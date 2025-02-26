import { applyMoveAttrs } from "#app/utils/move-utils";
import { MoveHeaderAttr } from "#app/data/move-attrs/move-header-attr";
import { type Pokemon } from "#app/field/pokemon";
import { type PokemonMove } from "#app/field/pokemon-move";
import { PhaseId } from "#enums/phase-id";
import type { PhaseManager } from "#app/phase-manager";
import { BattlePhase } from "./abstract-battle-phase";

/**
 * Applies {@linkcode MoveHeaderAttr}s
 * @extends BattlePhase
 */
export class MoveHeaderPhase extends BattlePhase {
  override readonly id = PhaseId.MOVE_HEADER;
  public readonly pokemon: Pokemon;
  public readonly move: PokemonMove;

  constructor(manager: PhaseManager, pokemon: Pokemon, move: PokemonMove) {
    super(manager);

    this.pokemon = pokemon;
    this.move = move;
  }

  public canMove(): boolean {
    return this.pokemon.isActive(true) && this.move.isUsable(this.pokemon);
  }

  public override start(): void {
    super.start();

    if (this.canMove()) {
      applyMoveAttrs(MoveHeaderAttr, this.pokemon, null, this.move.getMove());
    }
    this.end();
  }
}
