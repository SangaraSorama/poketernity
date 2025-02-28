import type BattleScene from "#app/battle-scene";
import { globalPhaseManager } from "#app/global-phase-manager";
import { LoginPhase } from "#app/phases/login-phase";
import { TitlePhase } from "#app/phases/title-phase";
import { UnavailablePhase } from "#app/phases/unavailable-phase";
import { UiMode } from "#enums/ui-mode";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Phases", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let scene: BattleScene;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    scene = game.scene;
  });

  describe("LoginPhase", () => {
    it("should start the login phase", async () => {
      globalPhaseManager.unshiftPhase(LoginPhase);
      await game.phaseInterceptor.to(LoginPhase);
      expect(scene.ui.getMode()).to.equal(UiMode.MESSAGE);
    });
  });

  describe("TitlePhase", () => {
    it("should start the title phase", async () => {
      globalPhaseManager.unshiftPhase(TitlePhase);
      await game.phaseInterceptor.to(TitlePhase);
      expect(scene.ui.getMode()).to.equal(UiMode.TITLE);
    });
  });

  describe("UnavailablePhase", () => {
    it("should start the unavailable phase", async () => {
      globalPhaseManager.unshiftPhase(UnavailablePhase);
      await game.phaseInterceptor.to(UnavailablePhase);
      expect(scene.ui.getMode()).to.equal(UiMode.UNAVAILABLE);
    }, 20000);
  });
});
