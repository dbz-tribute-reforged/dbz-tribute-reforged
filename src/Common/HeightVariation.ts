export class HeightVariation implements Serializable<HeightVariation> {
  static readonly NO_VARIATION = 0;
  static readonly LINEAR_VARIATION = 1;
  static readonly PARABOLIC_VARIATION = 2;

  constructor(
    public start: number = 250,
    public finish: number = 0, 
    public scaling: number = HeightVariation.NO_VARIATION, 
  ) {

  }

  deserialize(
    input: {
      start: number;
      finish: number;
      scaling: number;
    },
  ) {
    this.start = input.start;
    this.finish = input.finish;
    this.scaling = input.scaling;
    return this;
  }
}