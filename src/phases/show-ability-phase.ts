import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./abstract-pokemon-phase";
import type { PhaseManager } from "#app/phase-manager";

export class ShowAbilityPhase extends PokemonPhase {
  private readonly passive: boolean;

  constructor(manager: PhaseManager, battlerIndex: BattlerIndex, passive: boolean = false) {
    super(manager, battlerIndex);

    this.passive = passive;
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon) {
      globalScene.abilityBar.showAbility(pokemon, this.passive);
    }

    this.end();
  }
}
