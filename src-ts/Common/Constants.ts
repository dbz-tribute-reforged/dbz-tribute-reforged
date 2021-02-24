import { Vector2D } from "./Vector2D";

export module Globals {
  export let isFBSimTest: boolean = false;
  export let isFreemode: boolean = false;
}

export module Constants {
  export const maxSubAbilities = 3;
  export const maxActivePlayers = 10;
  export const maxPlayers = 24;
  export const dummyBeamUnitId = FourCC("hpea");
  export const dummyCasterId = FourCC("h054");
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
    -7000, 20000
  );
  export const heavenHellTopRight: Vector2D = new Vector2D(
    6550, 24000
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
  export const floatingTextVisionRange: number = 3000;
  export const beamSpawnOffset: number = 40;
  export const gameStartIndicatorUnit: number = FourCC("hkni");
  export const silenceBuff: number = FourCC("BNsi");
  export const hostPlayerOrder: number[] = [0,5,1,6,2,7,3,8,4,9];
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

  export const hit = FourCC("E00K");
  export const timeSkip = FourCC("A0FT");
  export const pocketDimension = FourCC("A0FU");
  export const flashFist = FourCC("A0FV");
  export const timeCage = FourCC("A0FW");
  export const pureProgress = FourCC("A0TH");

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

  export const sephiroth = FourCC("H09M");
  export const sephirothOctoslash = FourCC("A0T7");
  export const sephirothHellsGate = FourCC("A0T8");
  export const sephirothFerventBlow = FourCC("A0T9");
  export const sephirothFerventRush = FourCC("A0TA");
  export const sephirothBlackMateria = FourCC("A0TB");
  export const sephirothOneWingedAngel = FourCC("A0TC");
  export const sephirothParry = FourCC("A0TD");

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

  export const videl = FourCC("H085");
  export const punch = FourCC("A073");
  export const kick = FourCC("A071");
  export const flyingKick = FourCC("A0JW");

  export const yamchaRLightPunch = FourCC("A0RC");
  export const yamchaRMediumPunch = FourCC("A0RD");
  export const yamchaRHeavyPunch = FourCC("A0RE");

  export const yamchaDashLeft = FourCC("A0RF");
  export const yamchaDashForward = FourCC("A0RG");
  export const yamchaDashRight = FourCC("A0RH");

  export const yamchaRSuperSpiritBall = FourCC("A0RI");
  export const yamchaRFullPowerKame = FourCC("A0RJ");
  export const yamchaRWolfFangBlast = FourCC("A0RK");
  
}