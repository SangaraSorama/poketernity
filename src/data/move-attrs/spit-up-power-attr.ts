import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { type StockpilingTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { VariableBasePowerAttr } from "#app/data/move-attrs/variable-base-power-attr";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Attribute used to calculate the power of attacks that scale with Stockpile stacks (i.e. Spit Up).
 * @extends VariableBasePowerAttr
 */
export class SpitUpPowerAttr extends VariableBasePowerAttr {
  private multiplier: number = 0;

  constructor(multiplier: number) {
    super();
    this.multiplier = multiplier;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const stockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);

    if (stockpilingTag && stockpilingTag.stockpiledCount > 0) {
      power.value = this.multiplier * stockpilingTag.stockpiledCount;
      return true;
    }

    return false;
  }
}
