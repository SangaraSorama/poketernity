import type { MoveAnim } from "#app/data/battle-anims";
import { Phase } from "#app/phase";
import type { PhaseManager } from "#app/phase-manager";

/**
 * Plays the given {@linkcode MoveAnim} sequentially.
 * @extends Phase
 */
export class MoveAnimPhase<Anim extends MoveAnim> extends Phase {
  protected readonly anim: Anim;
  protected readonly onSubstitute: boolean = false;

  constructor(manager: PhaseManager, anim: Anim, onSubstitute: boolean = false) {
    super(manager);

    this.anim = anim;
    this.onSubstitute = onSubstitute;
  }

  public override start(): void {
    super.start();

    this.anim.play(this.onSubstitute, () => this.end());
  }
}
