import { Id } from "Common/Constants";
import { AbilityNames } from "./AbilityNames";

export const abilityCodesToNames = new Map<number, string>(
  [
    // goku
    [Id.kamehameha, AbilityNames.Goku.KAMEHAMEHA],
    [Id.kamehamehaGod, AbilityNames.Goku.GOD_KAMEHAMEHA],
    [Id.spiritBomb, AbilityNames.Goku.SPIRIT_BOMB],
    [Id.dragonFist, AbilityNames.Goku.DRAGON_FIST],
    [Id.superDragonFist, AbilityNames.Goku.SUPER_DRAGON_FIST],
    [Id.ultraInstinct, AbilityNames.Goku.ULTRA_INSTINCT],
    [Id.masteredUltraInstinct, AbilityNames.Goku.MASTERED_ULTRA_INSTINCT],

    // vegeta
    [Id.galickGun, AbilityNames.Vegeta.GALICK_GUN],
    [Id.bigBangAttack, AbilityNames.Vegeta.BIG_BANG_ATTACK],
    [Id.finalFlash, AbilityNames.Vegeta.FINAL_FLASH],
    [Id.finalFlash2, AbilityNames.Vegeta.FINAL_FLASH_2],
    [Id.energyBlastVolley, AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY],
    [Id.moonlight, AbilityNames.Vegeta.MOONLIGHT],
    [Id.angryShout, AbilityNames.Vegeta.ANGRY_SHOUT],

    // gohan
    [Id.unlockPotential, AbilityNames.Gohan.UNLOCK_POTENTIAL],
    [Id.greatSaiyamanHasArrived, AbilityNames.Gohan.THE_GREAT_SAIYAMAN_HAS_ARRIVED],
    [Id.potentialUnleashed, AbilityNames.Gohan.POTENTIAL_UNLEASHED],
    [Id.masenko, AbilityNames.Gohan.MASENKO],
    [Id.superMasenko, AbilityNames.Gohan.SUPER_MASENKO],
    [Id.twinDragonShot, AbilityNames.Gohan.TWIN_DRAGON_SHOT],
    [Id.superDragonFlight, AbilityNames.Gohan.SUPER_DRAGON_FLIGHT],
    [Id.fatherSonKame, AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA],

    // future trunks
    [Id.finishBuster, AbilityNames.FutureTrunks.FINISH_BUSTER],

    // goten
    [Id.gotenRockThrow, AbilityNames.Goten.ROCK_THROW],
    [Id.superGotenStrike, AbilityNames.Goten.SUPER_GOTEN_STRIKE],

    // kid trunks
    [Id.kidTrunksFinalCannon, AbilityNames.KidTrunks.FINAL_CANNON],
    [Id.kidTrunksSwordOfHope, AbilityNames.KidTrunks.SWORD_OF_HOPE],

    // gotenks
    [Id.dieDieMissileBarrage, AbilityNames.Gotenks.DIE_DIE_MISSILE_BARRAGE],
    [Id.galacticDonut, AbilityNames.Gotenks.GALACTIC_DONUT],
    [Id.ultraVolleyball, AbilityNames.Gotenks.ULTRA_VOLLEYBALL],
    [Id.superGhostKamikazeAttack, AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK],
    [Id.superGhostKamikazeAttack2, AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK_2],
    [Id.gotenksSS3, AbilityNames.Gotenks.GOTENKS_SS3],

    // future trunks
    [Id.heatDomeAttack, AbilityNames.FutureTrunks.HEAT_DOME_ATTACK],
    [Id.burningAttack, AbilityNames.FutureTrunks.BURNING_ATTACK],
    // [FourCC('A064'), "High Power Rush"],
    [Id.blazingRush, AbilityNames.FutureTrunks.BLAZING_RUSH],
    [Id.shiningSwordAttack, AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK],
    [Id.superSaiyanRage, AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE],

    // piccolo
    [Id.piccoloSBC, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON],
    [Id.slappyHand, AbilityNames.Piccolo.SLAPPY_HAND],
    [Id.hellzoneGrenade, AbilityNames.Piccolo.HELLZONE_GRENADE],
    [Id.multiForm, AbilityNames.Piccolo.MULTI_FORM],
    [Id.kyodaika, AbilityNames.Piccolo.KYODAIKA],
    // clones version
    [Id.piccoloCloneSBC, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON],

    // bardock
    [Id.futureSight, AbilityNames.Bardock.FUTURE_SIGHT],
    [Id.tyrantBreaker, AbilityNames.Bardock.TYRANT_BREAKER],
    [Id.tyrantLancer, AbilityNames.Bardock.TYRANT_LANCER],
    [Id.riotJavelin, AbilityNames.Bardock.RIOT_JAVELIN],
    [Id.rebellionSpear, AbilityNames.Bardock.REBELLION_SPEAR],
    [Id.saiyanSpirit, AbilityNames.Bardock.SAIYAN_SPIRIT],

    // pan & giru
    [Id.panKame, AbilityNames.Pan.KAMEHAMEHA],
    [Id.panGodKame, AbilityNames.Pan.GOD_KAMEHAMEHA],
    [Id.maidenBlast, AbilityNames.Pan.MAIDEN_BLAST],
    [Id.reliableFriend, AbilityNames.Pan.RELIABLE_FRIEND],
    [Id.honeyBeeCostume, AbilityNames.Pan.HONEY_BEE_COSTUME],
    [Id.summonGiru, AbilityNames.Pan.SUMMON_GIRU],

    // android 17 dbs
    [Id.powerBlitz, AbilityNames.Android17DBS.POWER_BLITZ],
    [Id.powerBlitzBarrage, AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE],
    [Id.barrierPrison, AbilityNames.Android17DBS.BARRIER_PRISON],
    [Id.barrierWall, AbilityNames.Android17DBS.BARRIER_WALL],
    [Id.androidBarrier, AbilityNames.Android17DBS.ANDROID_BARRIER],
    [Id.superElectricStrike, AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE],

    // videl
    [Id.punch, AbilityNames.Videl.PUNCH],
    [Id.kick, AbilityNames.Videl.KICK],
    [Id.flyingKick, AbilityNames.Videl.FLYING_KICK],

    // upa
    [Id.javelinThrow, AbilityNames.Upa.JAVELIN_THROW],
    [Id.whirlwindTempest, AbilityNames.Upa.WHIRLWIND_TEMPEST],
    [Id.korinFlag, AbilityNames.Upa.KORIN_FLAG],
    [Id.lastStand, AbilityNames.Upa.LAST_STAND],

    // tapion
    [Id.braveSlash, AbilityNames.Tapion.BRAVE_SLASH],
    [Id.braveCannon, AbilityNames.Tapion.BRAVE_CANNON],
    [Id.shiningSword, AbilityNames.Tapion.SHINING_SWORD],
    [Id.herosFlute, AbilityNames.Tapion.HEROS_FLUTE],
    [Id.braveSwordAttack, AbilityNames.Tapion.BRAVE_SWORD_ATTACK],

    // jiren
    [Id.powerImpact, AbilityNames.Jiren.POWER_IMPACT],
    [Id.powerImpact2, AbilityNames.Jiren.POWER_IMPACT_2],
    [Id.mightyPunch, AbilityNames.Jiren.MIGHTY_PUNCH],
    [Id.mightyPunch2, AbilityNames.Jiren.MIGHTY_PUNCH_2],
    [Id.glare, AbilityNames.Jiren.GLARE],
    [Id.glare2, AbilityNames.Jiren.GLARE_2],
    [Id.heatwave, AbilityNames.Jiren.HEATWAVE],
    [Id.heatwave2, AbilityNames.Jiren.HEATWAVE_2],
    [Id.meditate, AbilityNames.Jiren.MEDITATE],
    [Id.meditate2, AbilityNames.Jiren.MEDITATE_2],
    [Id.ultimateBurningWarrior, AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR],
    [Id.ultimateBurningWarrior2, AbilityNames.Jiren.ULTIMATE_BURNING_WARRIOR_2],

    // toppo
    [Id.justiceFlash, AbilityNames.Toppo.JUSTICE_FLASH],
    [Id.justiceFlash2, AbilityNames.Toppo.JUSTICE_FLASH_2],
    [Id.justicePunch, AbilityNames.Toppo.JUSTICE_PUNCH],
    [Id.justicePunch2, AbilityNames.Toppo.JUSTICE_PUNCH_2],
    [Id.justiceTornado, AbilityNames.Toppo.JUSTICE_TORNADO],
    [Id.justiceTornado2, AbilityNames.Toppo.JUSTICE_TORNADO_2],
    [Id.justiceHold, AbilityNames.Toppo.JUSTICE_HOLD],
    [Id.justiceHold2, AbilityNames.Toppo.JUSTICE_HOLD_2],
    [Id.justicePoseToppo, AbilityNames.Toppo.JUSTICE_POSE],
    [Id.toppoGodOfDestruction, AbilityNames.Toppo.GOD_OF_DESTRUCTION],

    // dyspo
    [Id.lightBullet, AbilityNames.Dyspo.LIGHT_BULLET],
    [Id.justiceKick, AbilityNames.Dyspo.JUSTICE_KICK],
    [Id.justiceKick2, AbilityNames.Dyspo.JUSTICE_KICK_2],
    [Id.justiceCannon, AbilityNames.Dyspo.JUSTICE_CANNON],
    [Id.justiceCannon2, AbilityNames.Dyspo.JUSTICE_CANNON_2],
    [Id.circleFlash, AbilityNames.Dyspo.CIRCLE_FLASH],
    [Id.circleFlash2, AbilityNames.Dyspo.CIRCLE_FLASH_2],
    [Id.justicePoseDyspo, AbilityNames.Dyspo.JUSTICE_POSE],
    [Id.superMaximumLightSpeedMode, AbilityNames.Dyspo.SUPER_MAXIMUM_LIGHT_SPEED_MODE],

    // krillin
    [Id.scatteringBullet, AbilityNames.Krillin.SCATTERING_BULLET],
    [Id.destructoDisc, AbilityNames.Krillin.DESTRUCTO_DISC],
    [Id.senzuThrow, AbilityNames.Krillin.SENZU_THROW],

    // yamcha R
    [Id.yamchaRLightPunch, AbilityNames.YamchaR.LIGHT_PUNCH],
    [Id.yamchaRMediumPunch, AbilityNames.YamchaR.MEDIUM_PUNCH],
    [Id.yamchaRHeavyPunch, AbilityNames.YamchaR.HEAVY_PUNCH],
    [Id.yamchaDashLeft, AbilityNames.YamchaR.DASH_LEFT],
    [Id.yamchaDashForward, AbilityNames.YamchaR.DASH_FORWARD],
    [Id.yamchaDashRight, AbilityNames.YamchaR.DASH_RIGHT],

    [Id.yamchaRSuperSpiritBall, AbilityNames.YamchaR.SUPER_SPIRIT_BALL],
    [Id.yamchaRFullPowerKame, AbilityNames.YamchaR.FULL_POWER_KAMEHAMEHA],
    [Id.yamchaRWolfFangBlast, AbilityNames.YamchaR.WOLF_FANG_BLAST],

    [FourCC('A0RL'), AbilityNames.YamchaR.SLEDGEHAMMER],
    [FourCC('A0RM'), AbilityNames.YamchaR.METEOR_CRASH],
    [FourCC('A0RN'), AbilityNames.YamchaR.UPPERCUT],

    [FourCC('A0RP'), AbilityNames.YamchaR.WOLF_FANG_HURRICANE],
    [FourCC('A0RQ'), AbilityNames.YamchaR.WOLF_FANG_VOLLEY],
    [FourCC('A0RR'), AbilityNames.YamchaR.REVERSE_WOLF_FANG_BLAST],

    [FourCC('A0RS'), AbilityNames.YamchaR.BLINDING_WOLF_FANG_FIST],
    [FourCC('A0RT'), AbilityNames.YamchaR.NEO_WOLF_FANG_BLAST],
    [FourCC('A0RU'), AbilityNames.YamchaR.NEO_WOLF_FANG_FIST],

    [FourCC('A0RV'), AbilityNames.YamchaR.SPIRIT_BALL],
    [FourCC('A0RW'), AbilityNames.YamchaR.FLASH_KAME],
    [FourCC('A0RX'), AbilityNames.YamchaR.WOLF_FANG_BARRAGE],

    [FourCC('A0S0'), AbilityNames.YamchaR.WOLF_FANG_PACK_ATTACK],
    [FourCC('A0RZ'), AbilityNames.YamchaR.WOLF_FANG_FLASH],
    [FourCC('A0RY'), AbilityNames.YamchaR.WOLF_FANG_FINISHER],

    [FourCC('A0S2'), AbilityNames.YamchaR.SUMMON_PUAR],
    [FourCC('A0S3'), AbilityNames.YamchaR.YAMCHA_BLAST],
    [FourCC('A0S4'), AbilityNames.YamchaR.PLAY_DEAD],

    [FourCC('A0S5'), AbilityNames.YamchaR.HOMERUN],
    [FourCC('A0S6'), AbilityNames.YamchaR.WOLF_FANG_PITCHING_FIST],
    [FourCC('A0S7'), AbilityNames.YamchaR.BATTER_UP],
    
    [FourCC('A0SB'), AbilityNames.YamchaR.SPARKING],

    // roshi
    [FourCC('A0FG'), AbilityNames.Roshi.KAMEHAMEHA_CHARGE],
    [FourCC('A0JE'), AbilityNames.Roshi.KAMEHAMEHA_FIRE],
    [FourCC('A0IE'), AbilityNames.Roshi.LIGHTNING_SURPRISE],
    [FourCC('A0FH'), AbilityNames.Roshi.MAX_POWER],
    [FourCC('A0SO'), AbilityNames.Roshi.KAMEHAMEHA_SUPER_CHARGE],
    [FourCC('A0SP'), AbilityNames.Roshi.KAMEHAMEHA_SUPER_FIRE],

    // all might
    [FourCC('A0SX'), AbilityNames.AllMight.DETROIT_SMASH],
    [FourCC('A0SY'), AbilityNames.AllMight.LEFT_SMASH],
    [FourCC('A0SZ'), AbilityNames.AllMight.RIGHT_SMASH],
    [FourCC('A0T2'), AbilityNames.AllMight.UNITED_STATES_OF_SMASH],
    [FourCC('A0T0'), AbilityNames.AllMight.ONE_FOR_ALL],
    [FourCC('A0T3'), AbilityNames.AllMight.OKLAHOMA_SMASH],
    [FourCC('A0T4'), AbilityNames.AllMight.CAROLINA_SMASH],
    [FourCC('A0T5'), AbilityNames.AllMight.CALIFORNIA_SMASH],
    [FourCC('A0T6'), AbilityNames.AllMight.NEW_HAMPSHIRE_SMASH],
    
    // mario
    [Id.jump, AbilityNames.Mario.JUMP],
    [Id.groundPound, AbilityNames.Mario.GROUND_POUND],
    [Id.hammerTime, AbilityNames.Mario.HAMMER_TIME],
    [Id.spinJump, AbilityNames.Mario.SPIN_JUMP],
    [Id.superCape, AbilityNames.Mario.SUPER_CAPE],
    [Id.powerUpBlock, AbilityNames.Mario.POWER_UP_BLOCK],
    [Id.fireball, AbilityNames.Mario.FIREBALL],

    // tien
    [Id.dodonRay, AbilityNames.Tien.DODON_RAY],
    [Id.triBeamCharge, AbilityNames.Tien.TRI_BEAM_CHARGE],
    [Id.triBeam, AbilityNames.Tien.TRI_BEAM_FIRE],
    [Id.tienKiai, AbilityNames.Tien.KIAI],
    [Id.multiFormSolarFlare, AbilityNames.Tien.MULTI_FORM_SOLAR_FLARE],
    [Id.tienFourArms, AbilityNames.Tien.FOUR_ARMS],

    // ichigo
    [Id.getsugaTensho, AbilityNames.Ichigo.GETSUGA_TENSHO],
    [Id.getsugaKuroi, AbilityNames.Ichigo.GETSUGA_KUROI],
    [Id.getsugaGran, AbilityNames.Ichigo.GETSUGA_GRAN],
    [Id.getsugaJujisho, AbilityNames.Ichigo.GETSUGA_JUJISHO],
    [Id.ceroCharge, AbilityNames.Ichigo.CERO_CHARGE],
    [Id.ceroFire, AbilityNames.Ichigo.CERO_FIRE],
    [Id.mugetsuUnleash, AbilityNames.Ichigo.MUGETSU_UNLEASH],
    [Id.mugetsuSlash, AbilityNames.Ichigo.MUGETSU_SLASH],
    [Id.shunpo, AbilityNames.Ichigo.SHUNPO],
    [Id.hirenkyaku, AbilityNames.Ichigo.HIRENKYAKU],
    [Id.blutVene, AbilityNames.Ichigo.BLUTVENE],
    [Id.ceroGigante, AbilityNames.Ichigo.CERO_GIGANTE],

    // dart feld
    [Id.doubleSlash, AbilityNames.DartFeld.DOUBLE_SLASH],
    [Id.burningRush, AbilityNames.DartFeld.BURNING_RUSH],
    [Id.madnessSlash, AbilityNames.DartFeld.MADNESS_SLASH],
    [Id.crushDance, AbilityNames.DartFeld.CRUSH_DANCE],
    [Id.heartOfFire, AbilityNames.DartFeld.HEART_OF_FIRE],
    [Id.madnessHero, AbilityNames.DartFeld.MADNESS_HERO],
    [Id.dragoonTransformation, AbilityNames.DartFeld.DRAGOON_TRANSFORMATION],
    [Id.blazingDynamo, AbilityNames.DartFeld.BLAZING_DYNAMO],
    [Id.dragoonFlourish, AbilityNames.DartFeld.DRAGOON_FLOURISH],
    [Id.flameShot, AbilityNames.DartFeld.FLAME_SHOT],
    [Id.paragonOfFlame, AbilityNames.DartFeld.PARAGON_OF_FLAME],
    [Id.finalBurst, AbilityNames.DartFeld.FINAL_BURST],
    [Id.redEyedDragonSummoning, AbilityNames.DartFeld.RED_EYED_DRAGON_SUMMON],

    // babidi
    [FourCC('A02F'), AbilityNames.Babidi.HARETSU],
    [FourCC('A0LG'), AbilityNames.Babidi.BABIDI_BARRIER],
    [FourCC('A0JQ'), AbilityNames.Babidi.BABIDI_MAGIC],
    [FourCC('A018'), AbilityNames.Babidi.SUMMON_PUI_PUI],
    [FourCC('A01A'), AbilityNames.Babidi.SUMMON_YAKON],
    [FourCC('A03E'), AbilityNames.Babidi.SUMMON_DABURA],

    // dabura
    [FourCC('A0OG'), AbilityNames.Dabura.EVIL_SPEAR],

    // buus
    [FourCC('A0EI'), AbilityNames.Buu.BUU_BEAM],
    [FourCC('A01C'), AbilityNames.Buu.FLESH_ATTACK],
    [FourCC('A0LH'), AbilityNames.Buu.INNOCENCE_BREATH],
    [FourCC('A0ER'), AbilityNames.Buu.ANGRY_EXPLOSION],
    [FourCC('A0C0'), AbilityNames.Buu.VANISHING_BALL],
    [FourCC('A01D'), AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK],

    // androids 13 14 15
    [FourCC('A00N'), AbilityNames.Android13.ENERGY_BEAM],
    // change later distortion field -> android barrier
    [FourCC('A0LC'), AbilityNames.Android13.SS_DEADLY_HAMMER],
    // new
    [FourCC('A0LD'), AbilityNames.Android13.SS_DEADLY_BOMBER],
    // old
    [FourCC('A041'), AbilityNames.Android13.SS_DEADLY_BOMBER],
    [FourCC('A01Y'), AbilityNames.Android13.NUKE],
    [FourCC('A0K2'), AbilityNames.Android13.OVERCHARGE],



    // broly
    [FourCC('A0G8'), AbilityNames.Broly.ENERGY_PUNCH],
    [FourCC('A00J'), AbilityNames.Broly.POWER_LEVEL_RISING],
    [FourCC('A0BZ'), AbilityNames.Broly.PLANET_CRUSHER],
    [FourCC('A084'), AbilityNames.Broly.GIGANTIC_ROAR],
    [FourCC('A0H6'), AbilityNames.Broly.GIGANTIC_OMEGASTORM],

    // cell 
    [FourCC('A029'), AbilityNames.Cell.ABSORB],
    [FourCC('A0JU'), AbilityNames.Cell.ABSORB],
    [FourCC('A0LA'), AbilityNames.Cell.ABSORB],
    // special beam cannon CELL
    [FourCC('A0C9'), AbilityNames.Cell.SPECIAL_BEAM_CANNON],
    // masenko CELL
    [FourCC('A0GD'), AbilityNames.Cell.MASENKO],
    [FourCC('A01Z'), AbilityNames.Cell.SPAWN_CELL_JUNIORS],
    [FourCC('A0O9'), AbilityNames.Cell.SOLAR_KAMEHAMEHA],
    [FourCC('A0OD'), AbilityNames.Cell.CELL_X_FORM],

    // cooler
    [FourCC('A06C'), AbilityNames.Cooler.DEATH_BEAM],
    [FourCC('A0C1'), AbilityNames.Cooler.SUPERNOVA_COOLER],
    [FourCC('A0KY'), AbilityNames.Cooler.NOVA_CHARIOT],
    [FourCC('A06N'), AbilityNames.Cooler.DEAFENING_WAVE],
    [FourCC('A063'), AbilityNames.Cooler.GETI_STAR_REPAIR],
    [FourCC('A0L2'), AbilityNames.Cooler.SUPERNOVA_GOLDEN],

    // raditz
    [FourCC('A0ME'), AbilityNames.Raditz.DOUBLE_SUNDAY],
    [FourCC('A0MF'), AbilityNames.Raditz.SATURDAY_CRASH],
    [FourCC('A0MG'), AbilityNames.Raditz.BEHIND_YOU],
    [FourCC('A0MH'), AbilityNames.Raditz.DOUBLE_SUNDAE],

    // nappa
    [FourCC('A0MI'), AbilityNames.Nappa.GIANT_STORM],
    [FourCC('A0MJ'), AbilityNames.Nappa.BLAZING_STORM],
    [FourCC('A0MK'), AbilityNames.Nappa.PLANT_SAIBAMEN],
    [FourCC('A0ML'), AbilityNames.Nappa.BREAK_CANNON],
    
    // saibamen
    [FourCC('A0MM'), AbilityNames.Saibaman.BOMB],
    [FourCC('A0MN'), AbilityNames.Saibaman.ACID],

    // moro
    [FourCC('A0MO'), AbilityNames.Moro.ENERGY_DRAIN],
    [FourCC('A0MP'), AbilityNames.Moro.ENERGY_BALL],
    [FourCC('A0MQ'), AbilityNames.Moro.LAVA_BURST],
    [FourCC('A0MR'), AbilityNames.Moro.LAVA_PILLARS],
    [FourCC('A0MS'), AbilityNames.Moro.POWER_LEVEL_SHARING],

    // super janemba
    [FourCC('A0O0'), AbilityNames.SuperJanemba.DEMONS_MARK],
    [FourCC('A0O1'), AbilityNames.SuperJanemba.DEMON_RUSH],
    [FourCC('A0NY'), AbilityNames.SuperJanemba.RAKSHASA_CLAW],
    [FourCC('A0NZ'), AbilityNames.SuperJanemba.DEVIL_CLAW],
    [FourCC('A0O2'), AbilityNames.SuperJanemba.BUNKAI_TELEPORT],
    [FourCC('A0OA'), AbilityNames.SuperJanemba.DEMONIC_BLADE],
    [FourCC('A0O3'), AbilityNames.SuperJanemba.HELLS_GATE],
    [FourCC('A0EU'), AbilityNames.SuperJanemba.COSMIC_ILLUSION],
    [FourCC('A0O4'), AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN],

    // king k rool
    [FourCC('A0OT'), AbilityNames.KingKRool.BELLY_ARMOR],
    [FourCC('A0IV'), AbilityNames.KingKRool.KROWN_TOSS],
    [FourCC('A0IW'), AbilityNames.KingKRool.KHARGE],
    [FourCC('A0IU'), AbilityNames.KingKRool.HAND_KANNON],
    [FourCC('A0OW'), AbilityNames.KingKRool.KANNONBLAST],
    [FourCC('A0IX'), AbilityNames.KingKRool.MONKEY_SMASHER],
    [FourCC('A0OU'), AbilityNames.KingKRool.BLAST_O_MATIC],
    [FourCC('A0OV'), AbilityNames.KingKRool.KINGS_THRONE],

    // eis shenron
    [FourCC('A0P1'), AbilityNames.EisShenron.FROST_CLAWS],
    [FourCC('A0P2'), AbilityNames.EisShenron.ICE_SLASH],
    [FourCC('A0P3'), AbilityNames.EisShenron.ABSOLUTE_ZERO],
    [FourCC('A0P4'), AbilityNames.EisShenron.ICE_CANNON],

    // ginyu
    [FourCC('A0PP'), AbilityNames.Ginyu.MILKY_CANNON],
    [FourCC('A0PQ'), AbilityNames.Ginyu.GALAXY_DYNAMITE],
    [FourCC('A0PT'), AbilityNames.Ginyu.GINYU_POSE_FIGHTING],
    [FourCC('A0PW'), AbilityNames.Ginyu.FROG_TONGUE],

    // frieza
    [FourCC('A0PZ'), AbilityNames.Frieza.DEATH_BEAM],
    [FourCC('A0Q0'), AbilityNames.Frieza.DEATH_CANNON],
    [FourCC('A0Q1'), AbilityNames.Frieza.NOVA_STRIKE],
    [FourCC('A0Q2'), AbilityNames.Frieza.SUPERNOVA],
    [FourCC('A0Q3'), AbilityNames.Frieza.EMPERORS_THRONE],
    [FourCC('A0Q4'), AbilityNames.Frieza.DEATH_STORM],
    [FourCC('A0Q5'), AbilityNames.Frieza.IMPALING_RUSH],
    [FourCC('A0Q6'), AbilityNames.Frieza.DEATH_BEAM_BARRAGE],
    [FourCC('A0Q7'), AbilityNames.Frieza.NOVA_RUSH],
    [FourCC('A0Q8'), AbilityNames.Frieza.DEATH_BALL],
    [FourCC('A0Q9'), AbilityNames.Frieza.SUPERNOVA_2],
    [FourCC('A0QA'), AbilityNames.Frieza.TAIL_WHIP],
    [FourCC('A0QB'), AbilityNames.Frieza.LAST_EMPEROR],
    [FourCC('A0QC'), AbilityNames.Frieza.DEATH_SAUCER],
    [FourCC('A0QD'), AbilityNames.Frieza.DEATH_BEAM_GOLDEN],
    [FourCC('A0QE'), AbilityNames.Frieza.DEATH_CANNON_GOLDEN],
    [FourCC('A0QF'), AbilityNames.Frieza.NOVA_RUSH_GOLDEN],
    [FourCC('A0QG'), AbilityNames.Frieza.EARTH_BREAKER],
    [FourCC('A0QH'), AbilityNames.Frieza.CAGE_OF_LIGHT],

    // omega shenron
    [FourCC('A0QJ'), AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET],
    [FourCC('A0QK'), AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL],
    [FourCC('A0QL'), AbilityNames.OmegaShenron.SHADOW_FIST],
    [FourCC('A0QM'), AbilityNames.OmegaShenron.DRAGONIC_RAGE],
    [FourCC('A0QP'), AbilityNames.OmegaShenron.ICE_CANNON],
    [FourCC('A0QQ'), AbilityNames.OmegaShenron.NOVA_STAR],
    [FourCC('A0QR'), AbilityNames.OmegaShenron.DRAGON_THUNDER],

    // guldo
    [FourCC('A0SC'), AbilityNames.Guldo.PSYCHO_JAVELIN],
    [FourCC('A0SD'), AbilityNames.Guldo.PSYCHIC_ROCK_THROW],
    [FourCC('A0SE'), AbilityNames.Guldo.TELEKINESIS],
    [FourCC('A0SF'), AbilityNames.Guldo.TIME_STOP],
    [FourCC('A0SG'), AbilityNames.Guldo.GINYU_POSE_GULDO],

    // zamasu
    [FourCC('A0SR'), AbilityNames.Zamasu.DIVINE_AUTHORITY],
    [FourCC('A0SS'), AbilityNames.Zamasu.GOD_SLASH],
    [FourCC('A0ST'), AbilityNames.Zamasu.HOLY_LIGHT_GRENADE],
    [FourCC('A0SU'), AbilityNames.Zamasu.HEAVENLY_RUSH],
    [FourCC('A0SV'), AbilityNames.Zamasu.ENERGY_BLADES],


    [Id.sephirothOctoslash, AbilityNames.Sephiroth.OCTOSLASH],
    [Id.sephirothHellsGate, AbilityNames.Sephiroth.HELLS_GATE],
    [Id.sephirothFerventBlow, AbilityNames.Sephiroth.FERVENT_BLOW],
    [Id.sephirothFerventRush, AbilityNames.Sephiroth.FERVENT_RUSH],
    [Id.sephirothBlackMateria, AbilityNames.Sephiroth.BLACK_MATERIA],
    [Id.sephirothOneWingedAngel, AbilityNames.Sephiroth.ONE_WINGED_ANGEL],
    [Id.sephirothParry, AbilityNames.Sephiroth.PARRY],


    [Id.timeSkip, AbilityNames.Hit.TIME_SKIP],
    [Id.pocketDimension, AbilityNames.Hit.POCKET_DIMENSION],
    [Id.flashFist, AbilityNames.Hit.FLASH_FIST],
    [Id.timeCage, AbilityNames.Hit.TIME_CAGE],
    [Id.pureProgress, AbilityNames.Hit.PURE_PROGRESS],


    [Id.tyrannoFlame, AbilityNames.RustTyranno.TYRANNO_FLAME],
    [Id.rustChomp, AbilityNames.RustTyranno.RUST_CHOMP],
    [Id.rustGobble, AbilityNames.RustTyranno.RUST_GOBBLE],
    [Id.tyrannoRoar, AbilityNames.RustTyranno.TYRANNO_ROAR],

    // items
    [FourCC('A0NS'), AbilityNames.Items.ANDROID_BOMB],
    [FourCC('A0NT'), AbilityNames.Items.GETI_STAR_FRAGMENT],
    // dummy caster FourCC("h054")
    // dummy stun micro / 1s / 2s
    // A08K / A0IY / A0I7
  ]
);