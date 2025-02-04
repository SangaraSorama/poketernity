import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";
import { fixedNumber } from "#app/utils";
import type { PhaseManager } from "#app/phase-manager";

export class ReloadSessionPhase extends Phase {
  private readonly systemDataStr?: string;

  constructor(manager: PhaseManager, systemDataStr?: string) {
    super(manager);

    this.systemDataStr = systemDataStr;
  }

  public override start(): void {
    const { gameData, time, ui } = globalScene;

    ui.setMode(UiMode.SESSION_RELOAD);

    let delayElapsed = false;
    let loaded = false;

    time.delayedCall(fixedNumber(1500), () => {
      if (loaded) {
        this.end();
      } else {
        delayElapsed = true;
      }
    });

    gameData.clearLocalData();

    (this.systemDataStr ? gameData.initSystem(this.systemDataStr) : gameData.loadSystem()).then(() => {
      if (delayElapsed) {
        this.end();
      } else {
        loaded = true;
      }
    });
  }
}
