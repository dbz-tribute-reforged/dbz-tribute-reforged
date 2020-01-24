import { SagaAbility } from "./SagaAbility";
import { AbilityNames } from "CustomAbility/AbilityNames";

const SHORT_CAST_TIME = 0.25;
const MEDIUM_CAST_TIME = 0.50;
const LONG_CAST_TIME = 0.75;
const EXTRA_LONG_CAST_TIME = 1.0;

export module SagaAbilities {
  export module Saga {
    export const GENERIC_BEAM = new SagaAbility(
      AbilityNames.Saga.GENERIC_BEAM, 15, 10, SHORT_CAST_TIME
    );
    export const GENERIC_BOMB = new SagaAbility(
      AbilityNames.Saga.GENERIC_BOMB, 35, 5, MEDIUM_CAST_TIME
    );
    export const POWER_BLITZ_BARRAGE_CUSTOM = new SagaAbility(
      AbilityNames.Saga.POWER_BLITZ_BARRAGE_CUSTOM, 60, 10, LONG_CAST_TIME, true
    );
  }
  
  export module Raditz {
    export const DOUBLE_SUNDAY = new SagaAbility(
      AbilityNames.Raditz.DOUBLE_SUNDAY, 8, 5, SHORT_CAST_TIME
    );
    export const SATURDAY_CRASH = new SagaAbility(
      AbilityNames.Raditz.SATURDAY_CRASH, 8, 4, SHORT_CAST_TIME
    );
  }

