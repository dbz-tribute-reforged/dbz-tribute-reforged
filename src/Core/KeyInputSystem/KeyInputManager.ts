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
      const isDown = BlzGetTriggerPlayerIsKeyDown();
      const meta = BlzGetTriggerPlayerMetaKey();

      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      const ki = Globals.customPlayers[playerId].getOsKeyInput(key);
      
      if (ki.isDown != isDown) {
        ki.isDown = isDown;
        ki.meta = meta;
      }

      return false;
    }));

    // after 30s of key down, automatically unset?
  }
}