import { Terrain, Id } from "Common/Constants";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class FarmProductData implements Serializable<FarmProductData> {
  constructor(
    public itemId: number = 0,
    public terrainId: number = 0
  ) {

  }

  deserialize(
    input: {
      itemId: number,
      terrainId: number
    }
  ) {
    this.itemId = input.itemId;
    this.terrainId = input.terrainId;
    return this;
  }
};


export class FarmingComponent implements Serializable<FarmingComponent> {
  protected started: boolean;
  protected finished: boolean;
  protected currentTick: number;

  protected x: number;
  protected y: number;
  protected terrainId: number;
  protected growthSpeed: number;

  protected sfx: effect | undefined;

  constructor(
    public abilityId: number = 0,
    public producedItems: FarmProductData[] = [],
    public repeatInterval: number = 1, 
    public duration: number = 1000,
    public sfxSizeStart: number = 0.5,
    public sfxSizeEnd: number = 1.0,
    public sfxBase: string = "Doodads\\LordaeronSummer\\Plants\\Wheat\\Wheat.mdl",
    public growthFarmland: number = 1.0,
    public growthGrass: number = 1.0,
    public growthDirt: number = 1.0,
    public growthWater: number = 0.5,
    public growthSnow: number = 0.25,
    public growthBlightRocky: number = 0.05,
  ) {
    this.started = false;
    this.finished = false;
    this.currentTick = 0;
    this.x = 0;
    this.y = 0;
    this.terrainId = 0;
    this.growthSpeed = 1.0;
    this.sfx = undefined;
  }

  init(x: number, y: number) {
    this.currentTick = 0;
    this.x = x;
    this.y = y;
    this.terrainId = GetTerrainType(x, y);
    // BJDebugMsg("terrainId: " + this.terrainId);
    // determine growth multiplier based on terrainId and mults
    this.growthSpeed = 1.0;
    
    const isWater = !IsTerrainPathable(this.x, this.y, PATHING_TYPE_FLOATABILITY);
    const isBlighted = IsPointBlighted(this.x, this.y);
    
    switch (this.terrainId) {
      case Terrain.crops:
        // BJDebugMsg("Crops");
        this.growthSpeed *= this.growthFarmland;
        break;

      case Terrain.grass:
        // BJDebugMsg("Grass");
        this.growthSpeed *= this.growthGrass;
        break;

      case Terrain.grassyDirt:
        case Terrain.vines:
        // BJDebugMsg("Grassy Dirt / Vines");
        this.growthSpeed *= (0.5 * this.growthGrass + 0.5 * this.growthDirt);
        break;

      case Terrain.dirt:
        // BJDebugMsg("Dirt");
        this.growthSpeed *= this.growthDirt;
        break;

      case Terrain.snow:
      case Terrain.ice:
        // BJDebugMsg("Snow/ice");
        this.growthSpeed *= this.growthSnow;
        break;

      case Terrain.winterGrass:
        // BJDebugMsg("WinterGrass");
        this.growthSpeed *= (0.5 * this.growthSnow + 0.5 * this.growthGrass);
        break;

      case Terrain.brick:
      case Terrain.sand:
      case Terrain.stonePath:
      case Terrain.greyStone:
      case Terrain.abyss:
      case Terrain.lavaCracks:
      case Terrain.darkDesert:
        // BJDebugMsg("Rocky");
        this.growthSpeed *= this.growthBlightRocky;
        break;

      default:
        BJDebugMsg("invalid terrain type");
        break;
    }

    if (isBlighted) {
      // BJDebugMsg("Blight");
      this.growthSpeed = this.growthBlightRocky;
    }

    if (isWater) {
      // BJDebugMsg("Water");
      this.growthSpeed = this.growthWater;
    }
  }
  
  performTickAction() {
    if (!this.started) {
      this.started = true;

      // create effect
      if (!this.sfx) {
        this.sfx = AddSpecialEffect(this.sfxBase, this.x, this.y);
        BlzSetSpecialEffectScale(this.sfx, this.sfxSizeStart);
      }
    }

    if (this.currentTick > this.duration) {
      let isProduced = false;
      this.producedItems.forEach((produce: FarmProductData) => {
        if (!isProduced) {
          if (produce.terrainId == this.terrainId || produce.terrainId == Terrain.any) {
            isProduced = true;
            CreateItem(produce.itemId, this.x, this.y);
          }
        }
      });

      this.cleanup();
    } else {
      this.currentTick += this.growthSpeed;
      
      // scale effect size
      if (this.sfx) {
        const timeToScale: number = this.sfxSizeStart + (this.currentTick / this.duration) * (this.sfxSizeEnd - this.sfxSizeStart);
        BlzSetSpecialEffectScale(this.sfx, timeToScale);
      }
    }
  }

  cleanup() {
    if (this.sfx) {
      DestroyEffect(this.sfx);
    }
    this.currentTick = 0;
    this.finished = true;
  }

  isStarted() {
    return this.started;
  }

  isFinished() {
    return this.finished;
  }
  

  clone(): FarmingComponent {
    const copy = new FarmingComponent(
      this.abilityId,
      this.producedItems,
      this.repeatInterval,
      this.duration,
      this.sfxSizeStart,
      this.sfxSizeEnd,
      this.sfxBase,
      this.growthFarmland,
      this.growthGrass,
      this.growthDirt,
      this.growthWater,
      this.growthSnow,
      this.growthBlightRocky,
    );
    return copy;
  }
  
  deserialize(
    input: { 
      abilityId: number;
      producedItems: {
        itemId: number,
        terrainId: number
      }[],
      repeatInterval: number, 
      duration: number,
      sfxSizeStart: number,
      sfxSizeEnd: number,
      sfxBase: string,
      growthFarmland: number,
      growthGrass: number,
      growthDirt: number,
      growthWater: number,
      growthSnow: number,
      growthBlightRocky: number,
    }
  ) {
    this.abilityId = input.abilityId;
    this.producedItems = [];
    for (const produce of input.producedItems) {
      this.producedItems.push(new FarmProductData().deserialize(produce));
    }
    this.repeatInterval = input.repeatInterval;
    this.duration = input.duration;
    this.sfxSizeStart = input.sfxSizeStart;
    this.sfxSizeEnd = input.sfxSizeEnd;
    this.sfxBase = input.sfxBase;
    this.growthFarmland = input.growthFarmland;
    this.growthGrass = input.growthGrass;
    this.growthDirt = input.growthDirt;
    this.growthWater = input.growthWater;
    this.growthSnow = input.growthSnow;
    this.growthBlightRocky = input.growthBlightRocky;
    return this;
  }
}

























