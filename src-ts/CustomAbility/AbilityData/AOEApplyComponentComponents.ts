
export const AOEApplyComponentComponents = [
  {
    name: "aoe apply pan immolation", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: 99,
    aoe: 2500,
    affectsNonSummons: false,
    affectsNonHeroes: false,
    affectsAllies: false,
    components: [
      { name: "damage pan immolation dps" },
      { name: "sfx pan immolation" },
    ],
  },
  {
    name: "aoe apply reliable friend", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: 66,
    aoe: 2500,
    affectsNonSummons: false,
    affectsNonHeroes: false,
    affectsAllies: false,
    components: [
      { name: "dash ground point reliable friend" },
      { name: "knockback reliable friend" },
      { name: "stun reliable friend" },
      { name: "sfx reliable friend" },
    ],
  },
  {
    name: "aoe apply power level sharing", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    aoe: 2000,
    affectsNonSummons: true,
    affectsNonHeroes: false,
    affectsAllies: true,
    components: [
      { name: "dash forward power level sharing" },
    ],
  },
  {
    name: "aoe apply marle haste", 
    repeatInterval: 1, 
    startTick: 66,
    endTick: -1,
    aoe: 800,
    affectsNonSummons: true,
    affectsNonHeroes: false,
    affectsAllies: true,
    components: [
      { name: "dash forward marle haste" },
    ],
  },
]