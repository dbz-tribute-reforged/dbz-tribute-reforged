import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { DamageData } from "Common/DamageData";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { SfxData } from "Common/SfxData";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";

export class Hook implements AbilityComponent, Serializable<Hook> {
  static readonly DIRECTION_FORWARDS = 0;
  static readonly DIRECTION_BACKWARDS = 1;

  protected startedHook: boolean;
  protected currentRange: number;
  protected hookTarget: Vector2D;
  protected hookSource: Vector2D;
  protected hookCoords: Vector2D;
  protected hookAngle: number;
  protected hookDirection: number;
  protected hookedUnit: unit | null;
  protected hookPause: boolean;
  protected nextCoord: Vector2D;
  protected nearbyUnitCoord: Vector2D;

  protected hookedGroup: group;

  constructor(
    public name: string = "Hook",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageData: DamageData = new DamageData(
      0.02,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ), 
    public maxRange: number = 1200,
    public speed: number = 120,
    public aoe: number = 120,
    public onlyHookHeroes: boolean = false,
    public useLastCastPoint: boolean = true,
    public sfxList: SfxData[] = [],
  ) {
    this.startedHook = false;
    this.currentRange = 0;
    this.hookTarget = new Vector2D();
    this.hookSource = new Vector2D();
    this.hookCoords = new Vector2D();
    this.hookAngle = 0;
    this.hookDirection = Hook.DIRECTION_FORWARDS;
    this.hookedUnit = null;
    this.hookPause = false;
    this.nextCoord = new Vector2D();
    this.nearbyUnitCoord = new Vector2D();
    this.hookedGroup = CreateGroup();
  }
  
