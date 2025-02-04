import { PhaseManager } from "./phase-manager";
import { TurnInitPhase } from "./phases/turn-init-phase";

export const globalPhaseManager = new PhaseManager();

globalPhaseManager.init(new TurnInitPhase(globalPhaseManager));
