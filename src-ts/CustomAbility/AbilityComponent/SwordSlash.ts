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

  protected previousCoord: Vector2D;
  protected nextDamageTick: number;

  constructor(
    public name: string = "SwordSlash",
    public repeatInterval: number = 1,
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
    public sfxList: SfxData[] = [
      new SfxData(
        "animeslashfinal.mdl", 
        1, 0, 1.5, 25, 25, 0, 
        new Vector3D(255, 155, 55), 
        false
      ),
    ],
    public attachedSfxList: SfxData[]= [
      new SfxData(
        "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl", 
        1, 0, 1.5, 25, 25, 0, 
        new Vector3D(255, 155, 55), 
        true, "weapon"
      ),
    ],
  ) {
    this.previousCoord = new Vector2D(0, 0);
    this.nextDamageTick = 0;
  }

  private getMouseCoordWithinRange(input: CustomAbilityInput) {
    let targetCoord = input.mouseData;
    const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
    const casterDistance = CoordMath.distance(casterCoord, targetCoord);

    if (casterDistance > this.maxDistance) {
      const casterDirection = CoordMath.angleBetweenCoords(casterCoord, targetCoord);
      targetCoord = CoordMath.polarProjectCoords(casterCoord, casterDirection, this.maxDistance);
    }
    return new Vector2D(targetCoord.x, targetCoord.y);
  }

  private dealDamageToGroup(source: unit, affectedGroup: group, damage: number): this {
    ForGroup(affectedGroup, () => {
      const target = GetEnumUnit();
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
    });
    return this;
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    AbilitySfxHelper.displaySfxListOnUnit(
      ability,
      this.sfxList, 
      source, 
      SfxData.SHOW_ALL_GROUPS,
      0, 
      BlzGetUnitZ(input.caster.unit)
    );

    const currentCoord = this.previousCoord;
    const targetCoord = this.getMouseCoordWithinRange(input);
    const slashDistance = CoordMath.distance(currentCoord, targetCoord);

    if (slashDistance > this.minDistance && ability.currentTick > this.nextDamageTick) {
      const slashDirection = CoordMath.angleBetweenCoords(currentCoord, targetCoord);
      const middleCoord = CoordMath.polarProjectCoords(currentCoord, slashDirection, slashDistance/2);
      
      const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      const sfxAngle = CoordMath.angleBetweenCoords(casterCoord, middleCoord);

      AbilitySfxHelper.displaySfxListAtCoord(
        ability,
        this.sfxList, 
        middleCoord, 
        SfxData.SHOW_ALL_GROUPS,
        sfxAngle, 
        BlzGetUnitZ(input.caster.unit)
      );

      const affectedGroup = UnitHelper.getNearbyValidUnits(
        middleCoord, 
        this.aoe,
        () => {
          return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), input.casterPlayer);
        }
      );
      
      const damageThisTick = 
        this.damageData.multiplier * 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true);

      this.dealDamageToGroup(input.caster.unit, affectedGroup, damageThisTick);
      DestroyGroup(affectedGroup);
      
      this.previousCoord = new Vector2D(targetCoord.x, targetCoord.y);
      this.nextDamageTick = ability.currentTick + this.delayBetweenDamageTicks;
    }
  }

  clone(): AbilityComponent {
    return new SwordSlash(
      this.name, this.repeatInterval, this.damageData, this.maxDistance,
      this.minDistance, this.aoe, this.delayBetweenDamageTicks, this.sfxList,
      this.attachedSfxList,
    );
  }

  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
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
      attachedSfxList: {
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
    this.damageData = new DamageData().deserialize(input.damageData);
    this.maxDistance = input.maxDistance;
    this.minDistance = input.minDistance;
    this.aoe = input.aoe;
    this.delayBetweenDamageTicks = input.delayBetweenDamageTicks;
    for (const sfx of input.sfxList) {
      this.sfxList.push(new SfxData().deserialize(sfx));
    }
    for (const sfx of input.attachedSfxList) {
      this.attachedSfxList.push(new SfxData().deserialize(sfx));
    }
    return this;
  }
}