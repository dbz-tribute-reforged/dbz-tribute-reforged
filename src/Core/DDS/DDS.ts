import { Constants, Globals } from "Common/Constants";
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

  public getDamageDataStr(): string {
    let data = "";
    for (const player of Constants.activePlayers) {
      const playerId = GetPlayerId(player);
      const dmgSend = LoadReal(Globals.genericDDSHashtable, playerId, DDS.PLAYER_DMG_SEND_KEY);
      const dmgSendSaga = LoadReal(Globals.genericDDSHashtable, playerId, DDS.PLAYER_DMG_SEND_SAGA_KEY);
      const dmgRecv = LoadReal(Globals.genericDDSHashtable, playerId, DDS.PLAYER_DMG_RECV_KEY);
      data += ( 
        udg_OriginalPlayerNames[playerId] + ":" 
        + " |cff00ff00PLAYER DMG:" + I2S(R2I(dmgSend))
        + "|r / |cffffcc00SAGA DMG:" + I2S(R2I(dmgSendSaga))
        + "|r / |cffff2222TANK:" + I2S(R2I(dmgRecv)) + "|r\n"
      );
    }
    return data;
  }
}