  protected calculateDamage(input: CustomAbilityInput): number {
    return (
      input.level * input.caster.spellPower * this.damageData.multiplier * 
      (
        CustomAbility.BASE_DAMAGE + 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true)
      )
    );
  }

  moveHook(speed: number): this {
    this.nextCoord.polarProjectCoords(this.hookCoords, this.hookAngle, speed);
    if (RectContainsCoords(GetPlayableMapRect(), this.nextCoord.x, this.nextCoord.y)) {
      this.hookCoords.setVector(this.nextCoord);    
      this.currentRange += speed;
    }
    return this;
  }
  
  hookClosestUnit(hookedGroup: group, casterPlayer: player): this { 
    let closestDistance = this.aoe + 1;
    ForGroup(hookedGroup, () => {
      const nearbyUnit = GetEnumUnit();
      // change hook condition, if want to hook allies
      if (UnitHelper.isUnitTargetableForPlayer(nearbyUnit, casterPlayer)) {
        if (!this.onlyHookHeroes || IsUnitType(nearbyUnit, UNIT_TYPE_HERO)) {
          this.nearbyUnitCoord.setPos(GetUnitX(nearbyUnit), GetUnitY(nearbyUnit));
          const distance = CoordMath.distance(
            this.hookCoords, this.nearbyUnitCoord
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            this.hookedUnit = nearbyUnit;
          }
        }
      }
    });
    return this;
  }

  hookNearbyUnits(aoe: number, casterPlayer: player): this {
    GroupEnumUnitsInRange(
      this.hookedGroup, 
      this.hookCoords.x, 
      this.hookCoords.y, 
      aoe,
      null
    );
    this.hookClosestUnit(this.hookedGroup, casterPlayer);

    GroupClear(this.hookedGroup);
    return this;
  }

  moveHookedUnit(hookedUnit: unit): this {
    PathingCheck.moveFlyingUnitToCoord(hookedUnit, this.hookCoords);
    return this;
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.startedHook) {
      this.startedHook = true;
      if (this.useLastCastPoint) {
        this.hookTarget.setVector(input.castPoint);
      } else {
        this.hookTarget.setVector(input.targetPoint);
      }
      this.hookSource.setPos(GetUnitX(source), GetUnitY(source));
      this.hookCoords.setVector(this.hookSource);
      this.hookAngle = CoordMath.angleBetweenCoords(this.hookSource, this.hookTarget);
    }

    const timeRatio = ability.calculateTimeRatio(this.startTick, this.endTick);
    const yaw = (this.hookAngle + 360) * CoordMath.degreesToRadians;

    if (this.currentRange > 0 || this.hookDirection == Hook.DIRECTION_FORWARDS) {
      AbilitySfxHelper.displaySfxListAtCoord(
        ability,
        this.sfxList, 
        this.hookCoords, 
        SfxData.SHOW_ALL_GROUPS,
        yaw, 
        BlzGetUnitZ(source),
        timeRatio,
      );
    }

    if (this.startedHook) {
      if (
        this.currentRange < this.maxRange && 
        !this.hookedUnit && 
        this.hookDirection == Hook.DIRECTION_FORWARDS
      ) {
        // hook forwards
        this.moveHook(this.speed);
        this.hookNearbyUnits(this.aoe, input.casterPlayer);
        if (this.hookedUnit) {
          this.hookPause = IsUnitPaused(this.hookedUnit);
          if (!this.hookPause) {
            PauseUnit(this.hookedUnit, true);
          }
          UnitDamageTarget(
            input.caster.unit, 
            this.hookedUnit, 
            this.calculateDamage(input),
            true,
            false,
            this.damageData.attackType,
            this.damageData.damageType,
            this.damageData.weaponType,
          )
        }
      } else if (this.currentRange > 0) {
        // hook backwards
        this.hookDirection = Hook.DIRECTION_BACKWARDS;
        this.moveHook(-this.speed);

        if (this.hookedUnit) {
          if (this.currentRange <= 0) {
            if (!this.hookPause) {
              PauseUnit(this.hookedUnit, false);
            }
          } else {
            this.moveHookedUnit(this.hookedUnit);
          }

          // support for hooked unit moving by other means
          this.hookCoords.setPos(GetUnitX(this.hookedUnit), GetUnitY(this.hookedUnit));
          this.hookAngle = CoordMath.angleBetweenCoords(this.hookSource, this.hookCoords);
        } else {
          // grab units on the way back
          // hrm... 
          // this.hookNearbyUnits(this.aoe, input.casterPlayer);
          // this.moveHook(-this.speed);
        }
      }
    }

    if (ability.isFinishedUsing(this)) {
      this.reset();
    }
  }

  reset() {
    this.currentRange = 0;
    this.startedHook = false;
    if (this.hookedUnit) {
      PauseUnit(this.hookedUnit, false);
    }
    this.hookDirection = Hook.DIRECTION_FORWARDS;
    this.hookedUnit = null;
    this.hookPause = false;
    AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
  }

  cleanup() {
    this.reset();
    DestroyGroup(this.hookedGroup);
  }
  

  clone(): AbilityComponent {
    return new Hook(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageData, this.maxRange, this.speed, this.aoe, 
      this.onlyHookHeroes, this.useLastCastPoint,
      this.sfxList,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      damageData: {
        multiplier: number; 
        attribute: number; 
        attackType: number; 
        damageType: number; 
        weaponType: number; 
      }; 
      maxRange: number,
      speed: number,
      aoe: number,
      onlyHookHeroes: boolean,
      useLastCastPoint: boolean,
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
        animSpeed: number;
        color: {
          x: number,
          y: number,
          z: number,
        },
        updateCoordsOnly: boolean;
        persistent: boolean;
        attachmentPoint: string;
      }[];
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.damageData = new DamageData().deserialize(input.damageData);
    this.maxRange = input.maxRange;
    this.speed = input.speed;
    this.aoe = input.aoe;
    this.onlyHookHeroes = input.onlyHookHeroes;
    this.useLastCastPoint = input.useLastCastPoint;
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    return this;
  }
}