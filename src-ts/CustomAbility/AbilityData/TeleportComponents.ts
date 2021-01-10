import { Teleport } from "CustomAbility/AbilityComponent/Teleport";

export const TeleportComponents = [
  {
    name: "teleport last cast point single", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: true,
    teleportTarget: Teleport.CAST_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport last cast point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.CAST_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport caster point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.CASTER_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport original point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.ORIGINAL_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport bunkai teleport return", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 198,
    teleportOnce: true,
    teleportTarget: Teleport.ORIGINAL_POINT,
    maxRange: 1200,
  },
  {
    name: "teleport target point continuous", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.TARGET_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport scattering bullet start continuous", 
    repeatInterval: 1, 
    startTick: 40,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.ORIGINAL_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
  {
    name: "teleport time skip", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: true,
    teleportTarget: Teleport.TARGET_UNIT,
    maxRange: 1200,
  },
  {
    name: "teleport galactic donut continuous", 
    repeatInterval: 1, 
    startTick: 24,
    endTick: -1,
    teleportTick: 0,
    teleportOnce: false,
    teleportTarget: Teleport.ORIGINAL_POINT,
    maxRange: Teleport.INFINITE_RANGE,
  },
];