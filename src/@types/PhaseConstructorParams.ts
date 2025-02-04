import type { Phase } from "#app/phase";
import type { PhaseManager } from "#app/phase-manager";
import type { Constructor } from "#app/utils";

/**
 * The parameters of the associated {@linkcode Phase}'s constructor, except for
 * the {@linkcode PhaseManager}, as a tuple.
 */
export type PhaseConstructorParams<T extends Constructor<Phase>> = T extends new (
  phaseManager: PhaseManager,
  ...args: infer P
) => any
  ? P
  : never;
