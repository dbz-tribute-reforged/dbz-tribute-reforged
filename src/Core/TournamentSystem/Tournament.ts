export enum TournamentState {
  NotStarted,
  Waiting,
  InProgress,
  Completed
};

export interface Tournament {
  name: string;

  state: TournamentState;

  start(): void;
  complete(): void;
}

export class BaseTournament implements Tournament {
  constructor(
    public name: string,
    public state: TournamentState = TournamentState.NotStarted,
  ) {

  }

  start(): void {
    this.state = TournamentState.Waiting;
  }

  complete(): void {
    this.state = TournamentState.Completed;
  }

}