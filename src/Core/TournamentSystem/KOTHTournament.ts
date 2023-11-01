import { AdvancedTournament } from "./AdvancedTournament";
import { TournamentState, Tournament } from "./Tournament";
import { Constants, Globals } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { WinLossHelper } from "Common/WinLossHelper";
import { TournamentData } from "./TournamentData";
import { UnitHelper } from "Common/UnitHelper";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { CastTimeHelper } from "CustomHero/CastTimeHelper";
import { KOTHGame } from "Core/GameMode/KOTHGame";
import { TimerManager } from "Core/Utility/TimerManager";
import { ExperienceManager } from "Core/ExperienceSystem/ExperienceManager";
import { VisionHelper } from "Common/VisionHelper";

export class KOTHTournament extends AdvancedTournament implements Tournament {
  protected unitsTeam1: unit[];
  protected unitsTeam2: unit[];

  protected kothGame: KOTHGame;

  constructor(
    public name: string = Constants.KOTHName,
    public state: TournamentState = TournamentState.NotStarted,
    public toStartDelay: number = 0,
  ) {
    super(name, state, toStartDelay);
    this.unitsTeam1 = [];
    this.unitsTeam2 = [];
    this.kothGame = new KOTHGame(this.toStartTimer, this.toStartTimerDialog);
  }

  start(): void {
    super.start();
    this.prepareTournament();
  }

  complete(): void {
    super.complete();

    ExperienceManager.getInstance().enableXPTrigger();
    EnableTrigger(gg_trg_Kill_Hero_Revive);
    // EnableTrigger(gg_trg_Kill_Hero_PvP_and_Saga);
    EnableTrigger(gg_trg_Teleport_Namek_Frieza);
    EnableTrigger(gg_trg_Teleport_Namek_Frieza_2);
    EnableTrigger(gg_trg_Teleport_Namek_Pod);
    EnableTrigger(gg_trg_Teleport_Namek_Pod_2);
    EnableTrigger(gg_trg_Teleport_Future_Trunks);
    EnableTrigger(gg_trg_Teleport_Future_Trunks_2);
    EnableTrigger(gg_trg_Teleport_Future_Cell);
    EnableTrigger(gg_trg_Teleport_Future_Cell_2);

    EnableTrigger(gg_trg_Auto_Transform);

    udg_GlobalStatMultiplier = 0.5;
    udg_IsCatchupSettingsAutomatic = true;
    

    Globals.tmpVector.setPos(0, 0);
    this.kothGame.moveTeamsToArena(Constants.defaultTeam1, Globals.tmpVector);
    this.kothGame.moveTeamsToArena(Constants.defaultTeam2, Globals.tmpVector);

    WinLossHelper.forceTeamWin(this.kothGame.getWinner());
  }

  // what to do before the tournament actually starts
  // e.g. show timers
  prepareTournament(): void {
    this.setupTournament();
  }

  setupTournament() {
    this.state = TournamentState.InProgress;
    this.kothGame.setupGame();

    ExperienceManager.getInstance().disableXPTrigger();
    DisableTrigger(gg_trg_Kill_Hero_Revive);
    // DisableTrigger(gg_trg_Kill_Hero_PvP_and_Saga);
    DisableTrigger(gg_trg_Teleport_Namek_Frieza);
    DisableTrigger(gg_trg_Teleport_Namek_Frieza_2);
    DisableTrigger(gg_trg_Teleport_Namek_Pod);
    DisableTrigger(gg_trg_Teleport_Namek_Pod_2);
    DisableTrigger(gg_trg_Teleport_Future_Trunks);
    DisableTrigger(gg_trg_Teleport_Future_Trunks_2);
    DisableTrigger(gg_trg_Teleport_Future_Cell);
    DisableTrigger(gg_trg_Teleport_Future_Cell_2);
    DisableTrigger(gg_trg_Auto_Transform);
    DisableTrigger(gg_trg_Auto_Transform_Turn_On);

    TriggerExecute(gg_trg_Catchup_Turn_Off);

    udg_GlobalStatMultiplier = 0.0;
    udg_IsCatchupSettingsAutomatic = false;

    VisionHelper.showFbArenaVision();
    
    const completeTimer = TimerManager.getInstance().get();
    TimerStart(completeTimer, 1.0, true, () => {
      if (this.kothGame.isFinished()) {
        this.complete();
        TimerManager.getInstance().recycle(completeTimer);
      }
    });
  }

  setPointsToWin(p: number) {
    this.kothGame.setPointsToWin(p);
  }
}