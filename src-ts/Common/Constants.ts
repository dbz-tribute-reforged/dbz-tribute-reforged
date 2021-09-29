import { Vector2D } from "./Vector2D";
import { CustomPlayer } from "CustomPlayer/CustomPlayer";

export module Globals {
  export let isFBSimTest: boolean = false;
  export let isFreemode: boolean = false;
  export let isNightmare: boolean = false;
  
  export const customPlayers: CustomPlayer[] = [];
  export let hostPlayer: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);
  export let canUseCustomUi = true;

  // to save number of events and triggers
  export const genericSpellTrigger = CreateTrigger();
  export const genericSpellHashtable = InitHashtable();

  // reuseable unit group
  export const tmpUnitGroup = CreateGroup();
}

export module Constants {
  export const maxSubAbilities = 4;
  export const maxActivePlayers = 10;
  export const maxPlayers = 24;
  export const dummyBeamUnitId = FourCC("hpea");
  export const dummyCasterId = FourCC("h054");
  export const korinFlag = FourCC("h09A");

  export const shortDisplayTextDuration = 5;
  export const mediumDisplayTextDuration = 10;
  export const longDisplayTextDuration = 15;
  export let jokeProbability = 0.02;
  export const sagaDisplayTextDuration = mediumDisplayTextDuration;
  export const sagaDisplayTextDelay = shortDisplayTextDuration;
  export const creepUpgradeDeathDelay = 10;
  export const creepRespawnReviveDelay = 55;
  export const creepUpgradeBuff: number = FourCC("BTLF");
  export const creepChainErrorMargin: number = 4;
  export const creepHeavenHellHeroRespawnDelay: number = 15;
  export const sagaPlayerId = PLAYER_NEUTRAL_AGGRESSIVE;
  export const sagaPlayer: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);
  export const heavenHellCreepPlayerId: number = maxPlayers - 1;
  export const heavenHellCreepPlayer: player = Player(heavenHellCreepPlayerId);
  export const heavenHellMaxHeroLevel: number = 10;
  export const heavenHellBottomLeft: Vector2D = new Vector2D(
    -8200, 20000
  );
  export const heavenHellTopRight: Vector2D = new Vector2D(
    9200, 24000
  );
  export const evilFightingSkills: number = FourCC("A03Z");
  export const sagaPingInterval: number = 30;
  export const sagaAggroInterval: number = 500;
  export const sagaMinAcquisitionRange: number = 2500;
  export const sagaMaxAcquisitionRange: number = 35000;
  export const reviveDelay: number = 5;
  // dont make team values 0
  export const invalidTeamValue: number = 0;
  export const team1Value: number = 1;
  export const team2Value: number = 2;
  export let defaultTeam1: player[] = [Player(0), Player(1), Player(2), Player(3), Player(4)];
  export let defaultTeam2: player[] = [Player(5), Player(6), Player(7), Player(8), Player(9)];
  export const creepPlayers: player[] = [
    Player(10), Player(11), Player(12), Player(13), Player(14), 
    Player(15), Player(16), Player(17), Player(18), Player(19), 
    Player(20), Player(21), Player(22), Player(23), 
    Player(PLAYER_NEUTRAL_AGGRESSIVE),
  ];
  export const maxHeroLevel: number = 1000;
  export const maxCreepLvl: number = 99;
  export const creepAggroRange: number = 900;
  export const finalBattleName: string = "Final Battle";
  export const budokaiName: string = "Tournament";
  export const locustAbility: number = FourCC("Aloc")
  export const shopSellItemAbility: number = FourCC("Asit");
  export const buffImmortal: number = FourCC("B01U");
  export const wishImmortalAbility: number = FourCC("A0M8");
  export const floatingTextVisionRange: number = 3000;
  export const beamSpawnOffset: number = 40;
  export const gameStartIndicatorUnit: number = FourCC("hkni");
  export const silenceBuff: number = FourCC("BNsi");
  export const hostPlayerOrder: number[] = [0,5,1,6,2,7,3,8,4,9];

  export const uiButtonSize: number = 0.036;
  export const uiXButtonSpacing: number = 0.001;
  export const uiYButtonSpacing: number = 0.001;

  export const BASE_STAMINA = 100.0;
}

export enum CostType {
  HP = "Life",
  MP = "Mana",
  SP = "Stamina",
  TMP_SP = "TMP Stamina",
}

