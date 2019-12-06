import { Summon } from "CustomAbility/AbilityComponent/Summon";

export const SummonComponents = [
  {
    name: "summon spawn cell juniors",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    target: FourCC('H01J'),
    multiplier: 0.25,
    attribute: bj_HEROSTAT_INT,
  },
  {
    name: "summon summon pui pui",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    target: FourCC('O004'),
    multiplier: 0.5,
    attribute: bj_HEROSTAT_INT,
  },
  {
    name: "summon summon yakon",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    target: FourCC('O009'),
    multiplier: 0.75,
    attribute: bj_HEROSTAT_INT,
  },
  {
    name: "summon summon dabura",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    target: FourCC('O000'),
    multiplier: 1,
    attribute: bj_HEROSTAT_INT,
  },
];