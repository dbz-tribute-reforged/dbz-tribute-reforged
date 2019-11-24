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

// probs not do this
// only use classes if there is going to be
// additional functionality
// just demonstrating it's easy to replace the
// contents of the beam class with other data (sfx,dmg) etc
export class BeamPurple extends Beam {

  constructor(
    name: string = "Purple Beam",
    currentCd: number = 0,
    maxCd: number = 6, 
    costType: CostType = CostType.MP,
    costAmount: number = 75,
    duration: number = 60,
    updateRate: number = 0.03,
    damageData: DamageData = new DamageData(
      0.4,
      bj_HEROSTAT_INT,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    beamHpMult: number = 0.6,
    speed: number = 25.0,
    aoe: number = 125,
    clashingDelayTicks: number = 2,
    maxDelayTicks: number = 6,
    durationIncPerDelay: number = 10,
    finishDamageData: DamageData = new DamageData(
      5,
      bj_HEROSTAT_INT,
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    finishAoe: number = 250,
    castTime: number = 0.25,
    knockbackData = new KnockbackData (
      22, 180, 125
    ),
    beamHeightVariationType: VariationTypes = VariationTypes.LINEAR_VARIATION,
    beamHeightStart: number = 0,
    beamHeightEnd: number = 0,
    isTracking: boolean = true,
    isFixedAngle: boolean = false,
    canClashWithHero: boolean = false,
    canMultiCast = false,
    waitsForNextClick: boolean = true,
    beamUnitType: number = FourCC('hpea'),
    animation: string = "walk",
    sfxList = [
      new SfxData(
        "Abilities\\Spells\\Undead\\OrbOfDeath\\AnnihilationMissile.mdl",
        2, 0, 1.2, 0, 0, 0,
        new Vector3D(
          255, 155, 255  
        ),
        true,
      ),
      new SfxData(
        "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
        duration, 0, 1.2, 0, 0, 0,
        new Vector3D(
          255, 125, 255  
        ),
        false,
      ),
    ],
    attachedSfxList = [
      new SfxData(
        "Abilities\Spells\Orc\Purge\PurgeBuffTarget.mdl",
        4, 0, 3.0, 0, 0, 0,
        new Vector3D(
          255, 155, 255  
        ),
        false, "origin"
      ),
    ],
    icon: Icon = new Icon(
      "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp"
    ),
    tooltip: Tooltip = new Tooltip(
      name,
      "Fires a medium speed purple beam with tracking" + 
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
