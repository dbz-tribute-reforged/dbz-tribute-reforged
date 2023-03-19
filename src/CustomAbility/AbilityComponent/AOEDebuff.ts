import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { Constants } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";

export class AOEDebuff implements AbilityComponent, Serializable<AOEDebuff> {
  static readonly SOURCE_UNIT = 0;
  static readonly SOURCE_TARGET_POINT_LAST_CAST = 1;
  static readonly SOURCE_TARGET_POINT_DYNAMIC = 2;

  protected alreadyDebuffed: Map<number, boolean>;
  protected castDummy: unit;
  protected sourceCoord: Vector2D;

  protected affectedGroup: group;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

  constructor(
    public name: string = "AOEDebuff",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public debuffSource: number = AOEDebuff.SOURCE_UNIT,
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
    this.affectedGroup = CreateGroup();
  }
  

  setDebuffSourceToTargettedPoint(input: CustomAbilityInput, source: unit) {
    if (this.debuffSource == AOEDebuff.SOURCE_UNIT) {
      this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    } else if (this.debuffSource == AOEDebuff.SOURCE_TARGET_POINT_LAST_CAST) {
      this.sourceCoord.setPos(input.castPoint.x, input.castPoint.y);
    } else {
      this.sourceCoord.setPos(input.targetPoint.x, input.targetPoint.y);
    }
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.setDebuffSourceToTargettedPoint(input, source);

    if (!this.isStarted || ability.currentTick == this.startTick) {
      this.isStarted = true;
      this.isFinished = false;
      this.castDummy = CreateUnit(
        input.casterPlayer, 
        Constants.dummyCasterId, 
        this.sourceCoord.x, this.sourceCoord.y, 
        0
      );
      UnitAddAbility(this.castDummy, this.abilityId);
      this.alreadyDebuffed.clear();
    }

    if (this.aoe == 0) {
      IssueTargetOrderById(this.castDummy, this.orderId, source);
    }

    if (this.aoe > 0) {
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
          UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer) 
          && (
            !this.onlyAffectHeroes ||
            IsUnitType(target, UNIT_TYPE_HERO)
          )
        ) {
          const targetId = GetHandleId(target);
          if (!this.requireBuff || GetUnitAbilityLevel(target, this.buffId) > 0) {
            if (this.keepCasting) {
              IssueTargetOrderById(this.castDummy, this.orderId, target);
            } else if (!this.alreadyDebuffed.get(targetId)) {
              this.alreadyDebuffed.set(targetId, true);
              IssueTargetOrderById(this.castDummy, this.orderId, target);
            }
          }
        }
      });
  
      GroupClear(this.affectedGroup);
    }

    // Note: there is an underlying assumption
    // that the repeatInterval will allow this ability to be called at its end tick
    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
      this.reset();
    }
  }

  reset() {
    if (GetUnitTypeId(this.castDummy) != 0) {
      RemoveUnit(this.castDummy);
    }
    this.alreadyDebuffed.clear();
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.affectedGroup);
  }
  

  clone(): AbilityComponent {
    return new AOEDebuff(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.debuffSource,
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
      debuffSource: number;
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
    this.debuffSource = input.debuffSource;
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