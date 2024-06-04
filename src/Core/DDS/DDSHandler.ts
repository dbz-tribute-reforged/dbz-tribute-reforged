import { Constants } from "Common/Constants";
import { DDSData } from "./DDSData";

export class DDSHandler {
  // before armr
  public static DDS_DAMAGING = 0;
  // after armr
  public static DDS_DAMAGED = 1;

  public recursiveFlag: boolean;
  public isDDSActive: boolean;
  public data: DDSData;

  public callbacks: ((dmg: DDSData) => void)[];
  public ddsTrigger: trigger;

  constructor(ddsType: number) {
    this.recursiveFlag = false;
    this.isDDSActive = false;
    this.data = new DDSData();

    this.callbacks = [];

    this.ddsTrigger = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYER_SLOTS + 4; ++i) {
      TriggerRegisterPlayerUnitEventSimple(this.ddsTrigger, Player(i), 
        ddsType == DDSHandler.DDS_DAMAGING ?
          EVENT_PLAYER_UNIT_DAMAGING :
          EVENT_PLAYER_UNIT_DAMAGED
      );
    }
    TriggerAddCondition(this.ddsTrigger, Condition(() => {
      return this.runCallbacks()
    }));
  }

  public doLock() {
    if (this.isDDSActive && !this.recursiveFlag) return false;
    this.isDDSActive = true;
    return true;
  }

  public doUnlock() {
    if (!this.isDDSActive) return false;
    this.isDDSActive = false;
    return true;
  }

  public runCallbacks() {
    if (!this.doLock()) return;
    this.data.get();
    for (const func of this.callbacks) {
      func(this.data);
    }
    this.data.applyDamage();
    this.doUnlock();
    return false;
  }

  public addCallback(func: (dmg: DDSData) => void) {
    this.callbacks.push(func);
  }
}