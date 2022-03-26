export class HeroSelectUnit implements Serializable<HeroSelectUnit> {
  constructor(
    public unitCode: any = null,
    public onlyRandom: boolean = false,
    public requirement: any = null,
    public category: number = 0,
  ) {

  }

  addToHeroSelector() {
    HeroSelector.addUnit(this.unitCode, this.onlyRandom, this.requirement);
    if (this.unitCode) {
      HeroSelector.addUnitCategory(this.unitCode, this.category);
    }
  }

  setUnitReq(who: any = null) {
    if (this.onlyRandom) return;

    HeroSelector.setUnitReq(this.unitCode, who);
  }

  hasCategory(cmp: number) {
    return BlzBitAnd(this.category, cmp) != 0;
  }

  deserialize(
    input: {
      unitCode: any,
      onlyRandom: boolean,
      requirement: any,
      category: number,
    }
  ) {
    this.unitCode = input.unitCode;
    this.onlyRandom = input.onlyRandom;
    this.requirement = input.requirement;
    this.category = input.category;
    return this;
  }
};
