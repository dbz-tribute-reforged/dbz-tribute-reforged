import { SagaSystemConfig } from "./SagaSystemConfig";
import { TestSaga, TestSagaTwo } from "./Sagas/TestSaga";
import { SagaState } from "./Sagas/BaseSaga";
import { VegetaSaga } from "./Sagas/SagaSaiyanGroup";
import { NamekSaga } from "./Sagas/SagaFriezaGroup";

// the actual saga configuration
export const sagaSystemConfig: SagaSystemConfig = {
  sagas: [
    TestSaga,
    TestSagaTwo,
    VegetaSaga,
    NamekSaga,
  ],

  sagaDependencies: {
    TestSaga: [],
    VegetaSaga: [
      [ TestSaga, SagaState.Completed ]
    ],
    NamekSaga: [
      [ VegetaSaga, SagaState.Completed ]
    ],
    // TestSagaTwo: [ 
    //   [ TestSaga, SagaState.Completed ]
    // ]
  }
};