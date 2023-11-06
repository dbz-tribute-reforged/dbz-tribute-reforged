import { Vector2D } from "./Vector2D";
import { CustomPlayer } from "CustomPlayer/CustomPlayer";

export module Globals {
  export let isMainGameStarted: boolean = false;
  export let isFBSimTest: boolean = false;
  export let isFreemode: boolean = false;
  export let isNightmare: boolean = false;
  export let isKOTH: boolean = false;
  export let numPVPKills: number = 0;
  export let clownValue: number = 0;
  export let showAbilityFloatingText: boolean = true;
  export let sagaSystemMode: number = 0;
  export let ddsTimeoutSeconds: number = 5;
  
  export const customPlayers: CustomPlayer[] = [];
  export let hostPlayer: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);
  export let canUseCustomUi: boolean = true;


  export let pecorinePickVoiceFlag: boolean = true;
  export let isFBArenaVision: boolean = false;

  // to save number of events and triggers
  export const genericSpellTrigger = CreateTrigger();
  export const simpleSpellEffectTrigger = CreateTrigger();
  export const simpleSpellFinishTrigger = CreateTrigger();
  export const simpleSpellEndTrigger = CreateTrigger();
  export const simpleSpellCDHashtable = InitHashtable();
  export const genericUpgradeTrigger = CreateTrigger();
  export const genericSpellHashtable = InitHashtable();
  export const genericEnemyHashtable = InitHashtable();
  export const genericDDSHashtable = InitHashtable();
  export const genericGateTPHashtable = InitHashtable(); // for ainz gate teleportation cooldowns
  export const minatoHashtable = InitHashtable();
  export const genericSpellMap = new Map<number, (spellId: number)=>void>();
  export const genericSpellFinishMap = new Map<number, (spellId: number)=>void>();
  export const genericSpellEndMap = new Map<number, (spellId: number)=>void>();
  export const linkedSpellsMap = new Map<number, (unit: unit, cd: number)=>void>();

  export const barrelMoveTrigger = CreateTrigger();
  export const barrelHashtable = InitHashtable(); 
  export const barrelUnitGroup = CreateGroup();

  export const DDSUnitMap = new Map<unit, boolean>();
  export const DDSTrigger = CreateTrigger();
  export const DDSEntryTrigger = CreateTrigger();

  // global beam units
  export const beamUnitGroup = CreateGroup();

  // reuseable unit group
  export const tmpUnitGroup = CreateGroup();
  export const tmpUnitGroup2 = CreateGroup();
  export const tmpUnitGroup3 = CreateGroup();
  export const tmpForce = CreateForce();
  export const tmpVector = new Vector2D();
  export const tmpVector2 = new Vector2D();
  export const tmpVector3 = new Vector2D();

  export const globalDummyCaster = CreateUnit(
    Player(PLAYER_NEUTRAL_PASSIVE), FourCC("h054"), 0, 0, 0
  );

  export const appuleVengeanceTeleportTrigger = CreateTrigger();

  export const barrierBlockUnits: Map<unit, number> = new Map();
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
  export const neutralPassivePlayer: player = Player(PLAYER_NEUTRAL_PASSIVE);
  export const heavenHellCreepPlayerId: number = maxPlayers - 1;
  export const heavenHellCreepPlayer: player = Player(heavenHellCreepPlayerId);
  export const heavenHellMaxHeroLevel: number = 9;
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
  export let activePlayers: player[] = [
    Player(0), Player(1), Player(2), Player(3), Player(4),
    Player(5), Player(6), Player(7), Player(8), Player(9)
  ];
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
  export const creepAggroRange: number = 800;
  export const finalBattleName: string = "Final Battle";
  export const KOTHName: string = "King of the Hill";
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

  export const uiButtonSize: number = 0.024;
  export const uiXButtonSpacing: number = 0.001;
  export const uiYButtonSpacing: number = 0.001;

  export const REGEN_TICK_RATE = 0.03;
  export const BASE_SP_REGEN = 3;
  export const BASE_HP_REGEN_PCT = 0.005;
  export const BASE_MP_REGEN_PCT = 0.01;

  export const BASE_STAMINA = 100.0;
  export const STAMINA_REGEN_MULT_MAX_BONUS = 2.0;
  export const STAMINA_REGEN_MULT_MIN_BONUS = 0.5;

  export const FARMING_TICK_INTERVAL = 0.05;
  export const FARMING_STANDARD_DURATION = 200;

  export const AGILITY_REGEN_EXPONENT = 1.8;
  export const FOUNTAIN_REGEN_MULT = 0.25;
  export const SAITAMA_PASSIVE_STAMINA_BONUS_MULT = 0.15;
  export const OMEGA_SHENRON_PASSIVE_REGEN_MULT = 0.15;
  export const ZAMASU_PASSIVE_HP_REGEN_MULT = 1;
  export const AINZ_MAGIC_BOOST_MP_REGEN_MULT = 0.25;
  export const ALBEDO_GUARDIAN_AURA_REGEN_MULT = 0.25;
  export const MIGHT_GUY_SUNSET_OF_YOUTH_REGEN_MULT = 0.25;

  export const MIGHT_GUY_GATE_HP_THRESHOLD = [100, 75, 66, 33, 20];
  export const MIGHT_GUY_GATE_HP_MULTS = [0, 1.5, 3, 4.5, 6];
  export const MIGHT_GUY_GATE_SP_MULTS = [0, 0.05, 0.1, 0.15, 0.2];

  export const NUOVA_HEAT_ARMOR_HP_MULT = -2;
  export const MAJIN_BUU_FAT_MP_REGEN_MULT = -0.75;
  export const SUPER_17_GEN_REGEN_MULT = 0.25;

  export const IS_APRIL_FOOLS_DAY = false;
  
  export function isShotoAbility(abilityId: number) {
    return (
      abilityId == Id.shotoTodorokiGlacier
      || abilityId == Id.shotoTodorokiWallOfFlames
      || abilityId == Id.shotoTodorokiIcePath
      || abilityId == Id.shotoTodorokiFlashfreezeHeatwave
      || abilityId == Id.shotoTodorokiHeavenPiercingIceWall
      || abilityId == Id.shotoTodorokiFlashfireFist
    );
  }
  
  export function isAinzAbility(abilityId: number) {
    return (
      abilityId == Id.ainzBlackHole
      || abilityId == Id.ainzBodyOfEffulgentBeryl
      || abilityId == Id.ainzEnergyDrain
      || abilityId == Id.ainzExplodeMine
      || abilityId == Id.ainzFallenDown
      || abilityId == Id.ainzGate
      || abilityId == Id.ainzGraspHeart
      || abilityId == Id.ainzGreaterFullPotential
      || abilityId == Id.ainzGreaterHardening
      || abilityId == Id.ainzGreaterMagicShield
      || abilityId == Id.ainzGreaterTeleportation
      || abilityId == Id.ainzGreaterThunder
      || abilityId == Id.ainzHoldOfRibs
      || abilityId == Id.ainzLaShubNiggurath
      || abilityId == Id.ainzMagicBoost
      || abilityId == Id.ainzPenetrateUp
      || abilityId == Id.ainzPerfectUnknowable
      || abilityId == Id.ainzRealitySlash
      || abilityId == Id.ainzRemoteViewing
      || abilityId == Id.ainzResistance
      || abilityId == Id.ainzSummonAlbedo
      || abilityId == Id.ainzSummonDemiurge
      || abilityId == Id.ainzSummonPandora
      || abilityId == Id.ainzSummonShalltear
      || abilityId == Id.ainzTGOALID
      || abilityId == Id.ainzTimeStop
      || abilityId == Id.ainzWallOfSkeleton
      || abilityId == Id.ainzWish
    );
  }
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
  export const KAME_DPS = 0.01;
  // export const KAME_EXPLOSION = 5 * KAME_DPS;
  // export const SPIRIT_BOMB_DPS = 0.008;
  // export const SPIRIT_BOMB_EXPLOSION = 0.25;
  // export const DFIST_DPS = 0.013;
  // export const DFIST_EXPLOSION = 20 * KAME_DPS;
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
  export const STUN_WALUIGI_BOMB = FourCC('A11W');

  // curse
  export const CURSE_SOLAR_FLARE = FourCC("A045");
  export const DEMONS_MARK = FourCC("A0O7");
  export const FROST_CLAWS_BLIND = FourCC("A0P6");
  export const BLINDING_WOLF_FANG_FIST = FourCC("A0S8");
  export const BRAVE_SLASH = FourCC("A0TV");
  export const DARK_MIST = FourCC("A0WS");
  export const APPULE_VENGEANCE = FourCC("A11D");
  export const CURSE_WALUIGI_SPIN = FourCC("A11X");
  export const CURSE_LEON_FLASHBANG = FourCC("A03F");
  export const CURSE_CELL_MAX_WINGS = FourCC("A04F");

  // slow
  export const HEROS_SONG = FourCC("A0I6");
  export const SLOW_TIME_STOP = FourCC("A0SH");
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
  export const SLOW_WALUIGI_FIREBALL_1 = FourCC('A11U');
  export const SLOW_LEON_STAGGER = FourCC("A03C");
  export const SLOW_LINK_FIRE_ARROW = FourCC("A0H3");

  export const SLOW_GENERIC_25_PCT_5S = FourCC('A117');
  export const SLOW_GENERIC_50_PCT_5S = FourCC('A118');
  export const SLOW_GENERIC_75_PCT_5S = FourCC('A119');
  export const SLOW_GENERIC_90_PCT_5S = FourCC('A11A');

  export const SLOW_GENERIC_25_PCT_3S = FourCC('A0BQ');
  export const SLOW_GENERIC_50_PCT_3S = FourCC('A0C3');
  export const SLOW_GENERIC_75_PCT_3S = FourCC('A0C4');
  export const SLOW_GENERIC_90_PCT_3S = FourCC('A0CA');

  export const SLOW_GENERIC_25_PCT_1_5S = FourCC('A03T');
  export const SLOW_GENERIC_50_PCT_1_5S = FourCC('A00K');
  export const SLOW_GENERIC_75_PCT_1_5S = FourCC('A04U');

  // entangling roots
  export const FLESH_ATTACK_ABSORB = FourCC("A07E");
  export const CIRCLE_FLASH = FourCC("A0R6");
  export const GALACTIC_DONUT = FourCC("A0U6");
  export const ROOT_WALUIGI_PIRANHA_PLANT = FourCC("A11V");
  export const ROOT_AINZ_HOLD_OF_RIBS = FourCC("A12O");
  export const ROOT_GALAXY_DONUT = FourCC("A13T");

  // sleep
  export const HYPNOWAVE_SLEEP = FourCC("A0X9");
  export const AINZ_TIME_STOP_SLEEP = FourCC("A12R");

  // inner fire
  export const LUCARIO_FORCE_DEBUFF = FourCC("A0Y5");
  export const MAX_POWER_DMG_BUFF = FourCC('A114');
  export const SUPER_CHARGE_DMG_BUFF = FourCC('A115');
  export const AINZ_GREATER_HARDENING = FourCC('A12L');
  export const AINZ_GREATER_MAGIC_SHIELD = FourCC('A12M');
  export const AINZ_MAGIC_BOOST = FourCC('A12N');

  // soul burn
  export const MAFUBA_SEALED = FourCC("A10R");
  export const MAFUBA_SEALING = FourCC("A10S");
  export const DEMIURGE_COMMAND_SILENCE = FourCC("A13M");

  // wand of illusion
  export const APPULE_VENGEANCE_CLONE = FourCC("A11C");
  export const APPULE_CLONES = FourCC("A11F");
  export const SHALLTEAR_EINHERJAR = FourCC("A13B");

  // invisibility
  export const AINZ_INVISIBILITY = FourCC('A12P');

  // faerie fire
  export const DEMIURGE_HELLFIRE_1 = FourCC("A13K");
  export const DEMIURGE_HELLFIRE_2 = FourCC("A13L");
  export const FAERIE_FIRE_MINATO_KUNAI = FourCC("A00C");
  export const FAERIE_FIRE_NUOVA_HEAT_ARMOR = FourCC("A03Q");
}

