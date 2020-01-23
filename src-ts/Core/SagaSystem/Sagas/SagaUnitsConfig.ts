import { SagaUnit } from "./SagaUnit";
import { Vector2D } from "Common/Vector2D";
import { AbilityNames } from "CustomAbility/AbilityNames";

export const sagaUnitsConfig = new Map<string, SagaUnit>(
  [
    // dead zone
    ["Garlic Jr", new SagaUnit(FourCC("U00D"), 5, 30, 25, 20, new Vector2D(6000, 22500))],
    ["Ginger", new SagaUnit(FourCC("O002"), 1, 5, 5, 5, new Vector2D(5860, 21638))],
    ["Nicky", new SagaUnit(FourCC("O003"), 1, 5, 5, 5, new Vector2D(5500, 22000))],
    ["Sansho", new SagaUnit(FourCC("N00C"), 1, 10, 5, 5, new Vector2D(6300, 22000))],

    // raditz
    // ["Raditz", new SagaUnit(FourCC("U01D"), 5, 45, 45, 60, new Vector2D(17333, -7358))],
    // ["Raditz", new SagaUnit(FourCC("U01D"), 10, 90, 60, 90, new Vector2D(8000, 5000))],
    // ["Raditz", new SagaUnit(FourCC("U01D"), 10, 90, 60, 90, new Vector2D(8800, 1400))],
    ["Raditz", new SagaUnit(FourCC("H08U"), 10, 90, 60, 90, new Vector2D(8800, 1400), 
      [AbilityNames.Raditz.DOUBLE_SUNDAY], 
      [AbilityNames.Raditz.SATURDAY_CRASH]
    )],

    // saiyan saga
    // ["Nappa", new SagaUnit(FourCC("U019"), 8, 120, 80, 80, new Vector2D(-3300, -5500))],
    // ["Vegeta", new SagaUnit(FourCC("E003"), 15, 200, 200, 300, new Vector2D(-3300, -5500))],
    // ["Nappa", new SagaUnit(FourCC("U019"), 12, 120, 80, 80, new Vector2D(8800, 1400))],
    ["Nappa", new SagaUnit(FourCC("H08W"), 12, 120, 80, 80, new Vector2D(8800, 1400), 
      [AbilityNames.Nappa.BLAZING_STORM],
      [AbilityNames.Nappa.GIANT_STORM, AbilityNames.Nappa.BREAK_CANNON]
    )],
    ["Vegeta", new SagaUnit(FourCC("E003"), 16, 200, 200, 300, new Vector2D(8800, 1400), 
      [AbilityNames.Vegeta.GALICK_GUN, AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY],
      [AbilityNames.Vegeta.FINAL_FLASH]
    )],
    
    // wheelo
    ["Kishime", new SagaUnit(FourCC("O00P"), 6, 75, 75, 75, new Vector2D(800, 18000))],
    ["Misokatsun", new SagaUnit(FourCC("O00O"), 5, 50, 80, 50, new Vector2D(400, 18200))],
    ["Ebifurya", new SagaUnit(FourCC("O00N"), 11, 150, 80, 75, new Vector2D(-600, 17500))],
    ["Dr. Kochin", new SagaUnit(FourCC("O00Q"), 1, 2, 1, 1, new Vector2D(-600, 17500))],
    ["Wheelo", new SagaUnit(FourCC("U006"), 17, 320, 150, 450, new Vector2D(-300, 18000))],

    // turles
    ["Turles", new SagaUnit(FourCC("H01H"), 28, 500, 250, 500, new Vector2D(-3000, 11000))],

    // slug
    ["Lord Slug", new SagaUnit(FourCC("O00L"), 30, 600, 300, 500, new Vector2D(8700, -5400),
      [AbilityNames.Piccolo.SLAPPY_HAND], 
      [AbilityNames.Saga.GENERIC_BOMB]
    )],

    // namek saga
    ["Dodoria", new SagaUnit(FourCC("U015"), 12, 350, 150, 200, new Vector2D(8800, 1400),
      [AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY],
      [AbilityNames.Nappa.BREAK_CANNON]
    )],
    ["Zarbon", new SagaUnit(FourCC("U016"), 17, 500, 300, 250, new Vector2D(8800, 1400),
      [AbilityNames.Saga.GENERIC_BEAM],
      [AbilityNames.Saga.GENERIC_BOMB]
    )],
    ["Zarbon 2", new SagaUnit(FourCC("U01B"), 25, 700, 300, 500, new Vector2D(8800, 1400),
      [AbilityNames.Saga.GENERIC_BEAM, AbilityNames.Broly.ENERGY_PUNCH],
      [AbilityNames.Saga.GENERIC_BOMB]
    )],

    // ginyu force
    ["Guldo", new SagaUnit(FourCC("U00Y"), 12, 200, 200, 650, new Vector2D(8800, 1400))],
    ["Recoome", new SagaUnit(FourCC("U005"), 22, 900, 200, 300, new Vector2D(8800, 1400),
      [AbilityNames.Broly.GIGANTIC_ROAR],
      [AbilityNames.Nappa.BREAK_CANNON]
    )],
    ["Burter", new SagaUnit(FourCC("U00Z"), 16, 400, 650, 350, new Vector2D(8800, 1400))],
    ["Jeice", new SagaUnit(FourCC("U010"), 18, 700, 250, 600, new Vector2D(8800, 1400))],
    ["Ginyu", new SagaUnit(FourCC("U000"), 22, 800, 250, 800, new Vector2D(8800, 1400))],

    // frieza
    ["Frieza 1", new SagaUnit(FourCC("U011"), 10, 1000, 200, 900, new Vector2D(8800, 1400),
      [AbilityNames.Frieza.DEATH_BEAM],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Frieza 2", new SagaUnit(FourCC("U012"), 20, 1200, 300, 800, new Vector2D(8800, 1400),
      [AbilityNames.Frieza.DEATH_BEAM],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Frieza 3", new SagaUnit(FourCC("U013"), 30, 1300, 350, 850, new Vector2D(8800, 1400),
      [AbilityNames.Frieza.DEATH_BEAM],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Frieza 4", new SagaUnit(FourCC("U014"), 40, 1500, 400, 1400, new Vector2D(8800, 1400),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.NOVA_CHARIOT],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Frieza 5", new SagaUnit(FourCC("U018"), 60, 2000, 500, 1800, new Vector2D(8800, 1400),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.NOVA_CHARIOT],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],

    // garlic jr
    ["Garlic Jr 2", new SagaUnit(FourCC("U00D"), 22, 800, 350, 850, new Vector2D(6000, 22500))],
    ["Salt", new SagaUnit(FourCC("U00E"), 14, 500, 300, 600, new Vector2D(6292, 22000))],
    ["Vinegar", new SagaUnit(FourCC("U00F"), 14, 500, 300, 600, new Vector2D(5861, 21285))],
    ["Mustard", new SagaUnit(FourCC("U00G"), 14, 600, 300, 500, new Vector2D(5860, 21638))],
    ["Spice", new SagaUnit(FourCC("U00H"), 14, 600, 300, 500, new Vector2D(5500, 22000))],

    // cooler's revenge
    ["Cooler", new SagaUnit(FourCC("H042"), 40, 1500, 400, 1600, new Vector2D(4500, 9300),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.NOVA_CHARIOT],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],

    // return of cooler
    ["Metal Cooler 1", new SagaUnit(FourCC("H01A"), 17, 1800, 400, 2000, new Vector2D(-6000, 17200),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.GETI_STAR_REPAIR],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Metal Cooler 2", new SagaUnit(FourCC("H01A"), 17, 1800, 400, 2000, new Vector2D(-6000, 17200),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.GETI_STAR_REPAIR],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Metal Cooler 3", new SagaUnit(FourCC("H01A"), 17, 1800, 400, 2000, new Vector2D(-6000, 17200),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.GETI_STAR_REPAIR],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],

    // trunks saga
    ["Mecha Frieza", new SagaUnit(FourCC("U00J"), 35, 2500, 410, 1000, new Vector2D(18000, 2000),
      [AbilityNames.Frieza.DEATH_BEAM],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["King Cold", new SagaUnit(FourCC("U00K"), 35, 2500, 410, 2000, new Vector2D(18000, 2000),
      [AbilityNames.Frieza.DEATH_BEAM],
    )],

    // androids 19/20 saga
    ["Android 19", new SagaUnit(FourCC("O00A"), 35, 2500, 350, 2500, new Vector2D(-5000, -5000))],
    ["Android 20", new SagaUnit(FourCC("H04T"), 35, 2500, 350, 3000, new Vector2D(-5000, -5000))],

    // androids 16/17/18 saga
    ["Android 16", new SagaUnit(FourCC("H08O"), 42, 4200, 350, 3300, new Vector2D(14000, 7500),
      [AbilityNames.Android17DBS.POWER_BLITZ],
      [AbilityNames.Android17DBS.ANDROID_BARRIER]
    )],
    ["Android 17", new SagaUnit(FourCC("H05C"), 37, 3500, 350, 3000, new Vector2D(14000, 7500),
      [AbilityNames.Android17DBS.POWER_BLITZ],
      [AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE, AbilityNames.Android17DBS.ANDROID_BARRIER]
    )],
    ["Android 18", new SagaUnit(FourCC("H05D"), 37, 3000, 350, 3500, new Vector2D(14000, 7500),
      [AbilityNames.Android17DBS.POWER_BLITZ],
      [AbilityNames.Android17DBS.ANDROID_BARRIER]
    )],

    // super android 13
    ["Android 13", new SagaUnit(FourCC("H01V"), 35, 4000, 350, 4000, new Vector2D(-5000, -5000),
      [AbilityNames.Androids13.ENERGY_BEAM],
      [AbilityNames.Androids13.SS_DEADLY_BOMBER]
    )],
    ["Android 14", new SagaUnit(FourCC("H01S"), 33, 3000, 350, 2000, new Vector2D(-5000, -5000),
      [AbilityNames.Androids13.ENERGY_BEAM],
      [AbilityNames.Androids13.NUKE]
    )],
    ["Android 15", new SagaUnit(FourCC("H01T"), 33, 2000, 350, 3000, new Vector2D(-5000, -5000),
      [AbilityNames.Androids13.ENERGY_BEAM],
      [AbilityNames.Androids13.NUKE]
    )],
    ["Super Android 13", new SagaUnit(FourCC("H01U"), 45, 4500, 400, 4000, new Vector2D(-5000, -5000),
      [AbilityNames.Androids13.SS_DEADLY_BOMBER, AbilityNames.Androids13.SS_DEADLY_HAMMER],
      [AbilityNames.Androids13.ANDROID_BARRIER]
    )],

    // cell saga
    ["Imperfect Cell", new SagaUnit(FourCC("H00E"), 30, 3500, 400, 3500, new Vector2D(-6000, 14500),
      [AbilityNames.Cell.KAMEHAMEHA],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],
    ["Semiperfect Cell", new SagaUnit(FourCC("H00F"), 50, 5000, 400, 5000, new Vector2D(-5000, 4500),
      [AbilityNames.Cell.KAMEHAMEHA, AbilityNames.Cell.MASENKO],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],
    ["Perfect Cell 1", new SagaUnit(FourCC("H00G"), 100, 6000, 400, 7000, new Vector2D(-5000, 4500),
      [AbilityNames.Cell.KAMEHAMEHA, AbilityNames.Cell.MASENKO],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],
    
    // cell games saga
    ["Perfect Cell Games", new SagaUnit(FourCC("H00G"), 60, 6000, 400, 6000, new Vector2D(19300, 20500),
      [AbilityNames.Cell.KAMEHAMEHA, AbilityNames.Cell.MASENKO],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],
    ["Super Perfect Cell", new SagaUnit(FourCC("H00G"), 60, 6500, 500, 6500, new Vector2D(19300, 20500),
      [AbilityNames.Cell.KAMEHAMEHA, AbilityNames.Cell.MASENKO],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],

    // future androids saga
    ["Future Android 17", new SagaUnit(FourCC("H05C"), 35, 2800, 350, 2000, new Vector2D(17500, -6800),
      [AbilityNames.Android17DBS.POWER_BLITZ],
      [AbilityNames.Android17DBS.ANDROID_BARRIER]
    )],
    ["Future Android 18", new SagaUnit(FourCC("H05D"), 35, 2000, 350, 2700, new Vector2D(17500, -6800),
      [AbilityNames.Android17DBS.POWER_BLITZ],
      [AbilityNames.Android17DBS.ANDROID_BARRIER]
    )],

    // future cell saga
    ["Future Imperfect Cell", new SagaUnit(FourCC("H00E"), 45, 3300, 400, 3300, new Vector2D(-6000, 14500),
      [AbilityNames.Cell.KAMEHAMEHA],
      [AbilityNames.Cell.SPECIAL_BEAM_CANNON]
    )],

    // broly - lss
    ["Broly DBZ 1", new SagaUnit(FourCC("H00M"), 45, 3000, 400, 2500, new Vector2D(8500, 4000),
      [AbilityNames.Broly.ENERGY_PUNCH, AbilityNames.Broly.POWER_LEVEL_RISING],
      [AbilityNames.Broly.PLANET_CRUSHER]
    )],

    // bojack unbound
    ["Bojack", new SagaUnit(FourCC("U00L"), 50, 6500, 400, 5500, new Vector2D(-4500, 2500))],
    ["Bido", new SagaUnit(FourCC("U00M"), 10, 2500, 400, 2500, new Vector2D(-4600, 2500))],
    ["Gokua", new SagaUnit(FourCC("U00N"), 15, 4000, 400, 3500, new Vector2D(-4700, 2100))],
    ["Pujin", new SagaUnit(FourCC("U00O"), 15, 3500, 400, 3000, new Vector2D(-4200, 2100))],
    ["Zangya", new SagaUnit(FourCC("U00P"), 20, 4500, 400, 3500, new Vector2D(-4600, 3000))],

    // broly - second coming
    ["Broly DBZ 2", new SagaUnit(FourCC("H00M"), 60, 3500, 400, 4000, new Vector2D(5000, 18000),
      [AbilityNames.Broly.ENERGY_PUNCH, AbilityNames.Broly.POWER_LEVEL_RISING],
      [AbilityNames.Broly.PLANET_CRUSHER]
    )],

    // other world tournament
    // caterpy, olibu, pikkon, arqua
    ["Olibu", new SagaUnit(FourCC("U01M"), 45, 3200, 400, 3000, new Vector2D(21300, 18500))],
    ["Pikkon", new SagaUnit(FourCC("U01N"), 45, 4500, 400, 6000, new Vector2D(17300, 21500))],

    // 25th budokai
    // shin supreme kai
    // spopovich
    // yamu
    
    // bio billy
    ["Broly Bio", new SagaUnit(FourCC("U008"), 90, 9000, 400, 9000, new Vector2D(12670, -6264),
      [AbilityNames.Broly.ENERGY_PUNCH, AbilityNames.Broly.POWER_LEVEL_RISING],
      [AbilityNames.Saibaman.ACID]
    )],

    // babidi ship saga
    // pui pui
    ["Pui Pui", new SagaUnit(FourCC("O004"), 10, 1000, 400, 1000, new Vector2D(16500, 12000))],
    ["Yakon", new SagaUnit(FourCC("O009"), 30, 3600, 400, 3300, new Vector2D(16500, 12000))],
    ["Dabura", new SagaUnit(FourCC("O000"), 60, 7500, 400, 7500, new Vector2D(16500, 12000))],

    // buu saga
    // babidi
    ["Babidi", new SagaUnit(FourCC("O001"), 30, 4000, 400, 12000, new Vector2D(16500, 12000),
      [AbilityNames.Babidi.HARETSU],
      [AbilityNames.Babidi.BABIDI_BARRIER]
    )],
    ["Fat Buu", new SagaUnit(FourCC("O005"), 80, 12000, 400, 12000, new Vector2D(16500, 12000),
      [AbilityNames.Buu.FLESH_ATTACK],
      [AbilityNames.Buu.INNOCENCE_BREATH]
    )],

    // fusion reborn
    ["Janemba", new SagaUnit(FourCC("H061"), 50, 11000, 400, 11000, new Vector2D(8500, 4000))],
    ["Super Janemba", new SagaUnit(FourCC("U007"), 90, 15000, 400, 15000, new Vector2D(8500, 4000))],

    // buu saga
    ["Super Buu", new SagaUnit(FourCC("O006"), 60, 14000, 400, 13000, new Vector2D(-3000, 10000),
      [AbilityNames.Buu.FLESH_ATTACK],
      [AbilityNames.Buu.VANISHING_BALL, AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK]
    )],
    ["Kid Buu", new SagaUnit(FourCC("O00C"), 90, 16000, 400, 15000, new Vector2D(5000, 9300),
      [AbilityNames.Buu.FLESH_ATTACK],
      [AbilityNames.Buu.VANISHING_BALL, AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK]
    )],

    // wrath of the dragon
    ["Hirudegarn Lower", new SagaUnit(FourCC("U009"), 40, 4000, 400, 4000, new Vector2D(-6700, -6700))],
    ["Hirudegarn Upper", new SagaUnit(FourCC("U00A"), 40, 4000, 400, 4000, new Vector2D(17333, -7358))],
    ["Hirudegarn", new SagaUnit(FourCC("U00B"), 70, 12000, 400, 12000, new Vector2D(-6700, -6700))],
    ["Mature Hirudegarn", new SagaUnit(FourCC("U00C"), 150, 17000, 400, 15000, new Vector2D(-6700, -6700))],

    // gt + super split
    // uub tournament ?
    // start gt stuff

    // bebi saga
    // general rilldo
    ["Super Bebi", new SagaUnit(FourCC("U004"), 100, 18000, 400, 16000, new Vector2D(-6000, -5500),
      [AbilityNames.Vegeta.GALICK_GUN, AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY],
      [AbilityNames.Vegeta.BIG_BANG_ATTACK, AbilityNames.Vegeta.FINAL_FLASH]
    )],
    ["Bebi Golden Oozaru", new SagaUnit(FourCC("H01L"), 160, 21000, 400, 19000, new Vector2D(-6000, -5500),
      [AbilityNames.Vegeta.GALICK_GUN, AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY],
      [AbilityNames.Vegeta.BIG_BANG_ATTACK, AbilityNames.Vegeta.FINAL_FLASH]
    )],

    // super 17 saga
    // hell fighter 17
    ["Super 17", new SagaUnit(FourCC("H05B"), 170, 17000, 400, 17000, new Vector2D(15000, 17000),
      [AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE],
      [AbilityNames.Android17DBS.ANDROID_BARRIER],
    )],
    // pui pui, yakon, 19, saibamen, appule, rilldo
    // cooler, king cold,
    // raditz, nappa, 
    // dodoria, recoome, guldo, jeice, 
    // babidi
    // general blue
    // tanks?

    // shadow dragon saga
    ["Haze Shenron", new SagaUnit(FourCC("U00S"), 50, 3500, 400, 3500, new Vector2D(4400, 9500))],
    ["Rage Shenron", new SagaUnit(FourCC("U00V"), 85, 15000, 400, 15000, new Vector2D(-2000, -6000))],
    ["Oceanus Shenron", new SagaUnit(FourCC("U00W"), 85, 15000, 400, 15000, new Vector2D(-5000, 3500))],
    ["Naturon Shenron", new SagaUnit(FourCC("U00X"), 85, 15000, 400, 15000, new Vector2D(-3500, -5500))],

    ["Nuova Shenron", new SagaUnit(FourCC("U00U"), 95, 17000, 400, 17000, new Vector2D(18500, -6700))],
    ["Eis Shenron", new SagaUnit(FourCC("U00T"), 95, 17000, 400, 17000, new Vector2D(18000, -6700))],

    ["Syn Shenron", new SagaUnit(FourCC("U00Q"), 100, 21000, 400, 21000, new Vector2D(3000, 7000))],
    ["Omega Shenron", new SagaUnit(FourCC("U00R"), 170, 23000, 400, 23000, new Vector2D(3000, 7000))],
    // gt end?

    // battle of gods movie/super
    // beerus
    ["Beerus", new SagaUnit(FourCC("U01F"), 200, 20000, 400, 20000, new Vector2D(5000, 3300))],
    // possibly spawn in pilaf

    // possible whis training saga?
    // whis E01I
    ["Whis", new SagaUnit(FourCC("E01I"), 150, 17000, 400, 17000, new Vector2D(5000, 3300))],

    // resurrection f
    // ginyu again? / tagoma
    ["Resurrection Frieza 1", new SagaUnit(FourCC("U011"), 55, 7000, 400, 10000, new Vector2D(-3000, 10000),
      [AbilityNames.Frieza.DEATH_BEAM],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Resurrection Frieza Final", new SagaUnit(FourCC("U014"), 90, 16000, 400, 16000, new Vector2D(-3000, 10000),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.NOVA_CHARIOT],
      [AbilityNames.Cooler.SUPERNOVA_COOLER]
    )],
    ["Resurrection Frieza Golden", new SagaUnit(FourCC("U01G"), 120, 20000, 400, 20000, new Vector2D(-3000, 10000),
      [AbilityNames.Frieza.DEATH_BEAM, AbilityNames.Cooler.NOVA_CHARIOT],
      [AbilityNames.Cooler.SUPERNOVA_GOLDEN]
    )],
    // sorbet

    // universe 6
    // frost
    // botamo
    // auto magetta
    // cabba
    // hit
    // monaka?
    ["Hit Universe 6", new SagaUnit(FourCC("E00K"), 130, 21000, 400, 21000, new Vector2D(16000, -6000))],

    // copy-vegeta saga
    // purple vege
    ["Copy-Vegeta", new SagaUnit(FourCC("E003"), 110, 17000, 400, 17000, new Vector2D(16000, 30000))],

    // future trunks saga super
    // goku black
    ["Goku Black 1", new SagaUnit(FourCC("E019"), 85, 15000, 400, 15000, new Vector2D(-6700, -6700),
      [AbilityNames.Goku.KAMEHAMEHA],
      [AbilityNames.Goku.GOD_KAMEHAMEHA]
    )],
    // gb + zamasu
    ["Goku Black 2", new SagaUnit(FourCC("E019"), 120, 21000, 400, 21000, new Vector2D(18000, 15000),
      [AbilityNames.Goku.KAMEHAMEHA],
      [AbilityNames.Goku.GOD_KAMEHAMEHA]
    )],
    ["Zamasu", new SagaUnit(FourCC("E012"), 60, 14000, 400, 17000, new Vector2D(18000, 15000))],
    
    // fused zamasu saga
    // fused
    // ["Zamasu", new SagaUnit(FourCC("E012"), 38, 5000, 400, 4500, new Vector2D(-5000, -5000))],
    // purpley form

    // universe survival
    // training
    // tournament of power
  ],
);