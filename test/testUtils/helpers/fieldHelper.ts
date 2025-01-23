// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type globalScene } from "#app/global-scene";
// -- end tsdoc imports --

import type { EnemyPokemon, PlayerPokemon, Pokemon } from "#app/field/pokemon";
import type { Type } from "#enums/type";
import { GameManagerHelper } from "#test/testUtils/helpers/gameManagerHelper";
import { expect, vi } from "vitest";

/** Helper to manage pokemon */
export class FieldHelper extends GameManagerHelper {
  /**
   * Passthrough for {@linkcode globalScene.getPlayerPokemon} that adds an `undefined` check for
   * the Pokemon so that the return type for the function doesn't have `undefined`.
   * This removes the need to add a `!` like when calling `game.scene.getPlayerPokemon()!`.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode PlayerPokemon} that is {@linkcode globalScene.getPlayerField on the field}
   * and {@linkcode PlayerPokemon.isActive is active}
   * (aka {@linkcode PlayerPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getPlayerPokemon(includeSwitching: boolean = true): PlayerPokemon {
    const pokemon = this.game.scene.getPlayerPokemon(includeSwitching);
    expect(pokemon).toBeDefined();
    return pokemon!;
  }

  /**
   * Passthrough for {@linkcode globalScene.getEnemyPokemon} that adds an `undefined` check for
   * the Pokemon so that the return type for the function doesn't have `undefined`.
   * This removes the need to add a `!` like when calling `game.scene.getEnemyPokemon()!`.
   * @param includeSwitching Whether a pokemon that is currently switching out is valid, default `true`
   * @returns The first {@linkcode EnemyPokemon} that is {@linkcode globalScene.getEnemyField on the field}
   * and {@linkcode EnemyPokemon.isActive is active}
   * (aka {@linkcode EnemyPokemon.isAllowedInBattle is allowed in battle}).
   */
  public getEnemyPokemon(includeSwitching: boolean = true): EnemyPokemon {
    const pokemon = this.game.scene.getEnemyPokemon(includeSwitching);
    expect(pokemon).toBeDefined();
    return pokemon!;
  }

  /**
   * Forces a pokemon to be terastallized as the specified {@linkcode Type}.
   * @param pokemon - The pokemon to terastallize
   * @param teraType - The type to terastallize it as
   */
  public forceTera(pokemon: Pokemon, teraType: Type): void {
    vi.spyOn(pokemon, "terastallized", "get").mockReturnValue(true);
    vi.spyOn(pokemon, "teraType", "get").mockReturnValue(teraType);
  }
}
