import { Id, DebuffAbilities, OrderIds, Buffs } from "Common/Constants";
import { AOEDebuff } from "CustomAbility/AbilityComponent/AOEDebuff";

export const AOEDebuffComponents = [
  {
    name: "stun masenko",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun blazing rush",
    repeatInterval: 1,
    startTick: 20,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun super saiyan rage",
    repeatInterval: 33,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_MICRO,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 200,
    keepCasting: true, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun saiyan spirit",
    repeatInterval: 1,
    startTick: 3,
    endTick: 22,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun reliable friend",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun energy punch",
    repeatInterval: 1,
    startTick: 16,
    endTick: 24,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "stun behind you",
    repeatInterval: 1,
    startTick: 5,
    endTick: 15,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  // {
  //   name: "debuff brave slash feedback",
  //   repeatInterval: 1,
  //   startTick: 0,
  //   endTick: -1,
  //   debuffSource: AOEDebuff.SOURCE_UNIT,
  //   abilityId: DebuffAbilities.BRAVE_SLASH,
  //   orderId: OrderIds.CURSE,
  //   aoe: 300,
  //   keepCasting: false, 
  //   onlyAffectHeroes: true,
  //   requireBuff: false,
  //   buffId: 0,
  // },
  {
    name: "debuff heros song brave cannon",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.HEROS_SONG,
    orderId: OrderIds.SLOW,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff heros song heros flute start",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.HEROS_SONG,
    orderId: OrderIds.SLOW,
    aoe: 900,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff heros song heros flute continuous",
    repeatInterval: 33,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.HEROS_SONG,
    orderId: OrderIds.SLOW,
    aoe: 900,
    keepCasting: true, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff demons mark rakshasa claw",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DEMONS_MARK,
    orderId: OrderIds.CURSE,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff demons mark devil claw",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DEMONS_MARK,
    orderId: OrderIds.CURSE,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff krown toss",
    repeatInterval: 1,
    startTick: 0,
    endTick: 50,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.KROWN_TOSS,
    orderId: OrderIds.SLOW,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun kharge",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun hand kannon",
    repeatInterval: 1,
    startTick: 0,
    endTick: 16,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff blind frost claws",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.FROST_CLAWS_BLIND,
    orderId: OrderIds.CURSE,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow frost claws",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow ice slash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun absolute zero finish",
    repeatInterval: 1,
    startTick: 131,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_FROZEN_EIS_SHENRON,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.FROSTBITE,
  },
  {
    name: "debuff stun ice cannon",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_FROZEN_EIS_SHENRON,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.FROSTBITE,
  },
  {
    name: "debuff slow milky cannon",
    repeatInterval: 1,
    startTick: 30,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.MILKY_CANNON,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun impaling rush",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun nova rush",
    repeatInterval: 1,
    startTick: 23,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow dragon thunder omega",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DRAGON_THUNDER,
    orderId: OrderIds.SLOW,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff root circle flash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.CIRCLE_FLASH,
    orderId: OrderIds.ENTANGLING_ROOTS,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun yamcha r uppercut",
    repeatInterval: 1,
    startTick: 8,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun yamcha r sledgehammer",
    repeatInterval: 1,
    startTick: 12,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow yamcha r spirit ball",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SPIRIT_BALL,
    orderId: OrderIds.SLOW,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun yamcha r neo wolf fang fist",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff blind yamcha r blinding wolf fang fist",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.BLINDING_WOLF_FANG_FIST,
    orderId: OrderIds.CURSE,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun lightning surprise",
    repeatInterval: 8,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: true, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff burn roshi mafuba sealing",
    repeatInterval: 16,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.MAFUBA_SEALING,
    orderId: OrderIds.SOUL_BURN,
    aoe: 400,
    keepCasting: true, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff burn roshi mafuba sealed",
    repeatInterval: 1,
    startTick: 98,
    endTick: 98,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.MAFUBA_SEALED,
    orderId: OrderIds.SOUL_BURN,
    aoe: 400,
    keepCasting: true, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: Buffs.MAFUBA_SEALING,
  },
  {
    name: "debuff bleed zamasu",
    repeatInterval: 1,
    startTick: 0,
    endTick: 4,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.BLEED_ZAMASU,
    orderId: OrderIds.SLOW,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun united states of smash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun carolina smash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun california smash",
    repeatInterval: 1,
    startTick: 22,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun new hampshire smash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff fervent wound",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.FERVENT_WOUND,
    orderId: OrderIds.SLOW,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun time cage",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 50,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow flatten",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.FLATTEN,
    orderId: OrderIds.SLOW,
    aoe: 550,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun goten rock throw",
    repeatInterval: 7,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_MICRO,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun super goten strike",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff root galactic donut",
    repeatInterval: 1,
    startTick: 16,
    endTick: 40,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.GALACTIC_DONUT,
    orderId: OrderIds.ENTANGLING_ROOTS,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun ultra volleyball",
    repeatInterval: 1,
    startTick: 16,
    endTick: 40,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow getsuga gran",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.GRAN_REY_SLOW,
    orderId: OrderIds.SLOW,
    aoe: 650,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun mugetsu slash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_AND_A_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 850,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun burning rush",
    repeatInterval: 1,
    startTick: 20,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow madness slash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: Id.madnessDebuffSlow,
    orderId: OrderIds.SLOW,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow madness on hit",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: Id.madnessDebuffSlow,
    orderId: OrderIds.SLOW,
    aoe: 50,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun burning rush",
    repeatInterval: 1,
    startTick: 20,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow final burst",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.FINAL_BURST_SLOW,
    orderId: OrderIds.SLOW,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow crono lightning 3",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.LIGHTNING_3_SLOW,
    orderId: OrderIds.SLOW,
    aoe: 350,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow marle ice 2",
    repeatInterval: 33,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 800,
    keepCasting: true, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow magus ice 2",
    repeatInterval: 33,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 700,
    keepCasting: true, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff magus dark mist",
    repeatInterval: 10,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DARK_MIST,
    orderId: OrderIds.CURSE,
    aoe: 1000,
    keepCasting: true, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff sleep lucca hypnosis",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.HYPNOWAVE_SLEEP,
    orderId: OrderIds.SLEEP,
    aoe: 700,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow marle ice",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun lucario gigantamax",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow saitama table flip",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.TABLE_FLIP,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun saitama serious punch",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow dk ground pound start",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DK_GROUND_POUND_SLOW,
    orderId: OrderIds.SLOW,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow dk ground pound continuous",
    repeatInterval: 33,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.DK_GROUND_POUND_SLOW,
    orderId: OrderIds.SLOW,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun dk jungle rush start",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun dk jungle rush end",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun hirudegarn heavy stomp",
    repeatInterval: 1,
    startTick: 4,
    endTick: 4,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow shoto glacier",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow shoto ice path",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.EIS_FROSTBITE,
    orderId: OrderIds.SLOW,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun shoto flashfreeze heatwave",
    repeatInterval: 1,
    startTick: 0,
    endTick: 15,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun shoto heaven piercing ice wall",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.FROSTBITE,
  },
  {
    name: "debuff stun guts heavy slash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun guts heavy slam",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow appule emergency escape",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_50_PCT_5S,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff curse appule vengeance",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.APPULE_VENGEANCE,
    orderId: OrderIds.CURSE,
    aoe: 300,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "buff illusion appule clones",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.APPULE_CLONES,
    orderId: OrderIds.WAND_OF_ILLUSION,
    aoe: 0,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow piccolo light grenade",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_25_PCT_5S,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow special beast cannon",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_25_PCT_5S,
    orderId: OrderIds.SLOW,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow waluigi fireball 1",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_WALUIGI_FIREBALL_1,
    orderId: OrderIds.SLOW,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun waluigi fireball 2 slow",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.SLOW_WALUIGI_FIREBALL_1,
  },
  {
    name: "debuff stun waluigi fireball 2 root",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.ROOT_WALUIGI_PIRANHA_PLANT,
  },
  {
    name: "debuff stun waluigi fireball 2 stun",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.STUN_WALUIGI_BOMB,
  },
  {
    name: "debuff stun waluigi fireball 2 curse",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.CURSE_WALUIGI_SPIN,
  },
  {
    name: "debuff stun waluigi piranha plant",
    repeatInterval: 3,
    startTick: 33,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.ROOT_WALUIGI_PIRANHA_PLANT,
    orderId: OrderIds.ENTANGLING_ROOTS,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun waluigi bomb",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_WALUIGI_BOMB,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff curse waluigi spin",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.CURSE_WALUIGI_SPIN,
    orderId: OrderIds.CURSE,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "buff inner fire max power",
    repeatInterval: 1,
    startTick: 0,
    endTick: 1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.MAX_POWER_DMG_BUFF,
    orderId: OrderIds.INNER_FIRE,
    aoe: 0,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "buff inner fire super charge",
    repeatInterval: 1,
    startTick: 0,
    endTick: 1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SUPER_CHARGE_DMG_BUFF,
    orderId: OrderIds.INNER_FIRE,
    aoe: 0,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun leon pistol",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 200,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: true,
    buffId: Buffs.SLOW_LEON_STAGGER,
  },
  {
    name: "debuff slow leon knife slash",
    repeatInterval: 1,
    startTick: 0,
    endTick: 2,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_LEON_STAGGER,
    orderId: OrderIds.SLOW,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow leon knife parry",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_LEON_STAGGER,
    orderId: OrderIds.SLOW,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow leon kick",
    repeatInterval: 1,
    startTick: 0,
    endTick: 10,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_LEON_STAGGER,
    orderId: OrderIds.SLOW,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun leon kick",
    repeatInterval: 1,
    startTick: 0,
    endTick: 10,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_HALF_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 450,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow leon rocket launcher",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_LEON_STAGGER,
    orderId: OrderIds.SLOW,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff blind leon flashbang",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.CURSE_LEON_FLASHBANG,
    orderId: OrderIds.CURSE,
    aoe: 500,
    keepCasting: false, 
    onlyAffectHeroes: false,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff root flesh attack",
    repeatInterval: 1,
    startTick: 0,
    endTick: 0,
    debuffSource: AOEDebuff.SOURCE_TARGET_UNIT,
    abilityId: DebuffAbilities.FLESH_ATTACK_ABSORB,
    orderId: OrderIds.ENTANGLING_ROOTS,
    aoe: 50,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun peco princess strike",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 200,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow peco princess splash",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_25_PCT_3S,
    orderId: OrderIds.SLOW,
    aoe: 400,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff stun peco royal slash",
    repeatInterval: 1,
    startTick: -1,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.STUN_ONE_SECOND,
    orderId: OrderIds.THUNDERBOLT,
    aoe: 200,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow peco princess valiant",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_50_PCT_5S,
    orderId: OrderIds.SLOW,
    aoe: 600,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
  {
    name: "debuff slow link boomerang",
    repeatInterval: 1,
    startTick: 0,
    endTick: -1,
    debuffSource: AOEDebuff.SOURCE_UNIT,
    abilityId: DebuffAbilities.SLOW_GENERIC_50_PCT_3S,
    orderId: OrderIds.SLOW,
    aoe: 250,
    keepCasting: false, 
    onlyAffectHeroes: true,
    requireBuff: false,
    buffId: 0,
  },
]