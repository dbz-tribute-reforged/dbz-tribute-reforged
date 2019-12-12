export class RandomCreepType {
  constructor(
    public creepType: number,
    public probability: number = 1.0,
  ) {

  }
}

export module RandomCreepTypeHelper {
  export function getType(randomCreepTypes: RandomCreepType[]): number {
    const rand = Math.random();
    let max = randomCreepTypes[0].probability;
    for (let i = 0; i < randomCreepTypes.length - 1; ++i) {
      if (max > rand) {
        return randomCreepTypes[i].creepType;
      }
      max += randomCreepTypes[i+1].probability;
    }
    return randomCreepTypes[randomCreepTypes.length - 1].creepType;
  }
}