import { Teleport } from "CustomAbility/AbilityComponent/Teleport";

export const TeleportComponents = [
  {
    name: "teleport last cast point single", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportOnce: true,
    teleportTarget: Teleport.CAST_POINT,
  },
  {
    name: "teleport last cast point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportOnce: false,
    teleportTarget: Teleport.CAST_POINT,
  },
  {
    name: "teleport caster point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportOnce: false,
    teleportTarget: Teleport.CASTER_POINT,
  },
  {
    name: "teleport original point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportOnce: false,
    teleportTarget: Teleport.ORIGINAL_POINT,
  },
];