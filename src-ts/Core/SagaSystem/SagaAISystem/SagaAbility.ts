export class SagaAbility {
  protected currentCd: number;

  constructor (
    public abilityName: string,
    public maxCd: number,
    public castChance: number,
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
}