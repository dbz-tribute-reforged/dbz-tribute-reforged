import { CustomAbility, CostType } from "./CustomAbility";
import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";
import { DamageData } from "./DamageData";
import { SfxData } from "./SfxData";
import { HeroStatToString } from "Common/HeroStatToString";
import { CustomAbilityInput } from "./CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector3D } from "Common/Vector3D";

export class ShiningSwordAttack extends CustomAbility {
  static readonly defaultName = "Shining Sword Attack"; 
  static readonly defaultCD = 4; 
  static readonly defaultCostType = CostType.MP; 
  static readonly defaultCostAmount = 25; 
  static readonly defaultDuration = 67; 
  static readonly defaultUpdateRate = 0.03;
  static readonly defaultDamageData = new DamageData(
    0.6,
    bj_HEROSTAT_AGI,
    ATTACK_TYPE_HERO,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  static readonly defaultMaxDistance = 500.0;
  static readonly defaultMinDistance = 100.0;
  static readonly defaultAOE = 225;
  static readonly defaultDelayBetweenDamageTicks = 3;
  static readonly defaultAnimation = "attack";
  static readonly defaultAttachedSfxName = "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl";
  static readonly defaultSfxList = [
    new SfxData(
      "animeslashfinal.mdl", 1, 0, 1.5, 75, 75, 0, 
      new Vector3D(255, 155, 55), 
      false
    ),
  ];
  static readonly defaultIcon = new Icon(
    "ReplaceableTextures\\CommandButtons\\BTNArcaniteMelee.blp",
    "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNArcaniteMelee.blp"
  );
  static readonly defaultTooltip = new Tooltip(
    "Shining Sword Attack",
    "Performs multipe sword slashes at your cursor location" + 
    "|nDeals " + 
    ShiningSwordAttack.defaultDamageData.multiplier + " * " + 
    HeroStatToString(ShiningSwordAttack.defaultDamageData.attribute) +
    " per damage tick (minimum " + 
    ShiningSwordAttack.defaultDelayBetweenDamageTicks * ShiningSwordAttack.defaultUpdateRate +
    "s)" +
    "|nCost: " + ShiningSwordAttack.defaultCostAmount + " " + ShiningSwordAttack.defaultCostType + 
    "|nCD: " + ShiningSwordAttack.defaultCD,
  );

  protected previousCoord: Vector2D;
  protected nextDamageTick: number;
  protected attachedSfx: effect;

  constructor(
    name: string = ShiningSwordAttack.defaultName,
    currentCd: number = 0,
    maxCd: number = ShiningSwordAttack.defaultCD, 
    costType: CostType = ShiningSwordAttack.defaultCostType,
    costAmount: number = ShiningSwordAttack.defaultCostAmount,
    duration: number = ShiningSwordAttack.defaultDuration,
    updateRate: number = ShiningSwordAttack.defaultUpdateRate,
    icon: Icon = ShiningSwordAttack.defaultIcon,
    tooltip: Tooltip = ShiningSwordAttack.defaultTooltip,
    public damageData: DamageData = ShiningSwordAttack.defaultDamageData,
    public maxDistance: number = ShiningSwordAttack.defaultMaxDistance,
    public minDistance: number = ShiningSwordAttack.defaultMinDistance,
    public aoe: number = ShiningSwordAttack.defaultAOE,
    public delayBetweenDamageTicks: number = ShiningSwordAttack.defaultDelayBetweenDamageTicks,
    public animation: string = ShiningSwordAttack.defaultAnimation,
    public sfxList: SfxData[] = ShiningSwordAttack.defaultSfxList,
    public attachedSfxName: string = ShiningSwordAttack.defaultAttachedSfxName,
  ) {
    super(
      name, 
      currentCd, 
      maxCd, 
      costType,
      costAmount,
      duration,
      updateRate,
      icon,
      tooltip
    );
    this.previousCoord = new Vector2D(0, 0);
    this.nextDamageTick = 0;
    this.attachedSfx = GetLastCreatedEffectBJ();
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

  private performTickAction(input: CustomAbilityInput): this {
    const currentCoord = this.previousCoord;
    const targetCoord = this.getMouseCoordWithinRange(input);
    const slashDistance = CoordMath.distance(currentCoord, targetCoord);

    if (slashDistance > this.minDistance && this.currentTick > this.nextDamageTick) {
      const slashDirection = CoordMath.angleBetweenCoords(currentCoord, targetCoord);
      const middleCoord = CoordMath.polarProjectCoords(currentCoord, slashDirection, slashDistance/2);
      
      const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      const sfxAngle = CoordMath.angleBetweenCoords(casterCoord, middleCoord);

      SetUnitAnimation(input.caster.unit, this.animation);

      this.displaySfxListAtCoord(
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
          return this.isBasicValidTarget(GetFilterUnit(), input.casterPlayer);
        }
      );
      
      const damageThisTick = 
        this.damageData.multiplier * 
        GetHeroStatBJ(this.damageData.attribute, input.caster.unit, true);

      this.dealDamageToGroup(input.caster.unit, affectedGroup, damageThisTick);
      DestroyGroup(affectedGroup);
      
      this.previousCoord = new Vector2D(targetCoord.x, targetCoord.y);
      this.nextDamageTick = this.currentTick + this.delayBetweenDamageTicks;
    }
    ++this.currentTick;
    return this;
  }

  // assume can cast ability
  public activate(input: CustomAbilityInput): void {
    this.takeCosts(input);
    this.nextDamageTick = 0;
    this.previousCoord = this.getMouseCoordWithinRange(input);

    // SetUnitAnimationByIndex(data.caster.unit, 1);
    SetUnitAnimation(input.caster.unit, this.animation);
    this.attachedSfx = AddSpecialEffectTargetUnitBJ("weapon", input.caster.unit, this.attachedSfxName);

    TimerStart(this.abilityTimer, this.updateRate, true, () => {
      if (this.currentTick <= this.duration) {
        this.performTickAction(input);
      }
      if (this.currentTick > this.duration) {
        DestroyEffect(this.attachedSfx);
        this.cleanupPersistentSfx();
      }
      this.updateCd();
    });
  }

}
