import { AOEHeal } from "CustomAbility/AbilityComponent/AOEHeal";

export const AOEHealComponents = [
  {
    name: "heal caster bankai hollow",
    repeatInterval: 5,
    startTick: 0,
    endTick: -1,
    healSource: AOEHeal.SOURCE_UNIT,
    scaleHealToSourceHP: false,
    useLastCastPoint: false,
    aoe: 1,
    maxHealTargets: AOEHeal.UNLIMITED_HEAL_TARGETS,
    onlyHealHeroes: true,
    onlyHealCaster: true,
    canHealCaster: true,
    maxHealTicks: AOEHeal.UNLIMITED_HEAL_TICKS,
    healMult: 0.0,
    healAttribute: bj_HEROSTAT_AGI,
    maxHealthHealPercent: 0.006,
    requireBuff: false,
    buffId: 0,
  },
];