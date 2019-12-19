import { SagaSystemConfig } from "./SagaSystemConfig";
import { SagaState } from "./Sagas/BaseSaga";
import { VegetaSaga, RaditzSaga } from "./Sagas/SagaSaiyanGroup";
import { NamekSaga, GinyuSaga, FriezaSaga, TrunksSaga, GoldenFriezaSaga } from "./Sagas/SagaFriezaGroup";
import { DeadZoneSaga, GarlicJrSaga } from "./Sagas/SagaGarlicGroup";
import { TurlesSaga } from "./Sagas/SagaTurlesGroup";
import { LordSlugSaga } from "./Sagas/SagaSlugGroup";
import { WheeloSaga } from "./Sagas/SagaWheeloGroup";
import { AndroidsSaga1, AndroidsSaga2, Super13Saga, FutureAndroidsSaga } from "./Sagas/SagaAndroidsGroup";
import { CoolerReturnSaga, CoolerRevengeSaga } from "./Sagas/SagaCoolerGroup";
import { ImperfectCellSaga, SemiperfectCellSaga, PerfectCellSaga, CellGamesSaga, SuperPerfectCellSaga, FutureCellSaga } from "./Sagas/SagaCellGroup";
import { BrolyDBZMovieSaga1, BrolyDBZMovieSaga2, BioBrolySaga } from "./Sagas/SagaBrolyGroup";
import { BojackSaga } from "./Sagas/SagaBojackGroup";
import { OtherWorldTournamentSaga } from "./Sagas/SagaOtherWorldGroup";
import { BabidiSaga, BuuSaga, SuperBuuSaga, KidBuuSaga } from "./Sagas/SagaBuuGroup";
import { JanembaSaga } from "./Sagas/SagaJanembaGroup";
import { HirudegarnSaga } from "./Sagas/SagaHirudegarnGroup";
import { BebiSaga } from "./Sagas/SagaBebiGroup";
import { Super17Saga } from "./Sagas/SagaSuper17Group";
import { ShadowDragonSaga1, ShadowDragonSaga2 } from "./Sagas/SagaShadowDragonGroup";
import { BeerusSaga, WhisTrainingSaga } from "./Sagas/SagaBeerusGroup";
import { Universe6Saga } from "./Sagas/SagaUniverse6Group";
import { FTSuperSaga1, FTSuperSaga2 } from "./Sagas/SagaFTSuperGroup";

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
    BrolyDBZMovieSaga1,
    BrolyDBZMovieSaga2,
    BioBrolySaga,
    BojackSaga,
    OtherWorldTournamentSaga,
    BabidiSaga,
    BuuSaga,
    SuperBuuSaga,
    KidBuuSaga,
    JanembaSaga,
    HirudegarnSaga,
    BebiSaga,
    Super17Saga,
    ShadowDragonSaga1,
    ShadowDragonSaga2,
    BeerusSaga,
    WhisTrainingSaga,
    GoldenFriezaSaga,
    Universe6Saga,
    FTSuperSaga1,
    FTSuperSaga2,
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
    BrolyDBZMovieSaga1: [
      [ PerfectCellSaga, SagaState.Completed ],
    ],
    BrolyDBZMovieSaga2: [
      [ BrolyDBZMovieSaga1, SagaState.Completed ],
    ],
    BioBrolySaga: [
      [ BrolyDBZMovieSaga2, SagaState.Completed ],
      [ BabidiSaga, SagaState.InProgress ],
    ],
    BojackSaga: [
      [ FutureAndroidsSaga, SagaState.Completed ],
      [ FutureCellSaga, SagaState.Completed ],
    ],
    OtherWorldTournamentSaga: [
      [ SuperPerfectCellSaga, SagaState.Completed ],
    ],
    BabidiSaga: [
      [ PerfectCellSaga, SagaState.Completed ],
    ],
    BuuSaga: [
      [ BabidiSaga, SagaState.Completed ],
    ],
    SuperBuuSaga: [
      [ BuuSaga, SagaState.Completed ],
    ],
    KidBuuSaga: [
      [ BuuSaga, SagaState.Completed ],
    ],
    JanembaSaga: [
      [ BuuSaga, SagaState.Completed ],
    ],
    HirudegarnSaga: [
      [ KidBuuSaga, SagaState.Completed ],
    ],
    // GT branch
    BebiSaga: [
      [ KidBuuSaga, SagaState.Completed ],
    ],
    Super17Saga: [
      [ BebiSaga, SagaState.Completed ],
    ],
    ShadowDragonSaga1: [
      [ Super17Saga, SagaState.Completed ],
    ],
    ShadowDragonSaga2: [
      [ ShadowDragonSaga1, SagaState.Completed ],
    ],
    // Super branch
    BeerusSaga: [
      [ KidBuuSaga, SagaState.Completed ],
    ],
    WhisTrainingSaga: [
      [ BeerusSaga, SagaState.Completed ],
    ],
    GoldenFriezaSaga: [
      [ BeerusSaga, SagaState.Completed ],
    ],
    Universe6Saga: [
      [ BeerusSaga, SagaState.Completed ],
    ],
    FTSuperSaga1: [
      [ FutureAndroidsSaga, SagaState.Completed ],
      [ FutureCellSaga, SagaState.Completed ],
      [ Universe6Saga, SagaState.Completed ],
    ],
    FTSuperSaga2: [
      [ FTSuperSaga1, SagaState.Completed ],
    ],
  }
};