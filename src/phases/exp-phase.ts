import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ExpBoosterModifier } from "#app/modifier/modifier";
import { NumberHolder } from "#app/utils";
import i18next from "i18next";
import { PlayerPartyMemberPokemonPhase } from "./abstract-player-party-member-pokemon-phase";
import { LevelUpPhase } from "./level-up-phase";
import type { PhaseManager } from "#app/phase-manager";

/**
 * Grants a player pokemon EXP and pushes a {@linkcode LevelUpPhase} if it leveled up
 * @extends PlayerPartyMemberPokemonPhase
 */
export class ExpPhase extends PlayerPartyMemberPokemonPhase {
  private readonly expValue: number;

  constructor(manager: PhaseManager, partyMemberIndex: number, expValue: number) {
    super(manager, partyMemberIndex);

    this.expValue = expValue;
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();
    const exp = new NumberHolder(this.expValue);
    globalScene.applyModifiers(ExpBoosterModifier, true, exp);
    exp.value = Math.floor(exp.value);
    globalScene.ui.showText(
      i18next.t("battle:expGain", { pokemonName: getPokemonNameWithAffix(pokemon), exp: exp.value }),
      null,
      () => {
        const lastLevel = pokemon.level;
        pokemon.addExp(exp.value);
        const newLevel = pokemon.level;
        if (newLevel > lastLevel) {
          this.manager.unshiftPhase(LevelUpPhase, this.partyMemberIndex, lastLevel, newLevel);
        }
        pokemon.updateInfo().then(() => this.end());
      },
      null,
      true,
    );
  }
}