export function stringToCostType(costType: string): CostType {
  if (costType == "Life" || costType == "HP") {
    return CostType.HP;
  } else if (costType == "Mana" || costType == "MP") {
    return CostType.MP;
  } else if (costType == "TMP_SP") {
    return CostType.TMP_SP;
  }
  return CostType.SP;
}
  
export module BASE_DMG {
  export const KAME_DPS = 0.0112;
  export const KAME_EXPLOSION = 0.053;
  export const SPIRIT_BOMB_DPS = 0.008;
  export const SPIRIT_BOMB_EXPLOSION = 0.25;
  export const DFIST_DPS = 0.013;
  export const DFIST_EXPLOSION = 0.25;
}

export module DebuffAbilities {
  // thunderbolt
  export const STUN_MICRO = FourCC('A08K')
  export const STUN_HALF_SECOND = FourCC('A0NR');
  export const STUN_ONE_SECOND = FourCC('A0IY');
  export const STUN_ONE_AND_A_HALF_SECOND = FourCC('A0FY');
  export const STUN_TWO_SECOND = FourCC('A0I7');
  export const STUN_THREE_SECOND = FourCC('A08H');
  export const STUN_FROZEN_EIS_SHENRON = FourCC('A0PA');

  // curse
  export const DEMONS_MARK = FourCC("A0O7");
  export const FROST_CLAWS_BLIND = FourCC("A0P6");
  export const BLINDING_WOLF_FANG_FIST = FourCC("A0S8");
  export const BRAVE_SLASH = FourCC("A0TV");
  export const DARK_MIST = FourCC("A0WS");

  // slow
  export const HEROS_SONG = FourCC("A0I6");
  export const EIS_FROSTBITE = FourCC("A0P5");
  export const KROWN_TOSS = FourCC("A0P9");
  export const MILKY_CANNON = FourCC("A0PU");
  export const DRAGON_THUNDER = FourCC("A0QT");
  export const SPIRIT_BALL = FourCC("A0SA");
  export const BLEED_ZAMASU = FourCC("A0I4");
  export const FERVENT_WOUND = FourCC("A0TE");
  export const FLATTEN = FourCC("A0TQ");
  export const GRAN_REY_SLOW = FourCC("A0V7");
  export const FINAL_BURST_SLOW = FourCC("A0VE");
  export const LIGHTNING_3_SLOW = FourCC("A0WN");
  export const TABLE_FLIP = FourCC("A03U");
  export const DK_GROUND_POUND_SLOW = FourCC("A06E");

  // entangling roots
  export const CIRCLE_FLASH = FourCC("A0R6");
  export const GALACTIC_DONUT = FourCC("A0U6");

  // sleep
  export const HYPNOWAVE_SLEEP = FourCC("A0X9");

  // inner fire
  export const LUCARIO_FORCE_DEBUFF = FourCC("A0Y5");
}

export module Buffs {
  // buffs
  export const HEROS_SONG = FourCC("B01H");

  export const COSMIC_ILLUSION = FourCC("B025");

  export const PARAGON_OF_FLAME = FourCC("B048");
  export const DRAGOON_TRANSFORMATION = FourCC("B049");

  export const LUCARIO_FORCE_1 = FourCC("B04R");
  export const LUCARIO_FORCE_2 = FourCC("B04S");
  export const LUCARIO_FORCE_3 = FourCC("B04T");
  export const LUCARIO_FORCE_4 = FourCC("B04U");
  export const LUCARIO_FORCE_5 = FourCC("B04V");
  export const LUCARIO_FORCE_6 = FourCC("B04W");
  export const LUCARIO_FORCE_7 = FourCC("B04X");
  export const LUCARIO_FORCE_8 = FourCC("B04Y");
  export const LUCARIO_FORCE_9 = FourCC("B04Z");
  export const LUCARIO_FORCE_10 = FourCC("B050");

  export const EXTREME_SPEED = FourCC("B04O");

  export const FROSTBITE = FourCC("B02T");
}

export module OrderIds {
  export const THUNDERBOLT = 852095;
  export const CURSE = 852190;
  export const SLOW = 852075;
  export const ENTANGLING_ROOTS = 852171;
  export const SLEEP = 852227;
  export const INNER_FIRE = 852066;
  export const HOLY_BOLT = 852092;
  export const STOP = 851972;
  export const HOLD_POSITION = 851993;
  export const MOVE = 851986
  export const PHASE_SHIFT_OFF = 852516;
  export const PHASE_SHIFT_ON = 852515;
}

export module Capsules {
  export const itemMysterBox = FourCC("I04V");

