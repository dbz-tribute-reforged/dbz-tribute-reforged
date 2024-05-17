import { Id } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";

export const AbilityShopData: Map<number, [string[], string[]]> = new Map([
  [
    Id.goku, [
      [
        // add
        AbilityNames.Goku.INSTANT_TRANSMISSION,
      ],
      [
        // remove
      ]
    ]
  ],
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
    Id.vegeta, [
      [
      ],
      [
        AbilityNames.BasicAbility.MAX_CHARGE,
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
        AbilityNames.Minato.HIRAISHIN_ZANZO,
      ],
      [
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
  [
    Id.beerus, [
      [
        AbilityNames.Beerus.BEERUS_COUNTER,
      ],
      [
      ]
    ]
  ],
  [
    Id.granolah, [
      [
        AbilityNames.Granolah.SHIELD,
        AbilityNames.Goku.INSTANT_TRANSMISSION,
      ],
      [
        AbilityNames.BasicAbility.GUARD,
      ]
    ]
  ],

]);