import { globalScene } from "#app/global-scene";
import type { EvolutionPhase } from "#app/phases/evolution-phase";
import type { MovePhase } from "#app/phases/move-phase";
import type { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import type { SwitchPhase } from "#app/phases/switch-phase";
import type { PhaseManager } from "./phase-manager";

export class Phase {
  protected manager: PhaseManager;

  constructor(manager: PhaseManager) {
    this.manager = manager;
  }

  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    this.manager.shiftPhase();
  }

  isEvolutionPhase(): this is EvolutionPhase {
    return false;
  }

  isSwitchPhase(): this is SwitchPhase {
    return false;
  }

  isMovePhase(): this is MovePhase {
    return false;
  }

  isSelectModifierPhase(): this is SelectModifierPhase {
    return false;
  }
}