export module Buffs {
  // buffs
  export const TIMED_LIFE = FourCC("BTLF");
  export const STUNNED = FourCC("BPSE");
  export const LIFE_REGENERATION_AURA = FourCC("B068"); // fountain
  export const BANISHED = FourCC("BHbn");

  export const HEROS_SONG = FourCC("B01H");

  export const COSMIC_ILLUSION = FourCC("B025");

  export const INNER_FIRE_AINZ_GREATER_MAGIC_SHIELD = FourCC("B05Z");
  export const INNER_FIRE_AINZ_MAGIC_BOOST = FourCC("B060");

  export const SLOW_KROWN_TOSS = FourCC("B02W");
  export const SLOW_ZAMASU_BLEED = FourCC("B01G");
  export const SLOW_FERVENT_WOUND = FourCC("B03M");

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

  export const MADNESS_CURSE_MISS = FourCC("B03X");

  export const MAFUBA_SEALED = FourCC("B05H");
  export const MAFUBA_SEALING = FourCC("B05I");

  export const SLOW_WALUIGI_FIREBALL_1 = FourCC("B05O");
  export const ROOT_WALUIGI_PIRANHA_PLANT = FourCC("B05P");
  export const STUN_WALUIGI_BOMB = FourCC("B05Q");
  export const CURSE_WALUIGI_SPIN = FourCC("B05R");

