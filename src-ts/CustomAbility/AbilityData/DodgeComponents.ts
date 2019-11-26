export const DodgeComponents = [
  // copy from here
  {
    name: "dodge ultra instinct",
    repeatInterval: 2, 
    knockbackData: {
      speed: 100, 
      angle: 360, 
      aoe: 500,
    },
    maxEnemies: 3,
    addRandomAngle: true,
  },
  // to here, and replace with unique name
  {
    name: "dodge homing beam",
    repeatInterval: 1, 
    knockbackData: {
      speed: 15, 
      angle: 110, 
      aoe: 700,
    },
    maxEnemies: 3,
    addRandomAngle: false,
  },
];