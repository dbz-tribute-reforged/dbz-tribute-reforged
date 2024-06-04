import { Constants } from "Common/Constants";
import { DDSData } from "./DDSData";
import { DDSHandler } from "./DDSHandler";

export class DDS {
  public static PLAYER_DMG_SEND_KEY = StringHash("player_dmg_send");
  public static PLAYER_DMG_RECV_KEY = StringHash("player_dmg_recv");
  public static PLAYER_DMG_SEND_SAGA_KEY = StringHash("player_dmg_send_saga");
  
  private static instance: DDS;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DDS();
    }
    return this.instance;
  }

  public damagedDDS: DDSHandler;

  constructor() {
    this.damagedDDS = new DDSHandler(DDSHandler.DDS_DAMAGED);
  }

  public addCallback(ddsType: number, func: (dmg: DDSData) => void) {
    if (ddsType == DDSHandler.DDS_DAMAGED) {
      this.damagedDDS.addCallback(func);
    }
  }
}