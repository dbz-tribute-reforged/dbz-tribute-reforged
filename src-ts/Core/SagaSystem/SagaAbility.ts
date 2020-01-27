export class SagaAbility {
  protected currentCd: number;

  constructor (
    public name: string,
    public maxLevel: number = 10,
    public maxCd: number = 15,
    public castChance: number = 5,
    public castDelay: number = 1.0,
    public isTracking: boolean = false,
  ) {
    this.currentCd = 0;
  }

  public updateCd() {
    if (this.currentCd > 0) {
      --this.currentCd;
    }
  }

  public applyCd() {
    this.currentCd = this.maxCd;
  }

  public readyToUse() {
    return this.currentCd <= 0;
  }

  public clone() {
    return new SagaAbility(
      this.name, this.maxLevel, this.maxCd, 
      this.castChance, this.castDelay, 
      this.isTracking
    );
  }
}