  export const SLOW_LEON_STAGGER = FourCC("B05T");
  export const SLOW_LINK_FIRE_ARROW = FourCC("B05X");

  export const OMEGA_SHENRON_ENVOY_AGI_PASSIVE = FourCC("B03E");

  export const ALBEDO_GUARDIAN_AURA = FourCC("B065");

  export const MIGHT_GUY_SUNSET_OF_YOUTH_AURA = FourCC("B06E");

  export const DEMIURGE_HELLFIRE_1 = FourCC("B06A");
  export const DEMIURGE_HELLFIRE_2 = FourCC("B06B");

  export const NUOVA_HEAT_ARMOR = FourCC("B06J");
}

export module OrderIds {
  export const THUNDERBOLT = 852095;
  export const CURSE = 852190;
  export const SLOW = 852075;
  export const ENTANGLING_ROOTS = 852171;
  export const SLEEP = 852227;
  export const INNER_FIRE = 852066;
  export const INVISIBILITY = 852069
  export const HOLY_BOLT = 852092;
  export const FAERIE_FIRE = 852149;
  export const SOUL_BURN = 852668;
  export const WAND_OF_ILLUSION = 852274;
  export const STOP = 851972;
  export const HOLD_POSITION = 851993;
  export const ATTACK = 851983;
  export const MOVE = 851986;
  export const SMART = 851971;
  export const PATROL = 851990;
  export const PHASE_SHIFT_OFF = 852516;
  export const PHASE_SHIFT_ON = 852515;
  export const MOVE_SLOT_1 = 852002;
  export const MOVE_SLOT_6 = 852007;
  export const PICK_UP_ITEM = 851981;
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

