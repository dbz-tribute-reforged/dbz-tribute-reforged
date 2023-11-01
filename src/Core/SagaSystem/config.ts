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
import { CellSaga, CellGamesSaga, FutureCellSaga, CellMaxSaga } from "./Sagas/SagaCellGroup";
import { BrolyDBZMovieSaga1, BrolyDBZMovieSaga2, BioBrolySaga, BrolyDBSSaga } from "./Sagas/SagaBrolyGroup";
import { BojackSaga } from "./Sagas/SagaBojackGroup";
import { OtherWorldTournamentSaga } from "./Sagas/SagaOtherWorldGroup";
import { BabidiSaga, BuuSaga, FutureBabidiSaga } from "./Sagas/SagaBuuGroup";
import { JanembaSaga } from "./Sagas/SagaJanembaGroup";
import { HirudegarnSaga } from "./Sagas/SagaHirudegarnGroup";
import { BebiSaga } from "./Sagas/SagaBebiGroup";
import { Super17Saga } from "./Sagas/SagaSuper17Group";
import { ShadowDragonSaga1, ShadowDragonSaga2 } from "./Sagas/SagaShadowDragonGroup";
import { BeerusSaga, WhisTrainingSaga } from "./Sagas/SagaBeerusGroup";
import { Universe6Saga } from "./Sagas/SagaUniverse6Group";
import { FTSuperSaga1, FTSuperSaga2 } from "./Sagas/SagaFTSuperGroup";
import { RustTyrannoSaga } from "./Sagas/SagaCronoGroup";

