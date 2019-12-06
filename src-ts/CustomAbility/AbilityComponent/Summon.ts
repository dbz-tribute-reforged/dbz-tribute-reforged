import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class Summon implements AbilityComponent, Serializable<Summon> {
  static readonly TARGET_SOURCE_UNIT = 0;
  static readonly TARGET_LAST_SUMMONED_UNIT = -1;
  
  protected currentTime: number;

  constructor(
    public name: string = "Summon",
    public repeatInterval: number = 1,
    public startTick: number = 1,
    public endTick: number = 1,
    public target: number = Summon.TARGET_SOURCE_UNIT,
    public multiplier: number = 0.25,
    public attribute: number = bj_HEROSTAT_INT,
  ) {
    this.currentTime = 0;
  }

  setupSummonUnit(summonUnit: unit, stats: number) {
    SetHeroStr(summonUnit, stats, true);
    SetHeroAgi(summonUnit, stats, true);
    SetHeroInt(summonUnit, stats, true);
    SuspendHeroXP(summonUnit, true);
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const stats = this.multiplier * GetHeroStatBJ(this.attribute, input.caster.unit, true);
    if (this.target == Summon.TARGET_SOURCE_UNIT) {
      this.setupSummonUnit(source, stats);
    } else if (this.target == Summon.TARGET_LAST_SUMMONED_UNIT) {
      this.setupSummonUnit(GetSummonedUnit(), stats);
    } else {
      let summonGroup = CreateGroup();
      GroupEnumUnitsOfPlayer(summonGroup, input.casterPlayer, Filter(() => {
        return GetUnitTypeId(GetFilterUnit()) == this.target;
      }));
      ForGroup(summonGroup, () => {
        this.setupSummonUnit(GetEnumUnit(), stats);
      })
      DestroyGroup(summonGroup);
    }
  }
  

  clone(): AbilityComponent {
    return new Summon(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.target, this.multiplier, this.attribute,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      target: number;
      multiplier: number;
      attribute: number;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.target = input.target;
    this.multiplier = input.multiplier;
    this.attribute = input.attribute;
    return this;
  }
}