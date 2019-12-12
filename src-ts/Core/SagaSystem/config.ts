import { SagaSystemConfig } from "./SagaSystemConfig";
import { SagaState } from "./Sagas/BaseSaga";
import { VegetaSaga, RaditzSaga } from "./Sagas/SagaSaiyanGroup";
import { NamekSaga, GinyuSaga, FriezaSaga } from "./Sagas/SagaFriezaGroup";
import { DeadZoneSaga, GarlicJrSaga } from "./Sagas/SagaGarlicGroup";
import { TurlesSaga } from "./Sagas/SagaTurlesGroup";
import { LordSlugSaga } from "./Sagas/SagaSlugGroup";
import { WheeloSaga } from "./Sagas/SagaWheeloGroup";

// the actual saga configuration
export const sagaSystemConfig: SagaSystemConfig = {
  sagas: [
    // TestSaga,
    // TestSagaTwo,
    DeadZoneSaga,
    RaditzSaga,
    VegetaSaga,
    WheeloSaga,
    TurlesSaga,
    NamekSaga,
    GinyuSaga,
    LordSlugSaga,
    FriezaSaga,
    GarlicJrSaga,
  ],

  sagaDependencies: {
    DeadZoneSaga: [],
    RaditzSaga: [],
    VegetaSaga: [
      [ RaditzSaga, SagaState.Completed ]
    ],
    WheeloSaga: [
      [ VegetaSaga, SagaState.Completed ]
    ],
    TurlesSaga: [
      [ VegetaSaga, SagaState.Completed ]
    ],
    NamekSaga: [
      [ VegetaSaga, SagaState.Completed ]
    ],
    GinyuSaga: [
      [ NamekSaga, SagaState.Completed ]
    ],
    LordSlugSaga: [
      [ TurlesSaga, SagaState.Completed ]
    ],
    FriezaSaga: [
      [ LordSlugSaga, SagaState.Completed ]
    ],
    GarlicJrSaga: [
      [ FriezaSaga, SagaState.Completed ],
      [ DeadZoneSaga, SagaState.Completed ],
    ]
    // TestSagaTwo: [ 
    //   [ TestSaga, SagaState.Completed ]
    // ]
  }
};