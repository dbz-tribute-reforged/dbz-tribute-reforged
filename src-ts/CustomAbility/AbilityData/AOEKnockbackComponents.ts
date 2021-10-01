import { AOEKnockback } from "CustomAbility/AbilityComponent/AOEKnockback";

export const AOEKnockbackComponents = [
  // spirit bomb stronger knockback
  // copy from here
  {
    name: "knockback 1tick 15speed 0angle 300aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 0, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback spirit bomb",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 9, 
      angle: 180, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // to here, and replace with unique name
  // kame light knockback
  {
    name: "knockback 1tick 10speed 0angle 250aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 0, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback kame",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 6, 
      angle: 180, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // knockback deflect
  {
    name: "knockback deflect",
    repeatInterval: 1, 
    startTick: 9,
    endTick: 18,
    knockbackData: {
      speed: 30, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // super dragon flight
  {
    name: "knockback super dragon flight",
    repeatInterval: 1, 
    startTick: 10,
    endTick: 30,
    knockbackData: {
      speed: 20, 
      angle: 0, 
      aoe: 200,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // heat dome attack
  {
    name: "knockback heat dome attack",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 9,
    knockbackData: {
      speed: 23, 
      angle: 0, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // hellzone grenade
  // {
  //   name: "knockback hellzone grenade",
  //   repeatInterval: 1, 
  //   startTick: 0,
  //   endTick: -1,
  //   knockbackData: {
  //     speed: 1, 
  //     angle: 0, 
  //     aoe: 250,
  //   },
  //   affectAllies: false,
  // },
  // videl punch
  {
    name: "knockback videl punch",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 4,
    knockbackData: {
      speed: 25, 
      angle: 0, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_TARGET_POINT,
    useLastCastPoint: true,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // videl kick
  {
    name: "knockback videl kick",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 7,
    knockbackData: {
      speed: 25, 
      angle: 0, 
      aoe: 375,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // videl flying kick
  {
    name: "knockback videl flying kick",
    repeatInterval: 1, 
    startTick: -1,
    endTick: -1,
    knockbackData: {
      speed: 50, 
      angle: 0, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // javelin throw
  {
    name: "knockback javelin throw",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 55, 
      angle: 180, 
      aoe: 150,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // ss deadly hammer reverse knockback
  {
    name: "knockback ss deadly hammer",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 25,
    knockbackData: {
      speed: 10, 
      angle: 180, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // android barrier knockback
  {
    name: "knockback android barrier",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 99,
    knockbackData: {
      speed: 45, 
      angle: 0, 
      aoe: 550,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // broly energy punch
  {
    name: "knockback energy punch reverse",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 19,
    knockbackData: {
      speed: -30, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback energy punch",
    repeatInterval: 1, 
    startTick: 19,
    endTick: -1,
    knockbackData: {
      speed: 30, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // broly power level rising
  {
    name: "knockback power level rising",
    repeatInterval: 1, 
    startTick: 1,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 0, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // big bang attack reverse knockback
  {
    name: "knockback 1tick 15speed 180angle 400aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 180, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback 1tick 25speed 180angle 250aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 25, 
      angle: 180, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // dfist knock-in
  {
    name: "knockback dfist",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 180, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // energy blast volley minor knockback
  {
    name: "knockback 1tick 5speed 0angle 250aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 5, 
      angle: 0, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // tyrant breaker knockback
  {
    name: "knockback tyrant breaker",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 25,
    knockbackData: {
      speed: 4, 
      angle: 0, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // angry shout large aoe knockback
  {
    name: "knockback angry shout",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 20, 
      angle: 0, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // reliable friend
  {
    name: "knockback reliable friend",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 0, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // babidi barrier knockback
  {
    name: "knockback babidi barrier",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 0, 
      aoe: 650,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // evil spear knock in
  {
    name: "knockback evil spear",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 60, 
      angle: 180, 
      aoe: 100,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // cooler deafening wave
  {
    name: "knockback 1tick 20speed 0angle 500aoe",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 20, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // solar kame
  {
    name: "knockback solar kame",
    repeatInterval: 1, 
    startTick: 111,
    endTick: -1,
    knockbackData: {
      speed: 45, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // raditz behind you
  {
    name: "knockback behind you",
    repeatInterval: 1, 
    startTick: 9,
    endTick: -1,
    knockbackData: {
      speed: 35, 
      angle: 0, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // power blitz
  {
    name: "knockback power blitz",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 4, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // power blitz barrage
  {
    name: "knockback power blitz barrage",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 1.5, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // super electric strike
  {
    name: "knockback super electric strike",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 2, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // belly armor
  {
    name: "knockback belly armor",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 5, 
      angle: 0, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // hand kannon
  {
    name: "knockback hand kannon",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 25, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_TARGET_POINT,
    useLastCastPoint: true,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback hand kannon deflect",
    repeatInterval: 1, 
    startTick: 29,
    endTick: -1,
    knockbackData: {
      speed: 0, 
      angle: 180, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_TARGET_POINT,
    useLastCastPoint: true,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // blast-o-matic
  {
    name: "knockback blast-o-matic",
    repeatInterval: 1, 
    startTick: 72,
    endTick: -1,
    knockbackData: {
      speed: 43, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // beam power impact
  {
    name: "knockback beam power impact",
    repeatInterval: 1, 
    startTick: -1,
    endTick: -1,
    knockbackData: {
      speed: 50, 
      angle: 0, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // beam power impact
  {
    name: "knockback beam power impact 2",
    repeatInterval: 1, 
    startTick: -1,
    endTick: -1,
    knockbackData: {
      speed: 75, 
      angle: 0, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // beam jiren meditate 2 barrier
  {
    name: "knockback beam jiren meditate 2 barrier",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // justice tornado
  {
    name: "knockback justice tornado",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 3, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // justice tornado 2
  {
    name: "knockback justice tornado 2",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 4.5, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: true,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // death storm
  {
    name: "knockback death storm start",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 33,
    knockbackData: {
      speed: 5, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: true,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback death storm explosion",
    repeatInterval: 1, 
    startTick: 33,
    endTick: 39,
    knockbackData: {
      speed: 5, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback death storm end",
    repeatInterval: 1, 
    startTick: 33,
    endTick: -1,
    knockbackData: {
      speed: 7, 
      angle: 0, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // nova star omega
  {
    name: "knockback nova star omega",
    repeatInterval: 1, 
    startTick: 75,
    endTick: -1,
    knockbackData: {
      speed: 42, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // justice kick 2
  {
    name: "knockback justice kick 2",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 6,
    knockbackData: {
      speed: 15, 
      angle: 0, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // circle flash
  {
    name: "knockback circle flash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 180, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // yamcha r super spirit ball
  {
    name: "knockback yamcha r super spirit ball",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 4, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // yamcha r wolf fang hurricane
  {
    name: "knockback yamcha r wolf fang hurricane",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 4, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // yamcha r batter up
  {
    name: "knockback yamcha r batter up deflect",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 0, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: true,
    isPersistent: false,
  },
  // yamcha r sparking
  {
    name: "knockback yamcha r sparking",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 200, 
      angle: 0, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: true,
    isPersistent: false,
  },
  // psycho javelin knock in
  {
    name: "knockback psycho javelin",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 25, 
      angle: 180, 
      aoe: 150,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // telekinesis knock in
  {
    name: "knockback guldo telekinesis",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 90, 
      angle: 180, 
      aoe: 550,
    },
    knockbackSource: AOEKnockback.SOURCE_TARGET_POINT,
    useLastCastPoint: true,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // kame super roshi
  {
    name: "knockback kame super roshi",
    repeatInterval: 1, 
    startTick: 7,
    endTick: -1,
    knockbackData: {
      speed: 49, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // lightning surprise
  {
    name: "knockback lightning surprise",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 3, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // divine authority
  {
    name: "knockback divine authority deflect",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 5, 
      angle: 0, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback divine authority knock-in",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // detroit smash
  {
    name: "knockback beam detroit smash",
    repeatInterval: 1, 
    startTick: 2,
    endTick: -1,
    knockbackData: {
      speed: 36, 
      angle: 180, 
      aoe: 250,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // united states of smash
  {
    name: "knockback united states of smash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 50,
    knockbackData: {
      speed: 12, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback beam united states of smash inner",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback beam united states of smash outer",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 0, 
      aoe: 750,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // oklahoma smash
  {
    name: "knockback oklahoma smash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 50,
    knockbackData: {
      speed: 9, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback oklahoma smash release",
    repeatInterval: 1, 
    startTick: 50,
    endTick: -1,
    knockbackData: {
      speed: 39, 
      angle: 0, 
      aoe: 900,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // new hampshire smash
  {
    name: "knockback new hampshire smash",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 25, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // black materia
  {
    name: "knockback black materia",
    repeatInterval: 1, 
    startTick: 100,
    endTick: -1,
    knockbackData: {
      speed: 6, 
      angle: 180, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // mario cape
  {
    name: "knockback super cape",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 20, 
      angle: 0, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_TARGET_POINT,
    useLastCastPoint: true,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // tri beam
  {
    name: "knockback beam tri beam fire",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 7, 
      angle: 180, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // tien kiai
  {
    name: "knockback tien kiai",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 25, 
      angle: 0, 
      aoe: 600,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: true,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // tyranno roar knockback / deflect
  {
    name: "knockback tyranno roar",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 10, 
      angle: 0, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: true,
    affectAllies: false,
    isPersistent: false,
  },
  // water 2
  {
    name: "knockback water 2",
    repeatInterval: 1, 
    startTick: 44,
    endTick: -1,
    knockbackData: {
      speed: 45, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // skurvy kannon
  {
    name: "knockback skurvy kannon",
    repeatInterval: 1, 
    startTick: 1,
    endTick: -1,
    knockbackData: {
      speed: 50, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // cyclone knock-in
  {
    name: "knockback cyclone",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 5, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // tail spin knock-in
  {
    name: "knockback tail spin",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 6, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // aura storm
  {
    name: "knockback aura storm",
    repeatInterval: 1, 
    startTick: 44,
    endTick: -1,
    knockbackData: {
      speed: 43, 
      angle: 180, 
      aoe: 500,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback giga sphere",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 180, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // saitama serious punch
  {
    name: "knockback saitama serious punch",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // saitama serious sideways jumps
  {
    name: "knockback saitama serious sideways jumps",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 20, 
      angle: 0, 
      aoe: 400,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // dk jungle rush
  {
    name: "knockback dk jungle rush",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 15, 
      angle: 180, 
      aoe: 300,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // chou makousen
  {
    name: "knockback chou makousen",
    repeatInterval: 1, 
    startTick: 52,
    endTick: -1,
    knockbackData: {
      speed: 40, 
      angle: 180, 
      aoe: 450,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // tail sweep
  {
    name: "knockback hirudegarn tail sweep",
    repeatInterval: 1, 
    startTick: 0,
    endTick: 6,
    knockbackData: {
      speed: 35, 
      angle: 0, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // shocking death ball
  {
    name: "knockback super 17 shocking death ball 1",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 6, 
      angle: 180, 
      aoe: 350,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback super 17 shocking death ball 2",
    repeatInterval: 2, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 5, 
      angle: 180, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  {
    name: "knockback super 17 shocking death ball 3",
    repeatInterval: 3, 
    startTick: 0,
    endTick: -1,
    knockbackData: {
      speed: 3, 
      angle: 180, 
      aoe: 1050,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: false,
  },
  // flashfreeze heatwave
  {
    name: "knockback shoto flashfreeze heatwave",
    repeatInterval: 1, 
    startTick: 16,
    endTick: 33,
    knockbackData: {
      speed: 45, 
      angle: 0, 
      aoe: 700,
    },
    knockbackSource: AOEKnockback.SOURCE_UNIT,
    useLastCastPoint: false,
    reflectBeams: false,
    affectAllies: false,
    isPersistent: true,
  },
];