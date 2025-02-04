import type { PhaseConstructorParams } from "./@types/PhaseConstructorParams";
import type { Phase } from "./phase";
import type { AbstractConstructor, Constructor } from "./utils";

export class PhaseManager {
  /** PhaseQueue: dequeue/remove the first element to get the next phase */
  public phaseQueue: Phase[] = [];
  public conditionalQueue: Array<[() => boolean, Phase]> = [];
  /** PhaseQueuePrepend: is a temp storage of what will be added to PhaseQueue */
  private phaseQueuePrepend: Phase[] = [];

  /** overrides default of inserting phases to end of phaseQueuePrepend array, useful or inserting Phases "out of order" */
  private phaseQueuePrependSpliceIndex: number = -1;
  private nextCommandPhaseQueue: Phase[] = [];

  private currentPhase: Phase | null = null;
  private standbyPhase: Phase | null = null;
  private defaultPhase: Phase | null = null;

  public init(defaultPhase: Phase) {
    this.defaultPhase = defaultPhase;
  }

  public getCurrentPhase(): Phase | null {
    return this.currentPhase;
  }

  public getStandbyPhase(): Phase | null {
    return this.standbyPhase;
  }

  public pushPhase<P extends Constructor<Phase>>(PhaseType: P, ...params: PhaseConstructorParams<P>): void {
    this.phaseQueue.push(new PhaseType(this, ...params))[0];
  }

  public deferPhase<P extends Constructor<Phase>>(PhaseType: P, ...params: PhaseConstructorParams<P>): void {
    return this.nextCommandPhaseQueue.push(new PhaseType(this, ...params))[0];
  }

  public pushConditionalPhase<P extends Constructor<Phase>>(
    condition: () => boolean,
    PhaseType: P,
    ...params: PhaseConstructorParams<P>
  ): void {
    this.conditionalQueue.push([condition, new PhaseType(this, ...params)]);
  }

  public unshiftPhase<P extends Constructor<Phase>>(PhaseType: P, ...params: PhaseConstructorParams<P>): void {
    const phase = new PhaseType(...params);
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(phase);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, phase);
    }
  }

  public clearPhaseQueue(): void {
    this.phaseQueue.splice(0, this.phaseQueue.length);
  }

  public clearAllPhases(): void {
    for (const queue of [this.phaseQueue, this.phaseQueuePrepend, this.conditionalQueue, this.nextCommandPhaseQueue]) {
      queue.splice(0, queue.length);
    }
    this.currentPhase = null;
    this.standbyPhase = null;
    this.clearPhaseQueueSplice();
  }

  public setPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = this.phaseQueuePrepend.length;
  }

  public clearPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = -1;
  }

  public shiftPhase(): void {
    if (this.standbyPhase) {
      this.currentPhase = this.standbyPhase;
      this.standbyPhase = null;
      return;
    }

    if (this.phaseQueuePrependSpliceIndex > -1) {
      this.clearPhaseQueueSplice();
    }
    if (this.phaseQueuePrepend.length) {
      while (this.phaseQueuePrepend.length) {
        const poppedPhase = this.phaseQueuePrepend.pop();
        if (poppedPhase) {
          this.phaseQueue.unshift(poppedPhase);
        }
      }
    }
    if (!this.phaseQueue.length) {
      this.populatePhaseQueue();
      // Clear the conditionalQueue if there are no phases left in the phaseQueue
      this.conditionalQueue = [];
    }

    this.currentPhase = this.phaseQueue.shift() ?? null;

    // Check if there are any conditional phases queued
    if (this.conditionalQueue?.length) {
      // Retrieve the first conditional phase from the queue
      const conditionalPhase = this.conditionalQueue.shift();
      // Evaluate the condition associated with the phase
      if (conditionalPhase?.[0]()) {
        // If the condition is met, add the phase to the phase queue
        this.phaseQueue.push(conditionalPhase[1]);
      } else if (conditionalPhase) {
        // If the condition is not met, re-add the phase back to the front of the conditional queue
        this.conditionalQueue.unshift(conditionalPhase);
      } else {
        console.warn("condition phase is undefined/null!", conditionalPhase);
      }
    }

    if (this.currentPhase) {
      console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
      this.currentPhase.start();
    }
  }

  public overridePhase<P extends Constructor<Phase>>(PhaseType: P, ...params: PhaseConstructorParams<P>): boolean {
    if (this.standbyPhase) {
      return false;
    }

    this.standbyPhase = this.currentPhase;
    this.currentPhase = new PhaseType(...params);
    console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
    this.currentPhase.start();

    return true;
  }

  /**
   * Find a specific {@linkcode Phase} in the phase queue.
   *
   * @param phaseFilter filter function to use to find the wanted phase
   * @returns the found phase or undefined if none found
   */
  public findPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): P | undefined {
    return this.phaseQueue.find(phaseFilter) as P;
  }

  public tryReplacePhase<P extends Constructor<Phase>>(
    phaseFilter: (phase: Phase) => boolean,
    PhaseType: P,
    ...params: PhaseConstructorParams<P>
  ): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue[phaseIndex] = new PhaseType(...params);
      return true;
    }
    return false;
  }

  public tryRemovePhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Will search for a specific phase in {@linkcode phaseQueuePrepend} via filter, and remove the first result if a match is found.
   * @param phaseFilter filter function
   */
  public tryRemoveUnshiftedPhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueuePrepend.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueuePrepend.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  public prependToPhase<P extends Constructor<Phase>>(
    targetPhase: AbstractConstructor<Phase>,
    PhaseType: P,
    ...params: PhaseConstructorParams<P>
  ): boolean {
    const targetIndex = this.phaseQueue.findIndex((ph) => ph instanceof targetPhase);

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, new PhaseType(this, ...params));
      return true;
    } else {
      this.unshiftPhase(PhaseType, ...params);
      return false;
    }
  }

  public appendToPhase<P extends Constructor<Phase>>(
    targetPhase: AbstractConstructor<Phase>,
    PhaseType: P,
    ...params: PhaseConstructorParams<P>
  ): boolean {
    const targetIndex = this.phaseQueue.findIndex((ph) => ph instanceof targetPhase);

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, new PhaseType(this, ...params));
      return true;
    } else {
      this.unshiftPhase(PhaseType, ...params);
      return false;
    }
  }

  public populatePhaseQueue(): void {
    if (this.nextCommandPhaseQueue) {
      this.phaseQueue.push(...this.nextCommandPhaseQueue);
      this.nextCommandPhaseQueue.splice(0, this.nextCommandPhaseQueue.length);
    }
    if (this.defaultPhase) {
      this.phaseQueue.push(this.defaultPhase);
    }
  }
}
