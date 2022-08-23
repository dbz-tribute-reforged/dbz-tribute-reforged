import { AdvancedTournament } from "./AdvancedTournament";
import { TournamentState, Tournament } from "./Tournament";
import { Constants } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { WinLossHelper } from "Common/WinLossHelper";
import { TournamentData } from "./TournamentData";
import { UnitHelper } from "Common/UnitHelper";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";

export class FinalBattle extends AdvancedTournament implements Tournament {
  protected unitsTeam1: unit[];
  protected unitsTeam2: unit[];
  protected winTrigger: trigger;
  protected winTeam: number;

  constructor(
    public name: string = TournamentData.finalBattleName,
    public state: TournamentState = TournamentState.NotStarted,
    public toStartDelay: number = TournamentData.finalBattleDelay,
  ) {
    super(name, state, toStartDelay);
    this.unitsTeam1 = [];
    this.unitsTeam2 = [];
    this.winTrigger = CreateTrigger();
    this.winTeam = Constants.invalidTeamValue;
  }

  start(): void {
    super.start();
    this.prepareTournament();
  }

  complete(): void {
    super.complete();
    WinLossHelper.forceTeamWin(this.winTeam);
    for (const unit of this.unitsTeam1) {
      SetUnitX(unit, 0);
      SetUnitY(unit, 0);
    }
    for (const unit of this.unitsTeam2) {
      SetUnitX(unit, 0);
      SetUnitY(unit, 0);
    }
  }

  // what to do before the tournament actually starts
  // e.g. show timers
  prepareTournament(): void {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "The Final Battle for the fate of the universe will begin in " + 
      this.toStartDelay + " seconds!"
    );
    
    // tell gui respawn system final battle is happening
    const dummyCaster = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE), 
      Constants.dummyCasterId,
      TournamentData.finalBattleDetector.x, 
      TournamentData.finalBattleDetector.y,
      0,
    );
    // UnitAddAbility(dummyCaster, TournamentData.finalBattleSpell);
    // IssueImmediateOrderById(dummyCaster, TournamentData.finalBattleOrder);

    TimerStart(this.toStartTimer, this.toStartDelay, false, () => {
      this.setupTournament();
    });
  }

  // setup the tournament by
  // moving units into it as needed
  setupTournament() {
    this.prepareTeam(Constants.defaultTeam1, this.unitsTeam1, TournamentData.tournamentWaitRoom1);
    this.prepareTeam(Constants.defaultTeam2, this.unitsTeam2, TournamentData.tournamentWaitRoom2);

    CreateItem(ItemConstants.Consumables.SENZU_BEAN, TournamentData.tournamentWaitRoom1.x, TournamentData.tournamentWaitRoom1.y - 500);
    CreateItem(ItemConstants.Consumables.SENZU_BEAN, TournamentData.tournamentWaitRoom2.x, TournamentData.tournamentWaitRoom2.y + 500);
    
    // for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
    //   FogModifierStart(CreateFogModifierRect(Player(i), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false));
    // }
    
    this.state = TournamentState.InProgress;
    this.lobbyWaitForTournament();
  }

  prepareTeam(players: player[], unitsTeam: unit[], waitRoom: Vector2D): void {
    // get all units put in wait rooms
    for (const player of players) {
      const playerUnits = CreateGroup();
      GroupEnumUnitsOfPlayer(playerUnits, player, null);

      ForGroup(playerUnits, () => {
        const unit = GetEnumUnit();
        if (UnitHelper.isUnitTournamentViable(unit)) {
          unitsTeam.push(unit);
          UnitResetCooldown(unit);
          if (UnitHelper.isUnitDead(unit)) {
            ReviveHero(unit, waitRoom.x, waitRoom.y, true);
          }
          SetUnitLifePercentBJ(unit, 100);
          SetUnitManaPercentBJ(unit, 100);
          SetUnitX(unit, waitRoom.x);
          SetUnitY(unit, waitRoom.y);
          SetUnitInvulnerable(unit, true);
        }
      })
      DestroyGroup(playerUnits);

      PanCameraToTimedForPlayer(player, waitRoom.x, waitRoom.y, 0.1);

    }
  }

  lobbyWaitForTournament(): void {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, TournamentData.finalBattleLobbyWait, 
      "You have " + TournamentData.finalBattleLobbyWait + 
      " seconds to make your last preparations for the Final Battle. " + 
      "After this, there's no turning back."
    );

    StopMusic(false);
    ClearMapMusic();
    PlayMusic("Audio\\Music\\KachiDaze.mp3");
    ResumeMusic();
    // TimerStart(CreateTimer(), 250, true, () => {
    //   if (this.winTeam == 0) {
    //     StopMusic(false);
    //     ClearMapMusic();
    //     PlayMusic("Audio\\Music\\KachiDaze.mp3");
    //     ResumeMusic();
    //   } else {
    //     DestroyTimer(GetExpiredTimer());
    //   }
    // });

    TimerStart(this.toStartTimer, TournamentData.finalBattleLobbyWait, false, () => {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, TournamentData.finalBattleLobbyWait, 
        "The Final Battle has begun!"
      );
      this.moveTeamsToSpawn(this.unitsTeam1, TournamentData.tournamentSpawn1);
      this.moveTeamsToSpawn(this.unitsTeam2, TournamentData.tournamentSpawn2);

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
    TriggerAddCondition(
      this.winTrigger,
      Condition(() => {
        return !UnitHelper.isImmortal(GetTriggerUnit())
      })
    )
    TriggerAddAction(this.winTrigger, () => {
      const dyingUnit = GetTriggerUnit();
      const player = GetOwningPlayer(dyingUnit);
      let teamNumber = Constants.invalidTeamValue;
      let dyingUnitTeam: unit[] = [];
      let index = this.unitsTeam1.indexOf(dyingUnit);
      if (index > -1) {
        this.unitsTeam1.splice(index, 1);
        dyingUnitTeam = this.unitsTeam1;
        teamNumber = Constants.team1Value;
      } else {
        index = this.unitsTeam2.indexOf(dyingUnit);
        if (index > -1) {
          this.unitsTeam2.splice(index, 1);
          dyingUnitTeam = this.unitsTeam2;
          teamNumber = Constants.team2Value;
        }
      }
      if (teamNumber != Constants.invalidTeamValue && dyingUnitTeam.length == 0) {
        this.winTeam = teamNumber % 2 + 1;
        this.complete();
      }
    });
  }
}