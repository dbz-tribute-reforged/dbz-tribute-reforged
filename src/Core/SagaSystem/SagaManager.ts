import { SagaSystemConfig } from "./SagaSystemConfig";
import { Saga, BaseSaga, SagaState } from "./Sagas/BaseSaga";
import { sagaSystemConfig } from "./config";
import { Constants } from "Common/Constants";
import { CustomMultiboardManager } from "CustomUI/CustomMultiboard";

export class SagaManager {

  private static instance: SagaManager;

  public static maxNumberConcurrentSagas: number = 6;

  protected inProgressSagas: number;

  config: SagaSystemConfig;
  sagas: Saga[] = [];

  protected sagaUpdateTimer: timer;
  protected sagaPingTimer: timer;

  constructor(sagaSystemConfig: SagaSystemConfig) {
    this.inProgressSagas = 0;

    this.config = sagaSystemConfig;
    this.sagaUpdateTimer = CreateTimer();
    this.sagaPingTimer = CreateTimer();

    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SagaManager(sagaSystemConfig);
    }
    return this.instance;
  }

  private initialize(): void {
    // setup the sagas
    for (let i = 0; i < this.config.sagas.length; i++) {
      const sagaType = this.config.sagas[i];
      this.sagas.push(new sagaType() as Saga);
    }
    TimerStart(this.sagaPingTimer, Constants.sagaPingInterval, true, () => {
      for (const saga of this.sagas) {
        if (saga.state == SagaState.InProgress) {
          saga.ping();
        }
      }
    });
    this.calculateMaxNumberOfConcurrentSagas();
    const updateMaxNumberOfConcurrentSagas = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerEventLeave(updateMaxNumberOfConcurrentSagas, Player(i));
    }
    TriggerAddAction(updateMaxNumberOfConcurrentSagas, () => {
      this.calculateMaxNumberOfConcurrentSagas();
    })

    TimerStart(this.sagaUpdateTimer, 0.03, true, () => {
      this.step();
    });
  }

  protected calculateMaxNumberOfConcurrentSagas() {
    let numActivePlayers = 0;
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      const player = Player(i);
      if (
        IsPlayerSlotState(player, PLAYER_SLOT_STATE_PLAYING) && 
        GetPlayerController(player) == MAP_CONTROL_USER
      ) {
        ++numActivePlayers;
      }
    }
    SagaManager.maxNumberConcurrentSagas = 3;
  }

  public step(): void {
    // iterate over all sagas and check the conditions to see if it should be progressed
    // iterate over each main saga and do some work
    this.inProgressSagas = this.countInProgressSagas();

    for (const saga of this.sagas) {
      switch (saga.state) {

        // if this saga hasn't started yet, run some logic to check if we should start it
        case SagaState.NotStarted: {
          // // if we are already at max concurrent sagas, then skip this
          if (this.inProgressSagas >= SagaManager.maxNumberConcurrentSagas)
            continue;

          // check the dependencies set up in config
          if (
            saga.state === SagaState.NotStarted 
            && this.sagaDependencyHasBeenMet(saga) 
            && saga.canStart()
          ) {
            // do start
            saga.start();
            CustomMultiboardManager.getInstance().addSaga(saga.name, saga.delay);
          }
          break;
        }

        // if saga is in progress, run its update function then check if it can be completed
        case SagaState.InProgress: {
          saga.update(0);
          if (saga.canComplete()) {
            saga.complete();
            CustomMultiboardManager.getInstance().finishSaga(saga.name);
          }
          break;
        }

        // if saga is completed, do nothing; we could expand this to check if a saga is
        // repeatable or something like that
        case SagaState.Completed: {
          // do nothing
          break;
        }

      }
    }
  }

  private sagaDependencyHasBeenMet(saga: BaseSaga): boolean {
    const dependenciesOfSaga = this.config.sagaDependencies[saga.constructor.name];
    
    for (const sagaDependencyKey of dependenciesOfSaga) {
      // get the current saga dependency from the list of initialized sagas so that we can check the state
      for (const saga of this.sagas) {
        if (
          saga.constructor.name == sagaDependencyKey[0].name && 
          saga.state != sagaDependencyKey[1]
        ) {
          return false;
        }
      }
    }
    return true;
  }

  protected countInProgressSagas(): number {
    let result = 0;
    for (const saga of this.sagas) {
      if (saga.state == SagaState.InProgress) {
        result += 1;
      }
    }
    return result;
  }
}