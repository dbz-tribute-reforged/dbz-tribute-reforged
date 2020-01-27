export module SagaAIData {
  export const MAX_ACTION_TICKS: number = 10000;
  export const UNLIMITED_BEAM_DODGES: number = -1;
  export const NO_DODGE_ANGLE: number = -9999;
  export const PERFORMED_DODGE: number = 1;
  export const PERFORMED_NO_DODGE: number = 1;

  // action is a state of being
  export enum Action {
    ATTACK,
    BEAM,
    DODGE,
    WAIT,
    REAGGRO,
  }

  export enum Order {
    DODGE = "smart",
    ATTACK = "smart",
    WAIT = "holdposition",
    MOVE = "smart",
  };

  export const DELAY_TO_INTERVALS = 4;

  export const defaultSpellPowerModifier: number = -0.20;
  export const defaultActionInterval: number = 25;
  export const defaultAggroInterval: number = 10;
  export const defaultConsecutiveAttacksAllowed: number = 10;
  export const defaultBeamsToDodge: number = 4;
  export const defaultDodgeAOE: number = 1600;
  export const defaultDodgeDistance: number = 400;
  export const defaultConsecutiveDodgesAllowed: number = 8;
  export const defaultConsecutiveBeamsAllowed: number = 1;
  export const defaultBeamRange: number = 1500;
  export const defaultAggressiveZanzoThreshold: number = 20;
  export const defaultMaxTimeSinceLastDodge: number = 8 * 2;
  export const defaultGuardLifePercentThreshold: number = 3;
}