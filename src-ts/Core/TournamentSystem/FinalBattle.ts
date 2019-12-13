import { TournamentNames } from "./TournamentManager";
import { AdvancedTournament } from "./AdvancedTournament";
import { TournamentState } from "./Tournament";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { WinLossHelper } from "Common/WinLossHelper";

export class FinalBattle extends AdvancedTournament {
  protected lobbyWait: number;
  protected unitsTeam1: unit[];
  protected unitsTeam2: unit[];
  protected winTrigger: trigger;

  constructor(
    public name: string = TournamentNames.FinalBattle,
    public state: TournamentState = TournamentState.NotStarted,
  ) {
    super(name, state);
    this.toStartDelay = Constants.finalBattleTime;
    this.lobbyWait = 15;
    this.unitsTeam1 = [];
    this.unitsTeam2 = [];
    this.winTrigger = CreateTrigger();
  }

  start(): void {
    super.start();
    this.prepareTournament();
  }

  complete(): void {
    super.complete();
  }

  prepareTournament(): void {
    TimerStart(this.toStartTimer, this.toStartDelay, false, () => {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        "Prepare yourselves, the final battle for the fate of the universe will begin in " + 
        this.lobbyWait + " seconds!"
      );
      
      const dummyCaster = CreateUnit(
        Player(PLAYER_NEUTRAL_PASSIVE), 
        Constants.dummyCasterId,
        0, 0, 0,
      );
      UnitAddAbility(dummyCaster, Constants.finalBattleSpell);
      IssueImmediateOrderById(dummyCaster, Constants.finalBattleOrder);

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
    TimerStart(this.toStartTimer, this.lobbyWait, false, () => {
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
      let team = 0;
      let dyingUnitTeam: unit[] = [];
      if (GetConvertedPlayerId(player) < Constants.maxActivePlayers / 2) {
        dyingUnitTeam = this.unitsTeam1;
        team = Constants.team1Value;
      } else {
        dyingUnitTeam = this.unitsTeam2;
        team = Constants.team2Value;
      }
      this.removeUnitFromTeam(dyingUnit, dyingUnitTeam);

      if (dyingUnitTeam.length == 0) {
        WinLossHelper.forceTeamWin((team) % 2 + 1);
        this.complete();
      }
    });
  }

  removeUnitFromTeam(unit: unit, unitsTeam: unit[]) {
    const index = this.unitsTeam1.indexOf(unit);
    this.unitsTeam1.splice(index, 1);
  }
}