  export const battleArmor5 = FourCC("A0ZB");
  export const treeOfMightSapling = FourCC("A0ZC");
  export const potaraEarring = FourCC("A0ZD");
}


export module Terrain {
  export const any = -1;
  export const dirt = FourCC("Ldrt");
  export const grass = FourCC("Lgrs");
  export const grassyDirt = FourCC("Ldrg");
  export const sand = FourCC("Zsan");
  export const darkDesert = FourCC("Bdsd");
  export const ice = FourCC("Iice");
  export const vines = FourCC("Avin");
  export const brick = FourCC("Ybtl");
  export const greyStone = FourCC("Dgrs");
  export const lavaCracks = FourCC("Dlvc");
  export const poison = FourCC("Cpos");
  export const abyss = FourCC("Oaby");
  export const stonePath = 1366520944;
  export const crops = FourCC("Vcrp");
  export const snow = 1665753905;
  export const winterGrass = 1666671410;
}

export module Id {
  export const attack = FourCC("Aatk");
  export const inventoryHero = FourCC("AInv");
  export const ghostNonVis = FourCC("Agho");
  export const ghostVisible = FourCC("Aeth");
  export const locust = FourCC("Aloc");

  export const useItem = FourCC("A0VF");
  export const itemAndroidBomb = FourCC('A0NS');
  export const itemGetiStarFragment = FourCC('A0NT');
  export const itemSacredWaterAbility = FourCC("A02R");
  export const itemEisRays = FourCC("A036");
  export const itemNuovaHeatArmor = FourCC("A03O");
  export const itemCellMaxWings = FourCC("A04E");
  export const itemMajinBuuFat = FourCC("A04Q");
  export const itemKingColdArmor = FourCC("A04R");
  export const itemSuper17Generator = FourCC("A04S");

  export const heroSelectorUnit = FourCC("n001");
  export const ultimateCharge = FourCC("A13U");

  export const summonShenron = FourCC("I01V");

  export const neutralAndroid17 = FourCC("n01M");
  export const neutralAndroid18 = FourCC("n008");
  export const vendorElHermano = FourCC("n03U");
  export const vendorChefSatan = FourCC("n03T");
  export const vendorKorin = FourCC("n01P");
  export const vendorWhis = FourCC("n01G");