  export const saibamenSeeds = FourCC("A0GQ");
  export const wheeloResearch = FourCC("A0IH");
  export const deadZone = FourCC("A0JB");
  export const scouter2 = FourCC("A0JC");
  
  export const getiStarFragment = FourCC("A0IK");
  export const dimensionSword = FourCC("A0JA");
  export const braveSword = FourCC("A0IJ");
  export const timeRing = FourCC("A0II");
}

export module Id {
  export const summonShenron = FourCC("I01V");

  export const allMight = FourCC("H09K");
  export const detroitSmash = FourCC("A0SX");
  export const leftSmash = FourCC("A0SY");
  export const rightSmash = FourCC("A0SZ");
  export const unitedStatesOfSmash = FourCC("A0T2");
  export const oneForAll = FourCC("A0T0");
  export const oklahomaSmash = FourCC("A0T3");
  export const carolinaSmash = FourCC("A0T4");
  export const californiaSmash = FourCC("A0T5");
  export const newHampshireSmash = FourCC("A0T6");

  export const android13 = FourCC("H01V");
  export const android14 = FourCC("H01S");
  export const android15 = FourCC("H01T");
  export const superAndroid13 = FourCC("H01U");
  export const android13EnergyBeam = FourCC("A00N");
  export const ssDeadlyBomber = FourCC("A0LD");
  export const ssDeadlyHammer = FourCC("A0LC");
  export const android13Nuke = FourCC("A01Y");
  export const android13Overcharge = FourCC("A0K2");

  export const android17dbs = FourCC("H08Z");
  export const powerBlitz = FourCC("A09O");
  export const powerBlitzBarrage = FourCC("A0MW");
  export const androidBarrier = FourCC("A0LB");
  export const superElectricStrike = FourCC("A0MV");
  export const barrierPrison = FourCC('A0MT');
  export const barrierWall = FourCC('A0MU');

  export const babidi = FourCC("O001");
  export const haretsu = FourCC("A02E");
  export const babidiBarrier = FourCC("A0LG");
  export const babidiMagic = FourCC("A0JQ");
  export const babidiDabura = FourCC("A03E");

  export const bardock = FourCC("H08M");
  export const futureSight = FourCC('A0LN');
  export const tyrantBreaker = FourCC("A0OX");
  export const tyrantLancer = FourCC("A0LO");
  export const riotJavelin = FourCC("A0LP");
  export const rebellionSpear = FourCC("A0LQ");
  export const saiyanSpirit = FourCC("A0LR");

  export const broly = FourCC("H00M");
  export const energyPunch = FourCC("A0G8");
  export const powerLevelRising = FourCC("A00J");
  export const planetCrusher = FourCC("A0BZ");
  export const giganticRoar = FourCC("A084");
  export const giganticOmegastorm = FourCC("A0H6");

  export const fatBuu = FourCC("O005");
  export const superBuu = FourCC("O006");
  export const kidBuu = FourCC("O00C");
  export const candyBeam = FourCC("A0EI");
  export const fleshAttack = FourCC("A01C");
  export const innocenceBreath = FourCC("A0LH");
  export const angryExplosion = FourCC("A0ER")
  export const vanishingBall = FourCC("A0C0");
  export const mankindDestructionAttack = FourCC("A01D");

  export const cellFirst = FourCC("H00E");
  export const cellSemi = FourCC("H00F");
  export const cellPerfect = FourCC("H00G");
  export const cellSBC = FourCC("A0C9");
  export const cellMasenko = FourCC("A0GD");
  export const cellAbsorb1 = FourCC("A029");
  export const cellAbsorb2 = FourCC("A0JU");
  export const cellAbsorb3 = FourCC("A0LA");
  export const cellJuniors = FourCC("A01Z");
  export const cellSolarKame = FourCC("A0O9");
  export const cellXForm = FourCC("A00D");

  export const crono = FourCC("H0A0");
  export const cronoCyclone = FourCC("A0VP");
  export const cronoSlash = FourCC("A0VQ");
  export const cronoLightning = FourCC("A0VR");
  export const cronoLightning2 = FourCC("A0VS");
  export const cronoLightning3 = FourCC("A0WM");
  export const cronoCleave = FourCC("A0VT");
  export const cronoLuminaire = FourCC("A0VU");

  export const frog = FourCC("H0A1");
  export const frogSlurpCut = FourCC("A0WA");
  export const frogSlurp = FourCC("A0WB");
  export const frogWater = FourCC("A0WC");
  export const frogWater2 = FourCC("A0WD");
  export const frogAerialStrike = FourCC("A0WE");
  export const frogSquash = FourCC("A0WF");

