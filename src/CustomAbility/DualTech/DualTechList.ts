import { Id } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";

export const DualTechList = [
  // sorrowful scythe
  {
    name: "3T Sorrowful Scythe",
    sourceAbility: Id.gokuBlackSorrowfulScythe,
    replaceAbilityName: "",
    aoe: 2000,
    casterDistance: -1,
    limit: 2,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: false,
    parts: [
      { name: "goku black sorrowful scythe" },
      { name: "goku black sorrowful scythe" },
    ]
  },
  // aura whirl
  {
    name: "2T Marle Aura Whirl",
    sourceAbility: Id.marleAura,
    replaceAbilityName: AbilityNames.Crono.AURA_WHIRL,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono aura whirl" },
    ]
  },
  {
    name: "2T Crono Aura Whirl",
    sourceAbility: Id.cronoCyclone,
    replaceAbilityName: AbilityNames.Crono.AURA_WHIRL,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle aura whirl" },
    ]
  },
  // x strike
  {
    name: "2T Crono X Strike",
    sourceAbility: Id.cronoSlash,
    replaceAbilityName: AbilityNames.Crono.X_STRIKE,
    aoe: 800,
    casterDistance: 1600,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog x strike" },
    ]
  },
  {
    name: "2T Frog X Strike",
    sourceAbility: Id.frogSlurpCut,
    replaceAbilityName: AbilityNames.Crono.X_STRIKE,
    aoe: 800,
    casterDistance: 1600,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono x strike" },
    ]
  },
  // rocket roll
  {
    name: "2T Crono Rocket Roll",
    sourceAbility: Id.cronoCyclone,
    replaceAbilityName: AbilityNames.Crono.ROCKET_ROLL,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo rocket roll" },
    ]
  },
  // super volt
  {
    name: "2T Crono Super Volt",
    sourceAbility: Id.cronoLightning2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo super volt" },
    ]
  },
  {
    name: "2T Robo Super Volt",
    sourceAbility: Id.roboElectrocute,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono super volt" },
    ]
  },
  // drill kick
  {
    name: "2T Crono Drill Kick",
    sourceAbility: Id.cronoCyclone,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla drill kick" },
    ]
  },
  // volt bite
  {
    name: "2T Crono Volt Bite 1",
    sourceAbility: Id.cronoLightning,
    replaceAbilityName: "",
    aoe: 350,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla volt bite" },
    ]
  },
  {
    name: "2T Crono Volt Bite 2",
    sourceAbility: Id.cronoLightning3,
    replaceAbilityName: "",
    aoe: 350,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla volt bite" },
    ]
  },
  // ice sword
  {
    name: "2T Marle Ice Sword 1",
    sourceAbility: Id.marleIce,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono ice sword" },
    ]
  },
  {
    name: "2T Marle Ice Sword 2",
    sourceAbility: Id.marleIce2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono ice sword" },
    ]
  },
  // antipode 1
  {
    name: "2T Marle Antipode 1",
    sourceAbility: Id.marleIce,
    replaceAbilityName: AbilityNames.Marle.ANTIPODE_1,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca antipode 1" },
    ]
  },
  {
    name: "2T Lucca Antipode 1",
    sourceAbility: Id.luccaFire,
    replaceAbilityName: AbilityNames.Marle.ANTIPODE_1,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle antipode 1" },
    ]
  },
  // antipode 2
  {
    name: "2T Marle Antipode 2",
    sourceAbility: Id.marleIce2,
    replaceAbilityName: AbilityNames.Marle.ANTIPODE_2,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca antipode 2" },
    ]
  },
  {
    name: "2T Lucca Antipode 2",
    sourceAbility: Id.luccaFire2,
    replaceAbilityName: AbilityNames.Marle.ANTIPODE_2,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle antipode 2" },
    ]
  },
  // ice water
  {
    name: "2T Marle Ice Water",
    sourceAbility: Id.marleIce,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog ice water" },
    ]
  },
  // glacier
  {
    name: "2T Marle Glacier",
    sourceAbility: Id.marleIce2,
    replaceAbilityName: AbilityNames.Marle.GLACIER,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog glacier" },
    ]
  },
  {
    name: "2T Frog Glacier",
    sourceAbility: Id.frogWater2,
    replaceAbilityName: AbilityNames.Marle.GLACIER,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle glacier" },
    ]
  },
  // glacier
  {
    name: "2T Marle Ice Toss",
    sourceAbility: Id.marleIce,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla ice toss" },
    ]
  },
  // cube toss
  {
    name: "2T Marle Cube Toss",
    sourceAbility: Id.marleIce2,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla cube toss" },
    ]
  },
  // aura beam
  {
    name: "2T Marle Aura Beam",
    sourceAbility: Id.marleAura,
    replaceAbilityName: AbilityNames.Marle.AURA_BEAM,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo aura beam" },
    ]
  },
  {
    name: "2T Robo Aura Beam",
    sourceAbility: Id.roboHealBeam,
    replaceAbilityName: AbilityNames.Marle.AURA_BEAM,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle aura beam" },
    ]
  },
  // ice tackle
  {
    name: "2T Marle Ice Tackle 1",
    sourceAbility: Id.marleIce,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo ice tackle" },
    ]
  },
  {
    name: "2T Marle Ice Tackle 2",
    sourceAbility: Id.marleIce2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo ice tackle" },
    ]
  },
  // flame whirl
  {
    name: "2T Lucca Flame Whirl",
    sourceAbility: Id.luccaFlamethrower,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono flame whirl" },
    ]
  },
  // fire sword
  {
    name: "2T Lucca Fire Sword 1",
    sourceAbility: Id.luccaFire,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono fire sword" },
    ]
  },
  {
    name: "2T Lucca Fire Sword 2",
    sourceAbility: Id.luccaFire2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono fire sword" },
    ]
  },
  // antipode 3
  {
    name: "2T Lucca Antipode 3",
    sourceAbility: Id.luccaFlare,
    replaceAbilityName: AbilityNames.Lucca.ANTIPODE_3,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "marle antipode 3" },
    ]
  },
  // red pin
  {
    name: "2T Lucca Red Pin 1",
    sourceAbility: Id.luccaFire,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog red pin" },
    ]
  },
  {
    name: "2T Lucca Red Pin 2",
    sourceAbility: Id.luccaFire2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog red pin" },
    ]
  },
  // line bomb
  {
    name: "2T Lucca Line Bomb 1",
    sourceAbility: Id.luccaNapalm,
    replaceAbilityName: "",
    aoe: 500,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog line bomb" },
    ]
  },
  {
    name: "2T Lucca Line Bomb 2",
    sourceAbility: Id.luccaMegaBomb,
    replaceAbilityName: "",
    aoe: 500,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog line bomb" },
    ]
  },
  // fire tackle
  {
    name: "2T Lucca Fire Tackle 1",
    sourceAbility: Id.luccaFire,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo fire tackle" },
    ]
  },
  {
    name: "2T Lucca Fire Tackle 2",
    sourceAbility: Id.luccaFire2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo fire tackle" },
    ]
  },
  // double bomb
  {
    name: "2T Lucca Double Bomb 1",
    sourceAbility: Id.luccaNapalm,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo double bomb" },
    ]
  },
  {
    name: "2T Lucca Double Bomb 2",
    sourceAbility: Id.luccaMegaBomb,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo double bomb" },
    ]
  },
  // flame kick
  {
    name: "2T Lucca Flame Kick",
    sourceAbility: Id.luccaFlamethrower,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla flame kick" },
    ]
  },
  // fire whirl
  {
    name: "2T Lucca Fire Whirl 1",
    sourceAbility: Id.luccaFire,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla fire whirl" },
    ]
  },
  {
    name: "2T Lucca Fire Whirl 2",
    sourceAbility: Id.luccaFire2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla fire whirl" },
    ]
  },
  // sword stream
  {
    name: "2T Frog Sword Stream 1",
    sourceAbility: Id.frogWater,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono sword stream" },
    ]
  },
  {
    name: "2T Frog Sword Stream 2",
    sourceAbility: Id.frogWater2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono sword stream" },
    ]
  },
  // spire
  {
    name: "2T Frog Spire",
    sourceAbility: Id.frogAerialStrike,
    replaceAbilityName: "",
    aoe: 1200,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono spire 2" },
      { name: "crono spire 3" },
    ]
  },
  // frog flare
  {
    name: "2T Frog Frog Flare",
    sourceAbility: Id.frogSquash,
    replaceAbilityName: AbilityNames.Frog.FROG_FLARE,
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca frog flare" },
    ]
  },
  // blade toss
  {
    name: "2T Frog Blade Toss",
    sourceAbility: Id.frogSlurpCut,
    replaceAbilityName: AbilityNames.Frog.BLADE_TOSS,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo blade toss" },
    ]
  },
  // bubble snap
  {
    name: "2T Frog Bubble Snap 1",
    sourceAbility: Id.frogWater,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo bubble snap" },
    ]
  },
  {
    name: "2T Frog Bubble Snap 2",
    sourceAbility: Id.frogWater2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "robo bubble snap" },
    ]
  },
  // bubble hit
  {
    name: "2T Frog Bubble Hit 1",
    sourceAbility: Id.frogWater,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla bubble hit" },
    ]
  },
  {
    name: "2T Frog Bubble Hit 2",
    sourceAbility: Id.frogWater2,
    replaceAbilityName: "",
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla bubble hit" },
    ]
  },
  // max cyclone
  {
    name: "2T Robo Max Cyclone",
    sourceAbility: Id.roboLaserSpin,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono max cyclone" },
    ]
  },
  // fire uzzi punch
  {
    name: "2T Robo Fire Uzzi Punch",
    sourceAbility: Id.roboUzziPunch,
    replaceAbilityName: AbilityNames.Robo.FIRE_UZZI_PUNCH,
    aoe: 600,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca fire uzzi punch 1" },
      { name: "lucca fire uzzi punch 2" },
    ]
  },
  // boogie
  {
    name: "2T Robo Boogie",
    sourceAbility: Id.roboLaserSpin,
    replaceAbilityName: AbilityNames.Robo.BOOGIE,
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla boogie" },
    ]
  },
  // robo spin kick
  {
    name: "2T Robo Spin Kick",
    sourceAbility: Id.roboTackle,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "ayla spin kick" },
    ]
  },
  // ayla falcon hit
  {
    name: "2T Ayla Falcon Hit",
    sourceAbility: Id.aylaBoulderToss,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "crono falcon hit" },
    ]
  },
  // blaze kick
  {
    name: "2T Ayla Blaze Kick 1",
    sourceAbility: Id.aylaTripleKick,
    replaceAbilityName: AbilityNames.Ayla.BLAZE_KICK_1,
    aoe: 800,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca blaze kick 1" },
    ]
  },
  {
    name: "2T Ayla Blaze Kick 2",
    sourceAbility: Id.aylaTripleKick,
    replaceAbilityName: AbilityNames.Ayla.BLAZE_KICK_2,
    aoe: 800,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: false,
    useOriginalOnEmpty: true,
    parts: [
      { name: "lucca blaze kick 2" },
    ]
  },
  // slurp kiss
  {
    name: "2T Ayla Slurp Kiss",
    sourceAbility: Id.aylaCharm,
    replaceAbilityName: "",
    aoe: 400,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: true,
    useLastCastPoint: false,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog slurp kiss" },
    ]
  },
  // drop kick
  {
    name: "2T Ayla Drop Kick",
    sourceAbility: Id.aylaTripleKick,
    replaceAbilityName: "",
    aoe: 800,
    casterDistance: -1,
    limit: 1,
    useCasterPoint: false,
    useLastCastPoint: true,
    useOriginalAbility: true,
    useOriginalOnEmpty: true,
    parts: [
      { name: "frog drop kick" },
    ]
  },
];