import { SagaSystemConfig } from "./SagaSystemConfig";
import { Saga, BaseSaga, SagaState } from "./Sagas/BaseSaga";
import { Entity } from "Libs/TreeLib/Entity";
import { Hooks } from "Libs/TreeLib/Hooks";
import { sagaSystemConfig } from "./config";
import { Constants } from "Common/Constants";

export class SagaManager extends Entity {

  private static instance: SagaManager;

  public maxNumberConcurrentSagas: number = 6;

  config: SagaSystemConfig;
  sagas: Saga[] = [];

  protected sagaPingTimer: timer;

  constructor(sagaSystemConfig: SagaSystemConfig) {
    super();

    this.config = sagaSystemConfig;
    this.sagaPingTimer = CreateTimer();

    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SagaManager(sagaSystemConfig);
      Hooks.set("SagaManager", this.instance);
    }
    return this.instance;
  }

  private initialize(): void {
    // setup the sagas
    for (let i = 0; i < this.config.sagas.length; i++) {
      let sagaType = this.config.sagas[i];
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
    this.maxNumberConcurrentSagas = 2 + Math.floor(numActivePlayers / 2);
  }

  public step(t: number): void {
    // iterate over all sagas and check the conditions to see if it should be progressed
    this.progressSagas(t);

    // TODO: progress side sagas (?)
  }

  private progressSagas(t: number): void {
    // iterate over each main saga and do some work
    for (let saga of this.sagas) {
      switch (saga.state) {

        // if this saga hasn't started yet, run some logic to check if we should start it
        case SagaState.NotStarted: {
          // if we are already at max concurrent sagas, then skip this
          if (this.inProgressSagas >= this.maxNumberConcurrentSagas)
            continue;

          // check the dependencies set up in config
          if (saga.state === SagaState.NotStarted && this.sagaDependencyHasBeenMet(saga) 
              && saga.canStart()) {
            // do start
            saga.start();
          }
          break;
        }

        // if saga is in progress, run its update function then check if it can be completed
        case SagaState.InProgress: {
          saga.update(t);
          if (saga.canComplete()) {
            saga.complete();
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
    let dependenciesOfSaga = this.config.sagaDependencies[saga.constructor.name];
    
    for (let sagaDependencyKey of dependenciesOfSaga) {
      // get the current saga dependency from the list of initialized sagas so that we can check the state
      let currSagaArr = this.sagas.filter(s => s.constructor.name === sagaDependencyKey[0].name);
      if (currSagaArr.length === 0 || currSagaArr[0].state !== sagaDependencyKey[1]) {
        // don't think we can just return true here...
        return false;
      }
    }
    return true;
  }

  //#region getters
  get inProgressSagas(): number {
    return this.sagas.filter(s => s.state === SagaState.InProgress).length;
  }
  //#endregion
}