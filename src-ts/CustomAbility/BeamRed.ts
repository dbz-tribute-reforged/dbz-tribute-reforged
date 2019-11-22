import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";

export class BeamRed extends Beam {


  // replace with config file stuff later
  constructor(
    public readonly name: string = "Beam Red",
    public currentCd: number = 0,
    public maxCd: number = 6, 
    public costType: CostType = CostType.HP,
    public costAmount: number = 75,
    public duration: number = 30,
    public updateRate: number = 0.03,
    public damageAmount: number = 2.0,
    public damageAttribute: number = bj_HEROSTAT_STR,
    public attackType: attacktype = ATTACK_TYPE_HERO,
    public damageType: damagetype = DAMAGE_TYPE_NORMAL,
    public weaponType: weapontype = WEAPON_TYPE_WHOKNOWS,
    public beamHpMult: number = 3.0,
    public speed: number = 40.0,
    public aoe: number = 175,
    public clashingDelayTicks: number = 2,
    public maxDelayTicks: number = 4,
    public durationIncPerDelay: number = 1,
    public animation: string = "death",
    public sfx: string = "Abilities\\Weapons\\VengeanceMissile\\VengeanceMissile.mdl",
    public sfxInterval: number = 2,
    public sfxScale: number = 1.75,
    public sfxHeight: number = 75,
    public beamUnitType: number = FourCC('hpea'),
    public icon: Icon = new Icon(
      "ReplaceableTextures\\CommandButtons\\BTNSoulBurn.blp",
      "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNSoulBurn.blp"
    ),
    public tooltip: Tooltip = new Tooltip(
      name,
      "Fires a fast red beam" + 
      "|nDeals " + damageAmount + " * " + HeroStatToString(damageAttribute) + " per Damage Tick"+ 
      "|nCost: " + costAmount + " " + costType + 
      "|nCD: " + maxCd,
    ),
  ) {
    super(
      name,
      currentCd,
      maxCd,
      costType,
      costAmount,
      duration,
      updateRate,
      damageAmount,
      damageAttribute,
      attackType,
      damageType,
      weaponType,
      beamHpMult,
      speed,
      aoe,
      clashingDelayTicks,
      maxDelayTicks,
      durationIncPerDelay,
      animation,
      sfx,
      sfxInterval,
      sfxScale,
      sfxHeight,
      beamUnitType,
      icon,
      tooltip,
    );
  }
}
