import type { PlayerPokemon } from "#app/field/pokemon";
import type { PhaseManager } from "#app/phase-manager";
import { PartyMemberPokemonPhase } from "./abstract-party-member-pokemon-phase";

// TODO: Delete this phase and replace it with PokemonPhase
export abstract class PlayerPartyMemberPokemonPhase extends PartyMemberPokemonPhase {
  constructor(manager: PhaseManager, partyMemberIndex: number) {
    super(manager, partyMemberIndex, true);
  }

  public getPlayerPokemon(): PlayerPokemon {
    return super.getPokemon() as PlayerPokemon;
  }
}
