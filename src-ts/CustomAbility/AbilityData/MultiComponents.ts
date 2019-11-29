import { MultiComponent } from "CustomAbility/AbilityComponent/MultiComponent";

export const MultiComponents = [
  {
    name: "multi twin dragon shot", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 30,
    angleMin: -15,
    angleMax: 15,
    delayBetweenComponents: 16,
    firingMode: MultiComponent.SPREAD_FIRING,
    components: [
      { name: "beam twin dragon shot" },
      { name: "beam twin dragon shot" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi final flash 2", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -10,
    angleMax: 10,
    delayBetweenComponents: 1,
    firingMode: MultiComponent.SPREAD_FIRING,
    components: [
      { name: "beam final flash" },
      { name: "beam final flash" },
      { name: "beam final flash" },
      { name: "beam final flash" },
      { name: "beam final flash" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi energy blast volley", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 5,
    angleMin: -20,
    angleMax: 20,
    delayBetweenComponents: 2,
    firingMode: MultiComponent.RANDOM_FIRING,
    components: [
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },

      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },

      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },

      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
      { name: "beam energy blast volley" },
    ],
  },
  // -------------------------------------------
  {
    name: "multi death beam barrage", 
    repeatInterval: 1, 
    startTick: 0,
    endTick: -1,
    angleDifference: 3,
    angleMin: -7,
    angleMax: -7,
    delayBetweenComponents: 4,
    firingMode: MultiComponent.SPREAD_FIRING,
    components: [
      { name: "beam death beam frieza" },
      { name: "beam death beam frieza" },
      { name: "beam death beam frieza" },
      { name: "beam death beam frieza" },
      { name: "beam death beam frieza" },
    ],
  },
];