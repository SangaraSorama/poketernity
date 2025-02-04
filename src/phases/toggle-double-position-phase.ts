import { FieldPosition } from "#enums/field-position";
import { globalScene } from "#app/global-scene";
import { BattlePhase } from "./abstract-battle-phase";
import type { PhaseManager } from "#app/phase-manager";

export class ToggleDoublePositionPhase extends BattlePhase {
  private readonly double: boolean;

  constructor(manager: PhaseManager, double: boolean) {
    super(manager);

    this.double = double;
  }

  public override start(): void {
    super.start();

    const playerPokemon = globalScene.getPlayerField().find((p) => p.isActive(true));
    if (playerPokemon) {
      playerPokemon
        .setFieldPosition(
          this.double && globalScene.getPokemonAllowedInBattle().length > 1 ? FieldPosition.LEFT : FieldPosition.CENTER,
          500,
        )
        .then(() => {
          if (playerPokemon.getFieldIndex() === 1) {
            const party = globalScene.getPlayerParty();
            party[1] = party[0];
            party[0] = playerPokemon;
          }
          this.end();
        });
    } else {
      this.end();
    }
  }
}
