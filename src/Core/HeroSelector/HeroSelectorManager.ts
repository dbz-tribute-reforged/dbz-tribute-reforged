import { Constants, Globals, Id } from "Common/Constants";
import { SoundHelper } from "Common/SoundHelper";
import { CustomUI } from "CustomUI/CustomUI";
import { HeroSelectCategory } from "./HeroSelectCategory";
import { HeroSelectUnit } from "./HeroSelectUnit";
import { HeroSelectUnitList } from "./HeroSelectUnitList";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { UnitHelper } from "Common/UnitHelper";
import { AbilityShop } from "Core/AbilityShop/AbilityShop";
import { Frame, Trigger } from "w3ts";

export class HeroSelectorManager {
  private static instance: HeroSelectorManager;

  static readonly BAN_TIME = 10;
  static readonly PICK_TIME = 80;
  

  public selectTimer: timer;
  public time: number;
  
  public repickTrigger: trigger;
  public allowRepick: boolean;

  public gameModeTrigger: trigger;
  public gameModeString: string;

  public isPicking: boolean;
  public setupFinished: boolean;
  public isGameStarted: boolean;

  public hideSelectorTrigger: trigger;

  public timerText: texttag;

  public heroSelectUnits: HeroSelectUnit[];

  public repickButton: Frame;
  public repickButtonTrigger: Trigger;

  public abilShop: AbilityShop;


  public static getInstance() {
    if (this.instance == null) {
      this.instance = new HeroSelectorManager();
    }
    return this.instance;
  }


  constructor() {
    this.selectTimer = CreateTimer();
    this.time = 0;

    this.repickTrigger = CreateTrigger();
    this.allowRepick = true;

    this.gameModeTrigger = CreateTrigger();
    this.gameModeString = "-ap";

    this.isPicking = false;
    this.setupFinished = false;
    this.isGameStarted = false;

    this.hideSelectorTrigger = CreateTrigger();
    
    this.timerText = CreateTextTag();

    this.heroSelectUnits = [];

    this.repickButton = null;
    this.repickButtonTrigger = null;

    this.init();

    this.abilShop = new AbilityShop();
    this.abilShop.setup();
  }

  init() {
    HeroSelectCategory.setupHeroSelectCategories();
    TeamViewer.Init();
    this.setupPlayerSpawns();
    this.setupUnitCreatedFunction();
    this.hookHeroSelectorHeroButton();
    this.setupRepick();
    this.setupHideSelectorTrigger();
    this.setupHeroes();
    this.setupGameModes();
    this.show(true);
    CustomUI.show(false, false);

    SetTextTagPos(this.timerText, GetRectCenterX(gg_rct_HeroPickRegion), GetRectMaxY(gg_rct_HeroPickRegion), 10);
    SetTextTagColor(this.timerText, 255, 255, 255, 255);
    SetTextTagVisibility(this.timerText, true);
    SetTextTagPermanent(this.timerText, true);
    SetTextTagTextBJ(this.timerText, "", 10);

    TimerStart(CreateTimer(), 1.0, true, () => {
      if (this.setupFinished) {
        DestroyTimer(GetExpiredTimer());

        this.startHeroSelection(true);
        TimerStart(this.selectTimer, 1.0, true, () => {
          this.runHeroSelectTimer();
        });
      }
    })
  }

  public checkIsGameStarted(): boolean {
    return this.isGameStarted;
  }

  enableFBSimTest(state: boolean) {
    this.allowRepick = state;
    for (const hsUnit of this.heroSelectUnits) {
      hsUnit.setUnitReq(null);
    }
    this.resetBansAndPicks();
  }

