import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { globalPhaseManager } from "#app/global-phase-manager";

/**
 * Attribute to increase a random stat on the user by 2 stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Acupressure_(move) | Acupressure}.
 * @extends MoveEffectAttr
 */
export class AcupressureStatStageChangeAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const randStats = BATTLE_STATS.filter((s) => target.getStatStage(s) < 6);
    if (randStats.length > 0) {
      const boostStat = [randStats[user.randSeedInt(randStats.length)]];
      globalPhaseManager.unshiftPhase(StatStageChangePhase, target.getBattlerIndex(), user, boostStat, 2);
      return true;
    }
    return false;
  }
}
