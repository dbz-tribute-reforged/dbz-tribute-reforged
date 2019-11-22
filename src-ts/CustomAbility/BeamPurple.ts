import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";
import { DamageTypeData } from "./DamageTypeData";
import { SfxData } from "./SfxData";
import { Vector3D } from "Common/Vector3D";

// probs not do this
// only use classes if there is going to be
// additional functionality
// just demonstrating it's easy to replace the
// contents of the beam class with other data (sfx,dmg) etc
export class BeamPurple extends Beam {

  constructor(
    public readonly name: string = "Purple Beam",
    public currentCd: number = 0,
    public maxCd: number = 6, 
    public costType: CostType = CostType.MP,
    public costAmount: number = 75,
    public duration: number = 45,
    public updateRate: number = 0.03,
    public damageAmount: number = 1.0,
    public damageAttribute: number = bj_HEROSTAT_INT,
    public damageTypeData: DamageTypeData = new DamageTypeData(
      ATTACK_TYPE_HERO, 
      DAMAGE_TYPE_NORMAL,
      WEAPON_TYPE_WHOKNOWS
    ),
    public beamHpMult: number = 0.4,
    public speed: number = 25.0,
    public aoe: number = 125,
    public clashingDelayTicks: number = 2,
    public maxDelayTicks: number = 8,
    public durationIncPerDelay: number = 1,
    public isTracking: boolean = true,
    public beamUnitType: number = FourCC('hpea'),
    public animation: string = "walk",
    public sfx = [
      new SfxData(
        "Abilities\\Spells\\Undead\\OrbOfDeath\\AnnihilationMissile.mdl",
        2, 
        1.2,
        75, 
        75,
        90,
        new Vector3D(
          255, 255, 255  
        ),
        true,
      ),
    ],
    public icon: Icon = new Icon(
      "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp"
    ),
    public tooltip: Tooltip = new Tooltip(
      name,
      "Fires a medium speed purple beam with tracking" + 
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
