import { Icon } from "Common/Icon";
import { Tooltip } from "Common/Tooltip";
import { CostType } from "./CustomAbility";
import { HeroStatToString } from "Common/HeroStatToString";
import { Beam } from "./Beam";

export class BeamPurple extends Beam {

  constructor(
    public readonly name: string = "Purple Beam",
    public currentCd: number = 0,
    public maxCd: number = 6, 
    public costType: CostType = CostType.MP,
    public costAmount: number = 50,
    public duration: number = 45,
    public updateRate: number = 0.03,
    public damageAmount: number = 0.9,
    public damageAttribute: number = bj_HEROSTAT_INT,
    public attackType: attacktype = ATTACK_TYPE_HERO,
    public damageType: damagetype = DAMAGE_TYPE_NORMAL,
    public weaponType: weapontype = WEAPON_TYPE_WHOKNOWS,
    public beamHpMult: number = 20.0,
    public speed: number = 35.0,
    public aoe: number = 125,
    public clashingDelayTicks: number = 2,
    public maxDelayTicks: number = 8,
    public animation: string = "death",
    public sfx: string = "Abilities\\Spells\\Undead\\OrbOfDeath\\AnnihilationMissile.mdl",
    public sfxInterval: number = 2,
    public sfxScale: number = 1.0,
    public sfxHeight: number = 75,
    public beamUnitType: number = FourCC('hpea'),
    public icon: Icon = new Icon(
      "ReplaceableTextures\\CommandButtons\\BTNPurge.blp",
      "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNPurge.blp"
    ),
    public tooltip: Tooltip = new Tooltip(
      name,
      "Fires a medium speed purple beam" + 
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
