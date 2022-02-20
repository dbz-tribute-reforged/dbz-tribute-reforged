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
    for (let i = 0; i < randomCreepTypes.length; ++i) {
      if (i > 0) {
        max += randomCreepTypes[i].probability;
      }
      if (max >= rand - 0.00003) {
        return randomCreepTypes[i].creepType;
      }
    }
    return -1;
  }
}