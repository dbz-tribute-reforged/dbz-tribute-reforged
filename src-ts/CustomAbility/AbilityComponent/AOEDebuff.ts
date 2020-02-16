import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class AOEDebuff implements AbilityComponent, Serializable<AOEDebuff> {

  protected alreadyDebuffed: Map<number, boolean>;
  protected castDummy: unit;

  constructor(
    public name: string = "AOEDebuff",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public abilityId: number = 0,
    public orderId: number = 0,
    public aoe: number = 500,
    public keepCasting: boolean = false,
  ) {
    this.alreadyDebuffed = new Map();
    this.castDummy = GetEnumUnit();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    if (ability.currentTick == this.startTick) {
      this.castDummy = CreateUnit(input.casterPlayer, Constants.dummyCasterId, sourceCoord.x, sourceCoord.y, 0);
      UnitAddAbility(this.castDummy, this.abilityId);
      this.alreadyDebuffed.clear();
    }

    const affectedGroup = UnitHelper.getNearbyValidUnits(
      sourceCoord, 
      this.aoe,
      () => {
        return (
          UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer) &&
          IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO)
        );
      }
    );

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      const targetId = GetHandleId(target);
      if (this.keepCasting) {
        IssueTargetOrderById(this.castDummy, this.orderId, target);
      } else if (!this.alreadyDebuffed.get(targetId)) {
        this.alreadyDebuffed.set(targetId, true);
        IssueTargetOrderById(this.castDummy, this.orderId, target);
      }
    });

    DestroyGroup(affectedGroup);

    // Note: there is an underlying assumption
    // that the repeatInterval will allow this ability to be called at its end tick
    if (ability.isFinishedUsing(this)) {
      this.cleanup();
    }
  }

  cleanup() {
    if (GetUnitTypeId(this.castDummy) != 0) {
      RemoveUnit(this.castDummy);
    }
    this.alreadyDebuffed.clear();
  }
  

  clone(): AbilityComponent {
    return new AOEDebuff(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.abilityId, this.orderId, this.aoe, this.keepCasting,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      abilityId: number;
      orderId: number; 
      aoe: number; 
      keepCasting: boolean; 
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.abilityId = input.abilityId;
    this.orderId = input.orderId;
    this.aoe = input.aoe;
    this.keepCasting = input.keepCasting;
    return this;
  }
}