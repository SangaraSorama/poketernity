import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import type { PhaseManager } from "./phase-manager";

export abstract class Phase {
  /** The identifier of the phase. Unique per phase, but **not** per instance! */
  public readonly id: PhaseId = PhaseId.UNSPECIFIED;

  protected manager: PhaseManager;

  constructor(manager: PhaseManager) {
    this.manager = manager;
  }

  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    this.manager.shiftPhase();
  }

  public is<T extends Phase = Phase>(phaseId: T["id"]): this is T {
    return this.id === phaseId;
  }
}