  export const ainzOoalGown = FourCC("H00Z");
  export const ainzRealitySlash = FourCC("A0I0");
  export const ainzBlackHole = FourCC("A0IQ");
  export const ainzGreaterThunder = FourCC("A0IT");
  export const ainzExplodeMine = FourCC("A0J0");
  export const ainzEnergyDrain = FourCC("A0K5");
  export const ainzGraspHeart = FourCC("A0JY");
  
  export const ainzBodyOfEffulgentBeryl = FourCC("A0KN");
  export const ainzGreaterHardening = FourCC("A0KZ");
  export const ainzGreaterFullPotential = FourCC("A11Z");
  export const ainzGreaterMagicShield = FourCC("A11Y");
  export const ainzMagicBoost = FourCC("A120");
  export const ainzPenetrateUp = FourCC("A121");
  
  export const ainzHoldOfRibs = FourCC("A122");
  export const ainzWallOfSkeleton = FourCC("A123");
  export const ainzPerfectUnknowable = FourCC("A124");
  export const ainzRemoteViewing = FourCC("A125");
  export const ainzGreaterTeleportation = FourCC("A126");
  export const ainzGate = FourCC("A127");
  
  export const ainzSummonAlbedo = FourCC("A128");
  export const ainzSummonShalltear = FourCC("A129");
  export const ainzSummonDemiurge = FourCC("A12A");
  export const ainzSummonPandora = FourCC("A12B");

  export const ainzTGOALID = FourCC("A12G");
  export const ainzFallenDown = FourCC("A12H");
  export const ainzLaShubNiggurath = FourCC("A12I");
  export const ainzTimeStop = FourCC("A12Q");
  export const ainzResistance = FourCC("A12S");
  export const ainzWish = FourCC("A12J");

  export const albedo = FourCC("H013");
  export const albedoDress = FourCC("H010");
  export const albedoDecapitate = FourCC("A12T");
  export const albedoDefensiveSlash = FourCC("A12U");
  export const albedoChargeAttack = FourCC("A12V");
  export const albedoAegis = FourCC("A12W");
  export const albedoFormSwap = FourCC("A12Y");
  export const albedoSkillBoost = FourCC("A12X");
  export const albedoGinnungagap = FourCC("A12Z");
  export const albedoGuardianAura = FourCC("A130");
  export const albedoVoracityAura = FourCC("A131");
  export const albedoFearAura = FourCC("A132");

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

  export const appule = FourCC("H0AI");
  export const appuleBlaster = FourCC("A104");
  export const appuleEscape = FourCC("A116");
  export const appuleVengeance = FourCC("A11B");
  export const appuleClones = FourCC("A11E");

  export const babidi = FourCC("O001");
  export const haretsu = FourCC("A02E");
  export const babidiBarrier = FourCC("A0LG");
  export const babidiMagic = FourCC("A0JQ");
  export const babidiDabura = FourCC("A03E");
  export const babidiDaburaUnit = FourCC("O000");
  export const babidiYakonUnit = FourCC("O009");

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
  export const candyGobbler = FourCC("A0LL");
  export const fleshAttack = FourCC("A01C");
  export const fleshAttackAbsorbTarget = FourCC("A06S");
  export const innocenceBreath = FourCC("A0LH");
  export const angryExplosion = FourCC("A0ER")
  export const vanishingBall = FourCC("A0C0");
  export const mankindDestructionAttack = FourCC("A01D");

  export const cellUnformed = FourCC("N00Q");
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
  export const cellJrKame = FourCC("A0CT");

  export const cellMax = FourCC("H00Y");
  export const cellMaxTailWhip = FourCC("A0HD");
  export const cellMaxScream = FourCC("A0HF");
  export const cellMaxBlock = FourCC("A0HG");
  export const cellMaxBarrier = FourCC("A0HM");
  export const cellMaxBarrier2 = FourCC("A0HY");
  export const cellMaxDisaster = FourCC("A0HZ");

  export const crono = FourCC("H0A0");
  export const cronoCyclone = FourCC("A0VP");
  export const cronoSlash = FourCC("A0VQ");
  export const cronoLightning = FourCC("A0VR");
  export const cronoLightning2 = FourCC("A0VS");
  export const cronoLightning3 = FourCC("A0WM");
  export const cronoCleave = FourCC("A0VT");
  export const cronoLuminaire = FourCC("A0VU");

