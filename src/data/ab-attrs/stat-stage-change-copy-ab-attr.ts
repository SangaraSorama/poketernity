import type { Pokemon } from "#app/field/pokemon";
import { globalPhaseManager } from "#app/global-phase-manager";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class StatStageChangeCopyAbAttr extends AbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, stats: BattleStat[], stages: number): boolean {
    if (!simulated) {
      globalPhaseManager.unshiftPhase(StatStageChangePhase, pokemon.getBattlerIndex(), true, stats, stages, {
        canBeCopied: false,
      });
    }
    return true;
  }
}
