import { type Pokemon } from "#app/field/pokemon";
import { globalPhaseManager } from "#app/global-phase-manager";
import { globalScene } from "#app/global-scene";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";

/**
 * Returns the Pokemon with weather-based forms
 */
export function getPokemonWithWeatherBasedForms() {
  return globalScene
    .getField(true)
    .filter(
      (p) =>
        (p.hasAbility(Abilities.FORECAST) && p.species.speciesId === Species.CASTFORM)
        || (p.hasAbility(Abilities.FLOWER_GIFT) && p.species.speciesId === Species.CHERRIM),
    );
}

export function queueShowAbility(pokemon: Pokemon, passive: boolean): void {
  globalPhaseManager.unshiftPhase(ShowAbilityPhase, pokemon.id, passive);
  globalPhaseManager.clearPhaseQueueSplice();
}
