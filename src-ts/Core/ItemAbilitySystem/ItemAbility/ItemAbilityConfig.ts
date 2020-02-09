import { ItemAbility } from "./ItemAbility";
import { ItemConstants } from "../ItemConstants";
import { TimeRing } from "./Items/TimeRing";
import { BioLab } from "./Items/BioLab";
import { BraveSword } from "./Items/BraveSword";

export const itemAbilityConfig = new Map<number, ItemAbility>(
  [
    [ItemConstants.ABILITY_TIME_RING, new TimeRing()],
    [ItemConstants.SagaDrops.BIO_LAB_RESEARCH, new BioLab()],
    [ItemConstants.SagaDrops.BRAVE_SWORD, new BraveSword()],
  ],
);