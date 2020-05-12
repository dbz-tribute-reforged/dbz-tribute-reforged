import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class AOEDebuff implements AbilityComponent, Serializable<AOEDebuff> {

  protected alreadyDebuffed: Map<number, boolean>;
  protected castDummy: unit;
  protected sourceCoord: Vector2D;

  constructor(
    public name: string = "AOEDebuff",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public abilityId: number = 0,
    public orderId: number = 0,
    public aoe: number = 500,
    public keepCasting: boolean = false,
    public onlyAffectHeroes: boolean = true,
    public requireBuff: boolean = false,
    public buffId: number = 0,
  ) {
    this.alreadyDebuffed = new Map();
    this.castDummy = GetEnumUnit();
    this.sourceCoord = new Vector2D();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    if (ability.currentTick == this.startTick) {
      this.castDummy = CreateUnit(
        input.casterPlayer, 
        Constants.dummyCasterId, 
        this.sourceCoord.x, this.sourceCoord.y, 
        0
      );
      UnitAddAbility(this.castDummy, this.abilityId);
      this.alreadyDebuffed.clear();
    }

    const affectedGroup = UnitHelper.getNearbyValidUnits(
      this.sourceCoord, 
      this.aoe,
      () => {
        return (
          UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer) &&
          (
            !this.onlyAffectHeroes ||
            IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO)
          )
        );
      }
    );

    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
      const targetId = GetHandleId(target);
      if (!this.requireBuff || GetUnitAbilityLevel(target, this.buffId) > 0) {
        if (this.keepCasting) {
          IssueTargetOrderById(this.castDummy, this.orderId, target);
        } else if (!this.alreadyDebuffed.get(targetId)) {
          this.alreadyDebuffed.set(targetId, true);
          IssueTargetOrderById(this.castDummy, this.orderId, target);
        }
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
      this.onlyAffectHeroes,
      this.requireBuff, this.buffId,
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
      onlyAffectHeroes: boolean;
      requireBuff: boolean;
      buffId: number;
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
    this.onlyAffectHeroes = input.onlyAffectHeroes;
    this.requireBuff = input.requireBuff;
    this.buffId = input.buffId;
    return this;
  }
}