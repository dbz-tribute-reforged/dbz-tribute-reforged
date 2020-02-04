import {Hooks} from "./Hooks";

/**
 * Provides timers for other classes,
 * Now, these timers generally is used by Entity, and i recommend extending Entity instead of adding callbacks here.
 * Once added, removing the callbacks can be quite the pain, only use it for static, always there callbacks.
 * Otherwise use Entity.
 */
export class Timers {
    private static instance: Timers;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Timers();
            Hooks.set("Timers", this.instance);
        }
        return this.instance;
    }

    private fastTimerCallbacks: Function[] = [];
    private readonly fastTimer: trigger;

    private constructor() {
        this.fastTimer = CreateTrigger();
        // fast timer has been slowed down to 0.02s from 0.01s because
        // 0.01s can cause desyncs on reforged
        TriggerRegisterTimerEvent(this.fastTimer, 0.02, true);
        TriggerAddAction(this.fastTimer, () => {
            this.fastTimerCallbacks.forEach((callback) => {
                callback();
            });
        });
    }

    public addFastTimerCallback(func: Function) {
        this.fastTimerCallbacks.push(func);
    }
}