  export const robo = FourCC("H0A2");
  export const roboTackle = FourCC("A0WG");
  export const roboLaserSpin = FourCC("A0WH");
  export const roboHealBeam = FourCC("A0WI");
  export const roboUzziPunch = FourCC("A0WJ");
  export const roboElectrocute = FourCC("A0WK");

  export const magus = FourCC("H0A3");
  export const darkBomb = FourCC("A0W3");
  export const magusLightning2 = FourCC("A0W5");
  export const magusFire2 = FourCC("A0WO");
  export const magusIce2 = FourCC("A0WP");
  export const magusWater2 = FourCC("A0WQ");
  export const magusDarkMist = FourCC("A0WR");
  export const magusDarkMatter = FourCC("A0W6");

  export const lucca = FourCC("H0A4");
  export const luccaFlamethrower = FourCC("A0WZ");
  export const luccaHypnowave = FourCC("A0X0");
  export const luccaFire2 = FourCC("A0X1");
  export const luccaFire = FourCC("A0X2");
  export const luccaNapalm = FourCC("A0X3");
  export const luccaMegaBomb = FourCC("A0X4");
  export const luccaFlare = FourCC("A0X5");

  export const ayla = FourCC("H0A5");
  export const aylaBoulderToss = FourCC("A0XG");
  export const aylaCharm = FourCC("A0XH");
  export const aylaTailSpin = FourCC("A0XI");
  export const aylaDinoTail = FourCC("A0XK");
  export const aylaTripleKick = FourCC("A0XL");

  export const marle = FourCC("H0A6");
  export const marleAura = FourCC("A0XA");
  export const marleAllure = FourCC("A0XB");
  export const marleIce = FourCC("A0XC");
  export const marleIce2 = FourCC("A0XD");
  export const marleCure = FourCC("A0XE");
  export const marleHaste = FourCC("A0XF");

  export const dartFeld = FourCC("H09Y");
  export const doubleSlash = FourCC("A0UQ");
  export const burningRush = FourCC("A0UR");
  export const madnessSlash = FourCC("A0UW");
  export const crushDance = FourCC("A0US");
  export const heartOfFire = FourCC("A0UT");
  export const heartOfFirePassive = FourCC("A0VA");
  export const madnessHero = FourCC("A0UU");
  export const madnessDebuffSlow = FourCC("A0V8");
  export const madnessDebuffCurse = FourCC("A0V9");
  export const dragoonTransformation = FourCC("A0V1");
  export const blazingDynamo = FourCC("A0UV");
  export const dragoonFlourish = FourCC("A0UX");
  export const flameShot = FourCC("A0UY");
  export const paragonOfFlame = FourCC("A0UZ");
  export const finalBurst = FourCC("A0V0");
  export const redEyedDragonSummoning = FourCC("A0V3");

  export const donkeyKong = FourCC("H05Q");
  export const dkGroundPound = FourCC("A041");
  export const dkRoll = FourCC("A05Z");
  export const dkBarrelRoll = FourCC("A05Q");
  export const dkBananaSlamma = FourCC("A06A");
  export const dkJungleRush = FourCC("A06B");
  export const dkBarrelCannon = FourCC("A069");

  export const dyspo = FourCC("H09H");
  export const lightBullet = FourCC("A0QY");
  export const justiceKick = FourCC("A0QZ");
  export const justiceKick2 = FourCC("A0R3");
  export const justiceCannon = FourCC("A0QX");
  export const justiceCannon2 = FourCC("A0R4");
  export const circleFlash = FourCC("A0R0");
  export const circleFlash2 = FourCC("A0R5");
  export const justicePoseDyspo = FourCC("A0R2");
  export const superMaximumLightSpeedMode = FourCC("A0R1");

  export const metalCooler = FourCC("H01A");
  export const fourthCooler = FourCC("H042");
  export const fifthCooler = FourCC("H043");
  export const deathBeamCooler = FourCC("A06C");
  export const supernovaCooler = FourCC("A0C1");
  export const goldenSupernova = FourCC("A0L2");
  export const novaChariot = FourCC("A0KY");
  export const deafeningWave = FourCC("A06N");
  export const getiStarRepair = FourCC("A063");

  // eis shenron
  export const eisShenron = FourCC("H09B");
  export const frostClaws = FourCC("A0P1");
  export const iceSlash = FourCC("A0P2");
  export const absoluteZero = FourCC("A0P3");
  export const iceCannon = FourCC("A0P4");

