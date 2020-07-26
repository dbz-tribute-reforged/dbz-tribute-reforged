import { MultiComponent } from "CustomAbility/AbilityComponent/MultiComponent";

export const MultiComponents = [
  {
    name: "multi twin dragon shot", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 30,
    angleMin: -15,
    angleMax: 15,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 16,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 2,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: false,
    sfxList: true,
    components: [
      { name: "beam twin dragon shot" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi final flash 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -2.5,
    angleMax: 2.5,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 2,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam final flash" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi energy blast volley", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -20,
    angleMax: 20,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 16,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam energy blast volley" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi father-son kame", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 500,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam father-son kame" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi father-son kame goku", 
    repeatInterval: 1, 
    startTick: 99,
    endTick: -1,
    angleDifference: 1,
    angleMin: 170,
    angleMax: 171,
    forceMinDistance: 250,
    forceMaxDistance: 250,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "sfx father-son kame goku" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi hellzone grenade", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 30,
    angleMin: -60,
    angleMax: 300,
    forceMinDistance: 800,
    forceMaxDistance: 800,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 12,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: true,
    useTargetUnitAsSource: true,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam hellzone grenade" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi hellzone grenade 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 60,
    angleMin: 60,
    angleMax: -300,
    forceMinDistance: 500,
    forceMaxDistance: 500,
    delayBetweenComponents: 4,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 6,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: true,
    useTargetUnitAsSource: true,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam hellzone grenade" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi innocence breath", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -60,
    angleMax: 60,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 12,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam innocence breath" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi mankind destruction attack", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -179,
    angleMax: 180,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 4,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 66,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam mankind destruction attack" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi double sunday", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 8,
    angleMin: -4,
    angleMax: 4,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 2,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam double sunday" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi blazing storm", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -20,
    angleMax: 20,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 0,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 5,
    componentsAddedPerRound: 2,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi blazing storm 1", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 0,
    angleMin: -20,
    angleMax: -20,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  {
    name: "multi blazing storm 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 0,
    angleMin: -10,
    angleMax: -10,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  {
    name: "multi blazing storm 3", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 0,
    angleMin: 0,
    angleMax: 0,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  {
    name: "multi blazing storm 4", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 0,
    angleMin: 10,
    angleMax: 10,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  {
    name: "multi blazing storm 5", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 0,
    angleMin: 20,
    angleMax: 20,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target blazing storm explosion" },
      { name: "sfx blazing storm" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi lava burst", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 60,
    angleMin: -150,
    angleMax: 150,
    forceMinDistance: 600,
    forceMaxDistance: 600,
    delayBetweenComponents: 6,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 5,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: false,
    sfxList: true,
    components: [
      { name: "beam lava burst" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi lava pillars", 
    repeatInterval: 8, 
    startTick: 0,
    endTick: -1,
    angleDifference: 40,
    angleMin: 0,
    angleMax: 360,
    forceMinDistance: 300,
    forceMaxDistance: 700,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 2,
    alwaysUpdateAngle: true,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target lava pillars" },
      { name: "sfx lava pillars" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi lava pillars 2", 
    repeatInterval: 8, 
    startTick: 0,
    endTick: -1,
    angleDifference: 40,
    angleMin: 0,
    angleMax: 360,
    forceMinDistance: 700,
    forceMaxDistance: 1100,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 2,
    alwaysUpdateAngle: true,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage target lava pillars" },
      { name: "sfx lava pillars" },
    ],
  },
  // -------------------------------------------
  // {
  //   name: "multi barrier prison", 
  //   repeatInterval: 1, 
  //   startTick: 0,
  //   endTick: -1,
  //   angleDifference: 0,
  //   angleMin: 0,
  //   angleMax: 0,
  //   forceMinDistance: 0,
  //   forceMaxDistance: 0,
  //   delayBetweenComponents: 0,
  //   firingMode: MultiComponent.SPREAD_FIRING,
  //   multiplyComponents: 1,
  //   componentsAddedPerRound: 1,
  //   alwaysUpdateAngle: false,
  //   fixedSourceCoords: true,
  //   useTargetUnitAsSource: true,
  //   useLastCastPoint: true,
  //   sfxList: true,
  //   components: [
  //     { name: "beam barrier prison" },
  //   ],
  // },
  // -------------------------------------------
  {
    name: "multi barrier wall", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 15,
    angleMin: -60,
    angleMax: 60,
    forceMinDistance: 500,
    forceMaxDistance: 0,
    delayBetweenComponents: 0,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 8,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: true,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam barrier wall" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi super electric strike", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -60,
    angleMax: 60,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 12,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam super electric strike" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi power blitz barrage", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: -2,
    angleMax: 2,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 16,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 10,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam power blitz barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi videl punch", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 200,
    forceMaxDistance: 200,
    delayBetweenComponents: 0,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 3,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage videl punch" },
      { name: "knockback videl punch" },
      { name: "sfx videl punch" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi brave slash", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 200,
    forceMaxDistance: 200,
    delayBetweenComponents: 0,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 2,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage brave slash" },
      { name: "sfx brave slash" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi justice flash", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: -4,
    angleMax: 4,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 8,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 12,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam justice flash" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi justice flash 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: -4,
    angleMax: 4,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 8,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 16,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam justice flash 2" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi solar kame", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 500,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam solar kame" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi devil claw", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -10,
    angleMax: 10,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 3,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam devil claw" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi lightning shower rain", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 20,
    angleMin: -50,
    angleMax: 50,
    forceMinDistance: 350,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 6,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam lightning shower rain" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi hand kannon", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 200,
    forceMaxDistance: 200,
    delayBetweenComponents: 0,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 4,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "damage hand kannon dps" },
      { name: "knockback hand kannon" },
      { name: "knockback hand kannon deflect" },
      { name: "sfx hand kannon" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi blast-o-matic", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 500,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam blast-o-matic" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi frost claws", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 15,
    angleMin: -22,
    angleMax: 24,
    forceMinDistance: 200,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 4,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam frost claws" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi galaxy dynamite", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: -4,
    angleMax: 4,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 10,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 4,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam galaxy dynamite" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi death beam barrage", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -10,
    angleMax: 10,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 5,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 5,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam death beam barrage" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi death saucer", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 30,
    angleMin: -15,
    angleMax: 15,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 16,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: false,
    sfxList: true,
    components: [
      { name: "beam death saucer 1" },
      { name: "beam death saucer 2" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi cage of light", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 30,
    angleMin: -60,
    angleMax: 300,
    forceMinDistance: 550,
    forceMaxDistance: 550,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 12,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: true,
    useTargetUnitAsSource: true,
    useLastCastPoint: false,
    sfxList: true,
    components: [
      { name: "beam cage of light pillar" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi dragon flash bullet", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -20,
    angleMax: 20,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 13,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam dragon flash bullet" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi nova star omega", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: 0,
    angleMax: 1,
    forceMinDistance: 500,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam nova star" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi scattering bullet start 1", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 90,
    angleMin: -6,
    angleMax: 354,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam scattering bullet start 1" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi scattering bullet start 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 45,
    angleMin: 6,
    angleMax: 366,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 1,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: true,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam scattering bullet start 2" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi power blitz barrage saga", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 1,
    angleMin: -2,
    angleMax: 2,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 16,
    firingMode: MultiComponent.SPREAD_FIRING,
    multiplyComponents: 14,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam power blitz barrage saga" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi mankind destruction attack saga", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 10,
    angleMin: -179,
    angleMax: 180,
    forceMinDistance: 0,
    forceMaxDistance: 0,
    delayBetweenComponents: 6,
    firingMode: MultiComponent.RANDOM_FIRING,
    multiplyComponents: 22,
    componentsAddedPerRound: 1,
    alwaysUpdateAngle: false,
    fixedSourceCoords: false,
    fixedReplacementCoords: false,
    useTargetUnitAsSource: false,
    useLastCastPoint: true,
    sfxList: true,
    components: [
      { name: "beam mankind destruction attack" },
    ],
  },
];