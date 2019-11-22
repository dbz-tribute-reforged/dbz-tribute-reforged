import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";
import { DamageTypeData } from "./DamageTypeData";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";

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
    public damageTypeData: DamageTypeData = new DamageTypeData(
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    public beamHpMult: number = 0.2,
    public speed: number = 50.0,
    public aoe: number = 175,
    public clashingDelayTicks: number = 2,
    public maxDelayTicks: number = 4,
    public durationIncPerDelay: number = 1,
    public isTracking: boolean = false,
    public beamUnitType: number = FourCC('hpea'),
    public animation: string = "death",
    public sfx = [
      new SfxData(
        "Abilities\\Weapons\\VengeanceMissile\\VengeanceMissile.mdl",
        2, 
        1.2,
        75, 
        75,
        0,
        new Vector3D(
          255, 255, 255  
        ),
        false,
      ),
      new SfxData(
        "Abilities\\Spells\\Other\\Volcano\\VolcanoMissile.mdl",
        4, 
        0.5,
        0, 
        0,
        0,
        new Vector3D(
          255, 205, 155  
        ),
        false,
      ),
    ],
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
      damageTypeData,
      beamHpMult,
      speed,
      aoe,
      clashingDelayTicks,
      maxDelayTicks,
      durationIncPerDelay,
      isTracking,
      beamUnitType,
      animation,
      sfx, 
      icon,
      tooltip,
    );
  }
}
