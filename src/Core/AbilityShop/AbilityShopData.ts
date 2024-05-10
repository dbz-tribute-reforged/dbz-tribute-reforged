import { Id } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";

export const AbilityShopData: Map<number, [string[], string[]]> = new Map([
  [
    Id.cellUnformed, [
      [
        AbilityNames.Cell.SUPER_CHARGE,
      ],
      [
        AbilityNames.BasicAbility.MAX_POWER,
      ]
    ]
  ],
  [
    Id.donkeyKong, [
      [
        AbilityNames.DonkeyKong.THRILLA_GORILLA,
      ],
      [
        AbilityNames.BasicAbility.SPARKING_BLAST,
      ]
    ]
  ],
  [
    Id.vegetaMajin, [
      [

      ],
      [
        AbilityNames.BasicAbility.MAX_CHARGE,
      ]
    ]
  ],
  [
    Id.minato, [
      [
        // add
        AbilityNames.Minato.HIRAISHIN_ZANZO,
      ],
      [
        // remove
        AbilityNames.BasicAbility.ZANZOKEN,
        AbilityNames.BasicAbility.ZANZO_DASH,
      ]
    ]
  ],
  [
    Id.genos, [
      [
        AbilityNames.Genos.STAND_UP,
      ],
      [
        AbilityNames.BasicAbility.SPARKING_BLAST,
      ]
    ]
  ],

]);