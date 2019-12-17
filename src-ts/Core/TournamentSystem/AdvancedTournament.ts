import { Tournament, TournamentState, BaseTournament } from "./Tournament";

export class AdvancedTournament extends BaseTournament implements Tournament {
  constructor(
    public name: string,
    public state: TournamentState = TournamentState.NotStarted,
    public toStartDelay: number = 60,
    public toStartTimer: timer = CreateTimer(),
    public toStartTimerDialog: timerdialog = CreateTimerDialog(toStartTimer),
    public startSound: sound = gg_snd_NewTournament,
    public completeSound: sound = gg_snd_NewTournament,
  ) {
    super(name, state);
  }

  start(): void {
    super.start();
    TimerDialogSetTitle(this.toStartTimerDialog, this.name);
    TimerDialogDisplay(this.toStartTimerDialog, true);
    PlaySoundBJ(this.startSound);
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
  }

  complete(): void {
    super.complete();
    TimerDialogDisplay(this.toStartTimerDialog, false);
    PlaySoundBJ(this.completeSound);
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, this.getColoredName());
  }

  getColoredName(): string {
    return "|cffffcc00[" + this.name + "]|r";
  }

}