  export const demiurge = FourCC("H017");
  export const demiurgeHellfireWall = FourCC("A13C");
  export const demiurgeGiantArm = FourCC("A13D");
  export const demiurgeCommand = FourCC("A13E");
  export const demiurgeMeteorFall = FourCC("A13F");
  export const demiurgeJaldabaoth = FourCC("A13G");
  export const demiurgeHellfireMantle = FourCC("A13H");
  export const demiurgePermaInvis = FourCC("A13J");

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

  export const dende = FourCC("H04D");
  export const dendeSacredWater = FourCC("A0C5");
  export const dendeSacredWater2 = FourCC("A06T");
  export const dendeHeal = FourCC("A0C6");
  export const dendeHeal2 = FourCC("A0C7");
  export const dendeGuardianDevotion = FourCC("A0CV");
  export const dendeArmorAura = FourCC("A0EJ");
  export const dendeOrange = FourCC("A06V");
  export const dendeOrangeFlag = FourCC("A0EV");

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
  export const plantWheat = FourCC("A0ZN");
  export const plantCorn = FourCC("A0ZO");
  export const plantRice = FourCC("A0ZP");
  export const farmerWarehouse = FourCC("h0AC");
  export const farmerSuperWarehouse = FourCC("h0AF");
  export const farmerHarvester = FourCC("h0AD");
  export const farmerToggleHarvestEngine = FourCC("A0ZR");
  export const farmerDisableWarehousing = FourCC("A0ZV");
  export const farmerEnableWarehousing = FourCC("A0ZW");
  export const farmerAdvancedHarvester = FourCC("h0AE");

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

  export const getiStarHero = FourCC("H002");
  export const metalCoolerClone = FourCC("H01Z");
  export const getiStarUpgradeCDR = FourCC("R00M");
  export const getiStarUpgradeSpellPower = FourCC("R00K");

  export const ginyu = FourCC("H09E");
  export const milkyCannon = FourCC("A0PP");
  export const galaxyDynamite = FourCC("A0PQ");
  export const ginyuTelekinesis = FourCC("A0PR");
  export const ginyuPoseUltimate = FourCC("A0PS");
  export const ginyuPoseFighting = FourCC("A0PT");
  export const ginyuChangeNow = FourCC("A0PO");
  export const ginyuChangeNowConfirm = FourCC("A0PN");

  export const gohan = FourCC("H00K");
  export const masenko = FourCC("A0H8");
  export const superMasenko = FourCC("A0TU");
  export const twinDragonShot = FourCC("A0IS");
  export const superDragonFlight = FourCC("A0L5");
  export const fatherSonKame = FourCC("A0OY");
  export const specialBeastCannon = FourCC("A11M");
  export const unlockPotential = FourCC("A0L6");
  export const greatSaiyamanHasArrived = FourCC("A0L7");
  export const potentialUnleashed = FourCC("A0L8");
  export const beastGohan = FourCC("A11L");

  export const goku = FourCC("H000");
  export const kamehameha = FourCC("A00R");
  export const kamehamehaGod = FourCC('A0L9');
  export const spiritBomb = FourCC('A0JP');
  export const dragonFist = FourCC("A00U");
  export const superDragonFist = FourCC("A0P0");
  export const solarFlare = FourCC("A0KO");
  export const ultraInstinct = FourCC('A0KR');
  export const masteredUltraInstinct = FourCC('A0MZ');

  export const gokuBlack = FourCC("E019");
  export const gokuBlackClone = FourCC("E01A");
  export const gokuBlackKamehameha = FourCC("A0IL");
  export const gokuBlackDivineLasso = FourCC("A0IM");
  export const gokuBlackDivineRetribution = FourCC("A0IN");
  export const gokuBlackWorkOfGods = FourCC("A0IO");
  export const gokuBlackSorrowfulScythe = FourCC("A0IP");

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
  
  export const guts = FourCC("H0AJ");
  export const gutsHeavySlash = FourCC("A105");
  export const gutsHeavySlam = FourCC("A106");
  export const gutsCannonArm = FourCC("A107");
  export const gutsCannonSlash = FourCC("A108");
  export const gutsRecklessCharge = FourCC("A109");
  export const gutsRelentlessAssault = FourCC("A10A");
  export const gutsRage = FourCC("A10B");
  export const gutsBerserk = FourCC("A10C");
  export const gutsBerserkerArmor = FourCC("A10D");
  export const gutsBeastOfDarkness = FourCC("A10E");
  export const gutsDragonCannonShot = FourCC("A10L");
  export const gutsBurstingFlame = FourCC("A10M");

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

