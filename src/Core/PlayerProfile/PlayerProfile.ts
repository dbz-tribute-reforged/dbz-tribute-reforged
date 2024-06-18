import { Constants, Globals } from "Common/Constants";
import { Logger } from "Common/Logger";
import { AbilityShop } from "Core/AbilityShop/AbilityShop";
import { EncodingBase64 } from "Core/SyncSaveLoad/EncodingBase64";
import { FilePromise } from "Core/SyncSaveLoad/FilePromise";
import { SyncSaveLoad } from "Core/SyncSaveLoad/SyncSaveLoad";
import { TimerManager } from "Core/Utility/TimerManager";
import { WinLossSystem } from "Core/WinLossSystem/WinLossSystem";
import { AbilityNames } from "CustomAbility/AbilityNames";

export class PlayerProfile {
  public static DBZTR_FOLDER = "DBZTR";
  public static PROFILE_FILE_NAME = "profile";
  public static FILE_SUFFIX = ".pld";
  public static FILE_HEADER = "DBZTR";
  public static FIELD_SEPARATOR = "|";
  public static VALUE_SEPARATOR = ":";

  public static FIELD_PLAYER_NAME = "NAME";

  public static FIELD_CAM_ZOOM = "CAM_ZOM";
  public static FIELD_CAM_ANGLE = "CAM_ANG";
  public static FIELD_CAM_ROTATION = "CAM_ROT";

  public static FIELD_NUM_GAMES = "NUM_GAMES";
  public static FIELD_NUM_FINISH_GAMES = "NUM_FINISH_GAMES";
  public static FIELD_NUM_WINS = "NUM_WINS";
  public static FIELD_NUM_LOSS = "NUM_LOSS";
  public static FIELD_MMR = "MMR";

  public static KEY_BASIC_ABIL_0 = "KEY_BASIC_ABIL_0";
  public static KEY_BASIC_ABIL_1 = "KEY_BASIC_ABIL_1";
  public static KEY_BASIC_ABIL_2 = "KEY_BASIC_ABIL_2";
  public static KEY_BASIC_ABIL_3 = "KEY_BASIC_ABIL_3";

  public static FIELD_PREFERS_ZD = "PREFERS_ZD";
  public static FIELD_PREFERS_TSS = "PREFERS_TSS";

  static getSaveFileName(name: string) {
    return (
      PlayerProfile.DBZTR_FOLDER + "\\" 
      + name + "\\"
      + PlayerProfile.PROFILE_FILE_NAME
      + PlayerProfile.FILE_SUFFIX
    );
  }

  // assume players cant change names
  public static GLOBAL_CACHE: string[] = [
    "", "", "", "", "",
    "", "", "", "", "",
    "", "", "", "", "",
    "", "", "", "", "",
    "", "", "", "", "",
  ];

  public static makeField(fieldName: string, fieldValue: any) {
    return fieldName + PlayerProfile.VALUE_SEPARATOR + tostring(fieldValue);
  }

