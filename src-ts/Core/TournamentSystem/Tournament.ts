import { Logger } from "Libs/TreeLib/Logger";

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
    // Logger.LogDebug('Starting tournament "' + this.name + '"');
    this.state = TournamentState.Waiting;
  }

  complete(): void {
    // Logger.LogDebug('Completing tournament "' + this.name + '"');
    this.state = TournamentState.Completed;
  }

}