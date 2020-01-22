export module SagaAIData {
  export const MAX_ACTION_TICKS: number = 10000;
  export const UNLIMITED_BEAM_DODGES: number = -1;
  export const NO_DODGE_ANGLE: number = -9999;
  export const PERFORMED_DODGE: number = 1;
  export const PERFORMED_NO_DODGE: number = 0;

  export enum Intent {
    ATTACK,
    // DODGE,
    REAGGRO,
    DODGE_OR_ATTACK,
    BEAM_OR_ATTACK,
  }

  export const DODGE_ORDER: string = "smart";
  export const ATTACK_ORDER: string = "smart";

  export const defaultActionInterval: number = 25;
  export const defaultAggroInterval: number = 10;
  export const defaultConsecutiveAttacksAllowed: number = 12;
  export const defaultBeamsToDodge: number = 3;
  export const defaultDodgeAOE: number = 1600;
  export const defaultDodgeDistance: number = 400;
  export const defaultConsecutiveDodgesAllowed: number = 12;
  export const defaultWeakBeamCooldown: number = 60;
  export const defaultStrongBeamCooldown: number = 180;
  export const defaultWeakBeamCastTime: number = 0.5;
  export const defaultStrongBeamCastTime: number = 1.0;
  export const defaultBeamRange: number = 1500;
}