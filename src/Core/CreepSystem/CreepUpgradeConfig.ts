import { RandomCreepType } from "./CreepUpgradeTypes";

export module SagaUpgradeNames {
  export const POST_SAIYANS = "PostSaiyans";
  export const PRE_SLUG = "PreSlug";
  export const PRE_TRUNKS = "PreTrunks";
  export const BIG_DINOS = "BigDinos";
  export const GETI_STAR = "GetiStar";
}

export module CreepResearchUpgrade {
  export const INTERVAL = 120;
  export const MAX_LEVEL = 50;
  export const ATTACK_SPEED_HP_UPG = FourCC("R008");
  export const ARMOR_UPG = FourCC("R009");

  export const UPGRADES_TO_RESEARCH = [
    ATTACK_SPEED_HP_UPG,
    // ARMOR_UPG,
  ]
}

export module Creep {
  export const WolfBaby = FourCC("n020");
  export const NamekianFrog = FourCC("n02P");

  export const RRSoldier1 = FourCC("n01D");  // lvl 2
  export const RRSoldierGun2 = FourCC("n01E"); // lvl 5
  export const RRSoldier3 = FourCC("n03G"); // lvl 9

  export const RRDefenseDroid = FourCC("n015"); // lvl 2
  export const RRBattleDroid = FourCC("n019"); // lvl 4
  export const RREnforcerDroid = FourCC("n01A"); // lvl 7
  export const RRPunisherDroid = FourCC("n031"); // lvl 14

  export const DinosaurBaby = FourCC("n02F"); // lvl 2
  export const DinosaurTeen = FourCC("n02E"); // lvl 4
  export const DinosaurSmall = FourCC("n03A"); // lvl 5
  export const DinosaurLarge = FourCC("n00D"); // lvl 25
  export const Pterodactyl = FourCC("n03B"); // lvl 10
    
  export const WolfNormal = FourCC("n014"); // lvl 5
  export const WolfAdult = FourCC("n038"); // lvl 8

  export const Saibaman = FourCC("n037"); // lvl 6
  export const Bull = FourCC("n039"); // lvl 8
  export const BearThief = FourCC("n03C"); // lvl 12

  export const FishBaby = FourCC("n01U"); // lvl 4
  export const FishAdult = FourCC("n02H"); // lvl 20
  export const SeaSerpent = FourCC("n00A"); // lvl 10
  export const CrocodileGiant = FourCC("n02Q"); // lvl 13
  export const CrocodileMother = FourCC("n02S"); // lvl 30

  export const SlugGuard = FourCC("z004"); // lvl 13
  export const SlugDefenseDroid = FourCC("n021"); // lvl 16

  export const WolfAlpha = FourCC("n02G"); // lvl 14
  export const Mummy = FourCC("n00N"); // lvl 19
  export const BirdHater = FourCC("n03M"); // lvl 32

  export const EvilSpirit = FourCC("n023"); // lvl 21
  export const SpookyGhost = FourCC("n03L"); // lvl 26
  export const AngryGhost = FourCC("n00O"); // lvl 30
  export const DarkSpirit = FourCC("n034"); // lvl 35

  export const FriezaScout = FourCC("n028"); // lvl 4
  export const FriezaHenchmen = FourCC("n02R"); // lvl 17
  export const FriezaOrlen = FourCC("n00Y"); // lvl 13 orange
  export const FriezaNabana = FourCC("n00Z"); // lvl 13 green
  export const FriezaRobery = FourCC("n010"); // lvl 13 brown (pink)
  export const FriezaAppule = FourCC("n011"); // lvl 17 purple
  export const FriezaPineapple = FourCC("n012"); // lvl 22 yellow
  export const FriezaStrawberry = FourCC("n017") // lvl 30 red
  export const FriezaGreyberry = FourCC("n018") // lvl 32 grey

  export const MetalCoolerClone = FourCC("n03W"); // lvl 18

  // maybe use these for when hell opens up?
  export const YenmaHelper = FourCC("n01X"); // lvl 2
  export const LostSoul = FourCC("n02C"); // lvl 3
  export const YenmaGuard = FourCC("n02J"); // lvl 12
  export const YenmaElite = FourCC("n02K"); // lvl 17
  export const SoulLord = FourCC("n02D"); // lvl 17
  export const SoulKing = FourCC("n02I"); // lvl 21
  export const PrimalDemon = FourCC("n032"); // lvl 21, 10 stats
  export const PrimalDemonKing = FourCC("n032"); // lvl 25, 15 stats

}