  export const jaco = FourCC("H0AL");
  export const jacoEliteBeamCharge = FourCC("A10T");
  export const jacoEliteBeamPrime = FourCC("A10U");
  export const jacoEliteBeamFire = FourCC("A10V");
  export const jacoAnnihilationBomb = FourCC("A10W");
  export const jacoRocketBoots = FourCC("A10X");
  export const jacoEmergencyBoost = FourCC("A10Y");
  export const jacoSuperEliteCombo = FourCC("A10Z");
  export const jacoElitePose = FourCC("A110");
  export const jacoShip = FourCC("A111");
  export const jacoSuperJaco = FourCC("A112");

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

  export const leonSKennedy = FourCC("H00B");
  export const leonPistol = FourCC("A00M");
  export const leonKnifeSlash = FourCC("A01T");
  export const leonKnifeParry = FourCC("A01Q");
  export const leonRoundhouseKick = FourCC("A00X");
  export const leonShotgun = FourCC("A02G");
  export const leonAssaultRifle = FourCC("A02K");
  export const leonSniperRifle = FourCC("A02O");
  export const leonRocketLauncher = FourCC("A037");
  export const leonFlashbang = FourCC("A038");
  export const leonHeavyGrenade = FourCC("A03A");

  export const linkTwilight = FourCC("H00X");
  export const linkSideSlash = FourCC("A0FK");
  export const linkBoomerang = FourCC("A0FL");
  export const linkBombCharge = FourCC("A0FM");
  export const linkBombThrow = FourCC("A0FN");
  export const linkBow = FourCC("A0FX");
  export const linkHookshot = FourCC("A0G4");
  export const linkHookshotPullTowards = FourCC("A0G5");
  export const linkHookshotPullIn = FourCC("A0G9");
  export const linkInventoryBook = FourCC("A0GA");
  export const linkArrowNormal = FourCC("A0GB");
  export const linkArrowFire = FourCC("A0GC");
  export const linkArrowIce = FourCC("A0GE");
  export const linkArrowLightning = FourCC("A0GF");
  export const linkArrowBomb = FourCC("A0H2");

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

  export const mightGuy = FourCC("H005");
  export const mightGuyDynamicEntry = FourCC("A00O");
  export const mightGuyLeafHurricane = FourCC("A00Y");
  export const mightGuyFrontLotus = FourCC("A012");
  export const mightGuyReverseLotus = FourCC("A015");
  export const mightGuySunsetOfYouth = FourCC("A016");
  export const mightGuySunsetOfYouthAura = FourCC("A028");
  export const mightGuyGate5 = FourCC("A01I");
  export const mightGuyGate6 = FourCC("A01M");
  export const mightGuyGate7 = FourCC("A01O");
  export const mightGuyGate8 = FourCC("A01R");
  export const mightGuyGateArmor = FourCC("A02I");
  export const mightGuyAsaKujaku = FourCC("A020");
  export const mightGuyHirudora = FourCC("A021");
  export const mightGuySekizo = FourCC("A023");
  export const mightGuyYagai = FourCC("A024");

  export const minato = FourCC("H001");
  export const minatoKunai = FourCC("A000");
  export const minatoFirstFlash = FourCC("A001");
  export const minatoSecondStep = FourCC("A002");
  export const minatoThirdStage = FourCC("A003");
  export const minatoSpiralFlash = FourCC("A00D");
  export const minatoHiraishin = FourCC("A004");
  export const minatoKuramaMode = FourCC("A009");
  export const minatoKuramaModeFlag = FourCC("A00A");

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
  export const roshiMafuba = FourCC("A10Q");
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

  export const moro = FourCC("H08Y");

  export const megumin = FourCC("H00L");
  export const meguminExplosion1 = FourCC("A03J");
  export const meguminExplosion2 = FourCC("A042");
  export const meguminExplosion3 = FourCC("A048");
  export const meguminExplosion4 = FourCC("A04A");
  export const meguminExplosion5 = FourCC("A04C");
  export const meguminPassive = FourCC("A04G");
  export const meguminManatite = FourCC("A05Y");
  export const meguminInvul = FourCC("A05X");

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

