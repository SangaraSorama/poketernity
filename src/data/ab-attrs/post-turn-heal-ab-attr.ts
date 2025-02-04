import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";
import { globalPhaseManager } from "#app/global-phase-manager";

export class PostTurnHealAbAttr extends PostTurnAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const abilityName = this.source.name;
        globalPhaseManager.unshiftPhase(
          PokemonHealPhase,
          pokemon.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() / 16),
          {
            message: i18next.t("abilityTriggers:postTurnHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
          },
        );
      }

      return true;
    }

    return false;
  }
}
