import { Capsules, Constants, Globals, Id, OrderIds } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { ExperienceManager } from "Core/ExperienceSystem/ExperienceManager";
import { TournamentData } from "Core/TournamentSystem/TournamentData";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { KOTHStage } from "./KOTHStage";
import { SoundHelper } from "Common/SoundHelper";
import { VisionHelper } from "Common/VisionHelper";
import { TimerManager } from "Core/Utility/TimerManager";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class KOTHGame {
  protected gameTimer: timer;
  protected gameState: number;
  protected gameCounter: number;
  protected roundWinner: number;
  protected pointsTeam1: number;
  protected pointsTeam2: number;
  protected pointsToWin: number;
  protected numRounds: number;

  protected lastUpgRound: number;
  protected baseLvlsPerRound: number;
  protected baseStatsPerRound: number;

  protected protectItems: boolean;
  protected captureXp: number

  protected captureTeam: number;
  protected captureCount: number;
  protected captureTextTag: texttag;
  protected captureSfxLock: effect;
  protected captureSfxUnlock: effect;

  protected fbStage: KOTHStage;
  protected namekStage: KOTHStage;
  protected futureStage: KOTHStage;
  protected currentStage: KOTHStage;

  protected fogs: fogmodifier[];

  protected rushTrigger: trigger;

  constructor(
    public showTimer: timer = null,
    public showDialog: timerdialog = null,
  ) {
    this.gameTimer = CreateTimer();
    this.gameState = TournamentData.kothStatePreStart;
    this.gameCounter = 0;
    this.roundWinner = 0;
    this.pointsToWin = TournamentData.kothPointsToWin;
    this.pointsTeam1 = 0;
    this.pointsTeam2 = 0;
    this.numRounds = 0;
    
    this.lastUpgRound = TournamentData.kothLastUpgRound;
    this.baseLvlsPerRound = TournamentData.kothLvlsPerRound;
    this.baseStatsPerRound = TournamentData.kothStatsPerRound;

    this.protectItems = true;
    this.captureXp = TournamentData.kothCaptureXp;
    
    this.captureTeam = Constants.invalidTeamValue;
    this.captureCount = 0;
    this.captureTextTag = CreateTextTag();
    this.captureSfxLock = AddSpecialEffect("Spell_Marker_Red.mdl", 0, 0);
    this.captureSfxUnlock = AddSpecialEffect("Spell_Marker_Green.mdl", 0, 0);
    BlzSetSpecialEffectScale(this.captureSfxLock, 0.01);
    BlzSetSpecialEffectAlpha(this.captureSfxLock, 200);
    BlzSetSpecialEffectScale(this.captureSfxUnlock, 0.01);
    BlzSetSpecialEffectAlpha(this.captureSfxUnlock, 200);

    
    this.fbStage = new KOTHStage(
      "Tournament of Power", 
      TournamentData.tournamentSpawn1, 
      TournamentData.tournamentSpawn2,
      TournamentData.finalBattleCenter,
      Rect(
        TournamentData.finalBattleBottomLeft.x, TournamentData.finalBattleBottomLeft.y,
        TournamentData.finalBattleTopRight.x, TournamentData.finalBattleTopRight.y
      )
    );
    this.namekStage = new KOTHStage(
      "Namek", 
      TournamentData.kothNamekSpawn1, 
      TournamentData.kothNamekSpawn2,
      TournamentData.kothNamekCenter,
      Rect(
        TournamentData.kothNamekBottomLeft.x, TournamentData.kothNamekBottomLeft.y,
        TournamentData.kothNamekTopRight.x, TournamentData.kothNamekTopRight.y
      )
    );
    this.futureStage = new KOTHStage(
      "Future", 
      TournamentData.kothFutureSpawn1, 
      TournamentData.kothFutureSpawn2,
      TournamentData.kothFutureCenter,
      Rect(
        TournamentData.kothFutureBottomLeft.x, TournamentData.kothFutureBottomLeft.y,
        TournamentData.kothFutureTopRight.x, TournamentData.kothFutureTopRight.y
      )
    );
    this.currentStage = new KOTHStage(
      "Tournament of Power", 
      TournamentData.tournamentSpawn1, 
      TournamentData.tournamentSpawn2,
      TournamentData.finalBattleCenter,
      TournamentData.tournamentRect
    );
    this.currentStage.copyStage(this.fbStage);

    this.fogs = VisionHelper.startFogModifierRadius(Constants.activePlayers, this.namekStage.capturePoint, TournamentData.kothCaptureRadius, FOG_OF_WAR_VISIBLE, true);
    this.fogs = VisionHelper.startFogModifierRadius(Constants.activePlayers, this.futureStage.capturePoint, TournamentData.kothCaptureRadius, FOG_OF_WAR_VISIBLE, true);

    SetTextTagPos(
      this.captureTextTag, 
      this.currentStage.capturePoint.x, 
      this.currentStage.capturePoint.y, 
      10
    );
    SetTextTagVisibility(this.captureTextTag, true);
    SetTextTagPermanent(this.captureTextTag, true);
    SetTextTagColor(this.captureTextTag, 255, 255, 255, 255);
    this.updateCaptureDisplay();
    

    this.rushTrigger = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(this.rushTrigger, player, "rrr", true);
    }
    TriggerAddAction(this.rushTrigger, () => {
      const player = GetTriggerPlayer();
      if (player == Globals.hostPlayer) {
        if (
          this.gameCounter > 0 
          && this.gameState == TournamentData.kothStateLobby
        ) {
          this.gameState = TournamentData.kothStateArena;
          this.gameCounter = 0;
          this.doArena();
          this.gameCounter = 1;
        }
      }
    });
  }

  setPointsToWin(p: number) {
    this.pointsToWin = p;
  }

  updateStage() {
    if (this.numRounds == 0) {
      this.currentStage.copyStage(this.fbStage);
    } else {
      const pointsDiff = Math.abs(this.pointsTeam1 - this.pointsTeam2);
      const existsAdv1 = pointsDiff >= TournamentData.kothPointsForAdv1;
      const existsAdv2 = pointsDiff >= TournamentData.kothPointsForAdv2;

      if (existsAdv1 || existsAdv2) {
        // change stages on adv

        if (existsAdv2) {
          this.currentStage.copyStage(this.futureStage);
        } else if (existsAdv1) {
          this.currentStage.copyStage(this.namekStage);
        }
  
        // give adv side (spawn1) to losing team
        if (this.pointsTeam1 > this.pointsTeam2) {
          this.currentStage.swapSides();
        }
      } else {
        // swap sides on no adv
        if (this.currentStage.name != this.fbStage.name) {
          this.currentStage.copyStage(this.fbStage);
        } else {
          this.currentStage.swapSides();
        }
      }
    }

    print("|cffffcc00Next Round: |cffff2222" + this.currentStage.name + "|r");
    this.updateCaptureDisplay();
    SetTextTagPos(
      this.captureTextTag, 
      this.currentStage.capturePoint.x, 
      this.currentStage.capturePoint.y,
      10
    );
    BlzSetSpecialEffectPosition(
      this.captureSfxLock, 
      this.currentStage.capturePoint.x, 
      this.currentStage.capturePoint.y,
      -128
    );
    BlzSetSpecialEffectPosition(
      this.captureSfxUnlock, 
      this.currentStage.capturePoint.x, 
      this.currentStage.capturePoint.y, 
      -128
    );
    BlzSetSpecialEffectScale(this.captureSfxUnlock, 0.01);
    BlzSetSpecialEffectScale(this.captureSfxLock, TournamentData.kothCaptureRadius / 100);
  }

  updateCaptureDisplay() {
    let str = "";
    if (this.captureTeam > 0) {
      str = this.captureTeam == Constants.team1Value ? "|cffff2222" : "|cff00ffff";
    }
    const ratio = Math.min(
      100, 
      R2I(100 * this.captureCount / TournamentData.kothCaptureWinCount)
    );
    str = str + I2S(ratio) + "%";
    SetTextTagTextBJ(this.captureTextTag, str, 15);
  }

  getWinner() {
    if (this.pointsTeam1 >= this.pointsToWin) {
      return Constants.team1Value;
    } else if (this.pointsTeam2 >= this.pointsToWin) {
      return Constants.team2Value;
    }
    return Constants.invalidTeamValue;
  }

  isFinished() {
    return (
      this.pointsTeam1 >= this.pointsToWin
      || this.pointsTeam2 >= this.pointsToWin
    );
  }

  setupGame() {
    this.runGame();
    TimerStart(this.gameTimer, 1.0, true, () => {
      this.runGame();
    });
  }

  runGame() {
    const preState = this.gameState;
    switch (this.gameState) {
      default:
      case TournamentData.kothStatePreStart:
        this.preStart();
        break;
      case TournamentData.kothStateLobby:
        this.doLobby();
        break;
      case TournamentData.kothStateArena:
        this.doArena();
        break;
      case TournamentData.kothStateArenaEnd:
        this.doArenaEnd();
        break;
      case TournamentData.kothStateFinished:
        this.doFinished();
        break;
    }

    if (this.gameState != preState) {
      this.gameCounter = 0;
    } else {
      this.gameCounter += 1;
    }
  }

  preStart() {
    StopMusic(false);
    ClearMapMusic();
    PlayMusic("Audio\\Music\\KachiDaze.mp3");
    ResumeMusic();

    this.gameState = TournamentData.kothStateLobby;
    this.setupLobbyNeutrals();
    this.preparePlayerHeroes(Constants.activePlayers);

    this.removeArenaCreeps(this.namekStage);
    const removeTimer = TimerManager.getInstance().get();
    TimerStart(removeTimer, 5.0, false, () => {
      this.removeArenaCreeps(this.futureStage);
    });
  }

  setupLobbyNeutrals() {
    let x = null;
    x = CreateUnit(
      Constants.sagaPlayer, 
      Id.neutralAndroid17,
      TournamentData.tournamentWaitRoom1.x - 256,
      TournamentData.tournamentWaitRoom1.y - 1280,
      0
    );
    SetUnitMoveSpeed(x, 0);
    x = CreateUnit(
      Constants.sagaPlayer, 
      Id.neutralAndroid18,
      TournamentData.tournamentWaitRoom1.x - 192,
      TournamentData.tournamentWaitRoom1.y - 1280,
      0
    );
    SetUnitMoveSpeed(x, 0);



    x = CreateUnit(
      Constants.sagaPlayer, 
      Id.neutralAndroid17,
      TournamentData.tournamentWaitRoom2.x - 256,
      TournamentData.tournamentWaitRoom2.y + 1280,
      0
    );
    SetUnitMoveSpeed(x, 0);
    x = CreateUnit(
      Constants.sagaPlayer, 
      Id.neutralAndroid18,
      TournamentData.tournamentWaitRoom2.x - 192,
      TournamentData.tournamentWaitRoom2.y + 1280,
      0
    );
    SetUnitMoveSpeed(x, 0);
  }

  unlockWishAbilities(player: player) {
    SetPlayerAbilityAvailable(player, Capsules.saibamenSeeds, true);
    SetPlayerAbilityAvailable(player, Capsules.wheeloResearch, true);
    SetPlayerAbilityAvailable(player, Capsules.deadZone, true);
    SetPlayerAbilityAvailable(player, Capsules.scouter2, true);
    SetPlayerAbilityAvailable(player, Capsules.getiStarFragment, true);
    SetPlayerAbilityAvailable(player, Capsules.dimensionSword, true);
    SetPlayerAbilityAvailable(player, Capsules.braveSword, true);
    SetPlayerAbilityAvailable(player, Capsules.timeRing, true);
    SetPlayerAbilityAvailable(player, Capsules.battleArmor5, true);
    SetPlayerAbilityAvailable(player, Capsules.treeOfMightSapling, true);
    // SetPlayerAbilityAvailable(player, Capsules.potaraEarring, true);
  }

  preparePlayerHeroes(players: player[]) {
    for (const player of players) {
      const playerId = GetPlayerId(player);
      this.unlockWishAbilities(player);
      ForGroup(udg_StatMultPlayerUnits[playerId], () => {
        const unit = GetEnumUnit();
        if (
          UnitHelper.isUnitTournamentViable(unit)
          && UnitHelper.isUnitAlive(unit)
          && !UnitHasItemOfTypeBJ(unit, ItemConstants.SagaDrops.BATTLE_ARMOR_5)
        ) {
          let it = CreateItem(
            ItemConstants.SagaDrops.BATTLE_ARMOR_5,
            GetUnitX(unit), GetUnitY(unit),
          );
          UnitAddItem(unit, it);
          // it = CreateItem(
          //   ItemConstants.KOTH.senzuGenerator,
          //   GetUnitX(unit), GetUnitY(unit),
          // );
          // UnitAddItem(unit, it);
          // it = CreateItem(
          //   ItemConstants.KOTH.hamGenerator,
          //   GetUnitX(unit), GetUnitY(unit),
          // );
          // UnitAddItem(unit, it);
          // it = CreateItem(
          //   ItemConstants.KOTH.bananaGenerator,
          //   GetUnitX(unit), GetUnitY(unit),
          // );
          // UnitAddItem(unit, it);
          it = CreateItem(
            ItemConstants.KOTH.miniSenzuGenerator,
            GetUnitX(unit), GetUnitY(unit),
          );
          UnitAddItem(unit, it);

          if (GetUnitTypeId(unit) == Id.skurvy) {
            it = CreateItem(
              ItemConstants.crystalCoconut,
              GetUnitX(unit), GetUnitY(unit),
            );
            UnitAddItem(unit, it);
          }
        }
      });
    }
  }
  
  removeArenaCreeps(stage: KOTHStage) {
    GroupEnumUnitsInRect(Globals.tmpUnitGroup, stage.arenaRect, null);
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      const player = GetOwningPlayer(unit);
      const playerId = GetPlayerId(player);
      if (
        !IsUnitType(unit, UNIT_TYPE_HERO) 
        && playerId >= Constants.maxActivePlayers
        && playerId != PLAYER_NEUTRAL_PASSIVE
      ) {
        RemoveUnit(unit);
      }
    });
    GroupClear(Globals.tmpUnitGroup);
  }

  resetRoundStats() {
    this.roundWinner = 0;
    this.captureTeam = Constants.invalidTeamValue;
    this.captureCount = 0;
    TimerDialogSetTitle(
      this.showDialog, 
      "Points |cff00ffff" 
      + this.pointsTeam1 
      + " : " + this.pointsTeam2
      + " (" + this.pointsToWin + ")"
      + "|r"
    );
  }

  doLobby() {
    // wait few seconds then move to arena
    if (this.gameCounter == 0) {
      this.resetRoundStats();
      this.moveTeamsToLobby(Constants.defaultTeam1, TournamentData.tournamentWaitRoom1);
      this.moveTeamsToLobby(Constants.defaultTeam2, TournamentData.tournamentWaitRoom2);
      if (this.numRounds == 0) {
        TimerStart(this.showTimer, TournamentData.kothLobbyWaitFirst, false, null);
      } else {
        TimerStart(this.showTimer, TournamentData.kothLobbyWait, false, null);
      }
      this.updateStage();
    }

    if (
      TimerGetRemaining(this.showTimer) == 0
      && !this.isFinished()
    ) {
      this.gameState = TournamentData.kothStateArena;
    }
  }

  doArena() {
    if (this.gameCounter == 0) {
      this.moveTeamsToArena(Constants.defaultTeam1, this.currentStage.spawn1);
      this.moveTeamsToArena(Constants.defaultTeam2, this.currentStage.spawn2);
      TriggerExecute(gg_trg_Auto_Transform);
      TimerStart(this.showTimer, TournamentData.kothArenaTimeout, false, null);
    }

    this.updateCapture();

    const isTeam1Dead = this.checkTeamUnitsDead(Constants.defaultTeam1);
    const isTeam2Dead = this.checkTeamUnitsDead(Constants.defaultTeam2);

    if (isTeam1Dead && isTeam2Dead) {
      print("|cffffff00The round is a draw!");
      this.roundWinner = Constants.invalidTeamValue;
      this.gameState = TournamentData.kothStateArenaEnd;
      return;
    }
    
    if (isTeam2Dead && !isTeam1Dead) {
      this.roundWinner = Constants.team1Value;
    }

    if (isTeam1Dead && !isTeam2Dead) {
      this.roundWinner = Constants.team2Value;
    }

    if (
      this.roundWinner != 0 
      || TimerGetRemaining(this.showTimer) == 0
    ) {
      if (this.roundWinner == 0 && this.captureCount > 0) {
        this.roundWinner = this.captureTeam;
      }

      if (this.roundWinner > 0) {
        print("|cff00ff00Team " + this.roundWinner + " has won the round!");
      } else {
        print("|cffffff00The round is a draw!");
      }
      this.gameState = TournamentData.kothStateArenaEnd;
    }
  }

  doArenaEnd() {
    if (this.gameCounter == 0) {
      this.endRound();
      if (this.isFinished()) {
        this.gameState = TournamentData.kothStateFinished;
      } else {
        this.gameState = TournamentData.kothStateLobby;
      }
    }
  }

  doFinished() {
    DisableTrigger(this.rushTrigger);
    PauseTimer(this.gameTimer);

    for (const fm of this.fogs) {
      DestroyFogModifier(fm);
    }
  }

  endRound() {
    switch (this.roundWinner) {
      default:
      case 0:
        // no one won
        break;
      case 1:
        // t1 won
        this.pointsTeam1++;
        this.moveArenaItemsToLobby(TournamentData.tournamentWaitRoom1);
        break;
      case 2:
        // t2 won
        this.pointsTeam2++;
        this.moveArenaItemsToLobby(TournamentData.tournamentWaitRoom2);
        break;
    }

    this.removeArenaSummons();

    // update displays
    print(
      "|cffffcc00Points |cff00ffff" 
      + this.pointsTeam1 + " : " 
      + this.pointsTeam2 
      + " (" + this.pointsToWin + ")"
    );
    this.numRounds++;
  }

  updateCapture() {
    if (this.gameCounter % 30 == 0) {
      PingMinimapForForceEx(
        bj_FORCE_ALL_PLAYERS,
        this.currentStage.capturePoint.x,
        this.currentStage.capturePoint.y,
        10, bj_MINIMAPPINGSTYLE_FLASHY,
        0, 100, 0
      );
    }

    if (this.gameCounter < TournamentData.kothCaptureUnlockTime) {
      return;
    }
    if (this.gameCounter == TournamentData.kothCaptureUnlockTime) {
      print("|cff00ff00The point has unlocked!");
      PlaySoundBJ(gg_snd_Warning);
      BlzSetSpecialEffectScale(this.captureSfxLock, 0.01);
      BlzSetSpecialEffectScale(this.captureSfxUnlock, TournamentData.kothCaptureRadius / 100);
    }

    // check who is standing in the center
    let isCenter1 = false;
    let isCenter2 = false;

    // give all people in the center extra EXP
    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRange(
      Globals.tmpUnitGroup, 
      this.currentStage.capturePoint.x, 
      this.currentStage.capturePoint.y,
      TournamentData.kothCaptureRadius, 
      null
    );
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      if (
        UnitHelper.isUnitAlive(unit) 
        && UnitHelper.isUnitTournamentViable(unit)
      ) {
        // is unit in team 1
        // is unit in team 2

        if (this.captureXp > 0) {
          const lvl = GetHeroLevel(unit);
          const reqXp = ExperienceManager.getInstance().getHeroReqLevelXPFrom(lvl, lvl+1);
          const giveXp = R2I(reqXp * TournamentData.kothCaptureExpBonusRatio);
          AddHeroXP(unit, giveXp, true);
        }

        const player = GetOwningPlayer(unit);
        if (!isCenter1) {
          for (const p of Constants.defaultTeam1) {
            if (player == p) isCenter1 = true;
          }
        }

        if (!isCenter2) {
          for (const p of Constants.defaultTeam2) {
            if (player == p) isCenter2 = true;
          }
        }
      }
    });
    GroupClear(Globals.tmpUnitGroup);

    // if only one team, update capture progress in that direction
    if (isCenter1 && !isCenter2) {
      this.addCaptureState(1);
    }

    if (!isCenter1 && isCenter2) {
      this.addCaptureState(2);
    }

    // if both teams or no one standing, then dont change capture state
  }

  addCaptureState(dir: number) {
    if (this.captureCount == 0) {
      this.captureTeam = dir;
    }

    this.captureCount += (this.captureTeam == dir) ? 1 : -1;
    this.updateCaptureDisplay();

    if (this.captureCount >= TournamentData.kothCaptureWinCount) {
      this.roundWinner = this.captureTeam;
    }
  }

  moveArenaItemsToLobby(pos: Vector2D) {
    const lobbyItemSize = 64;
    const lobbyLimits = 512;
    let xMod = 0;
    let yMod = 0;
    EnumItemsInRect(this.currentStage.arenaRect, null, () => {
      const it = GetEnumItem();
      if (IsItemVisible(it)) {
        SetItemPosition(
          it, 
          pos.x + xMod % lobbyLimits, 
          pos.y + yMod % lobbyLimits
        );
        xMod += lobbyItemSize;
        if (xMod % lobbyLimits == 0) yMod =+ lobbyItemSize;
      }
    });
  }

  removeArenaSummons() {
    GroupClear(Globals.tmpUnitGroup);
    GroupEnumUnitsInRect(
      Globals.tmpUnitGroup, 
      this.currentStage.arenaRect,
      null
    );
    ForGroup(Globals.tmpUnitGroup, () => {
      const unit = GetEnumUnit();
      const playerId = GetPlayerId(GetOwningPlayer(unit));
      if (
        playerId >= 0 
        && playerId < Constants.maxActivePlayers
        && !UnitHelper.isUnitTournamentViable(unit)
      ) {
        RemoveUnit(unit);
      }
    });
  }

  reviveResetUnitState(unit: unit, playerId: number, pos: Vector2D) {
    if (UnitHelper.isUnitDead(unit)) {
      ReviveHero(unit, pos.x, pos.y, true);
    }
    SetUnitLifePercentBJ(unit, 100);
    SetUnitManaPercentBJ(unit, 100);

    UnitResetCooldown(unit);
    const ch = Globals.customPlayers[playerId].getCustomHero(unit);
    if (ch) {
      ch.forceEndAllAbilities();
      ch.setCurrentSP(ch.getMaxSP());
    }

    UnitRemoveBuffs(unit, true, true);
    IssueImmediateOrderById(unit, OrderIds.STOP);

    SetUnitX(unit, pos.x);
    SetUnitY(unit, pos.y);
  }

  moveTeamsToLobby(players: player[], pos: Vector2D): void {
    // get all units put in wait rooms
    for (const player of players) {
      const playerId = GetPlayerId(player);
      const numUnits = CountUnitsInGroup(udg_StatMultPlayerUnits[playerId]);
      if (numUnits == 0) continue;
      // const numUnitsMult = Math.min(1, 0.25 + 1 / numUnits);
      const numUnitsMult = Math.min(1, (2*numUnits-1) / (numUnits * numUnits));

      ForGroup(udg_StatMultPlayerUnits[playerId], () => {
        const unit = GetEnumUnit();
        if (!UnitHelper.isUnitTournamentViable(unit)) return;
        
        this.reviveResetUnitState(unit, playerId, pos);
        SetUnitInvulnerable(unit, true);

        // give lvls / stats as necessary
        if (this.numRounds < this.lastUpgRound) {
          if (this.baseLvlsPerRound > 0) {
            const lvl = GetHeroLevel(unit);
            let exp = ExperienceManager.getInstance().getHeroReqLevelXPFrom(
              lvl, R2I(lvl + this.baseLvlsPerRound / numUnits)
            );
            // if (numUnits > 0) exp = R2I(exp / numUnits);
            AddHeroXP(unit, exp, false);
          }
  
          if (this.baseStatsPerRound > 0) {
            udg_StatMultUnit = unit;
            udg_StatMultReal = I2R(R2I(this.baseStatsPerRound / numUnits));
            TriggerExecute(gg_trg_Add_To_Base_Stats);
            TriggerExecute(gg_trg_Add_To_Tourney_Stats_Data);
            TriggerExecute(gg_trg_Update_Current_Stats);
          }
        }
        
        // mark items to not drop on death
      });
      PanCameraToTimedForPlayer(player, pos.x, pos.y, 0);
    }
  }

  protectUnitItems(unit: unit) {
    if (!this.protectItems) return;
    for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
      const it = UnitItemInSlot(unit, i);
      if (
        it != null 
        && BlzGetItemBooleanField(it, ITEM_BF_DROPPED_WHEN_CARRIER_DIES)
      ) {
        BlzSetItemBooleanField(it, ITEM_BF_DROPPED_WHEN_CARRIER_DIES, false);
      }
    }
  }

  moveTeamsToArena(
    players: player[], 
    spawn: Vector2D,
  ) {
    for (const player of players) {
      const playerId = GetPlayerId(player);
      ForGroup(udg_StatMultPlayerUnits[playerId], () => {
        const unit = GetEnumUnit();
        if (UnitHelper.isUnitTournamentViable(unit)) {
          this.reviveResetUnitState(unit, playerId, spawn);
          ShowUnit(unit, true);
          if (!this.isFinished()) {
            PauseUnit(unit, true);
            SetUnitInvulnerable(unit, true);
          }
        } else {
          RemoveUnit(unit);
        }
      });

      if (this.isFinished()) {
        PanCameraToTimedForPlayer(player, spawn.x, spawn.y, 0);
      } else {
        PanCameraToTimedForPlayer(
          player, 
          this.currentStage.capturePoint.x, 
          this.currentStage.capturePoint.y,
          0
        );
        const timer = TimerManager.getInstance().get();
        TimerStart(timer, TournamentData.kothArenaCamDelay1, false, () => {
          PanCameraToTimedForPlayer(
            player, 
            spawn.x, 
            spawn.y, 
            TournamentData.kothArenaCamDelay2
          );
          TimerManager.getInstance().recycle(timer);
          const timer2 = TimerManager.getInstance().get();
          TimerStart(timer2, TournamentData.kothArenaCamDelay2, false, () => {
            ForGroup(udg_StatMultPlayerUnits[playerId], () => {
              const unit = GetEnumUnit();
              if (!UnitHelper.isUnitTournamentViable(unit)) return;
              ShowUnit(unit, true);
              PauseUnit(unit, false);
              SetUnitInvulnerable(unit, false);
            });
            TimerManager.getInstance().recycle(timer2);
          });
        });
      }
    }
  }

  checkTeamUnitsDead(players: player[]) {
    let allDead = true;

    for (const player of players) {
      const playerId = GetPlayerId(player);
      ForGroup(udg_StatMultPlayerUnits[playerId], () => {
        const unit = GetEnumUnit();
        if (
          UnitHelper.isUnitTournamentViable(unit)
          && UnitHelper.isUnitAlive(unit)
        ) {
          allDead = false;
        }
      });
    }

    return allDead;
  }
}