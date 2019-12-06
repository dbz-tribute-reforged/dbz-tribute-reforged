import { SagaSystemConfig } from "./SagaSystemConfig";
import { TestSaga, TestSagaTwo } from "./Sagas/TestSaga";
import { SagaState } from "./Sagas/BaseSaga";

// the actual saga configuration
export const sagaSystemConfig: SagaSystemConfig = {
  sagas: [
    TestSaga,
    TestSagaTwo
  ],

  sagaDependencies: {
    TestSaga: [],
    TestSagaTwo: [ 
      [ TestSaga, SagaState.Completed ]
    ]
  }
};