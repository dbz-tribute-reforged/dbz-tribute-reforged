import { AdvancedTournament } from "./AdvancedTournament";
import { TournamentState, Tournament } from "./Tournament";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { WinLossHelper } from "Common/WinLossHelper";
import { Logger } from "Libs/TreeLib/Logger";

export class FinalBattle extends AdvancedTournament implements Tournament {
  protected lobbyWait: number;
  protected unitsTeam1: unit[];
  protected unitsTeam2: unit[];
  protected winTrigger: trigger;
  protected winTeam: number;

  constructor(
    public name: string = Constants.finalBattleName,
    public state: TournamentState = TournamentState.NotStarted,
  ) {
    super(name, state);
    this.toStartDelay = Constants.finalBattleDelay;
    this.lobbyWait = 15;
    this.unitsTeam1 = [];
    this.unitsTeam2 = [];
    this.winTrigger = CreateTrigger();
    this.winTeam = 0;
  }

  start(): void {
    super.start();
    this.prepareTournament();
  }

  complete(): void {
    super.complete();
    WinLossHelper.forceTeamWin((this.winTeam) % 2 + 1);
    for (const unit of this.unitsTeam1) {
      SetUnitX(unit, 0);
      SetUnitY(unit, 0);
    }
    for (const unit of this.unitsTeam2) {
      SetUnitX(unit, 0);
      SetUnitY(unit, 0);
    }
  }

  prepareTournament(): void {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "The final battle for the fate of the universe will begin in " + 
      this.toStartDelay + " seconds!"
    );
    const dummyCaster = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE), 
      Constants.dummyCasterId,
      0, 0, 0,
    );
    UnitAddAbility(dummyCaster, Constants.finalBattleSpell);
    IssueImmediateOrderById(dummyCaster, Constants.finalBattleOrder);

    TimerStart(this.toStartTimer, this.toStartDelay, false, () => {

      this.prepareTeam(Constants.defaultTeam1, this.unitsTeam1, Constants.tournamentWaitRoom1);
      this.prepareTeam(Constants.defaultTeam2, this.unitsTeam2, Constants.tournamentWaitRoom2);

      CreateItem(Constants.senzuBean, Constants.tournamentWaitRoom1.x, Constants.tournamentWaitRoom1.y);
      CreateItem(Constants.senzuBean, Constants.tournamentWaitRoom2.x, Constants.tournamentWaitRoom2.y);
      
      for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
        FogModifierStart(CreateFogModifierRect(Player(i), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false));
      }
      
      this.state = TournamentState.InProgress;
      this.lobbyWaitForTournament();
    });
  }

  prepareTeam(players: player[], unitsTeam: unit[], waitRoom: Vector2D): void {
    // get all units put in wait rooms
    for (const player of players) {
      const playerUnits = CreateGroup();
      GroupEnumUnitsOfPlayer(playerUnits, player, Filter(() => {
        return IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO);
      }));

      ForGroup(playerUnits, () => {
        const unit = GetEnumUnit();
        unitsTeam.push(unit);
        UnitResetCooldown(unit);
        SetUnitLifePercentBJ(unit, 100);
        SetUnitManaPercentBJ(unit, 100);
        SetUnitX(unit, waitRoom.x);
        SetUnitY(unit, waitRoom.y);
        SetUnitInvulnerable(unit, true);
      })

      DestroyGroup(playerUnits);
    }
  }

  lobbyWaitForTournament(): void {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, this.lobbyWait, 
      "You have " + this.lobbyWait + 
      " seconds to make your last preparations for the Final Battle. " + 
      "After this, there's no turning back."
    );

    TimerStart(this.toStartTimer, this.lobbyWait, false, () => {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, this.lobbyWait, 
        "The Final Battle has begun!"
      );
      this.moveTeamsToSpawn(this.unitsTeam1, Constants.tournamentSpawn1);
      this.moveTeamsToSpawn(this.unitsTeam2, Constants.tournamentSpawn2);

      this.setupWinTriggerActions();
    })
  }

  moveTeamsToSpawn(unitsTeam: unit[], spawnPoint: Vector2D) {
    for (const unit of unitsTeam) {
      SetUnitX(unit, spawnPoint.x);
      SetUnitY(unit, spawnPoint.y);
      ShowUnitShow(unit);
      PauseUnit(unit, false);
      SetUnitInvulnerable(unit, false);
      TriggerRegisterUnitEvent(this.winTrigger, unit, EVENT_UNIT_DEATH);
    }
  }

  setupWinTriggerActions() {
    TriggerAddAction(this.winTrigger, () => {
      const dyingUnit = GetTriggerUnit();
      const player = GetOwningPlayer(dyingUnit);
      let teamNumber = 0;
      let dyingUnitTeam: unit[] = [];
      if (GetConvertedPlayerId(player) < Constants.maxActivePlayers / 2) {
        dyingUnitTeam = this.unitsTeam1;
        teamNumber = Constants.team1Value;
      } else {
        dyingUnitTeam = this.unitsTeam2;
        teamNumber = Constants.team2Value;
      }
      this.removeUnitFromTeam(dyingUnit, dyingUnitTeam);

      Logger.LogDebug("Team " + teamNumber + " remaining: " + dyingUnitTeam.length);
      if (dyingUnitTeam.length == 0) {
        this.winTeam = teamNumber;
        this.complete();
      }
    });
  }

  removeUnitFromTeam(unit: unit, unitsTeam: unit[]) {
    const index = unitsTeam.indexOf(unit);
    unitsTeam.splice(index, 1);
  }
}