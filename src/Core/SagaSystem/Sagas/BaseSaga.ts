
export enum SagaState {
  NotStarted,
  InProgress,
  Completed
};

export class BaseSaga {
  public state: SagaState = SagaState.NotStarted;

  name: string = '';

  start(): void {
    this.state = SagaState.InProgress;
  }

  complete(): void {
    this.state = SagaState.Completed;
  }

  ping(): void {
    
  }
}

export interface Saga {
  state: SagaState;

  name: string;
  delay: number;

  canStart: () => boolean;
  canComplete: () => boolean;

  start: () => void;
  complete: () => void;
  update: (t: number) => void;
  ping: () => void;
  getDelay: () => number;
}