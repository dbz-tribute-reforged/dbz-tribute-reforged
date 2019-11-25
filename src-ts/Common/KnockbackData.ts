export class KnockbackData implements Serializable<KnockbackData>{
  constructor (
    public speed: number = 0,
    public angle: number = 0,
    public aoe: number = 0,
  ) {

  }

  
  deserialize(
    input: { 
      speed: number; 
      angle: number; 
      aoe: number; 
    }
  ) {
    this.speed = input.speed;
    this.angle = input.angle;
    this.aoe = input.aoe;
    return this;
  }
}