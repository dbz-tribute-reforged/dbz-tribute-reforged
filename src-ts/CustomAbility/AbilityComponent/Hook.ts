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
    const nextCoord = CoordMath.polarProjectCoords(this.hookCoords, this.hookAngle, speed);
    if (RectContainsCoords(GetPlayableMapRect(), nextCoord.x, nextCoord.y)) {
      this.hookCoords = nextCoord;    
      this.currentRange += speed;
    }
    return this;
  }
  
  hookClosestUnit(hookedGroup: group): this { 
    let closestDistance = this.aoe + 1;
    ForGroup(hookedGroup, () => {
      const nearbyUnit = GetEnumUnit();
      if (!this.onlyHookHeroes || IsUnitType(nearbyUnit, UNIT_TYPE_HERO)) {
        const distance = CoordMath.distance(
          this.hookCoords, 
          new Vector2D(GetUnitX(nearbyUnit), GetUnitY(nearbyUnit))
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          this.hookedUnit = nearbyUnit;
        }
      }
    });

    DestroyGroup(hookedGroup);

    if (this.hookedUnit) {
      this.hookPause = IsUnitPaused(this.hookedUnit);
      if (!this.hookPause) {
        PauseUnit(this.hookedUnit, true);
      }
    }
    return this;
  }

  isUnitHookableForPlayer(casterPlayer: player): boolean {
    // extensible for friendlies
    return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), casterPlayer);
  }

  hookNearbyUnits(aoe: number, casterPlayer: player): this {
    const hookedGroup = UnitHelper.getNearbyValidUnits(
      this.hookCoords, 
      aoe,
      () => {
        return this.isUnitHookableForPlayer(casterPlayer);
      }
    );
    this.hookClosestUnit(hookedGroup);
    return this;
  }

  moveHookedUnit(hookedUnit: unit): this {
    PathingCheck.moveFlyingUnitToCoord(hookedUnit, this.hookCoords);
    return this;
  }

  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.startedHook) {
      this.startedHook = true;
      this.hookTarget = new Vector2D(input.targetPoint.x, input.targetPoint.y);
      this.hookSource = new Vector2D(GetUnitX(source), GetUnitY(source));
      this.hookCoords = this.hookSource;
      this.hookAngle = CoordMath.angleBetweenCoords(this.hookSource, this.hookTarget);
    }

        
    AbilitySfxHelper.displaySfxListAtCoord(
      ability,
      this.sfxList, 
      this.hookCoords, 
      SfxData.SHOW_ALL_GROUPS,
      this.hookAngle, 
      BlzGetUnitZ(source),
    );

    if (this.startedHook) {
      if (
        this.currentRange < this.maxRange && 
        !this.hookedUnit && 
        this.hookDirection == Hook.DIRECTION_FORWARDS
      ) {
        // hook forwards
        this.moveHook(this.speed);
        this.hookNearbyUnits(this.aoe, input.casterPlayer);
      } else if (this.currentRange > 0) {
        // hook backwards
        this.hookDirection = Hook.DIRECTION_BACKWARDS;
        this.moveHook(-this.speed);

        if (this.hookedUnit) {
          if (this.currentRange <= 0) {
            if (!this.hookPause) {
              PauseUnit(this.hookedUnit, false);
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
          } else {
            this.moveHookedUnit(this.hookedUnit);
          }

          // support for hooked unit moving by other means
          this.hookCoords = new Vector2D(GetUnitX(this.hookedUnit), GetUnitY(this.hookedUnit));
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
      this.currentRange = 0;
      this.startedHook = false;
      if (this.hookedUnit) {
        PauseUnit(this.hookedUnit, false);
      }
      this.hookDirection = Hook.DIRECTION_FORWARDS;
      this.hookedUnit = null;
      this.hookPause = false;
    }
  }
  

  clone(): AbilityComponent {
    return new Hook(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.damageData, this.maxRange, this.speed, this.aoe, 
      this.onlyHookHeroes, this.sfxList,
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
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        color: {
          x: number,
          y: number,
          z: number,
        },
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
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    return this;
  }
}