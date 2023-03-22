
export class DualTechManager {
  private static instance: DualTechManager;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DualTechManager();
    }
    return this.instance;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // collect dual techs and register their initialization conditions
  }


}