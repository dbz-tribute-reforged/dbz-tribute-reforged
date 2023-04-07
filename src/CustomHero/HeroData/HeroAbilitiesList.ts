import { Id } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";

export const HeroAbilitiesList: Map<number, string[]> = new Map(
  [
    // goku and xeno
    [Id.goku, [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Goku.SPIRIT_BOMB, 
      AbilityNames.Goku.DRAGON_FIST, 
      AbilityNames.Goku.SUPER_DRAGON_FIST, 
      AbilityNames.Goku.GOD_KAMEHAMEHA, 
      AbilityNames.Goku.ULTRA_INSTINCT,
      AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    ]],
    [FourCC("H08J"), [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Goku.SPIRIT_BOMB, 
      AbilityNames.Goku.DRAGON_FIST, 
      AbilityNames.Goku.SUPER_DRAGON_FIST, 
      AbilityNames.Goku.GOD_KAMEHAMEHA, 
      AbilityNames.Goku.ULTRA_INSTINCT,
      AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    ]],

    // vegeta
    [Id.vegeta, [
      AbilityNames.Vegeta.GALICK_GUN, 
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 
      AbilityNames.Vegeta.FINAL_FLASH, 
      AbilityNames.Vegeta.FINAL_FLASH_2, 
      AbilityNames.Vegeta.MOONLIGHT, 
      AbilityNames.Vegeta.ANGRY_SHOUT, 
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY,
      AbilityNames.Vegeta.ULTRA_EGO,
      AbilityNames.Vegeta.EGO_GALICK_GUN, 
      AbilityNames.Vegeta.HAKAI_BARRAGE, 
    ]],
    
    // gohan
    [Id.gohan, [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Goku.GOD_KAMEHAMEHA, 
      AbilityNames.Gohan.MASENKO, 
      AbilityNames.Gohan.SUPER_MASENKO, 
      AbilityNames.Gohan.TWIN_DRAGON_SHOT,
      AbilityNames.Gohan.SUPER_DRAGON_FLIGHT, 
      AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA, 
      AbilityNames.Gohan.SPECIAL_BEAST_CANNON, 
      AbilityNames.Gohan.UNLOCK_POTENTIAL, 
      AbilityNames.Gohan.THE_GREAT_SAIYAMAN_HAS_ARRIVED, 
      AbilityNames.Gohan.POTENTIAL_UNLEASHED,
      AbilityNames.Gohan.BEAST_GOHAN,
    ]],
    
    // goten
    [Id.goten, [
      AbilityNames.Goku.KAMEHAMEHA,
      AbilityNames.Goten.ROCK_THROW,
      AbilityNames.Goten.SUPER_GOTEN_STRIKE,
    ]],
    // kid trunks
    [Id.kidTrunks, [
      AbilityNames.FutureTrunks.FINISH_BUSTER,
      AbilityNames.KidTrunks.FINAL_CANNON,
      AbilityNames.KidTrunks.SWORD_OF_HOPE,
    ]],
    // gotenks
    [Id.gotenks, [
      AbilityNames.Goku.KAMEHAMEHA,
      AbilityNames.Gotenks.DIE_DIE_MISSILE_BARRAGE,
      AbilityNames.Gotenks.GALACTIC_DONUT,
      AbilityNames.Gotenks.ULTRA_VOLLEYBALL,
      AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK,
      AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK_2,
      AbilityNames.Gotenks.GOTENKS_SS3,
    ]],

    // future trunks
    [Id.ft, [
      AbilityNames.FutureTrunks.FINISH_BUSTER, 
      AbilityNames.FutureTrunks.HEAT_DOME_ATTACK, 
      AbilityNames.FutureTrunks.BURNING_ATTACK, 
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 
      AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK, 
      AbilityNames.FutureTrunks.SWORD_OF_HOPE, 
      AbilityNames.FutureTrunks.BLAZING_RUSH, 
      AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE,
    ]],
    // ss rage
    [FourCC("H08I"), [
      AbilityNames.FutureTrunks.FINISH_BUSTER, 
      AbilityNames.FutureTrunks.BURNING_ATTACK, 
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 
      AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK, 
      AbilityNames.FutureTrunks.BLAZING_RUSH, 
      "Heat Dome Attack", 
      AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE
    ]],

    // piccolo
    [Id.piccolo, [
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
      AbilityNames.Piccolo.SLAPPY_HAND, 
      AbilityNames.Piccolo.HELLZONE_GRENADE, 
      AbilityNames.Piccolo.MULTI_FORM, 
      AbilityNames.Piccolo.LIGHT_GRENADE, 
      AbilityNames.Piccolo.KYODAIKA
    ]],
    // piccolo clone
    [FourCC("H04X"), [
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
    ]],

    // bardock
    [FourCC("H08M"), [
      AbilityNames.Bardock.FUTURE_SIGHT,
      AbilityNames.Bardock.TYRANT_BREAKER, 
      AbilityNames.Bardock.TYRANT_LANCER, 
      AbilityNames.Bardock.RIOT_JAVELIN, 
      AbilityNames.Bardock.REBELLION_SPEAR, 
      AbilityNames.Vegeta.MOONLIGHT, 
      AbilityNames.Vegeta.ANGRY_SHOUT, 
      AbilityNames.Bardock.SAIYAN_SPIRIT, 
    ]],
    
    // pan
    [Id.pan, [
      AbilityNames.Pan.KAMEHAMEHA, 
      AbilityNames.Pan.GOD_KAMEHAMEHA, 
      AbilityNames.Pan.MAIDEN_BLAST, 
      AbilityNames.Pan.RELIABLE_FRIEND, 
      AbilityNames.Pan.SUMMON_GIRU, 
      AbilityNames.Pan.HONEY_BEE_COSTUME
    ]],
    [FourCC("H08R"), [AbilityNames.Pan.KAMEHAMEHA, AbilityNames.Pan.GOD_KAMEHAMEHA, AbilityNames.Pan.MAIDEN_BLAST, AbilityNames.Pan.RELIABLE_FRIEND, AbilityNames.Pan.SUMMON_GIRU, AbilityNames.Pan.HONEY_BEE_COSTUME]],
    // giru
    [FourCC("H08Q"), ["Machine Gun", "Grappling Claw", "Gill Missile", AbilityNames.Pan.RELIABLE_FRIEND, "Dragon Radar"]],

    // android 17 dbs
    [FourCC("H08Z"), [
      AbilityNames.Android17DBS.POWER_BLITZ, 
      AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE, 
      AbilityNames.Android17DBS.BARRIER_PRISON, 
      AbilityNames.Android17DBS.BARRIER_WALL, 
      AbilityNames.Android17DBS.ANDROID_BARRIER, 
      AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE
    ]],

    // videl
    [FourCC("H085"), [
      AbilityNames.Videl.PUNCH, 
      AbilityNames.Videl.KICK, 
      AbilityNames.Videl.FLYING_KICK, 
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY, 
    ]],

    // upa
    [FourCC("H099"), [
      AbilityNames.Upa.JAVELIN_THROW, 
      AbilityNames.Upa.WHIRLWIND_TEMPEST, 
      AbilityNames.Upa.KORIN_FLAG, 
      AbilityNames.Upa.LAST_STAND, 
    ]],

    // tapion
    [FourCC("E014"), [
      AbilityNames.Tapion.BRAVE_SLASH, 
      AbilityNames.Tapion.BRAVE_CANNON, 
      AbilityNames.Tapion.SHINING_SWORD, 
      AbilityNames.Tapion.HEROS_FLUTE,
      AbilityNames.Tapion.BRAVE_SWORD_ATTACK, 
    ]],

    // jiren
    [FourCC("E01P"), [
      AbilityNames.Jiren.POWER_IMPACT, 
      AbilityNames.Jiren.POWER_IMPACT_2, 
      AbilityNames.Jiren.MIGHTY_PUNCH, 
      AbilityNames.Jiren.MIGHTY_PUNCH_2, 
      AbilityNames.Jiren.GLARE, 
      AbilityNames.Jiren.GLARE_2, 
      AbilityNames.Jiren.HEATWAVE, 
      AbilityNames.Jiren.HEATWAVE_2, 
      AbilityNames.Jiren.MEDITATE, 
      AbilityNames.Jiren.MEDITATE_2, 
      AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR, 
      AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_2,
      AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_3,
    ]],

    // toppo
    [FourCC("H09C"), [
      AbilityNames.Toppo.JUSTICE_FLASH, 
      AbilityNames.Toppo.JUSTICE_FLASH_2, 
      AbilityNames.Toppo.JUSTICE_PUNCH, 
      AbilityNames.Toppo.JUSTICE_PUNCH_2, 
      AbilityNames.Toppo.JUSTICE_HOLD, 
      AbilityNames.Toppo.JUSTICE_HOLD_2, 
      AbilityNames.Toppo.JUSTICE_TORNADO, 
      AbilityNames.Toppo.JUSTICE_TORNADO_2, 
      AbilityNames.Toppo.JUSTICE_POSE, 
      AbilityNames.Toppo.GOD_OF_DESTRUCTION, 
    ]],

    // dyspo
    [FourCC("H09H"), [
      AbilityNames.Dyspo.LIGHT_BULLET,
      AbilityNames.Dyspo.JUSTICE_KICK,
      AbilityNames.Dyspo.JUSTICE_KICK_ON_HIT,
      AbilityNames.Dyspo.JUSTICE_KICK_2,
      AbilityNames.Dyspo.JUSTICE_CANNON,
      AbilityNames.Dyspo.JUSTICE_CANNON_2,
      AbilityNames.Dyspo.CIRCLE_FLASH,
      AbilityNames.Dyspo.CIRCLE_FLASH_2,
      AbilityNames.Dyspo.JUSTICE_POSE,
      AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE,
    ]],

    // krillin
    [FourCC("H03Y"), [
      AbilityNames.Krillin.KAMEHAMEHA,
      AbilityNames.Krillin.SCATTERING_BULLET,
      AbilityNames.Krillin.DESTRUCTO_DISC,
      AbilityNames.Krillin.SENZU_THROW,
    ]],

    // yamcha r
    [Id.yamchaR, [
      AbilityNames.YamchaR.LIGHT_PUNCH,
      AbilityNames.YamchaR.MEDIUM_PUNCH,
      AbilityNames.YamchaR.HEAVY_PUNCH,

      AbilityNames.YamchaR.DASH_LEFT,
      AbilityNames.YamchaR.DASH_FORWARD,
      AbilityNames.YamchaR.DASH_RIGHT,

      AbilityNames.YamchaR.SUPER_SPIRIT_BALL,
      AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA,
      AbilityNames.YamchaR.WOLF_FANG_BLAST,
      
      AbilityNames.YamchaR.UPPERCUT,
      AbilityNames.YamchaR.METEOR_CRASH,
      AbilityNames.YamchaR.SLEDGEHAMMER,

      AbilityNames.YamchaR.WOLF_FANG_HURRICANE,
      AbilityNames.YamchaR.WOLF_FANG_VOLLEY,
      AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST,
  
      AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST,
      AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST,
      AbilityNames.YamchaR.NEO_WOLF_FANG_FIST,
  
      AbilityNames.YamchaR.SPIRIT_BALL,
      AbilityNames.YamchaR.FLASH_KAME,
      AbilityNames.YamchaR.WOLF_FANG_BARRAGE,
  
      AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK,
      AbilityNames.YamchaR.WOLF_FANG_FLASH,
      AbilityNames.YamchaR.WOLF_FANG_FINISHER,
  
      AbilityNames.YamchaR.SUMMON_PUAR,
      AbilityNames.YamchaR.YAMCHA_BLAST,
      AbilityNames.YamchaR.PLAY_DEAD,
  
      AbilityNames.YamchaR.HOMERUN,
      AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST,
      AbilityNames.YamchaR.BATTER_UP,
      
      AbilityNames.YamchaR.SPARKING,
    ]],

    // roshi
    [FourCC("E001"), [
      AbilityNames.Roshi.KAMEHAMEHA_CHARGE,
      AbilityNames.Roshi.KAMEHAMEHA_FIRE,
      AbilityNames.Roshi.KAMEHAMEHA_SUPER_CHARGE,
      AbilityNames.Roshi.KAMEHAMEHA_SUPER_FIRE,
      AbilityNames.Roshi.LIGHTNING_SURPRISE,
      AbilityNames.Roshi.MAFUBA,
      AbilityNames.Roshi.MAX_POWER,
      AbilityNames.Roshi.NEW_TRICK,
      AbilityNames.Roshi.ULTIMATE_INSTINCT,
    ]],

    // all might
    [FourCC("H09K"), [
      AbilityNames.AllMight.DETROIT_SMASH,
      AbilityNames.AllMight.LEFT_SMASH,
      AbilityNames.AllMight.RIGHT_SMASH,
      AbilityNames.AllMight.UNITED_STATES_OF_SMASH,
      AbilityNames.AllMight.ONE_FOR_ALL,
      AbilityNames.AllMight.OKLAHOMA_SMASH,
      AbilityNames.AllMight.CAROLINA_SMASH,
      AbilityNames.AllMight.CALIFORNIA_SMASH,
      AbilityNames.AllMight.NEW_HAMPSHIRE_SMASH,
    ]],

    // mario
    [Id.mario, [
      AbilityNames.Mario.JUMP,
      AbilityNames.Mario.GROUND_POUND,
      AbilityNames.Mario.HAMMER_TIME,
      AbilityNames.Mario.SPIN_JUMP,
      AbilityNames.Mario.SUPER_CAPE,
      AbilityNames.Mario.POWER_UP_BLOCK,
      AbilityNames.Mario.FIREBALL,
      AbilityNames.Mario.SUPER_FIREBALL,
    ]],

    // tien
    [Id.tien, [
      AbilityNames.Tien.DODON_RAY,
      AbilityNames.Tien.TRI_BEAM_CHARGE,
      AbilityNames.Tien.TRI_BEAM_FIRE,
      AbilityNames.Tien.KIAI,
      AbilityNames.Tien.MULTI_FORM_SOLAR_FLARE,
      AbilityNames.Tien.FOUR_ARMS,
    ]],

    [Id.tienClone, [
      AbilityNames.Tien.DODON_RAY,
    ]],

    // ichigo
    [Id.ichigo, [
      AbilityNames.Ichigo.GETSUGA_TENSHO,
      AbilityNames.Ichigo.GETSUGA_KUROI,
      AbilityNames.Ichigo.GETSUGA_GRAN,
      AbilityNames.Ichigo.GETSUGA_JUJISHO,
      AbilityNames.Ichigo.GETSUGA_ON_HIT_1,
      AbilityNames.Ichigo.GETSUGA_ON_HIT_2,
      AbilityNames.Ichigo.GETSUGA_ON_HIT_3,
      AbilityNames.Ichigo.GETSUGA_ON_HIT_4,
      AbilityNames.Ichigo.BANKAI,
      AbilityNames.Ichigo.BANKAI_HOLLOW,
      AbilityNames.Ichigo.BANKAI_BLUT_VENE,
      AbilityNames.Ichigo.BANKAI_FINAL,
      AbilityNames.Ichigo.CERO_CHARGE,
      AbilityNames.Ichigo.CERO_FIRE,
      AbilityNames.Ichigo.MUGETSU_UNLEASH,
      AbilityNames.Ichigo.MUGETSU_SLASH,
      AbilityNames.Ichigo.SHUNPO,
      AbilityNames.Ichigo.HIRENKYAKU,
      AbilityNames.Ichigo.BLUTVENE,
      // AbilityNames.Ichigo.DASH_BANKAI_FINAL_1,
      // AbilityNames.Ichigo.DASH_BANKAI_FINAL_2,
      AbilityNames.Ichigo.CERO_GIGANTE,
    ]],

    [Id.dartFeld, [
      AbilityNames.DartFeld.DOUBLE_SLASH,
      AbilityNames.DartFeld.BURNING_RUSH,
      AbilityNames.DartFeld.MADNESS_SLASH,
      AbilityNames.DartFeld.CRUSH_DANCE,
      AbilityNames.DartFeld.HEART_OF_FIRE,
      AbilityNames.DartFeld.MADNESS_HERO,
      AbilityNames.DartFeld.MADNESS_DEBUFF_ON_HIT,
      AbilityNames.DartFeld.DRAGOON_TRANSFORMATION,
      AbilityNames.DartFeld.BLAZING_DYNAMO,
      AbilityNames.DartFeld.DRAGOON_FLOURISH,
      AbilityNames.DartFeld.FLAME_SHOT,
      AbilityNames.DartFeld.PARAGON_OF_FLAME,
      AbilityNames.DartFeld.PARAGON_OF_FLAME_ON_HIT,
      AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_1,
      AbilityNames.DartFeld.DASH_PARAGON_OF_FLAME_2,
      AbilityNames.DartFeld.FINAL_BURST,
      AbilityNames.DartFeld.RED_EYED_DRAGON_SUMMON,
    ]],

    [Id.crono, [
      AbilityNames.Crono.CYCLONE,
      AbilityNames.Crono.SLASH,
      AbilityNames.Crono.LIGHTNING,
      AbilityNames.Crono.LIGHTNING_2,
      AbilityNames.Crono.LIGHTNING_3,
      AbilityNames.Crono.CLEAVE,
      AbilityNames.Crono.LUMINAIRE,
    ]],

    [Id.frog, [
      AbilityNames.Frog.SLURP_CUT,
      AbilityNames.Frog.SLURP,
      AbilityNames.Frog.WATER,
      AbilityNames.Frog.WATER2,
      AbilityNames.Frog.AERIAL_STRIKE,
      AbilityNames.Frog.FROG_SQUASH,
    ]],

    [Id.robo, [
      AbilityNames.Robo.ROBO_TACKLE,
      AbilityNames.Robo.LASER_SPIN,
      AbilityNames.Robo.HEAL_BEAM,
      AbilityNames.Robo.UZZI_PUNCH,
      AbilityNames.Robo.ELECTROCUTE,
    ]],

    [Id.lucca, [
      AbilityNames.Lucca.FLAMETHROWER,
      AbilityNames.Lucca.HYPNOWAVE,
      AbilityNames.Lucca.FIRE,
      AbilityNames.Lucca.FIRE2,
      AbilityNames.Lucca.NAPALM,
      AbilityNames.Lucca.MEGABOMB,
      AbilityNames.Lucca.FLARE,
    ]],
    
    [Id.magus, [
      AbilityNames.Magus.LIGHTNING_2,
      AbilityNames.Magus.WATER_2,
      AbilityNames.Magus.FIRE_2,
      AbilityNames.Magus.ICE_2,
      AbilityNames.Magus.DARK_BOMB,
      AbilityNames.Magus.DARK_MIST,
      AbilityNames.Magus.DARK_MATTER,
    ]],

    [Id.ayla, [
      AbilityNames.Ayla.BOULDER_TOSS,
      AbilityNames.Ayla.CHARM,
      AbilityNames.Ayla.TAIL_SPIN,
      AbilityNames.Ayla.DINO_TAIL,
      AbilityNames.Ayla.TRIPLE_KICK,
    ]],

    [Id.marle, [
      AbilityNames.Marle.AURA,
      AbilityNames.Marle.ALLURE,
      AbilityNames.Marle.ICE,
      AbilityNames.Marle.ICE_2,
      AbilityNames.Marle.CURE,
      AbilityNames.Marle.HASTE,
    ]],

    [Id.lucario, [
      AbilityNames.Lucario.VACUUM_WAVE,
      AbilityNames.Lucario.IRON_DEFENSE,
      AbilityNames.Lucario.EXTREME_SPEED,
      AbilityNames.Lucario.EXTREME_SPEED_ON_HIT,
      AbilityNames.Lucario.AURA_SPHERE,
      AbilityNames.Lucario.MEGA_EVOLUTION,
      AbilityNames.Lucario.AURA_STORM,
      AbilityNames.Lucario.GIGANTAMAX,
      AbilityNames.Lucario.GIGA_SPHERE,
    ]],

    [Id.saitama, [
      AbilityNames.Saitama.NORMAL_PUNCH,
      AbilityNames.Saitama.CONSECUTIVE_PUNCHES,
      AbilityNames.Saitama.LEAP,
      AbilityNames.Saitama.TABLE_FLIP,
      AbilityNames.Saitama.OK,
      AbilityNames.Saitama.SERIOUS_SERIES,
      AbilityNames.Saitama.SERIOUS_PUNCH,
      AbilityNames.Saitama.SERIOUS_SIDEWAYS_JUMPS,
    ]],

    [Id.donkeyKong, [
      AbilityNames.DonkeyKong.GROUND_POUND,
      AbilityNames.DonkeyKong.ROLL,
      AbilityNames.DonkeyKong.BARREL_ROLL,
      AbilityNames.DonkeyKong.BANANA_SLAMMA,
      AbilityNames.DonkeyKong.JUNGLE_RUSH,
      AbilityNames.DonkeyKong.BARREL_CANNON,
    ]],

    [Id.schala, [
      AbilityNames.Schala.MAGIC_ORBS,
      AbilityNames.Schala.MAGIC_ORBS_2,
      // AbilityNames.Schala.PROTECT,
      // AbilityNames.Schala.PROTECT_2,
      // AbilityNames.Schala.TELEPORTATION,
      // AbilityNames.Schala.TELEPORTATION_2,
      AbilityNames.Schala.SKYGATE,
      AbilityNames.Schala.SKYGATE_2,
      AbilityNames.Schala.MAGIC_SEAL,
      AbilityNames.Schala.MAGIC_SEAL_2,
      AbilityNames.Schala.PRAY,
      AbilityNames.Schala.DREAM_DEVOURER,
    ]],

    [Id.shotoTodoroki, [
      AbilityNames.ShotoTodoroki.GLACIER,
      AbilityNames.ShotoTodoroki.WALL_OF_FLAMES,
      AbilityNames.ShotoTodoroki.ICE_PATH,
      AbilityNames.ShotoTodoroki.FLASHFREEZE_HEATWAVE,
      AbilityNames.ShotoTodoroki.HEAVEN_PIERCING_ICE_WALL,
      AbilityNames.ShotoTodoroki.FLASHFIRE_FIST,
      AbilityNames.ShotoTodoroki.HEATING_UP,
      AbilityNames.ShotoTodoroki.COOLING_DOWN,
    ]],

    [Id.sonic, [
      AbilityNames.Sonic.JUMP,
      AbilityNames.Sonic.SPIN,
      AbilityNames.Sonic.INSTA_SHIELD,
      AbilityNames.Sonic.HOMING_ATTACK,
      AbilityNames.Sonic.SPIN_DASH,
      AbilityNames.Sonic.LIGHT_SPEED_DASH,
      AbilityNames.Sonic.SUPER_SONIC,
    ]],

    [Id.guts, [
      AbilityNames.Guts.HEAVY_SLASH,
      AbilityNames.Guts.HEAVY_SLAM,
      AbilityNames.Guts.CANNON_SLASH,
      AbilityNames.Guts.BURSTING_FLAME,
      AbilityNames.Guts.RECKLESS_CHARGE,
      AbilityNames.Guts.RELENTLESS_ASSAULT,
      AbilityNames.Guts.RAGE,
      AbilityNames.Guts.BERSERK,
      AbilityNames.Guts.CANNON_ARM,
      AbilityNames.Guts.DRAGON_CANNON_SHOT,
      AbilityNames.Guts.BERSERKER_ARMOR,
      AbilityNames.Guts.BEAST_OF_DARKNESS,
    ]],

    [Id.jaco, [
      AbilityNames.Jaco.ELITE_BEAM_CHARGE,
      AbilityNames.Jaco.ELITE_BEAM_PRIME,
      AbilityNames.Jaco.ELITE_BEAM_FIRE,
      AbilityNames.Jaco.ANNIHILATION_BOMB,
      AbilityNames.Jaco.ROCKET_BOOTS,
      AbilityNames.Jaco.EMERGENCY_BOOST,
      AbilityNames.Jaco.SUPER_ELITE_COMBO,
      AbilityNames.Jaco.ELITE_POSE,
      AbilityNames.Jaco.MACRO_CANNON,
      AbilityNames.Jaco.SUPER_JACO,
    ]],

    [Id.leonSKennedy, [
      AbilityNames.LeonSKennedy.PISTOL,
      AbilityNames.LeonSKennedy.KNIFE_SLASH,
      AbilityNames.LeonSKennedy.KNIFE_PARRY,
      AbilityNames.LeonSKennedy.ROUNDHOUSE_KICK,
      AbilityNames.LeonSKennedy.SHOTGUN,
      AbilityNames.LeonSKennedy.ASSAULT_RIFLE,
      AbilityNames.LeonSKennedy.SNIPER_RIFLE,
      AbilityNames.LeonSKennedy.ROCKET_LAUNCHER,
      AbilityNames.LeonSKennedy.FLASHBANG,
      AbilityNames.LeonSKennedy.HEAVY_GRENADE,
    ]],

    [Id.megumin, [
      AbilityNames.Megumin.EXPLOSION_1,
      AbilityNames.Megumin.EXPLOSION_2,
      AbilityNames.Megumin.EXPLOSION_3,
      AbilityNames.Megumin.EXPLOSION_4,
      AbilityNames.Megumin.EXPLOSION_5,
    ]],
    



    // androids 13 14 15
    [FourCC("H01V"), [
      AbilityNames.Android13.ENERGY_BEAM, 
      AbilityNames.Android13.SS_DEADLY_BOMBER, 
      AbilityNames.Android13.ANDROID_BARRIER, 
      AbilityNames.Android13.OVERCHARGE
    ]],
    [FourCC("H01S"), [AbilityNames.Android13.ENERGY_BEAM, AbilityNames.Android13.NUKE, AbilityNames.Android13.ANDROID_BARRIER, AbilityNames.Android13.OVERCHARGE]],
    [FourCC("H01T"), [AbilityNames.Android13.ENERGY_BEAM, AbilityNames.Android13.NUKE, AbilityNames.Android13.ANDROID_BARRIER, AbilityNames.Android13.OVERCHARGE]],
    // super 13
    [FourCC("H01U"), [
      AbilityNames.Android13.SS_DEADLY_HAMMER, 
      AbilityNames.Android13.SS_DEADLY_BOMBER, 
      AbilityNames.Android13.NUKE, 
      AbilityNames.Android13.ANDROID_BARRIER, 
      AbilityNames.Android13.OVERCHARGE
    ]],
    // ultra 13
    [FourCC("H01W"), [AbilityNames.Android13.SS_DEADLY_HAMMER, AbilityNames.Android13.SS_DEADLY_BOMBER, AbilityNames.Android13.NUKE, AbilityNames.Android13.ANDROID_BARRIER, AbilityNames.Android13.OVERCHARGE]],

    // babidi
    [FourCC("O001"), [
      AbilityNames.Babidi.SUMMON_PUI_PUI, 
      AbilityNames.Babidi.SUMMON_YAKON, 
      AbilityNames.Babidi.SUMMON_DABURA, 
      AbilityNames.Babidi.HARETSU, 
      AbilityNames.Babidi.BABIDI_BARRIER, 
      "Babidi Magic"
    ]],

    // dabura
    [FourCC("O000"), [
      AbilityNames.Dabura.EVIL_SPEAR,
    ]],

    // fat buu / super buu / kid buu
    [FourCC("O005"), [
      AbilityNames.Buu.BUU_BEAM, 
      AbilityNames.Buu.FLESH_ATTACK, 
      AbilityNames.Buu.INNOCENCE_BREATH, 
      AbilityNames.Buu.ANGRY_EXPLOSION
    ]],
    [FourCC("O006"), [
      AbilityNames.Buu.BUU_BEAM, 
      AbilityNames.Buu.FLESH_ATTACK, 
      AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, 
      AbilityNames.Buu.ANGRY_EXPLOSION, 
      AbilityNames.Buu.VANISHING_BALL
    ]],
    [Id.kidBuu, [
      AbilityNames.Tien.DODON_RAY,
      AbilityNames.Buu.FLESH_ATTACK, AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, AbilityNames.Buu.ANGRY_EXPLOSION, AbilityNames.Buu.VANISHING_BALL,
      AbilityNames.Goku.GOD_KAMEHAMEHA, AbilityNames.Goku.ULTRA_INSTINCT, AbilityNames.Goku.MASTERED_ULTRA_INSTINCT, 
      AbilityNames.Vegeta.EGO_GALICK_GUN, AbilityNames.Vegeta.ULTRA_EGO, AbilityNames.Vegeta.HAKAI_BARRAGE,
      AbilityNames.Gohan.POTENTIAL_UNLEASHED,
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, AbilityNames.Piccolo.KYODAIKA,
      AbilityNames.FutureTrunks.HEAT_DOME_ATTACK, AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE,
      AbilityNames.Bardock.TYRANT_BREAKER, AbilityNames.Bardock.TYRANT_LANCER, AbilityNames.Bardock.FUTURE_SIGHT,
      AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE,
      AbilityNames.Videl.PUNCH,
      AbilityNames.Upa.JAVELIN_THROW,
      AbilityNames.Tapion.BRAVE_SLASH, AbilityNames.Tapion.BRAVE_CANNON,
      AbilityNames.Jiren.POWER_IMPACT, AbilityNames.Jiren.POWER_IMPACT_2, AbilityNames.Jiren.MEDITATE, AbilityNames.Jiren.MEDITATE_2,
      AbilityNames.Toppo.JUSTICE_FLASH, AbilityNames.Toppo.JUSTICE_FLASH_2, AbilityNames.Toppo.GOD_OF_DESTRUCTION,
      AbilityNames.Dyspo.LIGHT_BULLET, AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE,
      AbilityNames.AllMight.DETROIT_SMASH, AbilityNames.AllMight.ONE_FOR_ALL,
      AbilityNames.Mario.JUMP, AbilityNames.Mario.GROUND_POUND,
      AbilityNames.Tien.DODON_RAY,
      AbilityNames.Ichigo.GETSUGA_JUJISHO, AbilityNames.Ichigo.SHUNPO, AbilityNames.Ichigo.HIRENKYAKU,
      AbilityNames.DartFeld.BURNING_RUSH, AbilityNames.DartFeld.DRAGOON_TRANSFORMATION, AbilityNames.DartFeld.DRAGOON_FLOURISH,
      AbilityNames.Crono.CYCLONE, AbilityNames.Crono.LUMINAIRE,
      AbilityNames.Frog.SLURP_CUT, AbilityNames.Frog.FROG_SQUASH,
      AbilityNames.Robo.ROBO_TACKLE, AbilityNames.Robo.ELECTROCUTE,
      AbilityNames.Magus.LIGHTNING_2,
      AbilityNames.Magus.WATER_2,
      AbilityNames.Magus.FIRE_2,
      AbilityNames.Magus.ICE_2,
      AbilityNames.Lucca.FLAMETHROWER, AbilityNames.Lucca.FLARE,
      AbilityNames.Ayla.BOULDER_TOSS, AbilityNames.Lucca.HYPNOWAVE,
      AbilityNames.Marle.AURA, AbilityNames.Marle.ALLURE,
      AbilityNames.Lucario.VACUUM_WAVE, AbilityNames.Lucario.MEGA_EVOLUTION,
      AbilityNames.Saitama.SERIOUS_SERIES, AbilityNames.Saitama.SERIOUS_PUNCH, AbilityNames.Saitama.SERIOUS_SIDEWAYS_JUMPS,
      AbilityNames.DonkeyKong.GROUND_POUND, AbilityNames.DonkeyKong.BARREL_CANNON,
      AbilityNames.LeonSKennedy.PISTOL,
      AbilityNames.Megumin.EXPLOSION_1,
      
      AbilityNames.Android13.SS_DEADLY_HAMMER,
      AbilityNames.Babidi.HARETSU, AbilityNames.Babidi.SUMMON_PUI_PUI,
      AbilityNames.Broly.ENERGY_PUNCH,
      AbilityNames.Cell.CELL_X_FORM,
      AbilityNames.Cooler.DEATH_BEAM,
      AbilityNames.Raditz.DOUBLE_SUNDAY,
      AbilityNames.Nappa.GIANT_STORM,
      AbilityNames.Moro.ENERGY_DRAIN,
      AbilityNames.SuperJanemba.DEMONS_MARK, AbilityNames.SuperJanemba.DEMON_RUSH, AbilityNames.SuperJanemba.DEVIL_CLAW, AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT,
      AbilityNames.KingKRool.BELLY_ARMOR, AbilityNames.KingKRool.KROWN_TOSS, 
      AbilityNames.EisShenron.FROST_CLAWS,
      AbilityNames.Ginyu.MILKY_CANNON,
      AbilityNames.Frieza.DEATH_BEAM_GOLDEN,
      AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET,
      AbilityNames.OmegaShenron.ICE_CANNON,
      AbilityNames.OmegaShenron.NOVA_STAR,
      AbilityNames.OmegaShenron.DRAGON_THUNDER,
      AbilityNames.Guldo.PSYCHO_JAVELIN,
      AbilityNames.Zamasu.DIVINE_AUTHORITY, AbilityNames.Zamasu.ENERGY_BLADES,
      AbilityNames.Sephiroth.OCTOSLASH, AbilityNames.Sephiroth.ONE_WINGED_ANGEL,
      AbilityNames.Hit.TIME_SKIP,
      AbilityNames.Hirudegarn.FLAME_BREATH,
      AbilityNames.Super17.FLASH_BOMBER_2,
      AbilityNames.Waluigi.FIREBALL_1,
      AbilityNames.Waluigi.FIREBALL_2,
      AbilityNames.GokuBlack.KAMEHAMEHA,

      AbilityNames.Schala.MAGIC_ORBS,
      AbilityNames.Schala.MAGIC_SEAL,
    ]],

    // broly
    [FourCC("H00M"), [AbilityNames.Broly.ENERGY_PUNCH, AbilityNames.Broly.POWER_LEVEL_RISING, AbilityNames.Broly.PLANET_CRUSHER, AbilityNames.Broly.GIGANTIC_ROAR, AbilityNames.Broly.GIGANTIC_OMEGASTORM]],
    
    // cell unformed / 1st form / 2nd form / perfect
    [FourCC("N00Q"), [AbilityNames.Goku.KAMEHAMEHA]],
    [FourCC("H00E"), [AbilityNames.Goku.KAMEHAMEHA, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, "Solar Flare", AbilityNames.Cell.ABSORB]],
    [FourCC("H00F"), [AbilityNames.Goku.KAMEHAMEHA, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, "Solar Flare", AbilityNames.Cell.ABSORB]],
    [FourCC("H00G"), [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Goku.GOD_KAMEHAMEHA, 
      AbilityNames.Gohan.MASENKO, 
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
      AbilityNames.Cell.SPAWN_CELL_JUNIORS,
      AbilityNames.Cell.SOLAR_KAMEHAMEHA,
      AbilityNames.Cell.CELL_X_FORM,
    ]],
    // cell junior
    [FourCC("H01J"), [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Goku.GOD_KAMEHAMEHA
    ]],


    // fourth form cooler
    [Id.fourthCooler, [AbilityNames.Cooler.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // final form cooler
    [Id.fifthCooler, [AbilityNames.Cooler.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // golden final form
    [FourCC("H05L"), [AbilityNames.Cooler.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // metal cooler
    [Id.metalCooler, [AbilityNames.Cooler.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.GETI_STAR_REPAIR, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    
    [Id.getiStarHero, [
      AbilityNames.Cooler.DEATH_BEAM, 
      AbilityNames.Cooler.SUPERNOVA_COOLER, 
      AbilityNames.Cooler.NOVA_CHARIOT, 
      AbilityNames.Cooler.GETI_STAR_REPAIR, 
      AbilityNames.Cooler.SUPERNOVA_GOLDEN
    ]],


    // farmer with shotgun
    [FourCC("H08S"), [
      AbilityNames.Cooler.DEATH_BEAM, 
      AbilityNames.Vegeta.FINAL_FLASH, 
      AbilityNames.Gohan.TWIN_DRAGON_SHOT, 
      // AbilityNames.Broly.GIGANTIC_ROAR, 
      AbilityNames.SuperJanemba.HELLS_GATE, 
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY,
      AbilityNames.Goku.ULTRA_INSTINCT,
      AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    ]],

    // raditz
    [FourCC("H08U"), [
      AbilityNames.Raditz.DOUBLE_SUNDAY, 
      AbilityNames.Raditz.SATURDAY_CRASH, 
      AbilityNames.Raditz.BEHIND_YOU, 
      AbilityNames.Vegeta.MOONLIGHT, 
      AbilityNames.Vegeta.ANGRY_SHOUT, 
      AbilityNames.Raditz.DOUBLE_SUNDAE
    ]],
    // nappa
    [FourCC("H08W"), [
      AbilityNames.Nappa.GIANT_STORM, 
      AbilityNames.Nappa.BLAZING_STORM, 
      AbilityNames.Nappa.PLANT_SAIBAMEN, 
      AbilityNames.Vegeta.MOONLIGHT, 
      AbilityNames.Vegeta.ANGRY_SHOUT, 
      AbilityNames.Nappa.BREAK_CANNON
    ]],
    // saibaman
    [FourCC("H08X"), [AbilityNames.Saibaman.BOMB, AbilityNames.Saibaman.ACID]],

    // moro
    [Id.moro, [AbilityNames.Moro.ENERGY_DRAIN, AbilityNames.Moro.ENERGY_BALL, AbilityNames.Moro.LAVA_BURST, AbilityNames.Moro.LAVA_PILLARS, AbilityNames.Moro.POWER_LEVEL_SHARING]],

    // super janemba
    [Id.janemba, [
      AbilityNames.SuperJanemba.DEMONS_MARK,
      AbilityNames.SuperJanemba.DEMON_RUSH,
      AbilityNames.SuperJanemba.RAKSHASA_CLAW,
      AbilityNames.SuperJanemba.RAKSHASA_CLAW_ON_HIT,
      AbilityNames.SuperJanemba.DEVIL_CLAW,
      AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT,
      AbilityNames.SuperJanemba.BUNKAI_TELEPORT,
      AbilityNames.SuperJanemba.DEMONIC_BLADE,
      AbilityNames.SuperJanemba.HELLS_GATE,
      AbilityNames.SuperJanemba.COSMIC_ILLUSION,
      AbilityNames.SuperJanemba.COSMIC_SLASH,
      AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN,
    ]],
    
    // king k rool
    [FourCC("E01D"), [
      AbilityNames.KingKRool.BELLY_ARMOR,
      AbilityNames.KingKRool.KROWN_TOSS,
      AbilityNames.KingKRool.KHARGE,
      AbilityNames.KingKRool.HAND_KANNON,
      AbilityNames.KingKRool.KANNONBLAST,
      AbilityNames.KingKRool.MONKEY_SMASHER,
      AbilityNames.KingKRool.KINGS_THRONE,
    ]],
    // blast-o-matic
    [FourCC("E01U"), [
      AbilityNames.KingKRool.BLAST_O_MATIC,
    ]],

    // eis shenron
    [FourCC("H09B"), [
      AbilityNames.EisShenron.FROST_CLAWS,
      AbilityNames.EisShenron.ICE_SLASH,
      AbilityNames.EisShenron.ABSOLUTE_ZERO,
      AbilityNames.EisShenron.ICE_CANNON,
    ]],

    // ginyu
    [FourCC("H09E"), [
      AbilityNames.Ginyu.MILKY_CANNON,
      AbilityNames.Ginyu.GALAXY_DYNAMITE,
      AbilityNames.Ginyu.GINYU_POSE_FIGHTING,
      AbilityNames.Ginyu.FROG_TONGUE,
    ]],

    // frieza, code is incorrect
    [FourCC("H06X"), [
      AbilityNames.Frieza.DEATH_BEAM,
      AbilityNames.Frieza.DEATH_CANNON,
      AbilityNames.Frieza.NOVA_STRIKE,
      AbilityNames.Frieza.SUPERNOVA, AbilityNames.Frieza.EMPERORS_THRONE,
      AbilityNames.Frieza.DEATH_STORM, AbilityNames.Frieza.IMPALING_RUSH, 
      AbilityNames.Frieza.DEATH_BEAM_BARRAGE, AbilityNames.Frieza.NOVA_RUSH, 
      AbilityNames.Frieza.TAIL_WHIP, AbilityNames.Frieza.DEATH_BALL, 
      AbilityNames.Frieza.SUPERNOVA_2,
      AbilityNames.Frieza.LAST_EMPEROR, AbilityNames.Frieza.DEATH_SAUCER,
      AbilityNames.Frieza.DEATH_BEAM_GOLDEN, 
      AbilityNames.Frieza.DEATH_CANNON_GOLDEN,
      AbilityNames.Frieza.NOVA_RUSH_GOLDEN,
      AbilityNames.Frieza.EARTH_BREAKER,
      AbilityNames.Frieza.CAGE_OF_LIGHT,
    ]],

    // omega shenron
    [FourCC("H09F"), [
      AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET,
      AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL,
      AbilityNames.OmegaShenron.SHADOW_FIST,
      AbilityNames.OmegaShenron.DRAGONIC_RAGE,
      AbilityNames.OmegaShenron.ICE_CANNON,
      AbilityNames.OmegaShenron.NOVA_STAR,
      AbilityNames.OmegaShenron.DRAGON_THUNDER,
    ]],

    // guldo
    [FourCC("H09J"), [
      AbilityNames.Guldo.PSYCHO_JAVELIN,
      AbilityNames.Guldo.PSYCHIC_ROCK_THROW,
      AbilityNames.Guldo.TELEKINESIS,
      AbilityNames.Guldo.TIME_STOP,
      AbilityNames.Guldo.GINYU_POSE_GULDO,
    ]],

    // zamasu
    [Id.zamasu, [
      AbilityNames.Zamasu.DIVINE_AUTHORITY,
      AbilityNames.Zamasu.GOD_SLASH,
      AbilityNames.Zamasu.HOLY_LIGHT_GRENADE,
      AbilityNames.Zamasu.HEAVENLY_RUSH,
      AbilityNames.Zamasu.ENERGY_BLADES,
    ]],

    // sephiroth
    [FourCC("H09M"), [
      AbilityNames.Sephiroth.OCTOSLASH,
      AbilityNames.Sephiroth.HELLS_GATE,
      AbilityNames.Sephiroth.FERVENT_BLOW,
      AbilityNames.Sephiroth.FERVENT_RUSH,
      AbilityNames.Sephiroth.BLACK_MATERIA,
      AbilityNames.Sephiroth.ONE_WINGED_ANGEL,
      AbilityNames.Sephiroth.PARRY,
    ]],

    // hit
    [Id.hit, [
      AbilityNames.Hit.TIME_SKIP,
      AbilityNames.Hit.POCKET_DIMENSION,
      AbilityNames.Hit.FLASH_FIST,
      AbilityNames.Hit.TIME_CAGE,
      AbilityNames.Hit.PURE_PROGRESS,
      AbilityNames.Hit.DEATH_BLOW,
    ]],

    // hirudegarn
    [Id.hirudegarn, [
      AbilityNames.Hirudegarn.FLAME_BREATH,
      AbilityNames.Hirudegarn.FLAME_BALL,
      AbilityNames.Hirudegarn.DARK_MIST,
      AbilityNames.Hirudegarn.CHOU_MAKOUSEN,
      AbilityNames.Hirudegarn.TAIL_SWEEP,
      AbilityNames.Hirudegarn.TAIL_ATTACK,
      AbilityNames.Hirudegarn.HEAVY_STOMP,
      AbilityNames.Hirudegarn.DARK_EYES,
      AbilityNames.Hirudegarn.MOLTING,
      AbilityNames.Hirudegarn.FLIGHT,
      AbilityNames.Hirudegarn.ENRAGE,
      AbilityNames.Hirudegarn.DEACTIVATE_ENRAGE,
    ]],

    // super 17
    [Id.super17, [
      AbilityNames.Super17.FLASH_BOMBER,
      AbilityNames.Super17.FLASH_BOMBER_2,
      AbilityNames.Super17.HELL_STORM,
      AbilityNames.Super17.SHOCKING_DEATH_BALL,
      AbilityNames.Super17.ABSORPTION,
      AbilityNames.Super17.ANDROID_BARRIER,
    ]],
    
    // skurvy
    [Id.skurvy, [
      AbilityNames.Skurvy.BIG_KANNON,
      AbilityNames.Skurvy.KANNON_FIRE,
      AbilityNames.Skurvy.RUN_YE_THROUGH,
      AbilityNames.Skurvy.PLUNDER,
      AbilityNames.Skurvy.MIRROR_NEVER_LIES,
      AbilityNames.Skurvy.WALK_THE_PLANK,
      AbilityNames.Skurvy.PIRATES_SCORN,
      AbilityNames.Skurvy.EXTRAORDINARY_POWER,
    ]],

    [Id.appule, [
      AbilityNames.Appule.APPULE_BLASTER,
      AbilityNames.Appule.APPULE_EMERGENCY_ESCAPE,
      AbilityNames.Appule.APPULE_VENGEANCE,
      AbilityNames.Appule.APPULE_CLONES,
    ]],

    [Id.waluigi, [
      AbilityNames.Waluigi.FIREBALL_1,
      AbilityNames.Waluigi.FIREBALL_2,
      AbilityNames.Waluigi.PIRANHA_PLANT,
      AbilityNames.Waluigi.BOMB,
      AbilityNames.Waluigi.SPIN,
      AbilityNames.Waluigi.JUMP,
    ]],

    [Id.gokuBlack, [
      AbilityNames.GokuBlack.KAMEHAMEHA,
      AbilityNames.GokuBlack.DIVINE_LASSO,
      AbilityNames.GokuBlack.DIVINE_RETRIBUTION,
      AbilityNames.GokuBlack.WORK_OF_GODS,
      AbilityNames.GokuBlack.SORROWFUL_SCYTHE,
    ]],
    [Id.gokuBlackClone, [
      AbilityNames.GokuBlack.KAMEHAMEHA,
      AbilityNames.GokuBlack.DIVINE_RETRIBUTION,
      AbilityNames.GokuBlack.SORROWFUL_SCYTHE,
    ]],
    

    // rusty
    [Id.rustTyranno, [
      AbilityNames.RustTyranno.TYRANNO_FLAME,
      AbilityNames.RustTyranno.RUST_CHOMP,
      AbilityNames.RustTyranno.RUST_GOBBLE,
      AbilityNames.RustTyranno.TYRANNO_ROAR,
    ]],

  ]
)