  export const farmerWithShotgun = FourCC("H08S");

  export const frieza = FourCC("H06X");
  export const deathBeamFrieza = FourCC("A0PZ");
  export const deathCannon = FourCC("A0Q0");
  export const novaStrike = FourCC("A0Q1");
  export const supernovaFrieza = FourCC("A0Q2");
  export const emperorsThrone = FourCC("A0Q3");
  export const deathStorm = FourCC("A0Q4");
  export const impalingRush = FourCC("A0Q5");
  export const deathBeamBarrage = FourCC("A0Q6");
  export const novaRush = FourCC("A0Q7");
  export const deathBall = FourCC("A0Q8");
  export const supernovaFrieza2 = FourCC("A0Q9");
  export const tailWhip = FourCC("A0QA");
  export const lastEmperor = FourCC("A0QB");
  export const deathSaucer = FourCC("A0QC");
  export const deathBeamGolden = FourCC("A0QD");
  export const deathCannonGolden = FourCC("A0QE");
  export const novaRushGolden = FourCC("A0QF");
  export const earthBreaker = FourCC("A0QG");
  export const cageOfLight = FourCC("A0QH");

  export const ft = FourCC("H009");
  export const ftss = FourCC("A0KT");
  export const finishBuster = FourCC("A02L");
  export const heatDomeAttack = FourCC("A0NL");
  export const burningAttack = FourCC("A03I");
  export const blazingRush = FourCC("A0LE");
  export const shiningSwordAttack = FourCC("A0LF");
  export const ftSwordOfHope = FourCC("A007");
  export const superSaiyanRage = FourCC("A0KT");

  export const ginyu = FourCC("H09E");
  export const milkyCannon = FourCC("A0PP");
  export const galaxyDynamite = FourCC("A0PQ");
  export const ginyuTelekinesis = FourCC("A0PR");
  export const ginyuPoseUltimate = FourCC("A0PS");
  export const ginyuPoseFighting = FourCC("A0PT");
  export const ginyuChangeNow = FourCC("A0PO");

  export const gohan = FourCC("H00K");
  export const unlockPotential = FourCC("A0L6");
  export const greatSaiyamanHasArrived = FourCC("A0L7");
  export const potentialUnleashed = FourCC("A0L8");
  export const masenko = FourCC("A0H8");
  export const superMasenko = FourCC("A0TU");
  export const twinDragonShot = FourCC("A0IS");
  export const superDragonFlight = FourCC("A0L5");
  export const fatherSonKame = FourCC("A0OY");

  export const goku = FourCC("H000");
  export const kamehameha = FourCC("A00R");
  export const kamehamehaGod = FourCC('A0L9');
  export const spiritBomb = FourCC('A0JP');
  export const dragonFist = FourCC("A00U");
  export const superDragonFist = FourCC("A0P0");
  export const solarFlare = FourCC("A0KO");
  export const ultraInstinct = FourCC('A0KR');
  export const masteredUltraInstinct = FourCC('A0MZ');

  export const goten = FourCC("H008");
  export const gotenRockThrow = FourCC("A0TX");
  export const superGotenStrike = FourCC("A0TW");

  export const kidTrunks = FourCC("H016");
  export const kidTrunksFinalCannon = FourCC("A0TY");
  export const kidTrunksSwordOfHope = FourCC("A0TZ");

  export const gotenks = FourCC("H00A");
  export const dieDieMissileBarrage = FourCC("A0U1");
  export const galacticDonut = FourCC("A0U2");
  export const ultraVolleyball = FourCC("A0U3");
  export const superGhostKamikazeAttack = FourCC("A0U4");
  export const superGhostKamikazeAttack2 = FourCC("A0U5");
  export const gotenksSS3 = FourCC("A0U0");

  export const guldo = FourCC("H09J");
  export const psychoJavelin = FourCC("A0SC");
  export const psychicRockThrow = FourCC("A0SD");
  export const guldoTelekinesis = FourCC("A0SE");
  export const guldoTimeStop = FourCC("A0SF");
  export const ginyuPoseGuldo = FourCC("A0SG");

