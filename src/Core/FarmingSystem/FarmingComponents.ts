import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { Id, Terrain, Constants } from "Common/Constants";

export const FarmingComponentsList = [
  {
    abilityId: Id.plantWheat,
    producedItems: [
      {
        itemId: ItemConstants.Farming.WHEAT, 
        terrainId: Terrain.any
      }
    ],
    repeatInterval: 1, 
    duration: Constants.FARMING_STANDARD_DURATION,
    sfxSizeStart: 0.5,
    sfxSizeEnd: 1.5,
    sfxBase: "Doodads\\LordaeronSummer\\Plants\\Wheat\\Wheat.mdl",
    growthFarmland: 2.0,
    growthGrass: 1.0,
    growthDirt: 1.0,
    growthWater: 0.75,
    growthSnow: 0.5,
    growthBlightRocky: 0.25,
  },
  {
    abilityId: Id.plantCorn,
    producedItems: [
      {
        itemId: ItemConstants.Farming.CORN, 
        terrainId: Terrain.any
      }
    ],
    repeatInterval: 1, 
    duration: Constants.FARMING_STANDARD_DURATION,
    sfxSizeStart: 0.5,
    sfxSizeEnd: 1.5,
    sfxBase: "Doodads\\LordaeronSummer\\Plants\\Corn\\Corn.mdl",
    growthFarmland: 1.5,
    growthGrass: 1.25,
    growthDirt: 1.5,
    growthWater: 0.5,
    growthSnow: 0.5,
    growthBlightRocky: 0.25,
  },
  {
    abilityId: Id.plantRice,
    producedItems: [
      {
        itemId: ItemConstants.Farming.RICE_SNOW, 
        terrainId: Terrain.snow
      },
      {
        itemId: ItemConstants.Farming.RICE, 
        terrainId: Terrain.any
      }
    ],
    repeatInterval: 1, 
    duration: Constants.FARMING_STANDARD_DURATION,
    sfxSizeStart: 0.5,
    sfxSizeEnd: 1.5,
    sfxBase: "Doodads\\Felwood\\Plants\\FelwoodCatTail\\FelwoodCatTail.mdl",
    growthFarmland: 0.75,
    growthGrass: 0.25,
    growthDirt: 0.5,
    growthWater: 2.0,
    growthSnow: 1.5,
    growthBlightRocky: 0.2,
  },
];