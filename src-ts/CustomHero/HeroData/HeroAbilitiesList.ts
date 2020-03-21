import { AbilityNames } from "CustomAbility/AbilityNames";

export const HeroAbilitiesList: Map<number, string[]> = new Map(
  [
    // goku and xeno
    [FourCC("H000"), [
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
      AbilityNames.Goku.GOD_KAMEHAMEHA, 
      AbilityNames.Goku.ULTRA_INSTINCT,
      AbilityNames.Goku.MASTERED_ULTRA_INSTINCT,
    ]],

    // vegeta
    [FourCC("E003"), [
      AbilityNames.Vegeta.GALICK_GUN, 
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 
      AbilityNames.Vegeta.FINAL_FLASH, 
      AbilityNames.Vegeta.FINAL_FLASH_2, 
      AbilityNames.Vegeta.MOONLIGHT, 
      AbilityNames.Vegeta.ANGRY_SHOUT, 
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY,
    ]],
    
    // gohan
    [FourCC("H00K"), [
      AbilityNames.Gohan.UNLOCK_POTENTIAL, 
      AbilityNames.Gohan.THE_GREAT_SAIYAMAN_HAS_ARRIVED, 
      AbilityNames.Gohan.POTENTIAL_UNLEASHED,
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Gohan.MASENKO, 
      AbilityNames.Gohan.TWIN_DRAGON_SHOT,
      AbilityNames.Gohan.SUPER_DRAGON_FLIGHT, 
      AbilityNames.Gohan.FATHER_SON_KAMEHAMEHA, 
    ]],
    
    // goten
    [FourCC("H008"), [
      AbilityNames.Goku.KAMEHAMEHA
    ]],
    // kid trunks
    [FourCC("H016"), [
      AbilityNames.FutureTrunks.FINISH_BUSTER
    ]],
    // gotenks
    [FourCC("H00A"), [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Gotenks.GALACTIC_DONUTS, 
      AbilityNames.Gotenks.SUPER_GHOST_KAMIKAZE_ATTACK
    ]],

    // future trunks
    [FourCC("H009"), [
      AbilityNames.FutureTrunks.FINISH_BUSTER, 
      AbilityNames.FutureTrunks.HEAT_DOME_ATTACK, 
      AbilityNames.FutureTrunks.BURNING_ATTACK, 
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 
      AbilityNames.FutureTrunks.SHINING_SWORD_ATTACK, 
      AbilityNames.FutureTrunks.BLAZING_RUSH, 
      AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE
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
    [FourCC("H00R"), [
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
      AbilityNames.Piccolo.SLAPPY_HAND, 
      AbilityNames.Piccolo.HELLZONE_GRENADE, 
      AbilityNames.Piccolo.MULTI_FORM, 
      AbilityNames.Piccolo.KYODAIKA
    ]],
    [FourCC("H04X"), [
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
      AbilityNames.Piccolo.SLAPPY_HAND, 
      AbilityNames.Piccolo.HELLZONE_GRENADE, 
      AbilityNames.Piccolo.MULTI_FORM, 
      AbilityNames.Piccolo.KYODAIKA
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
    [FourCC("H08P"), [AbilityNames.Pan.KAMEHAMEHA, AbilityNames.Pan.MAIDEN_BLAST, AbilityNames.Pan.RELIABLE_FRIEND, AbilityNames.Pan.SUMMON_GIRU, AbilityNames.Pan.HONEY_BEE_COSTUME]],
    [FourCC("H08R"), [AbilityNames.Pan.KAMEHAMEHA, AbilityNames.Pan.MAIDEN_BLAST, AbilityNames.Pan.RELIABLE_FRIEND, AbilityNames.Pan.SUMMON_GIRU, AbilityNames.Pan.HONEY_BEE_COSTUME]],
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
    [FourCC("O00C"), [
      AbilityNames.Buu.FLESH_ATTACK, AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, AbilityNames.Buu.ANGRY_EXPLOSION, AbilityNames.Buu.VANISHING_BALL,
      AbilityNames.Goku.GOD_KAMEHAMEHA, AbilityNames.Goku.ULTRA_INSTINCT, AbilityNames.Goku.MASTERED_ULTRA_INSTINCT, 
      AbilityNames.Vegeta.GALICK_GUN, 
      AbilityNames.Gohan.POTENTIAL_UNLEASHED,
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, AbilityNames.Piccolo.KYODAIKA,
      AbilityNames.FutureTrunks.HEAT_DOME_ATTACK, AbilityNames.FutureTrunks.SUPER_SAIYAN_RAGE,
      AbilityNames.Bardock.TYRANT_BREAKER, AbilityNames.Bardock.TYRANT_LANCER, AbilityNames.Bardock.FUTURE_SIGHT,
      AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE,
      AbilityNames.Videl.PUNCH,
      AbilityNames.Upa.JAVELIN_THROW,
      AbilityNames.Tapion.BRAVE_SLASH, AbilityNames.Tapion.BRAVE_CANNON,
      AbilityNames.Android13.SS_DEADLY_HAMMER,
      AbilityNames.Babidi.HARETSU, AbilityNames.Babidi.SUMMON_PUI_PUI,
      AbilityNames.Broly.ENERGY_PUNCH,
      AbilityNames.Cell.CELL_X_FORM,
      AbilityNames.Frieza.DEATH_BEAM,
      AbilityNames.Raditz.DOUBLE_SUNDAY,
      AbilityNames.Nappa.GIANT_STORM,
      AbilityNames.Moro.ENERGY_DRAIN,
      AbilityNames.SuperJanemba.DEMONS_MARK, AbilityNames.SuperJanemba.DEMON_RUSH, AbilityNames.SuperJanemba.DEVIL_CLAW, AbilityNames.SuperJanemba.DEVIL_CLAW_ON_HIT,
      AbilityNames.KingKRool.BELLY_ARMOR, AbilityNames.KingKRool.KROWN_TOSS, 
    ]],

    // broly
    [FourCC("H00M"), [AbilityNames.Broly.ENERGY_PUNCH, AbilityNames.Broly.POWER_LEVEL_RISING, AbilityNames.Broly.PLANET_CRUSHER, AbilityNames.Broly.GIGANTIC_ROAR, AbilityNames.Broly.GIGANTIC_OMEGASTORM]],
    
    // cell unformed / 1st form / 2nd form / perfect
    [FourCC("N00Q"), [AbilityNames.Goku.KAMEHAMEHA]],
    [FourCC("H00E"), [AbilityNames.Goku.KAMEHAMEHA, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, "Solar Flare", AbilityNames.Cell.ABSORB]],
    [FourCC("H00F"), [AbilityNames.Goku.KAMEHAMEHA, AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, "Solar Flare", AbilityNames.Cell.ABSORB]],
    [FourCC("H00G"), [
      AbilityNames.Goku.KAMEHAMEHA, 
      AbilityNames.Gohan.MASENKO, 
      AbilityNames.Piccolo.SPECIAL_BEAM_CANNON, 
      AbilityNames.Cell.SPAWN_CELL_JUNIORS,
      AbilityNames.Cell.SOLAR_KAMEHAMEHA,
      AbilityNames.Cell.CELL_X_FORM,
    ]],
    // cell junior
    [FourCC("H01J"), [AbilityNames.Goku.KAMEHAMEHA]],


    // fourth form cooler
    [FourCC("H042"), [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // final form cooler
    [FourCC("H043"), [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // golden final form
    [FourCC("H05L"), [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.DEAFENING_WAVE, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],
    // metal cooler
    [FourCC("H01A"), [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.SUPERNOVA_COOLER, AbilityNames.Cooler.NOVA_CHARIOT, AbilityNames.Cooler.GETI_STAR_REPAIR, AbilityNames.Cooler.SUPERNOVA_GOLDEN]],

    // farmer with shotgun
    [FourCC("H08S"), [
      AbilityNames.Frieza.DEATH_BEAM, 
      AbilityNames.Vegeta.FINAL_FLASH, 
      AbilityNames.Gohan.TWIN_DRAGON_SHOT, 
      AbilityNames.Broly.GIGANTIC_ROAR, 
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
    [FourCC("H08W"), [AbilityNames.Nappa.GIANT_STORM, AbilityNames.Nappa.BLAZING_STORM, AbilityNames.Nappa.PLANT_SAIBAMEN, AbilityNames.Vegeta.MOONLIGHT, AbilityNames.Vegeta.ANGRY_SHOUT, AbilityNames.Nappa.BREAK_CANNON]],
    // saibaman
    [FourCC("H08X"), [AbilityNames.Saibaman.BOMB, AbilityNames.Saibaman.ACID]],

    // moro
    [FourCC("H08Y"), [AbilityNames.Moro.ENERGY_DRAIN, AbilityNames.Moro.ENERGY_BALL, AbilityNames.Moro.LAVA_BURST, AbilityNames.Moro.LAVA_PILLARS, AbilityNames.Moro.POWER_LEVEL_SHARING]],

    // super janemba
    [FourCC("H062"), [
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
  ]
)