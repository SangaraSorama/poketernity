import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { PostWeatherLapseAbAttr } from "./post-weather-lapse-ab-attr";
import { globalPhaseManager } from "#app/global-phase-manager";

export class PostWeatherLapseHealAbAttr extends PostWeatherLapseAbAttr {
  private readonly healFactor: number;

  constructor(healFactor: number, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.healFactor = healFactor;
  }

  override apply(pokemon: Pokemon, simulated: boolean, _weather: Weather): boolean {
    if (!pokemon.isFullHp()) {
      const abilityName = this.source.name;
      if (!simulated) {
        globalPhaseManager.unshiftPhase(
          PokemonHealPhase,
          pokemon.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() / (16 / this.healFactor)),
          {
            message: i18next.t("abilityTriggers:postWeatherLapseHeal", {
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