  export const hirudegarn = FourCC("H05U");
  export const hirudegarnFlameBreath = FourCC("A081");
  export const hirudegarnFlameBall = FourCC("A082");
  export const hirudegarnDarkMist = FourCC("A083");
  export const hirudegarnChouMakousen = FourCC("A0CP");
  export const hirudegarnTailSweep = FourCC("A0CQ");
  export const hirudegarnTailAttack = FourCC("A0DI");
  export const hirudegarnHeavyStomp = FourCC("A0EM");
  export const hirudegarnDarkEyes = FourCC("A0EO");
  export const hirudegarnMolting = FourCC("A0ET");
  export const hirudegarnFlight = FourCC("A0G3");
  export const hirudegarnEnrage = FourCC("A0G6");
  export const hirudegarnDeactivateEnrage = FourCC("A0G7");
  export const hirudegarnPassive = FourCC("A0GG");


  export const hit = FourCC("E00K");
  export const timeSkip = FourCC("A0FT");
  export const pocketDimension = FourCC("A0FU");
  export const flashFist = FourCC("A0FV");
  export const timeCage = FourCC("A0FW");
  export const pureProgress = FourCC("A0TH");
  export const hitDeathBlow = FourCC("A0GP");

  export const ichigo = FourCC("H09S");
  export const getsugaTensho = FourCC("A0U7");
  export const getsugaKuroi = FourCC("A0V4");
  export const getsugaGran = FourCC("A0V5");
  export const getsugaJujisho = FourCC("A0UH");
  export const bankai = FourCC("A0U8");
  export const bankaiFinal = FourCC("A0U9");
  export const ceroCharge = FourCC("A0UA");
  export const ceroFire = FourCC("A0UB");
  export const mugetsuBook = FourCC("A0UC");
  export const mugetsuUnleash = FourCC("A0UD");
  export const mugetsuSlash = FourCC("A0UE");
  export const shunpo = FourCC("A0UF");
  export const hirenkyaku = FourCC("A0VL");
  export const blutVene = FourCC("A0VM");
  export const ceroGigante = FourCC("A0VO");

  export const janemba = FourCC("H062");
  export const demonRush = FourCC("A0O1");
  export const rakshasaClaw = FourCC("A0NY");
  export const devilClaw = FourCC("A0NZ");
  export const bunkaiTeleport = FourCC("A0O2");
  export const demonicBlade = FourCC("A0OA");
  export const cosmicIllusion = FourCC("A0EU");
  export const hellsGate = FourCC("A0O3");
  export const lightningShowerRain = FourCC("A0O4");

  export const jiren = FourCC("E01P");
  export const powerImpact = FourCC("A0K9");
  export const powerImpact2 = FourCC("A0SI");
  export const mightyPunch = FourCC("A0K8");
  export const mightyPunch2 = FourCC("A0SJ");
  export const followUp = FourCC("A0KB");
  export const glare = FourCC("A0K6");
  export const glare2 = FourCC("A0SK");
  export const heatwave = FourCC("A0K7");
  export const heatwave2 = FourCC("A0SL");
  export const meditate = FourCC("A0KD");
  export const meditate2 = FourCC("A0SM");
  export const ultimateBurningWarrior = FourCC("A0KC");
  export const ultimateBurningWarrior2 = FourCC("A0SN");
  export const ultimateBurningWarrior3 = FourCC("A005");

  export const krillin = FourCC("H03Y");
  export const scatteringBullet = FourCC("A0R9");
  export const destructoDisc = FourCC("A0RA");
  export const senzuThrow = FourCC("A0RB");

  export const kkr = FourCC("E01D");
  export const bellyArmor = FourCC("A0OT");
  export const krownToss = FourCC("A0IV");
  export const kharge = FourCC("A0IW");
  export const kannonblast = FourCC("A0OW");
  export const monkeySmasher = FourCC("A0IX");
  export const blasto = FourCC("A0OU");
  export const kingsThrone = FourCC("A0OV");

  export const lucario = FourCC("H0A7");
  export const vacuumWave = FourCC("A0XU");
  export const ironDefense = FourCC("A0XV");
  export const ironDefensePassive = FourCC("A0Y4");
  export const extremeSpeed = FourCC("A0XW");
  export const auraSphere = FourCC("A0XX");
  export const lucarioMegaEvolution = FourCC("A0Y0");
  export const auraStorm = FourCC("A0Y3");
  export const lucarioGigantomax = FourCC("A0Y1");
  export const gigaSphere = FourCC("A0Y2");


  export const raditz = FourCC("H08U");
  export const doubleSunday = FourCC("A0ME");
  export const saturdayCrash = FourCC("A0MF");
  export const behindYou = FourCC("A0MG");
  export const doubleSundae = FourCC("A0MH");

