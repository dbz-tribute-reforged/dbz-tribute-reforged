import { CustomAbility, CostType } from "./CustomAbility";
import { CustomAbilityData } from "./CustomAbilityData";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { CustomAbilityHelper } from "./CustomAbilityHelper";

export class ShiningSwordAttack implements CustomAbility {
  static readonly defaultName = "Shining Sword Attack"; 
  static readonly defaultCD = 4; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 25; 
  static readonly defaultDuration = 67; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDamageAmount = 1.0;
  static readonly defaultDamageAttribute = bj_HEROSTAT_AGI;
  static readonly defaultAttackType = ATTACK_TYPE_HERO;
  static readonly defaultDamageType = DAMAGE_TYPE_NORMAL;
  static readonly defaultWeaponType = WEAPON_TYPE_WHOKNOWS;
  static readonly defaultMaxDistance = 500.0;
  static readonly defaultMinDistance = 120.0;
  static readonly defaultAOE = 225;
  static readonly defaultDelayBetweenDamageTicks = 3;
  static readonly defaultAnimation = "attack";
  // static readonly defaultSfx = "BladeBeamFinal.mdl";
  static readonly defaultSfx = "animeslashfinal.mdl";
  static readonly defaultSfxHeight = 75;
  static readonly defaultAttachedSfxName = "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl";
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNArcaniteMelee.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNArcaniteMelee.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    "Shining Sword Attack",
    "Performs multipe sword slashes at your cursor location" + 
    "|nDeals " + ShiningSwordAttack.defaultDamageAmount + " * AGI per Damage Tick (minimum 0.9s)"+ 
    "|nCost: " + ShiningSwordAttack.defaultCostAmount + " " + ShiningSwordAttack.defaultCostType + 
    "|nCD: " + ShiningSwordAttack.defaultCD,
  );

  public currentTick: number;
  public abilityTimer: timer;
  protected abilityData: CustomAbilityData | undefined;
  protected previousCoord: Vector2D;
  protected nextDamageTick: number;
  protected attachedSfx: effect;

  constructor(
    public readonly name: string = ShiningSwordAttack.defaultName,
    public currentCd: number = 0,
    public maxCd: number = ShiningSwordAttack.defaultCD, 
    public costType: CostType = ShiningSwordAttack.defaultCostType,
    public costAmount: number = ShiningSwordAttack.defaultCostAmount,
    public duration: number = ShiningSwordAttack.defaultDuration,
    public updateRate: number = ShiningSwordAttack.defaultUpdateRate,
    public damageAmount: number = ShiningSwordAttack.defaultDamageAmount,
    public damageAttribute: number = ShiningSwordAttack.defaultDamageAttribute,
    public attackType: attacktype = ShiningSwordAttack.defaultAttackType,
    public damageType: damagetype = ShiningSwordAttack.defaultDamageType,
    public weaponType: weapontype = ShiningSwordAttack.defaultWeaponType,
    public maxDistance: number = ShiningSwordAttack.defaultMaxDistance,
    public minDistance: number = ShiningSwordAttack.defaultMinDistance,
    public aoe: number = ShiningSwordAttack.defaultAOE,
    public delayBetweenDamageTicks: number = ShiningSwordAttack.defaultDelayBetweenDamageTicks,
    public animation: string = ShiningSwordAttack.defaultAnimation,
    public sfx: string = ShiningSwordAttack.defaultSfx,
    public sfxHeight: number = ShiningSwordAttack.defaultSfxHeight,
    public attachedSfxName: string = ShiningSwordAttack.defaultAttachedSfxName,
    public icon: Icon = ShiningSwordAttack.defaultIcon,
    public tooltip: Tooltip = ShiningSwordAttack.defaultTooltip,
  ) {
    this.currentTick = 0;
    this.abilityTimer = CreateTimer();
    this.previousCoord = new Vector2D(0, 0);
    this.nextDamageTick = 0;
    this.attachedSfx = AddSpecialEffect(attachedSfxName, 0, 0);
  }

  public canCastAbility(data: CustomAbilityData): boolean {
    return CustomAbilityHelper.canCast(this, data);
  }

  public takeAbilityCosts(data: CustomAbilityData): this {
    CustomAbilityHelper.takeCosts(this, data);
    return this;
  }

  public updateCd(): this {
    CustomAbilityHelper.updateCD(this);
    return this;
  }

  private isValidTarget(unit: unit) {
    if (this.abilityData) {
      return CustomAbilityHelper.basicIsValidTarget(unit, this.abilityData);
    }
    return false;
  }

  private performTickAction(): this {
    if (this.abilityData && this.abilityData.mouseData) {
      const currentCoord = this.previousCoord;
      let targetCoord = this.abilityData.mouseData;
      let slashDistance = CoordMath.distance(currentCoord, targetCoord);

      const casterCoord = new Vector2D(GetUnitX(this.abilityData.caster.unit), GetUnitY(this.abilityData.caster.unit));
      const casterDistance = CoordMath.distance(casterCoord, targetCoord);

      if (casterDistance > this.maxDistance) {
        const casterDirection = CoordMath.angleBetweenCoords(casterCoord, targetCoord);
        targetCoord = CoordMath.polarProjectCoords(casterCoord, casterDirection, this.maxDistance);
        slashDistance = CoordMath.distance(currentCoord, targetCoord);
      }

      if (slashDistance > this.minDistance && this.currentTick > this.nextDamageTick) {
        const slashDirection = CoordMath.angleBetweenCoords(currentCoord, targetCoord);
        const middleCoord = CoordMath.polarProjectCoords(currentCoord, slashDirection, slashDistance/2);
        
        const sfxAngle = CoordMath.angleBetweenCoords(casterCoord, middleCoord);

        SetUnitAnimation(this.abilityData.caster.unit, "attack");

        let sfxLoc = Location(middleCoord.x, middleCoord.y);
        let slash = AddSpecialEffectLoc(this.sfx, sfxLoc);
        BlzSetSpecialEffectScale(slash, 1.5);
        BlzSetSpecialEffectHeight(slash, BlzGetUnitZ(this.abilityData.caster.unit) + this.sfxHeight);
        BlzSetSpecialEffectColor(slash, 255, 155, 55);
        BlzSetSpecialEffectYaw(slash, sfxAngle * CoordMath.degreesToRadians);
        DestroyEffect(slash);
        RemoveLocation(sfxLoc);

        
        const affectedGroup = CreateGroup();
        GroupEnumUnitsInRange(
          affectedGroup, 
          middleCoord.x, 
          middleCoord.y, 
          this.aoe, 
          Condition(() => {
            return this.isValidTarget(GetFilterUnit());
          }),
        );
        
        const damageThisTick = 
          this.damageAmount * 
          GetHeroStatBJ(this.damageAttribute, this.abilityData.caster.unit, true);

        ForGroup(affectedGroup, () => {
          const target = GetEnumUnit();

          if (this.abilityData) {
            UnitDamageTarget(
              this.abilityData.caster.unit, 
              target,
              damageThisTick,
              true,
              false,
              this.attackType,
              this.damageType,
              this.weaponType
            );
          }
        })
        
        DestroyGroup(affectedGroup);
        
        this.previousCoord = new Vector2D(targetCoord.x, targetCoord.y);
        this.nextDamageTick = this.currentTick + this.delayBetweenDamageTicks;
      }
    }
    ++this.currentTick;
    if (this.currentTick >= this.duration) {
      DestroyEffect(this.attachedSfx);
    }
    return this;
  }

  // assume can cast ability
  public activate(data: CustomAbilityData): void {
    this.abilityData = data;
    this.takeAbilityCosts(data);

    this.nextDamageTick = 0;
    if (data && data.caster && data.mouseData) {
      // SetUnitAnimationByIndex(data.caster.unit, 1);
      SetUnitAnimation(data.caster.unit, "attack");

      let targetCoord = data.mouseData;
      const casterCoord = new Vector2D(GetUnitX(this.abilityData.caster.unit), GetUnitY(this.abilityData.caster.unit));
      const casterDistance = CoordMath.distance(casterCoord, targetCoord);

      if (casterDistance > this.maxDistance) {
        const casterDirection = CoordMath.angleBetweenCoords(casterCoord, targetCoord);
        targetCoord = CoordMath.polarProjectCoords(casterCoord, casterDirection, this.maxDistance);
      }

      this.previousCoord = new Vector2D(targetCoord.x, targetCoord.y);

      this.attachedSfx = AddSpecialEffectTargetUnitBJ("weapon", this.abilityData.caster.unit, this.attachedSfxName);
    }

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick < this.duration) {
        this.performTickAction();
      }
      this.updateCd();
    });
  }

}
