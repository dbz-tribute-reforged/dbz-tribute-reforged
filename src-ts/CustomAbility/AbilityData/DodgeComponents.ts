export const DodgeComponents = [
  // copy from here
  {
    name: "dodge ultra instinct",
    repeatInterval: 2, 
    knockbackData: {
      speed: 100, 
      angle: 270, 
      aoe: 500,
    },
    maxEnemies: 3,
    addRandomAngle: true,
  },
  // to here, and replace with unique name
  {
    name: "dodge homing beam 120angle",
    repeatInterval: 1, 
    knockbackData: {
      speed: 15, 
      angle: 120, 
      aoe: 800,
    },
    maxEnemies: 3,
    addRandomAngle: false,
  },
];