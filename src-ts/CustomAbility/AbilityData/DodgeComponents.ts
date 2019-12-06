export const DodgeComponents = [
  // copy from here
  {
    name: "dodge ultra instinct",
    repeatInterval: 2, 
    startTick: 0,
    endTick: -1,
    groundOnly: true,
    knockbackData: {
      speed: 100, 
      angle: 270, 
      aoe: 600,
    },
    maxEnemies: 3,
    addRandomAngle: true,
  },
  // to here, and replace with unique name
  {
    name: "dodge homing beam",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    groundOnly: false,
    knockbackData: {
      speed: 10, 
      angle: 150, 
      aoe: 1000,
    },
    maxEnemies: 1,
    addRandomAngle: false,
  },
  // --------------------------------------------
  {
    name: "dodge basic",
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    groundOnly: true,
    knockbackData: {
      speed: 25, 
      angle: 30, 
      aoe: 500,
    },
    maxEnemies: 3,
    addRandomAngle: true,
  },
];