  export const pecorine = FourCC("H00V");
  export const pecorinePrincessSplash = FourCC("A07F");
  export const pecorineRoyalSlash = FourCC("A07S");
  export const pecorineOnigiriTime = FourCC("A080");
  export const pecorinePrincessStrike = FourCC("A0A2");
  export const pecorinePrincessValiant = FourCC("A0B4");
  export const pecorinePrincessForce = FourCC("A0B7");
  export const pecorinePrincessSword = FourCC("A0B8");
  export const pecorineArmr = FourCC("A0B9");
  export const pecorineEatFlag = FourCC("A0BA");

  export const piccolo = FourCC("H00R");
  export const kyodaika = FourCC("A04Y");
  export const piccoloSBC = FourCC("A06F");
  export const piccoloCloneSBC = FourCC("A0ES");
  export const slappyHand = FourCC("A0C8");
  export const hellzoneGrenade = FourCC("A0LM");
  export const multiForm = FourCC('A088');
  export const lightGrenade = FourCC("A11K");
  
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

  export const shalltearBloodfallen = FourCC("H015");
  export const shalltearPurifyingJavelin = FourCC("A133");
  export const shalltearVermilionNova = FourCC("A134");
  export const shalltearMistForm = FourCC("A135");
  export const shalltearNegativeImpactShield = FourCC("A136");
  export const shalltearEinherjar = FourCC("A137");
  export const shalltearValhalla = FourCC("A138");
  export const shalltearTimeReverse = FourCC("A139");

  export const shotoTodoroki = FourCC("H05X");
  export const shotoTodorokiGlacier = FourCC("A0YR");
  export const shotoTodorokiWallOfFlames = FourCC("A0YS");
  export const shotoTodorokiIcePath = FourCC("A0YT");
  export const shotoTodorokiFlashfreezeHeatwave = FourCC("A0YU");
  export const shotoTodorokiHeavenPiercingIceWall = FourCC("A0YY");
  export const shotoTodorokiFlashfireFist = FourCC("A0YZ");
  export const shotoTodorokiHeatingUp = FourCC("A0YV");
  export const shotoTodorokiCoolingDown = FourCC("A0YW");
  
  export const sonic = FourCC("H0AA");
  export const sonicJump = FourCC("A0ZE");
  export const sonicInstaShield = FourCC("A0ZH");
  export const sonicHomingAttack = FourCC("A0ZI");
  export const sonicSpinDash = FourCC("A0ZJ");
  export const sonicLightSpeedDash = FourCC("A0ZK");
  export const sonicSpin = FourCC("A0ZG");
  export const sonicSuper = FourCC("A0ZF");

  export const super17 = FourCC("H05V");
  export const super17Skin = FourCC("H05B");
  export const super17FlashBomber = FourCC("A0GT");
  export const super17FlashBomber2 = FourCC("A0XJ");
  export const super17HellStorm = FourCC("A0GU");
  export const super17ShockingDeathBall = FourCC("A0H1");
  export const super17Absorption = FourCC("A0P8");

  export const taoGrenade = FourCC("h04M");

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
  export const toppoHakai = FourCC("A0PH");

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

  export const vegetaMajin = FourCC("H019");
  export const vegetaMajinGalickGun = FourCC("A13N");
  export const vegetaMajinGalaxyBreaker = FourCC("A13O");
  export const vegetaMajinBigBangAttack2 = FourCC("A13P");
  export const vegetaMajinFinalFlash = FourCC("A13Q");
  export const vegetaMajinGalaxyDonut = FourCC("A13R");
  export const vegetaMajinFinalExplosion = FourCC("A13S");

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
  export const skurvyPower = FourCC("A0ZA");
  export const skurvyPlunderBird = FourCC("nalb");
  
  export const waluigi = FourCC("H0AO");
  export const waluigiFireball = FourCC("A11N");
  export const waluigiSuperFireball = FourCC("A11O");
  export const waluigiPiranhaPlant = FourCC("A11P");
  export const waluigiBomb = FourCC("A11Q");
  export const waluigiSpin = FourCC("A11R");
  export const waluigiJump = FourCC("A11S");

  export const yamchaR = FourCC("E010");
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

  export const zamasu = FourCC("E012");
  export const zamasuImmortality = FourCC("A0SW");


  export const itemHealingBuff = FourCC("BIrg");

}