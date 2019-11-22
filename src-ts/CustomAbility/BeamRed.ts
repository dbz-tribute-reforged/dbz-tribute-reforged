import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";
import { DamageData } from "./DamageData";

export class BeamRed extends Beam {


  // replace with config file stuff later
  constructor(
    name: string = "Beam Red",
    currentCd: number = 0,
    maxCd: number = 6, 
    costType: CostType = CostType.HP,
    costAmount: number = 75,
    duration: number = 40,
    updateRate: number = 0.03,
    damageData: DamageData = new DamageData(
      2.0,
      bj_HEROSTAT_STR,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    beamHpMult: number = 0.2,
    speed: number = 50.0,
    aoe: number = 175,
    clashingDelayTicks: number = 2,
    maxDelayTicks: number = 4,
    durationIncPerDelay: number = 1,
    isTracking: boolean = false,
    beamUnitType: number = FourCC('hpea'),
    animation: string = "death",
    sfxList = [
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
      "|nDeals " + 
      damageData.multiplier + " * " + 
      HeroStatToString(damageData.attribute) +
      " per Damage Tick" + 
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
      icon,
      tooltip,
      damageData,
      beamHpMult,
      speed,
      aoe,
      clashingDelayTicks,
      maxDelayTicks,
      durationIncPerDelay,
      isTracking,
      beamUnitType,
      animation,
      sfxList,
    );
  }
}
