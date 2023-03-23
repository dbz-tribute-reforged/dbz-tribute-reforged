import { Globals } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { DualTechPart } from "./DualTechPart";


export class DualTech {
  protected seenUnits: Set<unit> = new Set();

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
    GroupClear(Globals.tmpUnitGroup);
    if (this.useCasterPoint) {
      GroupEnumUnitsInRange(
        Globals.tmpUnitGroup,
        GetUnitX(input.caster.unit),
        GetUnitY(input.caster.unit),
        this.aoe,
        null
      );
    }

    let executed = false;
    this.seenUnits.clear();

    ForGroup(Globals.tmpUnitGroup, () => {
      const u = GetEnumUnit();
      if (
        IsUnitType(u, UNIT_TYPE_HERO)
        && UnitHelper.isUnitAlive(u)
        && !UnitHelper.isUnitStunned(u)
        && u != input.caster.unit
      ) {
        // find source for parts
        for (const p of this.parts) {
          if (p.isValid(input, u) && !this.seenUnits.has(u)) {
            this.seenUnits.add(u);
            if (p.execute(input, u)) {
              executed = true;
            }
          }
        }
      }
    });

    this.seenUnits.clear();
    GroupClear(Globals.tmpUnitGroup);
    
    for (const p of this.parts) {
      p.reset();
    }

    if (!executed) return false;
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