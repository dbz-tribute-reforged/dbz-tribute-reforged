import { Saga, BaseSaga, SagaState } from "./Sagas/BaseSaga";

type BaseSagaType = { new(): BaseSaga };

// definition for what the configuration should do
export interface SagaSystemConfig {
  sagas: BaseSagaType[];

  sagaDependencies: { 
    [sagaKey: string]: [
      BaseSagaType,
      SagaState
    ][]
  }
};