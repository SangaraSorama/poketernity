import { StockpilingTag } from "#app/data/battler-tags";
import type { Pokemon } from "#app/field/pokemon";
import { PokemonSummonData } from "#app/field/pokemon-summon-data";
import * as messages from "#app/messages";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.spyOn(messages, "getPokemonNameWithAffix").mockImplementation(() => "");
});

describe("BattlerTag - StockpilingTag", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  describe("onAdd", () => {
    it("unshifts a StatStageChangePhase with expected stat stage changes on add", async () => {
      const mockPokemon = {
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene, "queueMessage").mockImplementation(() => {});

      const subject = new StockpilingTag(1);

      vi.spyOn(game.phaseManager, "unshiftPhase").mockImplementation((PhaseType, ...params) => {
        expect(PhaseType).toBeTypeOf(typeof StatStageChangePhase);
        expect(params["stages"]).toEqual(1);
        expect(params["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));
      });

      subject.onAdd(mockPokemon);

      expect(game.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });

    it("unshifts a StatStageChangePhase with expected stat changes on add (one stat maxed)", async () => {
      const mockPokemon = {
        summonData: new PokemonSummonData(),
        getBattlerIndex: () => 0,
      } as unknown as Pokemon;

      vi.spyOn(game.scene, "queueMessage").mockImplementation(() => {});

      mockPokemon.summonData.statStages[Stat.DEF - 1] = 6;
      mockPokemon.summonData.statStages[Stat.SPD - 1] = 5;

      const subject = new StockpilingTag(1);

      vi.spyOn(game.phaseManager, "unshiftPhase").mockImplementation((PhaseType, ...params) => {
        expect(PhaseType).toBeTypeOf(typeof StatStageChangePhase);
        expect(params["stages"]).toEqual(1);
        expect(params["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));
      });

      subject.onAdd(mockPokemon);

      expect(game.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });
  });

  describe("onOverlap", () => {
    it("unshifts a StatStageChangePhase with expected stat changes on overlap", async () => {
      const mockPokemon = {
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene, "queueMessage").mockImplementation(() => {});

      const subject = new StockpilingTag(1);

      vi.spyOn(game.phaseManager, "unshiftPhase").mockImplementation((PhaseType, ...params) => {
        expect(PhaseType).toBeTypeOf(typeof StatStageChangePhase);
        expect(params["stages"]).toEqual(1);
        expect(params["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));
      });

      subject.onOverlap(mockPokemon);

      expect(game.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });
  });

  describe("stack limit, stat tracking, and removal", () => {
    it("can be added up to three times, even when one stat does not change", async () => {
      const mockPokemon = {
        summonData: new PokemonSummonData(),
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene, "queueMessage").mockImplementation(() => {});

      mockPokemon.summonData.statStages[Stat.DEF - 1] = 5;
      mockPokemon.summonData.statStages[Stat.SPD - 1] = 4;

      const subject = new StockpilingTag(1);

      vi.spyOn(game.phaseManager, "unshiftPhase").mockImplementation((PhaseType, ...params) => {
        expect(PhaseType).toBeTypeOf(typeof StatStageChangePhase);
        expect(params["stages"]).toEqual(1);
        expect(params["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));
      });

      subject.onAdd(mockPokemon);
      expect(subject.stockpiledCount).toBe(1);

      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(2);

      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(3);

      // fourth stack should not be applied
      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(3);
      expect(subject.statChangeCounts).toMatchObject({ [Stat.DEF]: 0, [Stat.SPDEF]: 2 });

      // removing tag should reverse stat changes
      vi.spyOn(game.phaseManager, "unshiftPhase").mockImplementationOnce((PhaseType, ...params) => {
        expect(PhaseType).toBeTypeOf(typeof StatStageChangePhase);
        expect(params["stages"]).toEqual(-2);
        expect(params["stats"]).toEqual(expect.arrayContaining([Stat.SPDEF]));
      });

      subject.onRemove(mockPokemon);
      expect(game.phaseManager.unshiftPhase).toHaveBeenCalledTimes(4);
    });
  });
});
