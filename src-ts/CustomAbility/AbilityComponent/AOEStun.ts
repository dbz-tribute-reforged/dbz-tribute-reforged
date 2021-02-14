import { AbilityComponent, ComponentConstants } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { Constants } from "Common/Constants";

// THIS COMPONENT HAS BEEN DEPRECATED, DO NOT USE
export class AOEStun implements AbilityComponent, Serializable<AOEStun> {
  static readonly MICRO = 0.03;
  static readonly ONE_SECOND = 1;
  static readonly TWO_SECOND = 2;

  protected alreadyStunned: Map<number, boolean>;
  protected stunDummy: unit;

  protected sourceCoord: Vector2D;
  protected affectedGroup: group;

  constructor(
    public name: string = "AOEStun",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public duration: number = AOEStun.ONE_SECOND,
    public aoe: number = 500,
    public keepStunning: boolean = false,
  ) {
    this.alreadyStunned = new Map();
    this.stunDummy = GetEnumUnit();
    this.sourceCoord = new Vector2D();
    this.affectedGroup = CreateGroup();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    if (ability.currentTick == this.startTick) {

      // just for testing
      // this.stunDummy = CreateUnit(input.casterPlayer, FourCC('Hmkg'), sourceCoord.x, sourceCoord.y, 0);
      // UnitAddAbility(this.stunDummy, FourCC('AHtb'));

      this.stunDummy = CreateUnit(input.casterPlayer, Constants.dummyCasterId, this.sourceCoord.x, this.sourceCoord.y, 0);

      if (this.duration == AOEStun.MICRO) {
        UnitAddAbility(this.stunDummy, FourCC('A08K'));
      } else if (this.duration == AOEStun.ONE_SECOND) {
        UnitAddAbility(this.stunDummy, FourCC('A0IY'));
      } else {
        UnitAddAbility(this.stunDummy, FourCC('A0I7'));
      }
      
      this.alreadyStunned.clear();
    }

    GroupEnumUnitsInRange(
      this.affectedGroup, 
      this.sourceCoord.x, 
      this.sourceCoord.y, 
      this.aoe,
      null
    );

    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (
        UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer) &&
        IsUnitType(target, UNIT_TYPE_HERO)
      ) {
        const targetId = GetHandleId(target);
        if (!this.alreadyStunned.get(targetId) || this.keepStunning) {
          this.alreadyStunned.set(targetId, true);
          IssueTargetOrder(this.stunDummy, "thunderbolt", target);
        }
      }
    });

    GroupClear(this.affectedGroup);

    // Note: there is an underlying assumption
    // that the repeatInterval will allow this ability to be called at its end tick
    if (ability.isFinishedUsing(this)) {
      this.reset();
    }
  }

  reset() {
    if (GetUnitTypeId(this.stunDummy) != 0) {
      RemoveUnit(this.stunDummy);
    }
    this.alreadyStunned.clear();
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.affectedGroup);
  }
  

  clone(): AbilityComponent {
    return new AOEStun(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.duration, this.aoe, this.keepStunning,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      duration: number; 
      aoe: number; 
      keepStunning: boolean; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.duration = input.duration;
    this.aoe = input.aoe;
    this.keepStunning = input.keepStunning;
    return this;
  }
}