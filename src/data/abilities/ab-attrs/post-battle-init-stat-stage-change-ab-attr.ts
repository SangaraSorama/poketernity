import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { PostBattleInitAbAttr } from "./post-battle-init-ab-attr";
import type { PhaseConstructorParams } from "#app/@types/PhaseConstructorParams";
import { globalPhaseManager } from "#app/global-phase-manager";

export class PostBattleInitStatStageChangeAbAttr extends PostBattleInitAbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;
  private readonly selfTarget: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget: boolean = false) {
    super(true, true);

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const statStageChangePhaseParams: PhaseConstructorParams<typeof StatStageChangePhase>[] = [];

    if (!simulated) {
      if (this.selfTarget) {
        statStageChangePhaseParams.push([pokemon.getBattlerIndex(), pokemon, this.stats, this.stages]);
      } else {
        for (const opponent of pokemon.getOpponents()) {
          statStageChangePhaseParams.push([opponent.getBattlerIndex(), pokemon, this.stats, this.stages]);
        }
      }

      for (const params of statStageChangePhaseParams) {
        if (!this.selfTarget && !globalScene.getFieldPokemonByBattlerIndex(params[0])?.summonData) {
          globalPhaseManager.pushPhase(StatStageChangePhase, ...params);
        } else {
          globalPhaseManager.unshiftPhase(StatStageChangePhase, ...params);
        }
      }
    }

    return true;
  }
}
