import { SagaUnit } from "./SagaUnit";
import { Vector2D } from "Common/Vector2D";
import { SagaAbilities } from "./SagaAbilitiesConfig";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export const sagaUnitsConfig = new Map<string, SagaUnit>(
  [
    // dead zone
    ["Garlic Jr", new SagaUnit(FourCC("U00D"), 9, 30, 25, 20, new Vector2D(-2200, 28000),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.POWER_POLE,
      ],
    )],
    ["Ginger", new SagaUnit(FourCC("O002"), 1, 5, 5, 5, new Vector2D(-2500, 27000))],
    ["Nicky", new SagaUnit(FourCC("O003"), 1, 5, 5, 5, new Vector2D(-1000, 26000))],
    ["Sansho", new SagaUnit(FourCC("N00C"), 3, 10, 5, 5, new Vector2D(-3500, 26000))],

    // raditz
    // ["Raditz", new SagaUnit(FourCC("U01D"), 5, 45, 45, 60, new Vector2D(17333, -7358))],
    // ["Raditz", new SagaUnit(FourCC("U01D"), 10, 90, 60, 90, new Vector2D(8000, 5000))],
    // ["Raditz", new SagaUnit(FourCC("U01D"), 10, 90, 60, 90, new Vector2D(8800, 1400))],
    ["Raditz", new SagaUnit(FourCC("H08U"), 12, 90, 60, 90, new Vector2D(8800, 1700), 
      [
        SagaAbilities.Raditz.DOUBLE_SUNDAY, 
        SagaAbilities.Raditz.SATURDAY_CRASH
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_1,
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],

    // saiyan saga
    // ["Nappa", new SagaUnit(FourCC("U019"), 8, 120, 80, 80, new Vector2D(-3300, -5500))],
    // ["Vegeta", new SagaUnit(FourCC("E003"), 15, 200, 200, 300, new Vector2D(-3300, -5500))],
    // ["Nappa", new SagaUnit(FourCC("U019"), 12, 120, 80, 80, new Vector2D(8800, 1400))],
    ["Nappa", new SagaUnit(FourCC("H08W"), 15, 120, 80, 80, new Vector2D(8800, 1700),
      [
        SagaAbilities.Nappa.BLAZING_STORM, 
        SagaAbilities.Nappa.GIANT_STORM, 
        SagaAbilities.Nappa.BREAK_CANNON,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_1,
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],
    ["Vegeta", new SagaUnit(FourCC("E003"), 25, 200, 200, 300, new Vector2D(8800, 1700),
      [
        SagaAbilities.Vegeta.GALICK_GUN, 
        SagaAbilities.Vegeta.ENERGY_BLAST_VOLLEY,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_1,
        ItemConstants.SagaDrops.SCOUTER_1,
        ItemConstants.SagaDrops.VEGETA_TAIL,
      ]
    )],
    
    // wheelo
    ["Kishime", new SagaUnit(FourCC("O00P"), 6, 75, 75, 75, new Vector2D(800, 18000))],
    ["Misokatsun", new SagaUnit(FourCC("O00O"), 5, 50, 80, 50, new Vector2D(400, 18200))],
    ["Ebifurya", new SagaUnit(FourCC("O00N"), 12, 150, 80, 75, new Vector2D(-600, 17500),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],
    ["Dr. Kochin", new SagaUnit(FourCC("O00Q"), 1, 2, 1, 1, new Vector2D(-600, 17500))],
    ["Wheelo", new SagaUnit(FourCC("U006"), 25, 320, 150, 450, new Vector2D(-300, 18000),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.WHEELO_RESEARCH_1,
      ]
    )],

    // turles
    ["Turles", new SagaUnit(FourCC("H01H"), 28, 500, 250, 500, new Vector2D(-3000, 11000),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_1,
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],

    // slug
    ["Lord Slug", new SagaUnit(FourCC("O00L"), 40, 600, 300, 500, new Vector2D(8700, -5400),
      [
        SagaAbilities.LordSlug.SLAPPY_HAND,
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Saga.GENERIC_BEAM,
      ],
      [
        ItemConstants.SagaDrops.DARKNESS_GENERATOR,
      ]
    )],

    // namek saga
    ["Dodoria", new SagaUnit(FourCC("U015"), 25, 350, 150, 200, new Vector2D(30500, 25500),
      [
        SagaAbilities.Vegeta.ENERGY_BLAST_VOLLEY,
        SagaAbilities.Nappa.BREAK_CANNON,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_1,
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],
    ["Zarbon", new SagaUnit(FourCC("U016"), 25, 500, 300, 250, new Vector2D(30700, 25500),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ]
    )],
    ["Zarbon 2", new SagaUnit(FourCC("U01B"), 45, 700, 300, 500, new Vector2D(30500, 25500),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_2,
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],

    // ginyu force
    ["Guldo", new SagaUnit(FourCC("H09J"), 9, 200, 200, 650, new Vector2D(25000, 30000),
      [
        SagaAbilities.Guldo.PSYCHO_JAVELIN, 
        SagaAbilities.Guldo.PSYCHIC_ROCK_THROW,
        SagaAbilities.Guldo.TELEKINESIS,
        SagaAbilities.Guldo.GINYU_POSE_GULDO,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_2,
      ]
    )],
    ["Recoome", new SagaUnit(FourCC("U005"), 35, 900, 200, 300, new Vector2D(24400, 30000),
      [
        SagaAbilities.Broly.ENERGY_PUNCH, 
        SagaAbilities.Nappa.BREAK_CANNON
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_3,
      ]
    )],
    ["Burter", new SagaUnit(FourCC("U00Z"), 10, 400, 650, 350, new Vector2D(24000, 29700))],
    ["Jeice", new SagaUnit(FourCC("U010"), 10, 700, 250, 600, new Vector2D(25000, 29700), 
      [
        SagaAbilities.Saga.GENERIC_BEAM,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_2,
      ]
    )],
    ["Ginyu", new SagaUnit(FourCC("H09E"), 50, 800, 250, 800, new Vector2D(24500, 29600),
      [
        SagaAbilities.Ginyu.MILKY_CANNON,
        SagaAbilities.Ginyu.GALAXY_DYNAMITE,
        SagaAbilities.Ginyu.GINYU_POSE_FIGHTING,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_3,
        ItemConstants.SagaDrops.SCOUTER_2,
      ]
    )],

    // frieza
    ["Frieza 1", new SagaUnit(FourCC("H071"), 10, 1000, 200, 900, new Vector2D(21500, 26100),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Frieza.DEATH_CANNON,
      ],
    )],
    ["Frieza 2", new SagaUnit(FourCC("H070"), 15, 1200, 300, 800, new Vector2D(21500, 26100),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Frieza.DEATH_STORM,
        SagaAbilities.Frieza.IMPALING_RUSH,
      ],
    )],
    ["Frieza 3", new SagaUnit(FourCC("H06Z"), 20, 1300, 350, 850, new Vector2D(21500, 26100),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Frieza.NOVA_RUSH,
        SagaAbilities.Frieza.DEATH_BEAM_BARRAGE,
      ],
    )],
    ["Frieza 4", new SagaUnit(FourCC("H06X"), 35, 1500, 400, 1400, new Vector2D(21500, 26100),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Frieza.NOVA_STRIKE,
        SagaAbilities.Frieza.TAIL_WHIP,
        SagaAbilities.Frieza.DEATH_BALL,
      ],
    )],
    ["Frieza 5", new SagaUnit(FourCC("H06Y"), 75, 2000, 500, 1800, new Vector2D(21500, 26100),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Frieza.DEATH_CANNON,
        SagaAbilities.Frieza.LAST_EMPEROR,
        SagaAbilities.Frieza.NOVA_STRIKE,
        SagaAbilities.Frieza.NOVA_RUSH,
        SagaAbilities.Frieza.DEATH_SAUCER,
        SagaAbilities.Frieza.SUPERNOVA,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_4,
        ItemConstants.SagaDrops.FRIEZA_TAIL,
      ]
    )],

    // garlic jr
    ["Garlic Jr 2", new SagaUnit(FourCC("U00D"), 60, 800, 350, 850, new Vector2D(-2200, 28000),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.DEAD_ZONE_FRAGMENT,
      ]
    )],
    ["Salt", new SagaUnit(FourCC("U00E"), 8, 500, 300, 600, new Vector2D(-2500, 27000))],
    ["Vinegar", new SagaUnit(FourCC("U00F"), 10, 500, 300, 600, new Vector2D(-1000, 26000))],
    ["Mustard", new SagaUnit(FourCC("U00G"), 10, 600, 300, 500, new Vector2D(-3500, 26000))],
    ["Spice", new SagaUnit(FourCC("U00H"), 9, 600, 300, 500, new Vector2D(-2000, 27000))],

    // cooler's revenge
    ["Cooler", new SagaUnit(FourCC("H042"), 60, 1500, 400, 1600, new Vector2D(4400, 9300),
      [
        SagaAbilities.Cooler.DEATH_BEAM,
        SagaAbilities.Cooler.SUPERNOVA_COOLER,
        SagaAbilities.Cooler.NOVA_CHARIOT,
      ],
      [
        ItemConstants.SagaDrops.SCOUTER_1,
      ]
    )],

    // return of cooler
    ["Metal Cooler 1", new SagaUnit(FourCC("H01A"), 25, 1800, 400, 2000, new Vector2D(25000, 30000),
      [
        SagaAbilities.Cooler.DEATH_BEAM,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Cooler.GETI_STAR_REPAIR,
      ],
      [
        ItemConstants.SagaDrops.GETI_STAR_FRAGMENT,
      ]
    )],
    ["Metal Cooler 2", new SagaUnit(FourCC("H01A"), 25, 1800, 400, 2000, new Vector2D(25100, 30000),
      [
        SagaAbilities.Cooler.DEATH_BEAM,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Cooler.GETI_STAR_REPAIR,
      ],
    )],
    ["Metal Cooler 3", new SagaUnit(FourCC("H01A"), 25, 1800, 400, 2000, new Vector2D(25000, 30100),
      [
        SagaAbilities.Cooler.DEATH_BEAM,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Cooler.GETI_STAR_REPAIR,
      ],
    )],

    // trunks saga
    ["Mecha Frieza", new SagaUnit(FourCC("U00J"), 70, 2500, 410, 1000, new Vector2D(24000, 6500),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Cooler.SUPERNOVA_COOLER,
      ],
    )],
    ["King Cold", new SagaUnit(FourCC("U00K"), 30, 2500, 410, 2000, new Vector2D(24400, 6500),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
      ],
    )],

    // androids 19/20 saga
    ["Android 19", new SagaUnit(FourCC("O00A"), 40, 2500, 350, 2500, new Vector2D(29000, -4300),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB,
      ],
    )],
    ["Android 20", new SagaUnit(FourCC("H04T"), 50, 2500, 350, 3000, new Vector2D(29000, -5000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB,
      ],
      [
        ItemConstants.SagaDrops.GERO_BOOTS,
      ]
    )],

    // androids 16/17/18 saga
    ["Android 16", new SagaUnit(FourCC("H08O"), 60, 4200, 350, 3300, new Vector2D(15000, 6500),
      [
        SagaAbilities.Android17DBS.POWER_BLITZ,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
      ],
      [
        ItemConstants.SagaDrops.ANDROID_BOMB,
      ]
    )],
    ["Android 17", new SagaUnit(FourCC("H05C"), 50, 3500, 350, 3000, new Vector2D(15500, 6500),
      [
        SagaAbilities.Android17DBS.POWER_BLITZ,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
        SagaAbilities.Android17DBS.SUPER_ELECTRIC_STRIKE,
      ],
    )],
    ["Android 18", new SagaUnit(FourCC("H05D"), 50, 3000, 350, 3500, new Vector2D(15000, 6000),
      [
        SagaAbilities.Android17DBS.POWER_BLITZ,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
      ],
    )],

    // super android 13
    ["Android 13", new SagaUnit(FourCC("H01V"), 50, 4000, 350, 4000, new Vector2D(-5000, -5000),
      [
        SagaAbilities.Android13.ENERGY_BEAM,
        SagaAbilities.Android13.SS_DEADLY_BOMBER,
      ],
    )],
    ["Android 14", new SagaUnit(FourCC("H01S"), 25, 3000, 350, 2000, new Vector2D(-5000, -5000),
      [
        SagaAbilities.Android13.ENERGY_BEAM,
        SagaAbilities.Android13.NUKE,
      ],
    )],
    ["Android 15", new SagaUnit(FourCC("H01T"), 25, 2000, 350, 3000, new Vector2D(-5000, -5000),
      [
        SagaAbilities.Android13.ENERGY_BEAM,
        SagaAbilities.Android13.NUKE,
      ],
    )],
    ["Super Android 13", new SagaUnit(FourCC("H01U"), 70, 4500, 400, 4000, new Vector2D(-5000, -5000),
      [
        SagaAbilities.Android13.SS_DEADLY_BOMBER,
        SagaAbilities.Android13.SS_DEADLY_HAMMER,
        SagaAbilities.Android13.NUKE,
        SagaAbilities.Android13.ANDROID_BARRIER,
        SagaAbilities.Android13.OVERCHARGE,
      ],
      [
        ItemConstants.SagaDrops.BANANA_GENERATOR
      ]
    )],

    // cell saga
    ["Imperfect Cell", new SagaUnit(FourCC("H00E"), 50, 3500, 400, 3500, new Vector2D(30500, 16000),
      [
        SagaAbilities.Cell.KAMEHAMEHA,
      ],
    )],
    ["Semiperfect Cell", new SagaUnit(FourCC("H00F"), 70, 5000, 400, 5000, new Vector2D(30500, 16000),
      [
        SagaAbilities.Cell.KAMEHAMEHA,
        SagaAbilities.Cell.SPECIAL_BEAM_CANNON,
      ],
    )],
    ["Perfect Cell 1", new SagaUnit(FourCC("H00G"), 95, 6000, 400, 7000, new Vector2D(30500, 16000),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Cell.KAMEHAMEHA,
        SagaAbilities.Cell.MASENKO,
        SagaAbilities.Cell.SPECIAL_BEAM_CANNON,
        SagaAbilities.Saga.SOLAR_KAMEHAMEHA_CUSTOM,
      ],
      [
        ItemConstants.SagaDrops.HBTC_TRAINING_TICKET,
      ]
    )],
    
    // cell games saga
    ["Perfect Cell Games", new SagaUnit(FourCC("H00G"), 90, 6000, 400, 6000, new Vector2D(20200, 20800),
      [
        SagaAbilities.Cell.KAMEHAMEHA,
        SagaAbilities.Cell.MASENKO,
        SagaAbilities.Cell.SPECIAL_BEAM_CANNON,
      ],
    )],
    ["Super Perfect Cell", new SagaUnit(FourCC("H00G"), 110, 6500, 500, 6500, new Vector2D(20200, 20800),
      [
        SagaAbilities.Cell.KAMEHAMEHA,
        SagaAbilities.Cell.MASENKO,
        SagaAbilities.Cell.SPECIAL_BEAM_CANNON,
      ],
    )],

    // future androids saga
    ["Future Android 17", new SagaUnit(FourCC("H05C"), 30, 2800, 350, 2000, new Vector2D(11000, 29500),
      [
        SagaAbilities.Android17DBS.POWER_BLITZ,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
        SagaAbilities.Android17DBS.SUPER_ELECTRIC_STRIKE,
      ],
    )],
    ["Future Android 18", new SagaUnit(FourCC("H05D"), 30, 2000, 350, 2700, new Vector2D(11400, 29500),
      [
        SagaAbilities.Android17DBS.POWER_BLITZ,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
      ],
    )],

    // future cell saga
    ["Future Imperfect Cell", new SagaUnit(FourCC("H00E"), 50, 3300, 400, 3300, new Vector2D(17000, 26000),
      [
        SagaAbilities.Cell.KAMEHAMEHA,
        SagaAbilities.Cell.SPECIAL_BEAM_CANNON,
      ],
    )],

    // broly - lss
    ["Broly DBZ 1", new SagaUnit(FourCC("H00M"), 50, 3000, 400, 2500, new Vector2D(8700, -5400),
      [
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Broly.POWER_LEVEL_RISING,
        SagaAbilities.Broly.PLANET_CRUSHER,
      ],
    )],

    // broly - second coming
    ["Broly DBZ 2", new SagaUnit(FourCC("H091"), 65, 3500, 400, 4000, new Vector2D(5000, 18000),
      [
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Broly.POWER_LEVEL_RISING,
        SagaAbilities.Broly.PLANET_CRUSHER,
        SagaAbilities.Broly.GIGANTIC_ROAR,
      ],
    )],
    
    // bio billy
    ["Broly Bio", new SagaUnit(FourCC("U008"), 100, 9000, 400, 9000, new Vector2D(12670, -6264),
      [
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Broly.POWER_LEVEL_RISING,
        SagaAbilities.Broly.GIGANTIC_ROAR,
      ],
      [
        ItemConstants.SagaDrops.BIO_LAB_RESEARCH,
      ]
    )],
    
    // dbs: broly
    ["Broly DBS", new SagaUnit(FourCC("H00M"), 190, 1, 1, 1, new Vector2D(5000, 18000),
      [
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Broly.POWER_LEVEL_RISING,
        SagaAbilities.Broly.PLANET_CRUSHER,
        SagaAbilities.Broly.GIGANTIC_ROAR,
        SagaAbilities.Broly.GIGANTIC_OMEGASTORM,
      ],
    )],

    // bojack unbound
    ["Bojack", new SagaUnit(FourCC("U00L"), 70, 6500, 400, 5500, new Vector2D(-4500, 2500),
      [
        SagaAbilities.Saga.GENERIC_BEAM, 
        SagaAbilities.Broly.ENERGY_PUNCH, 
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],
    ["Bido", new SagaUnit(FourCC("U00M"), 9, 2500, 400, 2500, new Vector2D(-4600, 2500))],
    ["Gokua", new SagaUnit(FourCC("U00N"), 20, 4000, 400, 3500, new Vector2D(-4700, 2100),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
      ],
    )],
    ["Pujin", new SagaUnit(FourCC("U00O"), 9, 3500, 400, 3000, new Vector2D(-4200, 2100))],
    ["Zangya", new SagaUnit(FourCC("U00P"), 10, 4500, 400, 3500, new Vector2D(-4600, 3000))],

    // other world tournament
    // caterpy, olibu, pikkon, arqua
    ["Olibu", new SagaUnit(FourCC("U01M"), 50, 3200, 400, 3000, new Vector2D(21300, 18500),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],
    ["Pikkon", new SagaUnit(FourCC("U01N"), 70, 4500, 400, 6000, new Vector2D(17300, 21500),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],

    // 25th budokai
    // shin supreme kai
    // spopovich
    // yamu

    // babidi ship saga
    // pui pui
    ["Pui Pui", new SagaUnit(FourCC("O004"), 9, 1000, 400, 1000, new Vector2D(16500, 12000))],
    ["Yakon", new SagaUnit(FourCC("O009"), 30, 3600, 400, 3300, new Vector2D(16500, 12000))],
    ["Dabura", new SagaUnit(FourCC("O000"), 80, 7500, 400, 7500, new Vector2D(16500, 12000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB,
        SagaAbilities.Dabura.EVIL_SPEAR,
      ],
    )],

    // buu saga
    // babidi
    ["Babidi", new SagaUnit(FourCC("O001"), 50, 4000, 400, 12000, new Vector2D(16500, 12000),
      [
        SagaAbilities.Babidi.HARETSU,
        SagaAbilities.Babidi.BABIDI_BARRIER
      ],
    )],
    ["Fat Buu", new SagaUnit(FourCC("O005"), 100, 12000, 400, 12000, new Vector2D(16500, 12000),
      [
        SagaAbilities.Buu.INNOCENCE_BREATH,
        SagaAbilities.Buu.ANGRY_EXPLOSION,
      ],
    )],

    // future babidi saga
    ["Future Pui Pui", new SagaUnit(FourCC("O004"), 7, 1000, 400, 1000, new Vector2D(16800, 26000))],
    ["Future Yakon", new SagaUnit(FourCC("O009"), 20, 3600, 400, 3300, new Vector2D(16900, 26000))],
    // dabura and babidi
    ["Future Dabura", new SagaUnit(FourCC("O000"), 60, 7500, 400, 7500, new Vector2D(17000, 26000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB,
        SagaAbilities.Dabura.EVIL_SPEAR,
      ],
      [
        ItemConstants.SagaDrops.DABURA_SWORD,
      ],
    )],
    ["Future Babidi", new SagaUnit(FourCC("O001"), 40, 4000, 400, 12000, new Vector2D(17100, 25500),
      [
        SagaAbilities.Babidi.HARETSU,
        SagaAbilities.Babidi.BABIDI_BARRIER
      ],
    )],

    // fusion reborn
    ["Janemba", new SagaUnit(FourCC("H061"), 80, 11000, 400, 11000, new Vector2D(19000, 16000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.Broly.ENERGY_PUNCH,
      ],
    )],
    ["Super Janemba", new SagaUnit(FourCC("H062"), 120, 15000, 400, 15000, new Vector2D(19000, 16000),
      [
        SagaAbilities.Broly.ENERGY_PUNCH,
        SagaAbilities.SuperJanemba.RAKSHASA_CLAW,
        SagaAbilities.SuperJanemba.BUNKAI_TELEPORT,
        SagaAbilities.SuperJanemba.HELLS_GATE,
        SagaAbilities.SuperJanemba.LIGHTNING_SHOWER_RAIN,
      ],
    )],

    // buu saga
    ["Super Buu", new SagaUnit(FourCC("O006"), 100, 14000, 400, 13000, new Vector2D(21000, -4700),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Buu.VANISHING_BALL,
        SagaAbilities.Buu.ANGRY_EXPLOSION,
        SagaAbilities.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM,
      ],
      [
        ItemConstants.SagaDrops.BEE_DOG_ITEM,
      ]
    )],
    ["Kid Buu", new SagaUnit(FourCC("O00C"), 120, 16000, 400, 15000, new Vector2D(21000, -4700),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Buu.VANISHING_BALL,
        SagaAbilities.Buu.ANGRY_EXPLOSION,
        SagaAbilities.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM,
      ],
    )],

    // wrath of the dragon
    ["Hirudegarn Lower", new SagaUnit(FourCC("U009"), 40, 4000, 400, 4000, new Vector2D(-6700, -6700))],
    ["Hirudegarn Upper", new SagaUnit(FourCC("U00A"), 40, 4000, 400, 4000, new Vector2D(17333, -7358))],
    ["Hirudegarn", new SagaUnit(FourCC("U00B"), 90, 12000, 400, 12000, new Vector2D(25000, -2700),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],
    ["Mature Hirudegarn", new SagaUnit(FourCC("U00C"), 150, 17000, 400, 15000, new Vector2D(25000, -2700),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.BRAVE_SWORD,
      ]
    )],

    // gt + super split
    // uub tournament ?
    // start gt stuff

    // bebi saga
    // general rilldo
    ["Super Bebi", new SagaUnit(FourCC("U004"), 90, 18000, 400, 16000, new Vector2D(-6000, -5500),
      [
        SagaAbilities.Vegeta.GALICK_GUN,
        SagaAbilities.Vegeta.ENERGY_BLAST_VOLLEY,
        SagaAbilities.Vegeta.BIG_BANG_ATTACK,
      ],
    )],
    ["Bebi Golden Oozaru", new SagaUnit(FourCC("H01L"), 160, 21000, 400, 19000, new Vector2D(-6000, -5500),
      [
        SagaAbilities.Vegeta.GALICK_GUN,
        SagaAbilities.Vegeta.ENERGY_BLAST_VOLLEY,
        SagaAbilities.Vegeta.FINAL_FLASH,
        SagaAbilities.Vegeta.BIG_BANG_ATTACK,
      ],
      [
        ItemConstants.SagaDrops.BATTLE_ARMOR_5,
      ]
    )],

    // super 17 saga
    // hell fighter 17
    ["Super 17", new SagaUnit(FourCC("H05B"), 170, 17000, 400, 17000, new Vector2D(15000, 17000),
      [
        SagaAbilities.Saga.POWER_BLITZ_BARRAGE_CUSTOM,
        SagaAbilities.Android17DBS.ANDROID_BARRIER,
      ],
    )],
    // pui pui, yakon, 19, saibamen, appule, rilldo
    // cooler, king cold,
    // raditz, nappa, 
    // dodoria, recoome, guldo, jeice, 
    // babidi
    // general blue
    // tanks?

    // shadow dragon saga
    ["Haze Shenron", new SagaUnit(FourCC("U00S"), 9, 3500, 400, 3500, new Vector2D(4400, 9500))],
    ["Rage Shenron", new SagaUnit(FourCC("U00V"), 50, 15000, 400, 15000, new Vector2D(-2000, -6000))],
    ["Oceanus Shenron", new SagaUnit(FourCC("U00W"), 70, 15000, 400, 15000, new Vector2D(-5000, 3500))],
    ["Naturon Shenron", new SagaUnit(FourCC("U00X"), 70, 15000, 400, 15000, new Vector2D(-3500, -5500), 
      [
        SagaAbilities.Saga.GENERIC_BEAM,
      ],
    )],

    ["Nuova Shenron", new SagaUnit(FourCC("U00U"), 100, 17000, 400, 17000, new Vector2D(29000, -4300),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.NuovaShenron.BURNING_ATTACK,
      ],
    )],
    ["Eis Shenron", new SagaUnit(FourCC("H09B"), 100, 17000, 400, 17000, new Vector2D(29000, -4800),
      [
        SagaAbilities.EisShenron.FROST_CLAWS,
        SagaAbilities.EisShenron.ICE_SLASH,
        SagaAbilities.EisShenron.ICE_CANNON,
      ],
    )],

    ["Syn Shenron", new SagaUnit(FourCC("H09F"), 140, 21000, 400, 21000, new Vector2D(3000, 7000),
      [
        SagaAbilities.OmegaShenron.DRAGON_FLASH_BULLET,
        SagaAbilities.OmegaShenron.NEGATIVE_ENERGY_BALL,
        SagaAbilities.OmegaShenron.DRAGONIC_RAGE,
      ],
    )],
    ["Omega Shenron", new SagaUnit(FourCC("H09G"), 180, 23000, 400, 23000, new Vector2D(3000, 7000),
      [
        SagaAbilities.OmegaShenron.DRAGON_FLASH_BULLET,
        SagaAbilities.OmegaShenron.NEGATIVE_ENERGY_BALL,
        SagaAbilities.OmegaShenron.DRAGONIC_RAGE,
        SagaAbilities.OmegaShenron.ICE_CANNON,
        SagaAbilities.OmegaShenron.DRAGON_THUNDER,
        SagaAbilities.Saga.NOVA_STAR_OMEGA_CUSTOM,
      ],
      [
        ItemConstants.CLEANSED_DRAGONBALL,
      ]
    )],
    // gt end?

    // battle of gods movie/super
    // beerus
    ["Beerus", new SagaUnit(FourCC("U01F"), 200, 20000, 400, 20000, new Vector2D(5000, 3300),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Cooler.SUPERNOVA_GOLDEN,
        SagaAbilities.Cooler.NOVA_CHARIOT,
      ],
      [
        ItemConstants.SagaDrops.BEERUS_PUDDING,
      ]
    )],
    // possibly spawn in pilaf

    // possible whis training saga?
    // whis E01I
    ["Whis", new SagaUnit(FourCC("E01I"), 150, 17000, 400, 17000, new Vector2D(5000, 3300),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Whis.ULTRA_INSTINCT,
      ],
      [
        ItemConstants.SagaDrops.WHIS_STAFF,
      ],
    )],

    // resurrection f
    // ginyu again? / tagoma
    ["Resurrection Frieza 1", new SagaUnit(FourCC("U011"), 60, 7000, 400, 10000, new Vector2D(-3000, 10000),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
      ],
    )],
    ["Resurrection Frieza Final", new SagaUnit(FourCC("U014"), 100, 16000, 400, 16000, new Vector2D(-3000, 10000),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Cooler.SUPERNOVA_COOLER,
        SagaAbilities.Cooler.NOVA_CHARIOT,
      ],
    )],
    ["Resurrection Frieza Golden", new SagaUnit(FourCC("U01G"), 150, 20000, 400, 20000, new Vector2D(-3000, 10000),
      [
        SagaAbilities.Frieza.DEATH_BEAM,
        SagaAbilities.Cooler.SUPERNOVA_GOLDEN,
        SagaAbilities.Cooler.NOVA_CHARIOT,
      ],
      [
        ItemConstants.SagaDrops.SORBET_RING,
      ]
    )],
    // sorbet

    // universe 6
    // frost
    // botamo
    // auto magetta
    // cabba
    // hit
    // monaka?
    ["Hit Universe 6", new SagaUnit(FourCC("E00K"), 160, 21000, 400, 21000, new Vector2D(16000, -6000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB,
        SagaAbilities.Cooler.NOVA_CHARIOT,
        SagaAbilities.Broly.ENERGY_PUNCH,
      ],
    )],

    // copy-vegeta saga
    // purple vege
    ["Copy-Vegeta", new SagaUnit(FourCC("E003"), 110, 17000, 400, 17000, new Vector2D(16000, 30000))],

    // future trunks saga super
    // goku black
    ["Goku Black 1", new SagaUnit(FourCC("E019"), 90, 15000, 400, 15000, new Vector2D(-6700, -6700),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
    )],
    // gb + zamasu
    ["Goku Black 2", new SagaUnit(FourCC("E019"), 130, 21000, 400, 21000, new Vector2D(12000, 28000),
      [
        SagaAbilities.GokuBlack.GOD_KAMEHAMEHA,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.SORROWFUL_SCYTHE,
      ]
    )],
    ["Zamasu", new SagaUnit(FourCC("E012"), 110, 14000, 400, 17000, new Vector2D(12000, 28000),
      [
        SagaAbilities.Saga.GENERIC_BEAM,
        SagaAbilities.Saga.GENERIC_BOMB
      ],
      [
        ItemConstants.SagaDrops.TIME_RING,
      ]
    )],
    
    // fused zamasu saga
    // fused
    // ["Zamasu", new SagaUnit(FourCC("E012"), 38, 5000, 400, 4500, new Vector2D(-5000, -5000))],
    // purpley form

    // universe survival
    // training
    // tournament of power
  ],
);