import {Logger} from "./Logger";

_G.__hooks = {};

/**
 * In order to prevent things falling out of scope, you can hook them to global,
 * That way the garbage collector wont ever remove it.
 */
export class Hooks {
    public static get(name: string): object | undefined {
        let test: { [key: string]: any } = _G.__hooks;
        return test[name];
    }

    public static set(name: string, value: any) {
        let test: { [key: string]: any } = _G.__hooks;
        test[name] = value;
        Logger.LogDebug("Hooked: " + name)
    }
}

/*
What is das hooks?
So, lua garbage collection removes stuff that falls out of scope, however,
if you add it to a global object it wont fall out of scope.
The reason being, using static objects does not bode well with ceres as things can fall out of scope,
So they need to be hooked into the global scope to some degree.
 */