// the actual saga configuration
export const sagaSystemConfig: SagaSystemConfig = {
  sagas: [
    // TestSaga,
    // TestSagaTwo,
    // main line
    RaditzSaga,
    VegetaSaga,
    NamekSaga,
    GinyuSaga,
    FriezaSaga,
    TrunksSaga,
    AndroidsSaga1,
    AndroidsSaga2,
    CellSaga,
    CellGamesSaga,
    OtherWorldTournamentSaga,
    BabidiSaga,
    BuuSaga,
    // movies
    DeadZoneSaga,
    WheeloSaga,
    TurlesSaga,
    LordSlugSaga,
    GarlicJrSaga,
    CoolerReturnSaga,
    CoolerRevengeSaga,
    Super13Saga,
    BrolyDBZMovieSaga1,
    BrolyDBZMovieSaga2,
    BioBrolySaga,
    JanembaSaga,
    HirudegarnSaga,
    // super branch
    BeerusSaga,
    WhisTrainingSaga,
    GoldenFriezaSaga,
    Universe6Saga,
    BrolyDBSSaga,
    // gt branch
    BebiSaga,
    Super17Saga,
    ShadowDragonSaga1,
    ShadowDragonSaga2,
    // future branch
    FutureAndroidsSaga,
    FutureCellSaga,
    BojackSaga,
    FutureBabidiSaga,
    FTSuperSaga1,
    FTSuperSaga2,
    // secret
    RustTyrannoSaga,
  ],

  sagaDependencies: {
    // starting sagas
    DeadZoneSaga: [],
    RaditzSaga: [],
    // main branch
    VegetaSaga: [
      [ RaditzSaga, SagaState.Completed ],
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
    TrunksSaga: [
      [ FriezaSaga, SagaState.Completed ],
    ],
    AndroidsSaga1: [
      [ TrunksSaga, SagaState.Completed ],
    ],
    AndroidsSaga2: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    CellSaga: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    CellGamesSaga: [
      [ CellSaga, SagaState.NotStarted ],
      [ CellSaga, SagaState.Completed ],
    ],
    OtherWorldTournamentSaga: [
      [ CellGamesSaga, SagaState.Completed ],
    ],
    BabidiSaga: [
      [ CellSaga, SagaState.Completed ],
    ],
    BuuSaga: [
      [ BabidiSaga, SagaState.Completed ],
    ],
    // z movie branch
    WheeloSaga: [
      [ DeadZoneSaga, SagaState.Completed ],
    ],
    TurlesSaga: [
      [ VegetaSaga, SagaState.Completed ],
    ],
    LordSlugSaga: [
      [ TurlesSaga, SagaState.Completed ],
    ],
    GarlicJrSaga: [
      [ DeadZoneSaga, SagaState.Completed ],
      [ LordSlugSaga, SagaState.Completed ],
    ],
    CoolerRevengeSaga: [
      [ GarlicJrSaga, SagaState.Completed ],
    ],
    CoolerReturnSaga: [
      [ CoolerRevengeSaga, SagaState.Completed ],
      [ FriezaSaga, SagaState.Completed ]
    ],
    Super13Saga: [
      [ CoolerRevengeSaga, SagaState.Completed ],
    ],
    BojackSaga: [
      [ Super13Saga, SagaState.Completed ],
    ],
    BrolyDBZMovieSaga1: [
      [ BojackSaga, SagaState.Completed ],
    ],
    BrolyDBZMovieSaga2: [
      [ BrolyDBZMovieSaga1, SagaState.Completed ],
    ],
    BioBrolySaga: [
      [ BrolyDBZMovieSaga2, SagaState.Completed ],
    ],
    JanembaSaga: [
      [ BioBrolySaga, SagaState.Completed ],
    ],
    HirudegarnSaga: [
      [ JanembaSaga, SagaState.Completed ],
    ],
    // future branch
    FutureAndroidsSaga: [
      [ CellSaga, SagaState.Completed ],
    ],
    FutureCellSaga: [
      [ FutureAndroidsSaga, SagaState.Completed ],
    ],
    FutureBabidiSaga: [
      // [ BojackSaga, SagaState.Completed ],
      [ FutureCellSaga, SagaState.Completed ],
    ],
    FTSuperSaga1: [
      [ FutureBabidiSaga, SagaState.Completed ],
    ],
    FTSuperSaga2: [
      [ FTSuperSaga1, SagaState.Completed ],
    ],
    // Super branch
    BeerusSaga: [
      [ BuuSaga, SagaState.Completed ],
    ],
    WhisTrainingSaga: [
      [ BeerusSaga, SagaState.Completed ],
    ],
    GoldenFriezaSaga: [
      [ WhisTrainingSaga, SagaState.Completed ],
    ],
    BrolyDBSSaga: [
      // [ Universe6Saga, SagaState.Completed ],
      [ BioBrolySaga, SagaState.Completed ],
      [ GoldenFriezaSaga, SagaState.Completed ],
    ],
    CellMaxSaga: [
      [ BrolyDBSSaga, SagaState.Completed ],
    ],
    // GT branch
    BebiSaga: [
      [ BuuSaga, SagaState.Completed ],
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
    // bonus
    Universe6Saga: [
      // [ GoldenFriezaSaga, SagaState.Completed ],
      [ FriezaSaga, SagaState.Completed ],
    ],
    // secret
    RustTyrannoSaga: [
      [ HirudegarnSaga, SagaState.Completed ],
      [ CellMaxSaga, SagaState.Completed ],
      [ FTSuperSaga2, SagaState.Completed ],
      [ ShadowDragonSaga2, SagaState.Completed ],
    ],
  }
};

export const fastSagaSystem: SagaSystemConfig = {
  sagas: [
    // TestSaga,
    // TestSagaTwo,
    // main line
    
    // start
    DeadZoneSaga,
    RaditzSaga,

    // branch 1
    VegetaSaga,
    NamekSaga,
    GinyuSaga,
    FriezaSaga,
    CoolerReturnSaga,
    TrunksSaga,
    AndroidsSaga1,
    AndroidsSaga2,
    CellSaga,
    BabidiSaga,
    BuuSaga,
    BeerusSaga,
    WhisTrainingSaga,
    GoldenFriezaSaga,
    BrolyDBSSaga,
    CellMaxSaga,

    // movies
    WheeloSaga,
    TurlesSaga,
    LordSlugSaga,
    GarlicJrSaga,
    Super13Saga,
    BojackSaga,
    BrolyDBZMovieSaga2,
    BioBrolySaga,
    JanembaSaga,
    HirudegarnSaga,
    FutureBabidiSaga,
    FTSuperSaga2,
    BebiSaga,
    ShadowDragonSaga1,
    ShadowDragonSaga2,

    Universe6Saga,
    // secret
    RustTyrannoSaga,
  ],

  sagaDependencies: {
    // starting sagas
    DeadZoneSaga: [],
    RaditzSaga: [],
    // main branch
    VegetaSaga: [
      [ RaditzSaga, SagaState.Completed ],
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
    CoolerReturnSaga: [
      [ FriezaSaga, SagaState.Completed ]
    ],
    TrunksSaga: [
      [ CoolerReturnSaga, SagaState.Completed ],
    ],
    AndroidsSaga1: [
      [ TrunksSaga, SagaState.Completed ],
    ],
    AndroidsSaga2: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    CellSaga: [
      [ AndroidsSaga1, SagaState.Completed ],
    ],
    BabidiSaga: [
      [ AndroidsSaga2, SagaState.Completed ],
      [ CellSaga, SagaState.Completed ],
    ],
    BuuSaga: [
      [ BabidiSaga, SagaState.Completed ],
    ],
    BeerusSaga: [
      [ BuuSaga, SagaState.Completed ],
    ],
    WhisTrainingSaga: [
      [ BeerusSaga, SagaState.Completed ],
    ],
    GoldenFriezaSaga: [
      [ WhisTrainingSaga, SagaState.Completed ],
    ],
    BrolyDBSSaga: [
      // [ Universe6Saga, SagaState.Completed ],
      // [ FTSuperSaga2, SagaState.Completed ],
      [ GoldenFriezaSaga, SagaState.Completed ],
    ],
    CellMaxSaga: [
      [ BrolyDBSSaga, SagaState.Completed ],
    ],



    // z movie branch
    WheeloSaga: [
      [ DeadZoneSaga, SagaState.Completed ],
    ],
    TurlesSaga: [
      [ DeadZoneSaga, SagaState.Completed ],
      [ VegetaSaga, SagaState.Completed ],
    ],
    LordSlugSaga: [
      [ TurlesSaga, SagaState.Completed ],
    ],
    GarlicJrSaga: [
      [ LordSlugSaga, SagaState.Completed ],
    ],
    Super13Saga: [
      [ GarlicJrSaga, SagaState.Completed ],
    ],
    BojackSaga: [
      [ Super13Saga, SagaState.Completed ],
    ],
    BrolyDBZMovieSaga2: [
      [ BojackSaga, SagaState.Completed ],
    ],
    BioBrolySaga: [
      [ BrolyDBZMovieSaga2, SagaState.Completed ],
    ],
    JanembaSaga: [
      [ BioBrolySaga, SagaState.Completed ],
    ],
    HirudegarnSaga: [
      [ JanembaSaga, SagaState.Completed ],
    ],
    FutureBabidiSaga: [
      [ HirudegarnSaga, SagaState.Completed ],
    ],
    FTSuperSaga2: [
      [ FutureBabidiSaga, SagaState.Completed ],
    ],
    BebiSaga: [
      [ FTSuperSaga2, SagaState.Completed ],
    ],
    ShadowDragonSaga1: [
      [ BebiSaga, SagaState.Completed ],
    ],
    ShadowDragonSaga2: [
      [ ShadowDragonSaga1, SagaState.Completed ],
    ],

    // bonus
    Universe6Saga: [
      // [ GoldenFriezaSaga, SagaState.Completed ],
      [ FriezaSaga, SagaState.Completed ],
    ],
    // secret
    RustTyrannoSaga: [
      [ CellMaxSaga, SagaState.Completed ],
      [ ShadowDragonSaga2, SagaState.Completed ],
    ],
  }
};