  export const roshi = FourCC("E001");
  export const roshiKameCharge = FourCC("A0FG");
  export const roshiKameFire = FourCC("A0JE");
  export const roshiKameCharge2 = FourCC("A0SO");
  export const roshiKameFire2 = FourCC("A0SP");
  export const roshiLightningSurprise = FourCC("A0IE");
  export const roshiNewTrick = FourCC("A0KU");
  export const roshiMaxPower = FourCC("A0FH");

  export const mario = FourCC("H09Q");
  export const jump = FourCC("A0TJ");
  export const groundPound = FourCC("A0TK");
  export const hammerTime = FourCC("A0TL");
  export const spinJump = FourCC("A0TM");
  export const superCape = FourCC("A0TN");
  export const powerUpBlock = FourCC("A0TO");
  export const fireball = FourCC("A0TP");
  export const marioSuperFireball = FourCC("A0YX");

  export const nappa = FourCC("H08W");
  export const giantStorm = FourCC("A0MI");
  export const blazingStorm = FourCC("A0MJ");
  export const plantSaibamen = FourCC("A0MK");
  export const breakCannon = FourCC("A0ML");

  export const omegaShenron = FourCC("H09F");
  export const dragonFlashBullet = FourCC("A0QJ");
  export const negativeEnergyBall = FourCC("A0QK");
  export const shadowFist = FourCC("A0QL");
  export const dragonicRage = FourCC("A0QM");
  export const omegaIceCannon = FourCC("A0QP");
  export const omegaNovaStar = FourCC("A0QQ");
  export const omegaDragonThunder = FourCC("A0QR");

  export const pan = FourCC("H08P");
  export const honeyBeeCostume = FourCC("A0LY");
  export const panKame = FourCC("A0LX");
  export const panGodKame = FourCC("A0VN");
  export const maidenBlast = FourCC("A0LU");
  export const reliableFriend = FourCC("A0LV");
  export const summonGiru = FourCC("A0LW");

  export const piccolo = FourCC("H00R");
  export const kyodaika = FourCC("A04Y");
  export const piccoloSBC = FourCC("A06F");
  export const piccoloCloneSBC = FourCC("A0ES");
  export const slappyHand = FourCC("A0C8");
  export const hellzoneGrenade = FourCC("A0LM");
  export const multiForm = FourCC('A088');
  
  export const rustTyranno = FourCC("H09Z");
  export const tyrannoFlame = FourCC("A0VI");
  export const rustChomp = FourCC("A0VG");
  export const rustGobble = FourCC("A0VH");
  export const tyrannoRoar = FourCC("A0VJ");

  export const saitama = FourCC("H04Y");
  export const saitamaNormalPunch = FourCC("A008");
  export const saitamaConsecutivePunches = FourCC("A00I");
  export const saitamaLeap = FourCC("A00Z");
  export const saitamaTableFlip = FourCC("A011");
  export const saitamaOK = FourCC("A03H");
  export const saitamaSeriousSeries = FourCC("A02J");
  export const saitamaSeriousPunch = FourCC("A02U");
  export const saitamaSeriousSidewaysJumps = FourCC("A032");

  export const schala = FourCC("H05W");
  export const schalaMagicOrbs = FourCC("A0YC");
  export const schalaMagicOrbs2 = FourCC("A0YK");
  export const schalaProtect = FourCC("A0YD");
  export const schalaProtect2 = FourCC("A0YL");
  export const schalaTeleportation = FourCC("A0YE");
  export const schalaTeleportation2 = FourCC("A0YN");
  export const schalaSkygate = FourCC("A0YF");
  export const schalaSkygate2 = FourCC("A0YM");
  export const schalaMagicSeal = FourCC("A0YG");
  export const schalaMagicSeal2 = FourCC("A0YO");
  export const schalaPray = FourCC("A0YH");
  export const schalaDreamDevourer = FourCC("A0YI");

  export const sephiroth = FourCC("H09M");
  export const sephirothOctoslash = FourCC("A0T7");
  export const sephirothHellsGate = FourCC("A0T8");
  export const sephirothFerventBlow = FourCC("A0T9");
  export const sephirothFerventRush = FourCC("A0TA");
  export const sephirothBlackMateria = FourCC("A0TB");
  export const sephirothOneWingedAngel = FourCC("A0TC");
  export const sephirothParry = FourCC("A0TD");

