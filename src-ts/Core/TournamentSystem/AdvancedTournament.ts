import { Tournament, TournamentState, BaseTournament } from "./Tournament";

export class AdvancedTournament extends BaseTournament implements Tournament {
  constructor(
    public name: string = "",
    public state: TournamentState = TournamentState.NotStarted,
    public toStartDelay: number = 60,
    public toStartTimer: timer = CreateTimer(),
    public toStartTimerDialog: timerdialog = CreateTimerDialog(toStartTimer),
  ) {
    super(name, state);
    TimerDialogSetTitle(this.toStartTimerDialog, this.name);
  }

  start(): void {
    super.start();
    TimerDialogDisplay(this.toStartTimerDialog, true);
  }

  complete(): void {
    super.complete();
  }

}