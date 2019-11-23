export enum VariationTypes {
  NO_VARIATION,
  LINEAR_VARIATION,
  PARABOLIC_VARIATION,
}

export class HeightVariation {

  constructor(
    public start: number = 250,
    public end: number = 0, 
    public type: number = VariationTypes.NO_VARIATION, 
  ) {

  }
}