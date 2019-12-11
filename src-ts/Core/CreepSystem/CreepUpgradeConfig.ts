export interface CreepUpgradeConfig {
  upgradeGroups: {
    [upgradeKey: string]: {
      // key: unit type upgraded from
      // value: unit type upgraded to
      map: Map<number, number>
    }
  }
}

export module SagaUpgradeNames {
  export const SAIYAN_SAGA = "SaiyanUpgrade";
}

export const DefaultCreepUpgradeConfig: CreepUpgradeConfig = {
  upgradeGroups: {
    SaiyanUpgrade: {
      map: new Map<number, number>(
        [
          [FourCC("n01E"), FourCC("n039")],
          [FourCC("n01D"), FourCC("n037")],
          [FourCC("n015"), FourCC("n037")],
          [FourCC("n019"), FourCC("n038")],
          [FourCC("n01A"), FourCC("n03C")],
          [FourCC("n02F"), FourCC("n03A")],
          [FourCC("n02E"), FourCC("n03A")],
        ]
      )
    },
    TurlesUpgrade: {
      map: new Map<number, number>(
        [
          [FourCC("n01E"), FourCC("n039")],
          [FourCC("n01D"), FourCC("n037")],
        ]
      )
    },
  }
}