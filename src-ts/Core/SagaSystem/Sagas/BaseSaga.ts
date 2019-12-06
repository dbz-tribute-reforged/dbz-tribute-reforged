import { Logger } from "Libs/TreeLib/Logger";


export enum SagaState {
  NotStarted,
  InProgress,
  Completed
};

export class BaseSaga {
  public state: SagaState = SagaState.NotStarted;

  name: string = '';

  start(): void {
    Logger.LogDebug('Starting saga "' + this.name + '"');
    this.state = SagaState.InProgress;
  }

  complete(): void {
    Logger.LogDebug('Completing saga "' + this.name + '"');
    this.state = SagaState.Completed;
  }
}

export interface Saga {
  state: SagaState;

  name: string;

  canStart: () => boolean;
  canComplete: () => boolean;

  start: () => void;
  complete: () => void;
  update: () => void;
}