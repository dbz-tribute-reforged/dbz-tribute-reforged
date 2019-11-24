import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";
import { DamageData } from "./DamageData";
import { HeightVariation, VariationTypes } from "Common/HeightVariation";
import { KnockbackData } from "./KnockbackData";

export class BeamRed extends Beam {


  // replace with config file stuff later
  constructor(
    name: string = "Red Beam",
    currentCd: number = 0,
    maxCd: number = 6, 
    costType: CostType = CostType.HP,
    costAmount: number = 75,
    duration: number = 40,
    updateRate: number = 0.03,
    damageData: DamageData = new DamageData(
      0.5,
      bj_HEROSTAT_STR,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    beamHpMult: number = 0.3,
    speed: number = 50.0,
    aoe: number = 175,
    clashingDelayTicks: number = 3,
    maxDelayTicks: number = 4,
    durationIncPerDelay: number = 8,
    finishDamageData: DamageData = new DamageData(
      5,
      bj_HEROSTAT_STR,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    finishAoe: number = 350,
    castTime: number = 0.25,
    knockbackData = new KnockbackData (
      15, 0, 175
    ),
    beamHeightVariationType: VariationTypes = VariationTypes.LINEAR_VARIATION,
    beamHeightStart: number = 0,
    beamHeightEnd: number = 300,
    isTracking: boolean = false,
    isFixedAngle: boolean = false,
    canClashWithHero: boolean = true,
    canMultiCast = false,
    waitsForNextClick: boolean = true,
    beamUnitType: number = FourCC('hpea'),
    animation: string = "death",
    sfxList = [
      new SfxData(
        "Abilities\\Weapons\\VengeanceMissile\\VengeanceMissile.mdl",
        2, 0, 1.3, 75, 75, 0,
        new Vector3D(
          255, 255, 255  
        ),
        false,
      ),
      new SfxData(
        "Abilities\\Spells\\Other\\Volcano\\VolcanoMissile.mdl",
        4, 0, 0.5, 0, 0, 0,
        new Vector3D(
          255, 205, 155  
        ),
        false,
      ),
      new SfxData(
        "NuclearExplosion.mdl",
        duration, 0, 0.5, 0, 0, 0,
        new Vector3D(
          255, 205, 155  
        ),
        false,
      ),
    ],
    attachedSfxList = [
      new SfxData(
        "Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl",
        0, 0, 1.5, 75, 75, 0,
        new Vector3D(
          255, 255, 255  
        ),
        true, "origin",
      ),
      new SfxData(
        "Abilities\\Weapons\\LordofFlameMissile\\LordofFlameMissile.mdl",
        0, 0, 1.5, 0, 0, 0,
        new Vector3D(
          255, 205, 155  
        ),
        true, "origin",
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
      castTime,
      canMultiCast,
      waitsForNextClick,
      animation,
      icon,
      tooltip,
      damageData,
      beamHpMult,
      speed,
      aoe,
      clashingDelayTicks,
      maxDelayTicks,
      durationIncPerDelay,
      finishDamageData,
      finishAoe,
      knockbackData,
      beamHeightVariationType,
      beamHeightStart,
      beamHeightEnd,
      isTracking,
      isFixedAngle,
      canClashWithHero,
      beamUnitType,
      sfxList,
      attachedSfxList,
    );
  }
}
