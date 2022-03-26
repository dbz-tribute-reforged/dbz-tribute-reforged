import { Constants, Globals, Id } from "Common/Constants";
import { HeroAbilitiesList } from "CustomHero/HeroData/HeroAbilitiesList";
import { HeroSelectCategory } from "./HeroSelectCategory";
import { HeroSelectUnit } from "./HeroSelectUnit";
import { HeroSelectUnitList } from "./HeroSelectUnitList";

export class HeroSelectorManager {
  private static instance: HeroSelectorManager;

  static readonly BAN_TIME = 25;
  static readonly PICK_TIME = 50;
  

  public selectTimer: timer;
  public time: number;
  
  public repickTrigger: trigger;
  public allowRepick: boolean;

  public gameModeTrigger: trigger;

  public setupFinished: boolean;
  public isGameStarted: boolean;

  public heroSelectUnits: HeroSelectUnit[];

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

    this.setupFinished = false;
    this.isGameStarted = false;

    this.heroSelectUnits = [];

    this.init();
  }

  init() {
    HeroSelectCategory.setupHeroSelectCategories();
    TeamViewer.Init();
    this.setupPlayerSpawns();
    this.setupUnitCreatedFunction();
    this.setupRepickTrigger();
    this.setupHeroes();
    this.setupGameModes();
    HeroSelector.show(true);

    TimerStart(CreateTimer(), 1.0, true, () => {
      if (this.setupFinished) {
        DestroyTimer(GetExpiredTimer());
        this.modeAllPick();
      }
    })
  }

  setupPlayerSpawns() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      GroupClear(Globals.tmpUnitGroup);
      GroupEnumUnitsOfPlayer(Globals.tmpUnitGroup, Player(i), null);
      ForGroup(Globals.tmpUnitGroup, () => {
        const unit = GetEnumUnit();
        if (GetUnitTypeId(unit) == Id.heroSelectorUnit) {
          Globals.customPlayers[i].heroPickSpawn.setUnit(unit);
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
      const unit = this.heroPickSpawnUnitForPlayer(unitCode, player);
      
      this.spawnExtraUnitsForPlayer(unitCode, player);
      
      if (isRandom) {
        // was randomed
      } else {
        // picked
      }

      SelectUnitForPlayerSingle(unit, player)
      HeroSelector.enablePick(false, player)
      HeroSelector.show(false, player);

      // do other stuff

      // if globals and globals.udg_HeroSelectorEvent then
      //     globals.udg_HeroSelectorEvent = 0
      //     globals.udg_HeroSelectorEvent = 1.0
      // end
    };
  }

  setupRepickTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      // TriggerRegisterPlayerEventEndCinematic(this.repickTrigger, Player(i));
      TriggerRegisterPlayerChatEvent(this.repickTrigger, Player(i), "-repick", true);
    }
    TriggerAddCondition(this.repickTrigger, Condition(() => {
      if (this.allowRepick) {
        this.doRepickForPlayer(GetTriggerPlayer());
      }
      return false;
    }));
  }

  doRepickForPlayer(player: player) {
    GroupClear(Globals.tmpUnitGroup)  
    GroupEnumUnitsOfPlayer(Globals.tmpUnitGroup, player, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (IsUnitType(unit, UNIT_TYPE_HERO)) {
        const playerId = GetPlayerId(player);
        udg_StatMultUnit = unit;
        TriggerExecute(gg_trg_Remove_Unit_From_StatMult);
        GroupRemoveUnit(udg_PlayerPickedHeroesUnitGroup[playerId], unit);

        const unitId = GetUnitTypeId(unit);
        if (
          unitId == Id.kidTrunks
          || unitId == Id.android14
          || unitId == Id.android15
        ) {
          RemoveUnit(unit);
        } else {
          HeroSelector.repick(unit);
        }
      }
    });
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







  startHeroSelection(doBans: boolean = true) {
    HeroSelector.deselectButtons();
    HeroSelector.update();
    HeroSelector.deselectButtons();
    this.forceAllRepick();
    // this.resetBansAndPicks();
    PauseTimer(this.selectTimer);
    if (doBans) {
      this.runBanPhase();
    } else {
      this.runPickPhase();
    }
  }

  forceAllRepick() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      this.doRepickForPlayer(Player(i));
    }
  }

  resetBansAndPicks() {
    const t1Player = Constants.defaultTeam1[0];
    const t2Player = Constants.defaultTeam2[0];
    for (const hsUnit of this.heroSelectUnits) {
      HeroSelector.counterSetUnitCode(hsUnit.unitCode, 0, t1Player);
      HeroSelector.counterSetUnitCode(hsUnit.unitCode, 0, t2Player);
    }
  }

  runBanPhase() {
    this.time = HeroSelectorManager.BAN_TIME;
    HeroSelector.enableBan(true);
    HeroSelector.update();
    HeroSelector.show(true);
    
    TimerStart(this.selectTimer, 1.0, true, () => {
      HeroSelector.setTitleText(GetLocalizedString(HeroSelector.BanButtonText) + ": " + this.time);
      
      if (this.time <= 0) {
        PauseTimer(this.selectTimer);
        HeroSelector.enablePick(true);
        HeroSelector.setTitleText("Picking: " + this.time);
        this.runPickPhase();
      }
      
      this.time -= 1;
    });
  }


  runPickPhase() {
    this.time = HeroSelectorManager.PICK_TIME;
    HeroSelector.enablePick(true);
    HeroSelector.update();
    HeroSelector.show(true);

    TimerStart(this.selectTimer, 1.0, true, () => {
      HeroSelector.setTitleText("Picking: " + this.time);
      
      if (this.time <= 0) {
        PauseTimer(this.selectTimer);
        this.finishHeroPick();
      }
      
      this.time -= 1;
    });
  }


  finishHeroPick() {
    this.allowRepick = false;
    this.isGameStarted = true;
    DisableTrigger(this.gameModeTrigger);

    HeroSelector.show(false);

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      udg_TempPlayer = Player(i);

      if (IsPlayerSlotState(udg_TempPlayer, PLAYER_SLOT_STATE_PLAYING)) {
        if (CountUnitsInGroup(udg_PlayerPickedHeroesUnitGroup[i]) == 0) {
          HeroSelector.forcePick(udg_TempPlayer);
        }
      }


      // force pick if not picked
      udg_TempPlayer = Player(i);
      udg_TempInt = i+1;
      TriggerExecute(gg_trg_Hero_Pick_Enable_Abilities);
      TriggerExecute(gg_trg_Hero_Pick_Setup_Selected_Heroes);
    }
    TriggerExecute(gg_trg_Hero_Pick_Completion);
  }



  
  setupGameModes() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ap", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ar", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-ar2", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-classic", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-meme", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-antimeme", true);
      TriggerRegisterPlayerChatEvent(this.gameModeTrigger, Player(i), "-crono", true);
    }
    TriggerAddCondition(this.gameModeTrigger, Condition(() => {
      const player = GetTriggerPlayer();
      if (player != Globals.hostPlayer) return false;

      
      const str = GetEventPlayerChatString();
      print("Game Mode: " + str);
      
      this.allowRepick = true;

      switch (str) {
        case "-classic":
          this.modeClassic();
          break;
        
        case "-meme":
          this.modeMeme();
          break;

        case "-antimeme":
          this.modeAntiMeme();
          break;

        case "-crono":
          this.modeCrono();
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
      hsUnit.setUnitReq(RACE_DEMON);
    }
    HeroSelector.deselectButtons();
    HeroSelector.update();

    this.runPickPhase();

    if (!repickable) {
      this.allowRepick = false;
    }
    HeroSelector.show(false);
    this.time = 15;

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      if (IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING)) {
        HeroSelector.forceRandom(player);
      }
    }
  }

  modeClassic() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.MEME + HeroSelectCategory.CRONO)) {
        hsUnit.setUnitReq(RACE_DEMON);
      } else {
        if (hsUnit.hasCategory(HeroSelectCategory.GOOD)) {
          hsUnit.setUnitReq(1);
        } else if (hsUnit.hasCategory(HeroSelectCategory.EVIL)) {
          hsUnit.setUnitReq(2);
        }
      }
    }
    this.startHeroSelection();
  }

  modeMeme() {
    for (const hsUnit of this.heroSelectUnits) {
      if (hsUnit.hasCategory(HeroSelectCategory.MEME)) {
        hsUnit.setUnitReq(null);
      } else {
        hsUnit.setUnitReq(RACE_DEMON);
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

};