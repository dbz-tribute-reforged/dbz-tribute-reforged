
export const AOEApplyComponentComponents = [
  {
    name: "aoe apply pan immolation", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: 66,
    aoe: 2400,
    affectsNonSummons: false,
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
    aoe: 2400,
    affectsNonSummons: false,
    affectsAllies: false,
    components: [
      { name: "dash ground point reliable friend" },
      { name: "stun reliable friend" },
      { name: "sfx reliable friend" },
    ],
  },
]