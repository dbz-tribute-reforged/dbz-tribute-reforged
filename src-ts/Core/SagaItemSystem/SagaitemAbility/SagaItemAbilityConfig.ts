import { SagaItemAbility } from "./SagaItemAbility";
import { SagaItemConstants } from "../SagaItemConstants";
import { TimeRing } from "./TimeRing";

export const sagaItemAbilityConfig = new Map<number, SagaItemAbility>(
  [
    [FourCC("A0NU"), new TimeRing()],
  ],
);