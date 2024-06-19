import { EncodingBase64 } from "./EncodingBase64";
import { EncodingHex } from "./EncodingHex";
import { FilePromise } from "./FilePromise";
import { Logger } from "Common/Logger";

export class SyncSaveLoad {
  private static _instance: SyncSaveLoad;
  public static getInstance() {
      if (!this._instance) {
          this._instance = new SyncSaveLoad();
      }
      return this._instance;
  }
  private constructor() {
      for (let i = 0; i < GetBJMaxPlayers(); i++) {
          BlzTriggerRegisterPlayerSyncEvent(this.syncEvent, Player(i), this.syncPrefix, false);
          BlzTriggerRegisterPlayerSyncEvent(this.syncEvent, Player(i), this.syncPrefixFinish, false);
      }
      TriggerAddAction(this.syncEvent, () => this.onSync());
  }

  public syncPrefix = "S_TIO";
  public syncPrefixFinish = "S_TIOF";
  public syncEvent: trigger = CreateTrigger();
  private allPromises: (FilePromise | undefined)[] = [];

  public writeFile(filename: string, writer: player, ...data: string[]) {
      let rawData = table.concat(data);
      let toCompile = EncodingBase64.Encode(rawData);
      let chunkSize = 180;
      let assemble = "";
      let noOfChunks = math.ceil(toCompile.length / chunkSize);

      Logger.LogVerbose("rawData.length: ", rawData.length);
      Logger.LogVerbose("toCompile.length: ", toCompile.length);
      
      if (writer == null || writer == GetLocalPlayer()) {
        PreloadGenClear();
        PreloadGenStart();
        xpcall(() => {
            for (let i = 0; i < toCompile.length; i++) {
                assemble += toCompile.charAt(i);
                if (assemble.length >= chunkSize) {
                    let header = EncodingHex.To32BitHexString(noOfChunks) + EncodingHex.To32BitHexString(math.ceil(i / chunkSize));
                    Preload(`")\ncall BlzSendSyncData("${this.syncPrefix}","${header + assemble}")\ncall S2I("`);
                    assemble = "";
                }
            }
            if (assemble.length > 0) {
                let header = EncodingHex.To32BitHexString(noOfChunks) + EncodingHex.To32BitHexString(noOfChunks);
                Preload(`")\ncall BlzSendSyncData("${this.syncPrefix}","${header + assemble}")\ncall S2I("`);
                //Final curtain call
            } 
        }, Logger.LogCritical);
        PreloadGenEnd(filename);
      }
      return toCompile;
  }

  public isPlayerAllowedToRead(reader: player) {
      return (this.allPromises[GetPlayerId(reader)] == null);
  }

  public read(filename: string, reader: player, onFinish?: (promise: FilePromise) => void): FilePromise {
      if (this.allPromises[GetPlayerId(reader)] == null) {
          this.allPromises[GetPlayerId(reader)] = new FilePromise(reader, onFinish);
          if (GetLocalPlayer() == reader) {
              PreloadStart();
              Preloader(filename);
              PreloadEnd(1);

              BlzSendSyncData(this.syncPrefixFinish, "");
          }
      } else {
          Logger.LogWarning("Trying to read file when file reader is already busy, please wait until finished.");
      }
      return <FilePromise>this.allPromises[GetPlayerId(reader)];
  }

  private onSync() {
      xpcall(() => {

          const readData = BlzGetTriggerSyncData();
          let totalChunkSize = EncodingHex.ToNumber(readData.substr(0, 8));
          let currentChunk = EncodingHex.ToNumber(readData.substr(8, 8));
          let theRest = readData.substr(16);

          Logger.LogVerbose("Loading ", currentChunk, " out of ", totalChunkSize);

          let promise = this.allPromises[GetPlayerId(GetTriggerPlayer())];
          if (promise) {
              if (BlzGetTriggerSyncPrefix() == this.syncPrefix) {
                  promise.buffer[currentChunk - 1] = theRest;
              } else if (BlzGetTriggerSyncPrefix() == this.syncPrefixFinish) {
                  promise.finish();
                  this.allPromises[GetPlayerId(promise.syncOwner)] = undefined;
                  Logger.LogDebug("Promise killed: ", this.allPromises[GetPlayerId(promise.syncOwner)]);
              }
          } else {
              Logger.LogWarning(`Syncronised data in ${SyncSaveLoad.name} when there is no promise present for player: ${GetPlayerName(GetTriggerPlayer())}`);
          }
      }, Logger.LogCritical);
  }
}