  public static Init() {
    // const setData = CreateTrigger();
    // for (const player of Constants.activePlayers) {
    //   TriggerRegisterPlayerChatEvent(setData, player, "-set", false);
    // }
    // TriggerAddCondition(setData, Condition(() => {
    //   const player = GetTriggerPlayer();
    //   const playerId = GetPlayerId(player);
    //   Globals.playerProfiles[playerId].name = GetEventPlayerChatString();
    //   print("str: ", GetEventPlayerChatString());
    //   return false;
    // }));
    const saveTest = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(saveTest, player, "-save", true);
    }
    TriggerAddCondition(saveTest, Condition(() => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      Globals.playerProfiles[playerId].save();
      return false;
    }));

    const loadTest = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(loadTest, player, "-load", true);
    }
    TriggerAddCondition(loadTest, Condition(() => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      Globals.playerProfiles[playerId].load(true);
      return false;
    }));

    const winTimer = TimerManager.getInstance().get();
    TimerStart(winTimer, 1, true, () => {
      if (Globals.isMainGameStarted && WinLossSystem.getInstance().hasWon()) {
        PlayerProfile.winGame(WinLossSystem.getInstance().getWinner());
        TimerManager.getInstance().recycle(winTimer);
      }
    })

    // load data for players
    for (const profile of Globals.playerProfiles) {
      if (profile.isPlaying()) profile.load(true);
    }
  }

  public static startGame() {
    // if (Globals.isFBSimTest) return;
    for (const profile of Globals.playerProfiles) {
      profile.addGame();
      profile.save();
    }
  }

  public static winGame(winTeam: number) {
    // if (Globals.isFBSimTest) return;
    for (const profile of Globals.playerProfiles) {
      for (const player of Constants.defaultTeam1) {
        if (profile.player != player) continue;
        if (winTeam == Constants.team1Value) {
          profile.addWin();
        } else {
          profile.addLoss();
        }
      }
      for (const player of Constants.defaultTeam2) {
        if (profile.player != player) continue;
        if (winTeam == Constants.team2Value) {
          profile.addWin();
        } else {
          profile.addLoss();
        }
      }
      profile.save();
    }
  }



  public player: player = null;
  public name: string = "unknown";

  public numGames: number = 0;
  public numFinishGames: number = 0;
  public numWins: number = 0;
  public numLoss: number = 0;
  public mmr: number = 1000;

  public fieldMap: Map<string, string> = new Map();
  
  constructor(player: player) {
    this.player = player;
    this.name = GetPlayerName(this.player);
  }

  isPlaying() {
    return (
      GetPlayerController(this.player) == MAP_CONTROL_USER
      && GetPlayerSlotState(this.player) == PLAYER_SLOT_STATE_PLAYING
    )
  }

  addGame() {
    this.numGames++;
  }

  addWin() {
    this.numWins++;
    this.numFinishGames++;
    this.mmr += Constants.MMR_PER_WIN;
  }

  addLoss() {
    this.numLoss--;
    this.numFinishGames++;
    this.mmr = Math.max(this.mmr - Constants.MMR_PER_WIN, Constants.MMR_MIN);
  }

  calcPrefersZD() {
    const playerId = GetPlayerId(this.player);
    const customPlayer = Globals.customPlayers[playerId];

    // has zanzo dash
    for (const abil of customPlayer.abilityButtons) {
      if (abil.name == AbilityNames.BasicAbility.ZANZO_DASH) {
        customPlayer.prefersZD = true;
        break;
      } else if (abil.name == AbilityNames.BasicAbility.ZANZOKEN) {
        customPlayer.prefersZD = false;
        break;
      }
    }
  }

  save() {
    if (!this.isPlaying()) return;

    const playerId = GetPlayerId(this.player);
    const customPlayer = Globals.customPlayers[playerId];

    this.calcPrefersZD();

    const data = [
      PlayerProfile.makeField(PlayerProfile.FILE_HEADER, Globals.versionStr),
      PlayerProfile.makeField(PlayerProfile.FIELD_PLAYER_NAME, this.name),

      PlayerProfile.makeField(PlayerProfile.FIELD_CAM_ZOOM, customPlayer.playerCam.zoom),
      PlayerProfile.makeField(PlayerProfile.FIELD_CAM_ANGLE, customPlayer.playerCam.angle),
      PlayerProfile.makeField(PlayerProfile.FIELD_CAM_ROTATION, customPlayer.playerCam.rotation),
      
      PlayerProfile.makeField(PlayerProfile.FIELD_NUM_GAMES, this.numGames),
      PlayerProfile.makeField(PlayerProfile.FIELD_NUM_FINISH_GAMES, this.numFinishGames),
      PlayerProfile.makeField(PlayerProfile.FIELD_NUM_WINS, this.numWins),
      PlayerProfile.makeField(PlayerProfile.FIELD_NUM_LOSS, this.numLoss),
      PlayerProfile.makeField(PlayerProfile.FIELD_MMR, this.mmr),

      PlayerProfile.makeField(PlayerProfile.KEY_BASIC_ABIL_0, Constants.oskeyToTextMap.get(customPlayer.abilityButtons[0].key)),
      PlayerProfile.makeField(PlayerProfile.KEY_BASIC_ABIL_1, Constants.oskeyToTextMap.get(customPlayer.abilityButtons[1].key)),
      PlayerProfile.makeField(PlayerProfile.KEY_BASIC_ABIL_2, Constants.oskeyToTextMap.get(customPlayer.abilityButtons[2].key)),
      PlayerProfile.makeField(PlayerProfile.KEY_BASIC_ABIL_3, Constants.oskeyToTextMap.get(customPlayer.abilityButtons[3].key)),

      PlayerProfile.makeField(PlayerProfile.FIELD_PREFERS_ZD, customPlayer.prefersZD ? 1 : 0),
      PlayerProfile.makeField(PlayerProfile.FIELD_PREFERS_TSS, udg_SummonsSelectFlagArray[playerId] ? 1 : 0),
    ];

    const saveStr = data.join(PlayerProfile.FIELD_SEPARATOR);
    const outData = SyncSaveLoad.getInstance().writeFile(
      PlayerProfile.getSaveFileName(this.name), 
      this.player, saveStr
    );
    PlayerProfile.GLOBAL_CACHE[GetPlayerId(this.player)] = outData;
    Logger.LogDebug("Save: ", saveStr);
    Logger.LogDebug("File: ", outData);
  }

  load(apply: boolean = false) {
    if (PlayerProfile.GLOBAL_CACHE[GetPlayerId(this.player)] != "") {
      this.unpack(EncodingBase64.Decode(
        PlayerProfile.GLOBAL_CACHE[GetPlayerId(this.player)]
      ), apply);
      return;
    }
    SyncSaveLoad.getInstance().read(PlayerProfile.getSaveFileName(this.name), 
      this.player, (promise: FilePromise) => {
        this.unpack(promise.finalString, apply);
    });
  }

  unpack(str: string, apply: boolean = false) {
    const words = str.split(PlayerProfile.FIELD_SEPARATOR);
    for (const word of words) {
      const part = word.split(PlayerProfile.VALUE_SEPARATOR);
      if (part.length < 2) continue;
      this.fieldMap.set(part[0], part[1]);
      Logger.LogDebug(part[0], part[1]);
    }
    if (apply) this.apply();
  }

  apply() {
    const playerId = GetPlayerId(this.player);
    const customPlayer = Globals.customPlayers[playerId];

    if (this.fieldMap.has(PlayerProfile.FILE_HEADER)) {
      if (GetLocalPlayer() == this.player) {
        print("Loading profile from version ", this.fieldMap.get(PlayerProfile.FILE_HEADER));
      }
    } else {
      if (GetLocalPlayer() == this.player) {
        print("Previous profile not detected");
      }
    }

    if (this.fieldMap.has(PlayerProfile.FIELD_PLAYER_NAME)) {
      if (this.name != this.fieldMap.get(PlayerProfile.FIELD_PLAYER_NAME)) {
        Logger.LogWarning("Mismatched names in profile");
        return;
      }
    } else {
      Logger.LogDebug("Missing profile name");
    }

    if (this.fieldMap.has(PlayerProfile.FIELD_CAM_ZOOM)) {
      customPlayer.playerCam.setNoUpdate(
        S2R(this.fieldMap.get(PlayerProfile.FIELD_CAM_ZOOM)),
        S2R(this.fieldMap.get(PlayerProfile.FIELD_CAM_ANGLE)),
        S2R(this.fieldMap.get(PlayerProfile.FIELD_CAM_ROTATION)),
      );
      customPlayer.playerCam.update();
    }

    if (this.fieldMap.has(PlayerProfile.FIELD_NUM_GAMES)) {
      this.numGames = S2I(this.fieldMap.get(PlayerProfile.FIELD_NUM_GAMES));
    }
    if (this.fieldMap.has(PlayerProfile.FIELD_NUM_FINISH_GAMES)) {
      this.numFinishGames = S2I(this.fieldMap.get(PlayerProfile.FIELD_NUM_FINISH_GAMES));
      if (GetLocalPlayer() == this.player) {
        print("Games Played: ", this.numGames);
      }
    }
    if (this.fieldMap.has(PlayerProfile.FIELD_NUM_WINS)) {
      this.numWins = S2I(this.fieldMap.get(PlayerProfile.FIELD_NUM_WINS));
      if (GetLocalPlayer() == this.player) {
        print("Games Won: ", this.numWins);
      }
    }
    if (this.fieldMap.has(PlayerProfile.FIELD_NUM_LOSS)) {
      this.numLoss = S2I(this.fieldMap.get(PlayerProfile.FIELD_NUM_LOSS));
      if (GetLocalPlayer() == this.player) {
        print("Games Lost: ", this.numLoss);
      }
    }
    if (this.fieldMap.has(PlayerProfile.FIELD_MMR)) {
      this.mmr = S2I(this.fieldMap.get(PlayerProfile.FIELD_MMR));
      if (GetLocalPlayer() == this.player) {
        print("Pseudo MMR: ", this.mmr);
      }
    }

    if (this.fieldMap.has(PlayerProfile.KEY_BASIC_ABIL_0)) {
      AbilityShop.getInstance().setAbilityKey(this.player, 0, 
        Constants.textToOsKeyMap.get(this.fieldMap.get(PlayerProfile.KEY_BASIC_ABIL_0))
      );
    }
    if (this.fieldMap.has(PlayerProfile.KEY_BASIC_ABIL_1)) {
      AbilityShop.getInstance().setAbilityKey(this.player, 1, 
        Constants.textToOsKeyMap.get(this.fieldMap.get(PlayerProfile.KEY_BASIC_ABIL_1))
      );
    }
    if (this.fieldMap.has(PlayerProfile.KEY_BASIC_ABIL_2)) {
      AbilityShop.getInstance().setAbilityKey(this.player, 2, 
        Constants.textToOsKeyMap.get(this.fieldMap.get(PlayerProfile.KEY_BASIC_ABIL_2))
      );
    }
    if (this.fieldMap.has(PlayerProfile.KEY_BASIC_ABIL_3)) {
      AbilityShop.getInstance().setAbilityKey(this.player, 3, 
        Constants.textToOsKeyMap.get(this.fieldMap.get(PlayerProfile.KEY_BASIC_ABIL_3))
      );
    }

    if (this.fieldMap.has(PlayerProfile.FIELD_PREFERS_ZD)) {
      if (S2I(this.fieldMap.get(PlayerProfile.FIELD_PREFERS_ZD)) == 1) {
        Logger.LogDebug("player prefers ZD");
        customPlayer.prefersZD = true;
      } else {
        Logger.LogDebug("player prefers ZZ");
        customPlayer.prefersZD = false;
      }
      AbilityShop.getInstance().forceZDPref(customPlayer);
    }

    if (this.fieldMap.has(PlayerProfile.FIELD_PREFERS_TSS)) {
      if (S2I(this.fieldMap.get(PlayerProfile.FIELD_PREFERS_TSS)) == 1) {
        Logger.LogDebug("player prefers TSS");
        if (!udg_SummonsSelectFlagArray[playerId]) {
          udg_TempPlayer = this.player;
          TriggerExecute(gg_trg_ToggleSummonSelect);
        }
      } else {
        Logger.LogDebug("player prefers TSS off");
        if (udg_SummonsSelectFlagArray[playerId]) {
          udg_TempPlayer = this.player;
          TriggerExecute(gg_trg_ToggleSummonSelect);
        }
      }
    }
  }
}