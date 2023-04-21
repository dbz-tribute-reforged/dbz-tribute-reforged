import { Constants, Globals } from "Common/Constants";
import { KeyInput } from "./KeyInput";

export class KeyInputManager {
  static instance: KeyInputManager;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new KeyInputManager();
    }
    return this.instance;
  }

  public keyInputTrigger: trigger = CreateTrigger();

  constructor() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);

      for (let k = 8; k < 255; ++k) {
        const key = ConvertOsKeyType(k);

        for (let j = 0; j < 8; ++j) {
          // meta key down
          BlzTriggerRegisterPlayerKeyEvent(
            this.keyInputTrigger,
            player,
            key, j, true
          );
  
          // key up
          BlzTriggerRegisterPlayerKeyEvent(
            this.keyInputTrigger,
            player,
            key, j, false
          );
        }
      }
    }

    TriggerAddCondition(this.keyInputTrigger, Condition(() => {
      const key = BlzGetTriggerPlayerKey();

      const playerId = GetPlayerId(GetTriggerPlayer());
      let ki = Globals.customPlayers[playerId].getOsKeyInput(key);
      if (!ki) {
        ki = new KeyInput(key);
        Globals.customPlayers[playerId].setOsKeyInput(key, ki);
      }
      ki.isDown = BlzGetTriggerPlayerIsKeyDown();
      ki.meta = BlzGetTriggerPlayerMetaKey();

      return false;
    }));
  }
}