  setupPlayerSpawns() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsOfPlayer(Globals.tmpUnitGroup, Player(i), null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (GetUnitTypeId(unit) == Id.heroSelectorUnit) {
          Globals.customPlayers[i].heroPickSpawn.setUnit(unit);
          ShowUnit(unit, false);
        }
      });
    }
  }

  heroPickSpawnUnitForPlayer(unitCode: number, player: player): unit {
    const playerId = GetPlayerId(player);
    const unit = CreateUnit(
      player, 
      unitCode, 
      Globals.customPlayers[playerId].heroPickSpawn.x, 
      Globals.customPlayers[playerId].heroPickSpawn.y, 
      0
    );
    
    if (!this.isGameStarted) {
      SetUnitInvulnerable(unit, true);
      ModifyHeroSkillPoints(unit, bj_MODIFYMETHOD_SET, 0);
    }

    udg_StatMultUnit = unit;
    TriggerExecute(gg_trg_Add_Unit_To_StatMult);
    
    GroupAddUnit(udg_PlayerPickedHeroesUnitGroup[playerId], unit);

    return unit;
  }

  spawnExtraUnitsForPlayer(unitCode: number, player: player) {
    if (unitCode == Id.goten) {
      this.heroPickSpawnUnitForPlayer(Id.kidTrunks, player);
    } else if (unitCode == Id.android13) {
      this.heroPickSpawnUnitForPlayer(Id.android14, player);
      this.heroPickSpawnUnitForPlayer(Id.android15, player);
    }
  }

  setupUnitCreatedFunction() {
    // override unitCreated function
    HeroSelector["unitCreated"] = function(player: player, unitCode: number, isRandom: boolean) {
      // enforce correct abilities for unit   
      this.abilShop.setPlayerShop(player, unitCode); 
      
      const unit = this.heroPickSpawnUnitForPlayer(unitCode, player);
      
      this.spawnExtraUnitsForPlayer(unitCode, player);
      
      if (isRandom) {
        // was randomed
      } else {
        // picked
      }

      SelectUnitForPlayerSingle(unit, player)
      HeroSelector.enablePick(false, player)
      this.show(false, player);
      CustomUI.show(true, false, player);

      if (Globals.pecorinePickVoiceFlag && GetUnitTypeId(unit) == Id.pecorine) {
        SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Pecorine/Pick.mp3", 5355);
        Globals.pecorinePickVoiceFlag = false;
      }
      
      udg_TempInt = GetConvertedPlayerId(player);
      TriggerExecute(gg_trg_Hero_Pick_Reset_Abilities);

      // do other stuff

      // if globals and globals.udg_HeroSelectorEvent then
      //     globals.udg_HeroSelectorEvent = 0
      //     globals.udg_HeroSelectorEvent = 1.0
      // end
    };
  }

  hookHeroSelectorHeroButton() {
    const func = HeroSelector["buttonSelected"];
    HeroSelector["buttonSelected"] = function(player: player, unitCode: number) {
      func(player, unitCode);
      this.abilShop.setPlayerShop(player, unitCode);
    }
  }

  setupRepick() {
    // create ui for repick
    
    this.repickButton = new Frame("ScriptDialogButton", 
      Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0), 0, 0
    )
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.3000, 0.1520)
      .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.3900, 0.1760)
      .setText("|cffFFCC00Repick|r")
      .setScale(1.00)

    this.repickButtonTrigger = new Trigger();
    this.repickButtonTrigger.triggerRegisterFrameEvent(this.repickButton, FRAMEEVENT_CONTROL_CLICK) 
    this.repickButtonTrigger.addAction( () => {
      this.repickButton.enabled = false;
      this.repickButton.enabled = true;
      this.initRepick(GetTriggerPlayer(), true);
    });

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      // TriggerRegisterPlayerEventEndCinematic(this.repickTrigger, Player(i));
      TriggerRegisterPlayerChatEvent(this.repickTrigger, Player(i), "-repick", true);
      TriggerRegisterPlayerChatEvent(this.repickTrigger, Player(i), "-repick2", true);
    }
    TriggerAddCondition(this.repickTrigger, Condition(() => {
      this.initRepick(
        GetTriggerPlayer(),
        !Globals.isFBSimTest || GetEventPlayerChatString() == "-repick",
      );
      return false;
    }));
  }

  initRepick(player: player, removeUnits: boolean) {
    if (!this.allowRepick) return;
    if (removeUnits) {
      this.doRepickForPlayer(player);
    }

    if (!Globals.isFBSimTest && this.gameModeString.substring(0, 3) == "-ar") {
      this.show(false, player);
      HeroSelector.forceRandom(player);
    } else {
      // remove gold
      SetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD, 0);
      this.show(true, player);
      HeroSelector.enablePick(true, player);
      CustomUI.show(false, false, player);
    }

    udg_TempInt = GetConvertedPlayerId(player);
    TriggerExecute(gg_trg_Hero_Pick_Reset_Abilities);
  }

  doRepickForPlayer(player: player, dropItems: boolean = false) {
    GroupClear(Globals.tmpUnitGroup)  
    GroupEnumUnitsOfPlayer(Globals.tmpUnitGroup, player, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (UnitHelper.isUnitRealHero(unit)) {
        const playerId = GetPlayerId(player);
        udg_StatMultUnit = unit;
        TriggerExecute(gg_trg_Remove_Unit_From_StatMult);
        GroupRemoveUnit(udg_PlayerPickedHeroesUnitGroup[playerId], unit);

        // drop items
        if (dropItems) {
          for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
            const item = UnitItemInSlot(unit, i);
            if (BlzGetItemBooleanField(item, ITEM_BF_CAN_BE_DROPPED)) {
              SetItemPosition(item, GetUnitX(unit), GetUnitY(unit));
            }
          }
        }

        const unitId = GetUnitTypeId(unit);
        let isRemoved = false;
        for (const hsUnit of this.heroSelectUnits) {
          if (unitId == hsUnit.unitCode) {
            HeroSelector.repick(unit, GetOwningPlayer(unit));
            isRemoved = true;
            break;
          }
        }
        if (!isRemoved) {
          RemoveUnit(unit);
        }
      }
    });
    GroupClear(Globals.tmpUnitGroup);
  }

  setupHideSelectorTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerChatEvent(this.hideSelectorTrigger, Player(i), "-hide", true);
      TriggerRegisterPlayerChatEvent(this.hideSelectorTrigger, Player(i), "-show", true);
    }
    TriggerAddCondition(this.hideSelectorTrigger, Condition(() => {
      
      if (this.allowRepick) {
        const str = GetEventPlayerChatString();
        if (str == "-hide") {
          this.show(false, GetTriggerPlayer());
        } else if (str == "-show") {
          this.show(true, GetTriggerPlayer());
        }
      }
      return false;
    }));
  }

  setupHeroes() {
    for (const data of HeroSelectUnitList) {
      this.heroSelectUnits.push(
        new HeroSelectUnit().deserialize(data)
      )
    }

    for (const hsUnit of this.heroSelectUnits) {
      hsUnit.addToHeroSelector();
    }

    this.setupFinished = true;
  }





  show(flag: boolean, who?: any) {
    HeroSelector.show(flag, who);
    if (!who || who == GetLocalPlayer()) {
      this.repickButton.setVisible(!flag && !this.isGameStarted);
    }
  }

  startHeroSelection(doBans: boolean = false) {
    HeroSelector.deselectButtons();
    HeroSelector.update();
    HeroSelector.deselectButtons();
    this.forceAllRepick();
    this.resetBansAndPicks();
    if (doBans && !Globals.isFBSimTest) {
      this.runBanPhase();
    } else {
      this.runPickPhase();
    }
  }

  forceAllRepick() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      this.doRepickForPlayer(Player(i), false);
    }
  }

  resetBansAndPicks() {
    // const t1Player = Constants.defaultTeam1[0];
    // const t2Player = Constants.defaultTeam2[0];
    for (const p of Globals.customPlayers) {
      for (const hsUnit of this.heroSelectUnits) {
        hsUnit.counterSetUnitCode(0, p.player);
        hsUnit.counterSetUnitCode(0, p.player);
      }
    }
  }

  runPickPhase() {
    this.time = HeroSelectorManager.PICK_TIME;
    HeroSelector.setTitleText("Picking: " + this.time);
    HeroSelector.enablePick(true);
    HeroSelector.update();
    this.show(true);
    CustomUI.show(false, false);
    this.isPicking = true;
    this.abilShop.setCanSwap(true);
  }

  runBanPhase() {
    this.time = HeroSelectorManager.BAN_TIME;
    HeroSelector.setTitleText(GetLocalizedString(HeroSelector.BanButtonText) + ": " + this.time);
    HeroSelector.enableBan(true);
    HeroSelector.update();
    this.show(true);
    CustomUI.show(false, false);
    this.isPicking = false;
    this.abilShop.setCanSwap(false);
  }

  runHeroSelectTimer() {
    if (this.time <= 0) {
      if (this.isPicking) {
        this.finishHeroPick();
      } else {
        this.runPickPhase();
      }
    }
    
    if (this.isPicking && this.time <= 5) {
      PlaySoundBJ(gg_snd_BattleNetTick);
    }

    if (this.isPicking) {
      HeroSelector.setTitleText("Pick: " + this.time);
    } else {
      HeroSelector.setTitleText(GetLocalizedString(HeroSelector.BanButtonText) + ": " + this.time);
    }

    this.time -= 1;
    SetTextTagTextBJ(this.timerText, I2S(this.time), 10);
  }


  finishHeroPick() {
    this.allowRepick = Globals.isFBSimTest;
    this.isGameStarted = true;
    DisableTrigger(this.gameModeTrigger);
    PauseTimer(this.selectTimer);

    this.show(false);
    CustomUI.show(true, false);

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      udg_TempPlayer = Player(i);

      // if (true) {
      if (IsPlayerSlotState(udg_TempPlayer, PLAYER_SLOT_STATE_PLAYING)) {
        if (CountUnitsInGroup(udg_PlayerPickedHeroesUnitGroup[i]) == 0) {
          HeroSelector.forcePick(udg_TempPlayer);
        }
      }
      // if (CountUnitsInGroup(udg_PlayerPickedHeroesUnitGroup[i]) == 0) {
      //   HeroSelector.forcePick(udg_TempPlayer);
      // }
      
      ForGroup(udg_PlayerPickedHeroesUnitGroup[i], () => {
        const unit = GetEnumUnit();
        const customHero = Globals.customPlayers[i].getCustomHero(unit);
        if (customHero) {
          customHero.setCurrentSP(customHero.getMaxSP());
        }
      })


      // force pick if not picked
      udg_TempPlayer = Player(i);
      udg_TempInt = i+1;
      TriggerExecute(gg_trg_Hero_Pick_Enable_Abilities);
      TriggerExecute(gg_trg_Hero_Pick_Setup_Selected_Heroes);
    }
    TriggerExecute(gg_trg_Hero_Pick_Completion);

    if (Globals.isKOTH) {
      let points = TournamentData.kothPointsToWin;
      if (StringLength(this.gameModeString) > 5) {
        const pStr = SubString(this.gameModeString, 5, 7);
        if (pStr) points = S2I(pStr);
      }
      TournamentManager.getInstance().addKOTH(points);
      TournamentManager.getInstance().startTournament(Constants.KOTHName);
    }
  }



  
  setupGameModes() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ap", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ar", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ar2", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-crono", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-anime", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-vg", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-meme", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-antimeme", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-classic", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-original", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-koth", false);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "rush", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "rrr", true);
    }
    TriggerAddCondition(this.gameModeTrigger, Condition(() => {
      const player = GetTriggerPlayer();
      if (player != Globals.hostPlayer) return false;

      
      const str = GetEventPlayerChatString().toLowerCase();
      if (str == "rush" || str == "rrr") {
        this.time = 1;
        return;
      }

      print("Game Mode: " + str);
      this.gameModeString = str;
      this.allowRepick = true;

      if (SubString(this.gameModeString, 0, 5) == "-koth") {
        this.modeKOTH();
        return;
      }

      switch (str) {
        case "-original":
          this.modeOriginal();
          break;

        case "-classic":
          this.modeClassic();
          break;
        
        case "-antimeme":
          this.modeAntiMeme();
          break;

        case "-meme":
          this.modeMeme();
          break;

        case "-crono":
          this.modeCrono();
          break;

        case "-anime":
          this.modeAnime();
          break;

        case "-vg":
          this.modeVG();
          break;

        case "-ar":
          this.modeAllRandom(false);
          break;
        case "-ar2":
          this.modeAllRandom(true);
          break;

        case "-ap":
        default:
          this.modeAllPick();
          break;
        
      }

      return false;
    }));
  }


  modeAllPick() {
    for (const hsUnit of this.heroSelectUnits) {
      hsUnit.setUnitReq(null);
    }
    this.startHeroSelection();
  }

  modeAllRandom(repickable: boolean) {
    for (const hsUnit of this.heroSelectUnits) {
      hsUnit.setUnitReq(null);
    }
    HeroSelector.deselectButtons();
    HeroSelector.update();
    this.forceAllRepick();

    this.runPickPhase();

    if (!repickable) {
      this.allowRepick = false;
    } else {

    }
    this.show(false);
    CustomUI.show(true, false);
    this.time = 15;

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      if (IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING)) {
        HeroSelector.forceRandom(player);
      }
    }
  }

  modeOriginal() {
    for (const hsUnit of this.heroSelectUnits) {
      if (
        hsUnit.hasCategory(HeroSelectCategory.DBZ)
        || hsUnit.hasCategory(HeroSelectCategory.CRONO)
      ) {
        if (hsUnit.hasCategory(HeroSelectCategory.GOOD)) {
          hsUnit.setUnitReq(0);
        } else if (hsUnit.hasCategory(HeroSelectCategory.EVIL)) {
          hsUnit.setUnitReq(1);
        }
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
      }
    }
    this.startHeroSelection();
  }

  modeClassic() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.DBZ)) {
        if (hsUnit.hasCategory(HeroSelectCategory.GOOD)) {
          hsUnit.setUnitReq(0);
        } else if (hsUnit.hasCategory(HeroSelectCategory.EVIL)) {
          hsUnit.setUnitReq(1);
        }
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
      }
    }
    this.startHeroSelection();
  }

  modeMeme() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.DBZ)) {
        hsUnit.setUnitReq(RACE_DEMON);
      } else {
        hsUnit.setUnitReq(null);
      }
    }
    this.startHeroSelection();
  }

  modeAntiMeme() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.MEME)) {
        hsUnit.setUnitReq(RACE_DEMON);
      } else {
        hsUnit.setUnitReq(null);
      }
    }
    this.startHeroSelection();
  }

  modeCrono() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.CRONO)) {
        hsUnit.setUnitReq(null);
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
      }
    }
    this.startHeroSelection();
  }

  modeAnime() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.ANIME)) {
        hsUnit.setUnitReq(null);
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
      }
    }
    this.startHeroSelection();
  }

  modeVG() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.VIDEOGAME)) {
        hsUnit.setUnitReq(null);
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
      }
    }
    this.startHeroSelection();
  }

  modeKOTH() {
    Globals.isKOTH = !Globals.isKOTH;
    const str = Globals.isKOTH ? "|cff00ff00ON" : "|cffff0000OFF";
    const pStr = SubString(this.gameModeString, 5, 7);
    print("|cffffcc00KOTH: " + str + "|r" + " " + "|cffffff00(" + pStr + ")|r");
    this.startHeroSelection(true);
  }

};