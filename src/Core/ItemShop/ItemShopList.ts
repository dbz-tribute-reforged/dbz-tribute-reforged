import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { ItemShopCategory } from "./ItemShopCategory";
import { TournamentData } from "Core/TournamentSystem/TournamentData";

export const ItemShopList = [
  // armor
  {
    id: ItemConstants.SagaDrops.BATTLE_ARMOR_1,
    lumberCost: 50,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
    ],
    recipe: [],
  },
  {
    id: ItemConstants.SagaDrops.BATTLE_ARMOR_2,
    lumberCost: 100,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_1,
      ItemConstants.SagaDrops.BATTLE_ARMOR_1,
    ],
  },
  {
    id: ItemConstants.SagaDrops.BATTLE_ARMOR_3,
    lumberCost: 150,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_2,
      ItemConstants.SagaDrops.BATTLE_ARMOR_1,
    ],
  },
  {
    id: ItemConstants.SagaDrops.BATTLE_ARMOR_4,
    lumberCost: 200,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_3,
      ItemConstants.SagaDrops.BATTLE_ARMOR_1,
    ],
  },
  {
    id: ItemConstants.SagaDrops.BATTLE_ARMOR_5,
    lumberCost: 250,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_4,
      ItemConstants.SagaDrops.BATTLE_ARMOR_1,
    ],
  },
  {
    id: ItemConstants.SagaDrops.KING_COLD_ARMOR,
    lumberCost: 200 + 250 + 200,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
      ItemShopCategory.INT,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_4,
    ],
  },
  {
    id: ItemConstants.SagaDrops.BROLY_FUR,
    lumberCost: 1000,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ARMOR,
      ItemShopCategory.STR,
      ItemShopCategory.AGI,
    ],
    recipe: [
      ItemConstants.SagaDrops.BATTLE_ARMOR_5,
    ],
  },

  // swords 
  {
    id: ItemConstants.zSword,
    lumberCost: 100,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
      ItemShopCategory.INT,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BEE_DOG_ITEM,
    lumberCost: 300,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
      ItemShopCategory.ARMOR,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BRAVE_SWORD,
    lumberCost: 400,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.DABURA_SWORD,
    lumberCost: 400,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
      ItemShopCategory.AGI,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.DIMENSION_SWORD,
    lumberCost: 600,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
    ],
    recipe: [
    ],
  },

  // str
  {
    id: ItemConstants.SagaDrops.VEGETA_TAIL,
    lumberCost: 200,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.STR,
      ItemShopCategory.MOVE_SPEED,
    ],
    recipe: [
    ],
  },

  // agi
  {
    id: ItemConstants.SagaDrops.POWER_POLE,
    lumberCost: 150,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.AGI,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.SORROWFUL_SCYTHE,
    lumberCost: 300,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.ATTACK,
      ItemShopCategory.AGI,
    ],
    recipe: [
    ],
  },

  // int
  {
    id: ItemConstants.SagaDrops.WHIS_STAFF,
    lumberCost: 250,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.INT,
    ],
    recipe: [
    ],
  },

  // universal
  {
    id: ItemConstants.SagaDrops.FRIEZA_TAIL,
    lumberCost: 200,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.STR,
      ItemShopCategory.AGI,
      ItemShopCategory.INT,
      ItemShopCategory.MOVE_SPEED,
    ],
    recipe: [
    ],
  },

  // offensive
  {
    id: ItemConstants.SagaDrops.ANDROID_BOMB,
    lumberCost: 300,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.OFFENSIVE,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BIO_LAB_RESEARCH,
    lumberCost: 400,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.OFFENSIVE,
    ],
    recipe: [
    ],
  },

  // defensive
  {
    id: ItemConstants.SagaDrops.GETI_STAR_FRAGMENT,
    lumberCost: 400,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.DEFENSIVE,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.SACRED_WATER,
    lumberCost: 500,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.DEFENSIVE,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.DEAD_ZONE_FRAGMENT,
    lumberCost: 900,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.DEFENSIVE,
      ItemShopCategory.CROWD_CONTROL,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BEERUS_PUDDING,
    lumberCost: 1000,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.DEFENSIVE,
    ],
    recipe: [
    ],
  },

  // crowd control
  {
    id: ItemConstants.SagaDrops.BABIDI_ENERGY_ABSORBER,
    lumberCost: 400,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.CROWD_CONTROL,
      ItemShopCategory.MANA_REGEN,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BROLY_COLLAR,
    lumberCost: 500,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.CROWD_CONTROL,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.SORBET_RING,
    lumberCost: 500,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.CROWD_CONTROL,
      ItemShopCategory.OFFENSIVE,
    ],
    recipe: [
    ],
  },

  // utility
  {
    id: ItemConstants.SagaDrops.SCOUTER_2,
    lumberCost: 200,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.DARKNESS_GENERATOR,
    lumberCost: 250,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.SAIBAMEN_SEEDS,
    lumberCost: 300,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.PASSIVE,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.TIME_RING,
    lumberCost: 400,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
      ItemShopCategory.HP_REGEN,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.SPARE_PARTS,
    lumberCost: 800,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.TREE_OF_MIGHT_FRUIT,
    lumberCost: 900,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
      ItemShopCategory.HP_REGEN,
    ],
    recipe: [
    ],
  },

  // movement speed
  {
    id: ItemConstants.SagaDrops.GERO_BOOTS,
    lumberCost: 100,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.MOVE_SPEED,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BOJACK_HEADBAND,
    lumberCost: 200,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.MOVE_SPEED
    ],
    recipe: [
    ],
  },

  // regen
  {
    id: ItemConstants.SagaDrops.WHEELO_RESEARCH_1,
    lumberCost: 200,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.HP_REGEN,
      ItemShopCategory.MANA_REGEN,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.SagaDrops.BANANA_GENERATOR,
    lumberCost: 500,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.HP_REGEN,
      ItemShopCategory.MANA_REGEN,
    ],
    recipe: [
    ],
  },

  // unique / character specific
  {
    id: ItemConstants.dragonBallItem,
    lumberCost: 250,
    category: [
      ItemShopCategory.ACTIVE,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.CLEANSED_DRAGONBALL,
    lumberCost: 400,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.STR,
      ItemShopCategory.INT,
    ],
    recipe: [
    ],
  },
  {
    id: ItemConstants.crystalCoconut,
    lumberCost: 1100,
    category: [
      ItemShopCategory.PASSIVE,
      ItemShopCategory.STR,
      ItemShopCategory.AGI,
      ItemShopCategory.INT,
      ItemShopCategory.UTILITY,
    ],
    recipe: [
    ],
  },
];