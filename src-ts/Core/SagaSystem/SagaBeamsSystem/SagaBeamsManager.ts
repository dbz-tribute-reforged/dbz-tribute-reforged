import { Hooks } from "Libs/TreeLib/Hooks";
import { CustomPlayer } from "CustomPlayer/CustomPlayer";
import { Constants } from "Common/Constants";
import { CustomHero } from "CustomHero/CustomHero";

export class SagaBeamsManager {
  static instance: SagaBeamsManager;

  protected sagaPlayer: CustomPlayer;

  constructor (
  ) {
    this.sagaPlayer = new CustomPlayer(PLAYER_NEUTRAL_AGGRESSIVE, "Sagas");
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SagaBeamsManager();
      Hooks.set("SagaBeamsManager", this.instance);
    }
    return this.instance;
  }

  initialize() {

  }

  public addSagaHero(hero: unit): this {
    this.sagaPlayer.addHero(hero);
    return this;
  }

  public getSagaCustomHero(hero: unit): CustomHero | undefined {
    return this.sagaPlayer.getCustomHero(hero);
  }


}