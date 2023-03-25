import { Globals } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { DualTechPart } from "./DualTechPart";


export class DualTech {
  protected seenUnits: Map<unit, boolean> = new Map();

  constructor(
    public sourceAbility: number = 0,
    public aoe: number = 0,
    public limit: number = 0,
    public useCasterPoint: boolean = true,
    public useOriginalAbility: boolean = true,
    public parts: DualTechPart[] = [],
  ) {

  }

  execute(input: CustomAbilityInput) {
    // find people that can be included
    GroupClear(Globals.tmpUnitGroup3);
    if (this.useCasterPoint) {
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup3,
        GetUnitX(input.caster.unit),
        GetUnitY(input.caster.unit),
        this.aoe,
        null
      );
    }

    let execute_count = 0;
    this.seenUnits.clear();

    ForGroup(Globals.tmpUnitGroup3, () => {
      const u = GetEnumUnit();
      if (
        execute_count < this.limit
        && IsUnitType(u, UNIT_TYPE_HERO)
        && UnitHelper.isUnitAlive(u)
        && !UnitHelper.isUnitStunned(u)
        && u != input.caster.unit
      ) {
        // find source for parts
        for (const p of this.parts) {
          if (p.isValid(input, u) && !this.seenUnits.has(u)) {
            this.seenUnits.set(u, true);
            if (p.execute(input, u)) {
              execute_count++;
            }
          }
        }
      }
    });

    this.seenUnits.clear();
    GroupClear(Globals.tmpUnitGroup3);
    
    for (const p of this.parts) {
      p.reset();
    }

    if (execute_count == 0) return false;
    return this.useOriginalAbility;
  }

  addPart(dt: DualTechPart) {
    this.parts.push(dt);
  }

  static deserialize(
    input: {
      sourceAbility: number;
      aoe: number;
      limit: number;
      useCasterPoint: boolean;
      useOriginalAbility: boolean;
      parts: {
        name: string, 
      }[];
    }
  ) {
    const dt = new DualTech();
    dt.sourceAbility = input.sourceAbility;
    dt.aoe = input.aoe;
    dt.limit = input.limit;
    dt.useCasterPoint = input.useCasterPoint;
    dt.useOriginalAbility = input.useOriginalAbility;
    return dt;
  }
}