export interface CreepUpgradeConfig {
  upgradeGroups: {
    [upgradeKey: string]: {
      // key: unit type upgraded from
      // value: unit type upgraded to
      map: Map<number, RandomCreepType[]>
    }
  }
}

export let DefaultCreepUpgradeConfig: CreepUpgradeConfig = {
  upgradeGroups: {
    PostSaiyans: {
      map: new Map<number, RandomCreepType[]>(
        [
          // [
          //   Creep.RRSoldier1, // from unit type (key)
          //   [
          //     // to unit type(s) (value)
          //     new RandomCreepType(Creep.Saibaman, 1.0),
          //   ]
          // ],
          [Creep.RRSoldier1, [
            new RandomCreepType(Creep.Saibaman, 1.0)
          ]],
          [Creep.RRDefenseDroid, [
            new RandomCreepType(Creep.Saibaman, 1.0)
          ]],
          [Creep.RRBattleDroid, [
            new RandomCreepType(Creep.WolfAdult, 1.0)
          ]],
          [Creep.RRSoldierGun2, [
            new RandomCreepType(Creep.Bull, 1.0)
          ]],
          [Creep.RREnforcerDroid, [
            new RandomCreepType(Creep.BearThief, 1.0)
          ]],
          [Creep.DinosaurBaby, [
            new RandomCreepType(Creep.DinosaurSmall, 0.5),
            new RandomCreepType(Creep.DinosaurTeen, 0.45),
            new RandomCreepType(Creep.Pterodactyl, 0.05)
          ]],
          [Creep.DinosaurTeen, [
            new RandomCreepType(Creep.DinosaurSmall, 0.9),
            new RandomCreepType(Creep.Pterodactyl, 0.1)
          ]],
          [Creep.CrocodileGiant, [
            new RandomCreepType(Creep.CrocodileMother, 1.0),
          ]],
          [Creep.NamekianFrog, [
            new RandomCreepType(Creep.CrocodileGiant, 0.2),
          ]],
          [Creep.FriezaScout, [
            new RandomCreepType(Creep.FriezaHenchmen, 0.3),
          ]],
        ]
      )
    },
    PreSlug: {
      map: new Map<number, RandomCreepType[]>(
        [
          [Creep.RRSoldier1, [
            new RandomCreepType(Creep.SlugGuard, 1.0)
          ]],
          [Creep.RRDefenseDroid, [
            new RandomCreepType(Creep.SlugGuard, 1.0)
          ]],
          [Creep.RRBattleDroid, [
            new RandomCreepType(Creep.SlugDefenseDroid, 1.0)
          ]],
          [Creep.RRSoldierGun2, [
            new RandomCreepType(Creep.SlugDefenseDroid, 1.0)
          ]],
          [Creep.RREnforcerDroid, [
            new RandomCreepType(Creep.EvilSpirit, 1.0)
          ]],
          [Creep.Saibaman, [
            new RandomCreepType(Creep.SlugGuard, 1.0)
          ]],
          [Creep.Bull, [
            new RandomCreepType(Creep.SlugDefenseDroid, 1.0)
          ]],
          [Creep.WolfAdult, [
            new RandomCreepType(Creep.SlugDefenseDroid, 1.0)
          ]],
          [Creep.BearThief, [
            new RandomCreepType(Creep.EvilSpirit, 1.0)
          ]],
          [Creep.WolfNormal, [
            new RandomCreepType(Creep.EvilSpirit, 1.0)
          ]],
          [Creep.RRSoldier3, [
            new RandomCreepType(Creep.SpookyGhost, 1.0)
          ]],
          [Creep.RRPunisherDroid, [
            new RandomCreepType(Creep.AngryGhost, 1.0)
          ]],
          [Creep.FishBaby, [
            new RandomCreepType(Creep.FishAdult, 0.85),
            new RandomCreepType(Creep.SeaSerpent, 0.15),
          ]],
          [Creep.DinosaurTeen, [
            new RandomCreepType(Creep.Pterodactyl, 0.65),
            new RandomCreepType(Creep.DinosaurSmall, 0.35),
          ]],
          [Creep.DinosaurBaby, [
            new RandomCreepType(Creep.DinosaurSmall, 0.7),
            new RandomCreepType(Creep.Pterodactyl, 0.2),
            new RandomCreepType(Creep.DinosaurTeen, 0.1),
          ]],
          [Creep.NamekianFrog, [
            new RandomCreepType(Creep.CrocodileGiant, 1.0),
          ]],
          [Creep.FriezaScout, [
            new RandomCreepType(Creep.FriezaHenchmen, 1.0)
          ]],
        ]
      )
    },
    // can skip slug creeps and go straight to this
    PreTrunks: {
      map: new Map<number, RandomCreepType[]>(
        [
          [Creep.Saibaman, [
            new RandomCreepType(Creep.FriezaOrlen, 0.5),
            new RandomCreepType(Creep.FriezaNabana, 0.3),
            new RandomCreepType(Creep.FriezaRobery, 0.2),
          ]],
          [Creep.Bull, [
            new RandomCreepType(Creep.FriezaAppule, 0.9),
            new RandomCreepType(Creep.FriezaRobery, 0.1),
          ]],
          [Creep.WolfAdult, [
            new RandomCreepType(Creep.FriezaAppule, 1.0),
          ]],
          [Creep.BearThief, [
            new RandomCreepType(Creep.FriezaPineapple, 1.0)
          ]],
          [Creep.WolfNormal, [
            new RandomCreepType(Creep.FriezaPineapple, 1.0)
          ]],
          [Creep.RRSoldier3, [
            new RandomCreepType(Creep.FriezaStrawberry, 1.0)
          ]],
          [Creep.RRPunisherDroid, [
            new RandomCreepType(Creep.FriezaGreyberry, 1.0)
          ]],
          // seafood
          [Creep.FishBaby, [
            new RandomCreepType(Creep.FishAdult, 0.9),
            new RandomCreepType(Creep.SeaSerpent, 0.1),
          ]],
          [Creep.SeaSerpent, [
            new RandomCreepType(Creep.FishAdult, 1.0),
          ]],
          // dinos
          [Creep.DinosaurTeen, [
            new RandomCreepType(Creep.Pterodactyl, 0.8),
            new RandomCreepType(Creep.DinosaurSmall, 0.2),
          ]],
          [Creep.DinosaurSmall, [
            new RandomCreepType(Creep.Pterodactyl, 0.6),
            new RandomCreepType(Creep.DinosaurLarge, 0.4),
          ]],
          [Creep.Pterodactyl, [
            new RandomCreepType(Creep.DinosaurLarge, 1.0),
          ]],
          // slug conversion if necessary
          [Creep.SlugGuard, [
            new RandomCreepType(Creep.FriezaOrlen, 0.5),
            new RandomCreepType(Creep.FriezaNabana, 0.3),
            new RandomCreepType(Creep.FriezaRobery, 0.2),
          ]],
          [Creep.SlugDefenseDroid, [
            new RandomCreepType(Creep.FriezaAppule, 0.9),
            new RandomCreepType(Creep.FriezaRobery, 0.1),
          ]],
          [Creep.EvilSpirit, [
            new RandomCreepType(Creep.FriezaPineapple, 1.0)
          ]],
          [Creep.SpookyGhost, [
            new RandomCreepType(Creep.FriezaStrawberry, 1.0)
          ]],
          [Creep.AngryGhost, [
            new RandomCreepType(Creep.FriezaGreyberry, 1.0)
          ]],
        ]
      )
    },
    BigDinos: {
      map: new Map<number, RandomCreepType[]>(
        [
          [Creep.FriezaOrlen, [
            new RandomCreepType(Creep.WolfAlpha, 1.0),
          ]],
          [Creep.FriezaNabana, [
            new RandomCreepType(Creep.WolfAlpha, 1.0),
          ]],
          [Creep.FriezaRobery, [
            new RandomCreepType(Creep.WolfAlpha, 1.0),
          ]],
          [Creep.FriezaAppule, [
            new RandomCreepType(Creep.Mummy, 1.0),
          ]],
          [Creep.FriezaStrawberry, [
            new RandomCreepType(Creep.BirdHater, 1.0),
          ]],
          [Creep.FriezaGreyberry, [
            new RandomCreepType(Creep.DarkSpirit, 1.0),
          ]],
          [Creep.DinosaurSmall, [
            new RandomCreepType(Creep.DinosaurLarge, 1.0),
          ]],
          [Creep.Pterodactyl, [
            new RandomCreepType(Creep.DinosaurLarge, 1.0),
          ]],
          [Creep.SeaSerpent, [
            new RandomCreepType(Creep.FishAdult, 1.0),
          ]],
        ]
      )
    },
    GetiStar: {
      map: new Map<number, RandomCreepType[]>(
        [
          [Creep.FriezaScout, [
            new RandomCreepType(Creep.MetalCoolerClone, 1.0),
          ]],
          [Creep.FriezaHenchmen, [
            new RandomCreepType(Creep.MetalCoolerClone, 1.0),
          ]],
        ]
      )
    },
  }
}