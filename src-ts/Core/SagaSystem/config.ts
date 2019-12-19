import { SagaSystemConfig } from "./SagaSystemConfig";
import { SagaState } from "./Sagas/BaseSaga";
import { VegetaSaga, RaditzSaga } from "./Sagas/SagaSaiyanGroup";
import { NamekSaga, GinyuSaga, FriezaSaga, TrunksSaga } from "./Sagas/SagaFriezaGroup";
import { DeadZoneSaga, GarlicJrSaga } from "./Sagas/SagaGarlicGroup";
import { TurlesSaga } from "./Sagas/SagaTurlesGroup";
import { LordSlugSaga } from "./Sagas/SagaSlugGroup";
import { WheeloSaga } from "./Sagas/SagaWheeloGroup";
import { AndroidsSaga1, AndroidsSaga2, Super13Saga, FutureAndroidsSaga } from "./Sagas/SagaAndroidsGroup";
import { CoolerReturnSaga, CoolerRevengeSaga } from "./Sagas/SagaCoolerGroup";
import { ImperfectCellSaga, SemiperfectCellSaga, PerfectCellSaga, CellGamesSaga, SuperPerfectCellSaga, FutureCellSaga } from "./Sagas/SagaCellGroup";

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
    CoolerReturnSaga,
    CoolerRevengeSaga,
    TrunksSaga,
    AndroidsSaga1,
    AndroidsSaga2,
    Super13Saga,
    ImperfectCellSaga,
    SemiperfectCellSaga,
    PerfectCellSaga,
    CellGamesSaga,
    SuperPerfectCellSaga,
    FutureAndroidsSaga,
    FutureCellSaga,
  ],

  sagaDependencies: {
    DeadZoneSaga: [],
    RaditzSaga: [],
    VegetaSaga: [
      [ RaditzSaga, SagaState.Completed ],
    ],
    WheeloSaga: [
      [ VegetaSaga, SagaState.Completed ],
    ],
    TurlesSaga: [
      [ VegetaSaga, SagaState.Completed ],
    ],
    LordSlugSaga: [
      [ TurlesSaga, SagaState.Completed ],
    ],
    NamekSaga: [
      [ VegetaSaga, SagaState.Completed ],
    ],
    GinyuSaga: [
      [ NamekSaga, SagaState.Completed ],
    ],
    FriezaSaga: [
      [ GinyuSaga, SagaState.Completed ],
    ],
    GarlicJrSaga: [
      [ FriezaSaga, SagaState.Completed ],
      [ DeadZoneSaga, SagaState.Completed ],
    ],
    CoolerRevengeSaga: [
      [ FriezaSaga, SagaState.Completed ],
    ],
    CoolerReturnSaga: [
      [ CoolerRevengeSaga, SagaState.Completed ],
      [ AndroidsSaga2, SagaState.Completed ]
    ],
    CoolerSaga: [
      [ FriezaSaga, SagaState.Completed ],
    ],
    TrunksSaga: [
      [ FriezaSaga, SagaState.Completed ],
    ],
    AndroidsSaga1: [
      [ TrunksSaga, SagaState.Completed ],
    ],
    AndroidsSaga2: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    Super13Saga: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    ImperfectCellSaga: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    SemiperfectCellSaga: [
      [ ImperfectCellSaga, SagaState.Completed ],
    ],
    PerfectCellSaga: [
      [ SemiperfectCellSaga, SagaState.Completed ],
    ],
    CellGamesSaga: [
      [ PerfectCellSaga, SagaState.Completed ],
    ],
    SuperPerfectCellSaga: [
      [ CellGamesSaga, SagaState.Completed ],
    ],
    FutureAndroidsSaga: [
      [ SemiperfectCellSaga, SagaState.Completed ],
    ],
    FutureCellSaga: [
      [ SemiperfectCellSaga, SagaState.Completed ],
    ],
    // TestSagaTwo: [ 
    //   [ TestSaga, SagaState.Completed ]
    // ]
  }
};