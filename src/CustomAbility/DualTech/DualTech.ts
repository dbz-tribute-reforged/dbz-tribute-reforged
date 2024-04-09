import { Globals } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { DualTechPart } from "./DualTechPart";
import { CoordMath } from "Common/CoordMath";


export class DualTech {
  protected seenUnits: Map<unit, boolean> = new Map();

  constructor(
    public name: string = "DualTech",
    public sourceAbility: number = 0,
    public replaceAbilityName: string = "",
    public aoe: number = 0,
    public casterDistance: number = -1,
    public limit: number = 0,
    public useCasterPoint: boolean = true,
    public useLastCastPoint: boolean = false,
    public useOriginalAbility: boolean = true,
    public useOriginalOnEmpty: boolean = false,
    public parts: DualTechPart[] = [],
  ) {

  }

  execute(input: CustomAbilityInput) {
    // find people that can be included
    let tmpX = 0;
    let tmpY = 0;
    GroupClear(Globals.tmpUnitGroup3);
    if (this.useCasterPoint) {
      tmpX = GetUnitX(input.caster.unit);
      tmpY = GetUnitY(input.caster.unit);
    } else if (this.useLastCastPoint) {
      tmpX = input.castPoint.x;
      tmpY = input.castPoint.y;
    }
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup3,
      tmpX,
      tmpY,
      this.aoe,
      null
    );

    let execCount = 0;
    this.seenUnits.clear();

    ForGroup(Globals.tmpUnitGroup3, () => {
      const u = GetEnumUnit();
      if (
        execCount < this.limit
        && IsUnitType(u, UNIT_TYPE_HERO)
        && UnitHelper.isUnitAlive(u)
        && !UnitHelper.isUnitStunned(u)
        && u != input.caster.unit
      ) {
        if (
          this.casterDistance >= 0
          && CoordMath.distanceXY(
            GetUnitX(input.caster.unit), 
            GetUnitY(input.caster.unit), 
            GetUnitX(u), GetUnitY(u)
          ) >= this.casterDistance
        ) {
          return;
        }
        // find source for parts
        for (const p of this.parts) {
          if (p.isValid(input, u) && !this.seenUnits.has(u)) {
            this.seenUnits.set(u, true);
            if (p.execute(input, u)) {
              execCount++;
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

    return execCount;
  }

  addPart(dt: DualTechPart) {
    this.parts.push(dt);
  }

  static deserialize(
    input: {
      name: string,
      sourceAbility: number;
      replaceAbilityName: string;
      aoe: number;
      casterDistance: number;
      limit: number;
      useCasterPoint: boolean;
      useLastCastPoint: boolean;
      useOriginalAbility: boolean;
      useOriginalOnEmpty: boolean;
      parts: {
        name: string, 
      }[];
    }
  ) {
    const dt = new DualTech();
    dt.name = input.name;
    dt.sourceAbility = input.sourceAbility;
    dt.replaceAbilityName = input.replaceAbilityName;
    dt.aoe = input.aoe;
    dt.casterDistance = input.casterDistance;
    dt.limit = input.limit;
    dt.useCasterPoint = input.useCasterPoint;
    dt.useLastCastPoint = input.useLastCastPoint;
    dt.useOriginalAbility = input.useOriginalAbility;
    dt.useOriginalOnEmpty = input.useOriginalOnEmpty;
    return dt;
  }
}