  export const shotoTodoroki = FourCC("H05X");
  export const shotoTodorokiGlacier = FourCC("A0YR");
  export const shotoTodorokiWallOfFlames = FourCC("A0YS");
  export const shotoTodorokiIcePath = FourCC("A0YT");
  export const shotoTodorokiFlashfreezeHeatwave = FourCC("A0YU");
  export const shotoTodorokiHeavenPiercingIceWall = FourCC("A0YY");
  export const shotoTodorokiFlashfireFist = FourCC("A0YZ");
  export const shotoTodorokiHeatingUp = FourCC("A0YV");
  export const shotoTodorokiCoolingDown = FourCC("A0YW");

  export const super17 = FourCC("H05V");
  export const super17Skin = FourCC("H05B");
  export const super17FlashBomber = FourCC("A0GT");
  export const super17FlashBomber2 = FourCC("A0XJ");
  export const super17HellStorm = FourCC("A0GU");
  export const super17ShockingDeathBall = FourCC("A0H1");
  export const super17Absorption = FourCC("A0P8");

  export const tapion = FourCC("E014");
  export const braveSlash = FourCC('A0I9');
  export const braveCannon = FourCC('A0I8');
  export const shiningSword = FourCC("A0IC");
  export const herosFlute = FourCC("A0IB");
  export const braveSwordAttack = FourCC('A0IA');

  export const tien = FourCC("H055");
  export const tienClone = FourCC("H05Y");
  export const dodonRay = FourCC("A06X");
  export const triBeamCharge = FourCC("A0TT");
  export const triBeam = FourCC("A08J");
  export const tienKiai = FourCC("A0TR");
  export const multiFormSolarFlare = FourCC("A0B6");
  export const tienFourArms = FourCC("A0TS");

  export const toppo = FourCC("H09C");
  export const justiceFlash = FourCC("A0PB");
  export const justiceFlash2 = FourCC("A0PI");
  export const justicePunch = FourCC("A0PD");
  export const justicePunch2 = FourCC("A0PK");
  export const justiceTornado = FourCC("A0PJ");
  export const justiceTornado2 = FourCC("A0PL");
  export const justiceHold = FourCC("A0PE");
  export const justiceHold2 = FourCC("A0PM");
  export const justicePoseToppo = FourCC("A0PF");
  export const toppoGodOfDestruction = FourCC("A0PC");

  export const upa = FourCC("H099");
  export const javelinThrow = FourCC("A0OH");
  export const whirlwindTempest = FourCC("A0OI");
  export const korinFlag = FourCC("A0OJ");
  export const lastStand = FourCC("A0OK");

  export const vegeta = FourCC("E003");
  export const galickGun = FourCC("A03N");
  export const bigBangAttack = FourCC("A0GO");
  export const finalFlash = FourCC("A01B");
  export const finalFlash2 = FourCC("A0L4");
  export const energyBlastVolley = FourCC("A0L3");
  export const moonlight = FourCC("A035");
  export const angryShout = FourCC("A0LS");
  export const ultraEgo = FourCC("A0GI");
  export const egoGalickGun = FourCC("A0GJ");
  export const vegetaHakai = FourCC("A0GK");
  export const vegetaHakaiBarrage = FourCC("A0GL");
  export const vegetaFightingSpirit = FourCC("A0GM");

  export const videl = FourCC("H085");
  export const punch = FourCC("A073");
  export const kick = FourCC("A071");
  export const flyingKick = FourCC("A0JW");

  export const skurvy = FourCC("H07Y");
  export const skurvyBigKannon = FourCC("A0Z0");
  export const skurvyKannonFire = FourCC("A0Z1");
  export const skurvyRunThrough = FourCC("A0Z2");
  export const skurvyPlunder = FourCC("A0Z3");
  export const skurvyMirrorNeverLies = FourCC("A0Z4");
  export const skurvyPlank = FourCC("A0Z5");
  export const skurvyScorn = FourCC("A0Z6");

  export const yamchaRLightPunch = FourCC("A0RC");
  export const yamchaRMediumPunch = FourCC("A0RD");
  export const yamchaRHeavyPunch = FourCC("A0RE");

  export const yamchaDashLeft = FourCC("A0RF");
  export const yamchaDashForward = FourCC("A0RG");
  export const yamchaDashRight = FourCC("A0RH");

  export const yamchaRSuperSpiritBall = FourCC("A0RI");
  export const yamchaRFullPowerKame = FourCC("A0RJ");
  export const yamchaRWolfFangBlast = FourCC("A0RK");

  export const yamchaSparking = FourCC("A0SB");


  export const itemHealingBuff = FourCC("BIrg");

}