  export module Nappa {
    export const BLAZING_STORM = new SagaAbility(
      AbilityNames.Nappa.BLAZING_STORM, 14, 10, MEDIUM_CAST_TIME
    );
    export const GIANT_STORM = new SagaAbility(
      AbilityNames.Nappa.GIANT_STORM, 20, 5, LONG_CAST_TIME
    );
    export const BREAK_CANNON = new SagaAbility(
      AbilityNames.Nappa.BREAK_CANNON, 35, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module Vegeta {
    export const GALICK_GUN = new SagaAbility(
      AbilityNames.Vegeta.GALICK_GUN, 14, 10, SHORT_CAST_TIME
    );
    export const ENERGY_BLAST_VOLLEY = new SagaAbility(
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY, 15, 5, SHORT_CAST_TIME
    );
    export const BIG_BANG_ATTACK = new SagaAbility(
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 30, 5, MEDIUM_CAST_TIME
    );
    export const FINAL_FLASH = new SagaAbility(
      AbilityNames.Vegeta.FINAL_FLASH, 35, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module LordSlug {
    export const SLAPPY_HAND = new SagaAbility(
      AbilityNames.Piccolo.SLAPPY_HAND, 12, 10, SHORT_CAST_TIME
    );
  }

  export module Broly {
    export const ENERGY_PUNCH = new SagaAbility(
      AbilityNames.Broly.ENERGY_PUNCH, 12, 10, SHORT_CAST_TIME
    );
    export const POWER_LEVEL_RISING = new SagaAbility(
      AbilityNames.Broly.POWER_LEVEL_RISING, 7, 10, MEDIUM_CAST_TIME
    );
    export const PLANET_CRUSHER = new SagaAbility(
      AbilityNames.Broly.PLANET_CRUSHER, 35, 3, MEDIUM_CAST_TIME
    );
    export const GIGANTIC_ROAR = new SagaAbility(
      AbilityNames.Broly.GIGANTIC_ROAR, 20, 5, MEDIUM_CAST_TIME
    );
    export const GIGANTIC_OMEGASTORM = new SagaAbility(
      AbilityNames.Broly.GIGANTIC_OMEGASTORM, 25, 3, LONG_CAST_TIME
    );
  }

  export module Frieza {
    export const DEATH_BEAM = new SagaAbility(
      AbilityNames.Frieza.DEATH_BEAM, 6, 10, SHORT_CAST_TIME
    );
  }

  export module Cooler {
    export const SUPERNOVA_COOLER = new SagaAbility(
      AbilityNames.Cooler.SUPERNOVA_COOLER, 20, 5, MEDIUM_CAST_TIME
    );
    export const SUPERNOVA_GOLDEN = new SagaAbility(
      AbilityNames.Cooler.SUPERNOVA_GOLDEN, 25, 5, MEDIUM_CAST_TIME
    );
    export const NOVA_CHARIOT = new SagaAbility(
      AbilityNames.Cooler.NOVA_CHARIOT, 25, 5, SHORT_CAST_TIME
    );
    export const GETI_STAR_REPAIR = new SagaAbility(
      AbilityNames.Cooler.GETI_STAR_REPAIR, 30, 5, SHORT_CAST_TIME
    );
  }

  export module Android17DBS {
    export const POWER_BLITZ = new SagaAbility(
      AbilityNames.Android17DBS.POWER_BLITZ, 12, 10, SHORT_CAST_TIME
    );
    export const POWER_BLITZ_BARRAGE = new SagaAbility(
      AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE, 20, 5, MEDIUM_CAST_TIME
    );
    export const BARRIER_PRISON = new SagaAbility(
      AbilityNames.Android17DBS.BARRIER_PRISON, 16, 10, SHORT_CAST_TIME
    );
    export const BARRIER_PRISO3N = new SagaAbility(
      AbilityNames.Android17DBS.BARRIER_WALL, 30, 5, MEDIUM_CAST_TIME
    );
    export const ANDROID_BARRIER = new SagaAbility(
      AbilityNames.Android17DBS.ANDROID_BARRIER, 45, 5, MEDIUM_CAST_TIME
    );
    export const SUPER_ELECTRIC_STRIKE = new SagaAbility(
      AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE, 22, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module Android13 {
    export const ENERGY_BEAM = new SagaAbility(
      AbilityNames.Android13.ENERGY_BEAM, 14, 10, SHORT_CAST_TIME
    );
    export const NUKE = new SagaAbility(
      AbilityNames.Android13.NUKE, 21, 10, MEDIUM_CAST_TIME
    );
    export const SS_DEADLY_BOMBER = new SagaAbility(
      AbilityNames.Android13.SS_DEADLY_BOMBER, 23, 5, LONG_CAST_TIME
    );
    export const SS_DEADLY_HAMMER = new SagaAbility(
      AbilityNames.Android13.SS_DEADLY_HAMMER, 23, 5, MEDIUM_CAST_TIME
    );
    export const ANDROID_BARRIER = new SagaAbility(
      AbilityNames.Android13.ANDROID_BARRIER, 45, 5, MEDIUM_CAST_TIME
    );
    export const OVERCHARGE = new SagaAbility(
      AbilityNames.Android13.OVERCHARGE, 45, 3, SHORT_CAST_TIME
    );
  }

  export module Cell {
    export const KAMEHAMEHA = new SagaAbility(
      AbilityNames.Cell.KAMEHAMEHA, 13, 10, SHORT_CAST_TIME
    );
    export const MASENKO = new SagaAbility(
      AbilityNames.Cell.MASENKO, 14, 10, SHORT_CAST_TIME
    );
    export const SPECIAL_BEAM_CANNON = new SagaAbility(
      AbilityNames.Cell.SPECIAL_BEAM_CANNON, 15, 10, SHORT_CAST_TIME
    );
  }

  export module Babidi {
    export const HARETSU = new SagaAbility(
      AbilityNames.Babidi.HARETSU, 15, 10, SHORT_CAST_TIME
    );
    export const BABIDI_BARRIER = new SagaAbility(
      AbilityNames.Babidi.BABIDI_BARRIER, 30, 5, SHORT_CAST_TIME
    );
  }

  export module Buu {
    export const FLESH_ATTACK = new SagaAbility(
      AbilityNames.Buu.FLESH_ATTACK, 15, 10, SHORT_CAST_TIME
    );
    export const INNOCENCE_BREATH = new SagaAbility(
      AbilityNames.Buu.INNOCENCE_BREATH, 22, 10, SHORT_CAST_TIME
    );
    export const ANGRY_EXPLOSION = new SagaAbility(
      AbilityNames.Buu.ANGRY_EXPLOSION, 30, 10, MEDIUM_CAST_TIME
    );
    export const VANISHING_BALL = new SagaAbility(
      AbilityNames.Buu.VANISHING_BALL, 20, 10, SHORT_CAST_TIME
    );
    export const MANKIND_DESTRUCTION_ATTACK = new SagaAbility(
      AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, 40, 20, MEDIUM_CAST_TIME
    );
  }

  export module GokuBlack {
    export const KAMEHAMEHA = new SagaAbility(
      AbilityNames.Goku.KAMEHAMEHA, 14, 10, SHORT_CAST_TIME
    );
    export const GOD_KAMEHAMEHA = new SagaAbility(
      AbilityNames.Goku.GOD_KAMEHAMEHA, 17, 10, SHORT_CAST_TIME
    );
  }

  export module NuovaShenron {
    export const BURNING_ATTACK = new SagaAbility(
      AbilityNames.FutureTrunks.BURNING_ATTACK, 20, 5, MEDIUM_CAST_TIME
    );
  }
  
}