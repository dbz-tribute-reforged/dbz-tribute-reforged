import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { DamageData } from "Common/DamageData";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { SfxData } from "Common/SfxData";
import { UnitHelper } from "Common/UnitHelper";
import { AbilitySfxHelper } from "CustomAbility/AbilitySfxHelper";
import { Vector3D } from "Common/Vector3D";

export class SwordSlash implements AbilityComponent, Serializable<SwordSlash> {

  protected targetCoord: Vector2D;
  protected currentCoord: Vector2D;
  protected previousCoord: Vector2D;
  protected nextDamageTick: number;

  protected affectedGroup: group;

  constructor(
    public name: string = "SwordSlash",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public damageData: DamageData = new DamageData(
      0.9,
      bj_HEROSTAT_AGI,
      ATTACK_TYPE_HERO,
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    public maxDistance: number = 500,
    public minDistance: number = 100,
    public aoe: number = 225,
    public delayBetweenDamageTicks: number = 3,
    public sfxList: SfxData[] = [],
    public attachedSfxList: SfxData[] = [],
  ) {
    this.targetCoord = new Vector2D(0, 0);
    this.currentCoord = new Vector2D(0, 0);
    this.previousCoord = new Vector2D(0, 0);
    this.nextDamageTick = 0;
    this.affectedGroup = CreateGroup();
  }

  private getMouseCoordWithinRange(input: CustomAbilityInput, target: Vector2D) {
    target.setVector(input.targetPoint);
    const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    const casterDistance = CoordMath.distance(casterCoord, target);

    if (casterDistance > this.maxDistance) {
      const casterDirection = CoordMath.angleBetweenCoords(casterCoord, target);
      target.polarProjectCoords(casterCoord, casterDirection, this.maxDistance);
    }
  }

  private dealDamageToGroup(input: CustomAbilityInput, source: unit, damage: number): this {
    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer)) {
        UnitDamageTarget(
          source, 
          target,
          damage,
          true,
          false,
          this.damageData.attackType,
          this.damageData.damageType,
          this.damageData.weaponType
        );
      }
    });
    return this;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (ability.currentTick == this.startTick) {
      this.previousCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      this.nextDamageTick = 0;
    }

    const timeRatio = ability.calculateTimeRatio(this.startTick, this.endTick);
    
    AbilitySfxHelper.displaySfxListOnUnit(
      ability,
      this.attachedSfxList, 
      source, 
      SfxData.SHOW_ALL_GROUPS,
      0, 
      BlzGetUnitZ(input.caster.unit),
      timeRatio,
    );

    this.currentCoord = this.previousCoord;
    this.getMouseCoordWithinRange(input, this.targetCoord);
    const slashDistance = CoordMath.distance(this.currentCoord, this.targetCoord);

    if (slashDistance > this.minDistance && ability.currentTick > this.nextDamageTick) {
      const slashDirection = CoordMath.angleBetweenCoords(this.currentCoord , this.targetCoord);
      this.currentCoord.polarProjectCoords(this.currentCoord, slashDirection, slashDistance/2);
      
      const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      const sfxAngle = CoordMath.angleBetweenCoords(casterCoord, this.currentCoord) * CoordMath.degreesToRadians;

      AbilitySfxHelper.displaySfxListAtCoord(
        ability,
        this.sfxList, 
        this.currentCoord, 
        SfxData.SHOW_ALL_GROUPS,
        sfxAngle,
        BlzGetUnitZ(source),
        timeRatio,
      );

      GroupEnumUnitsInRange(
        this.affectedGroup, 
        this.currentCoord.x, 
        this.currentCoord.y, 
        this.aoe,
        null
      );
      
      const damageThisTick = 
        input.level * input.caster.spellPower * this.damageData.multiplier * 
        (
          CustomAbility.BASE_DAMAGE +  
          GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true
        )
      );

      this.dealDamageToGroup(input, source, damageThisTick);
      GroupClear(this.affectedGroup);
      
      this.previousCoord.setVector(this.currentCoord);
      this.nextDamageTick += this.delayBetweenDamageTicks;
    }
    
    if (ability.isFinishedUsing(this)) {
      this.reset();
    }
  }

  reset() {
    this.nextDamageTick = 0;
    AbilitySfxHelper.cleanupPersistentSfx(this.sfxList);
    AbilitySfxHelper.cleanupPersistentSfx(this.attachedSfxList);
  }

  cleanup() {
    this.reset();
  }


  clone(): AbilityComponent {
    return new SwordSlash(
      this.name, this.repeatInterval, this.startTick, this.endTick,
      this.damageData, this.maxDistance,
      this.minDistance, this.aoe, this.delayBetweenDamageTicks, this.sfxList,
      this.attachedSfxList,
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
      maxDistance: number;
      minDistance: number;
      aoe: number;
      delayBetweenDamageTicks: number;
      sfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        endScale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
        extraRoll: number;
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
      attachedSfxList: {
        model: string;
        repeatInterval: number;
        group: number;
        scale: number;
        endScale: number;
        startHeight: number;
        endHeight: number;
        extraDirectionalYaw: number;
        extraPitch: number;
        extraRoll: number;
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
    this.maxDistance = input.maxDistance;
    this.minDistance = input.minDistance;
    this.aoe = input.aoe;
    this.delayBetweenDamageTicks = input.delayBetweenDamageTicks;
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    for (const attachedSfx of input.attachedSfxList) {
      this.attachedSfxList.push(new SfxData().deserialize(attachedSfx));
    }
    return this;
  }
}