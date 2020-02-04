import { SagaAbility } from "./SagaAbility";
import { AbilityNames } from "CustomAbility/AbilityNames";

const SHORT_CAST_TIME = 0.75;
const MEDIUM_CAST_TIME = 1.0;
const LONG_CAST_TIME = 1.25;
const EXTRA_LONG_CAST_TIME = 1.5;

export module SagaAbilities {
  export module Saga {
    export const GENERIC_BEAM = new SagaAbility(
      AbilityNames.Saga.GENERIC_BEAM, 10, 15, 10, SHORT_CAST_TIME
    );
    export const GENERIC_BOMB = new SagaAbility(
      AbilityNames.Saga.GENERIC_BOMB, 10, 35, 5, LONG_CAST_TIME
    );
    export const POWER_BLITZ_BARRAGE_CUSTOM = new SagaAbility(
      AbilityNames.Saga.POWER_BLITZ_BARRAGE_CUSTOM, 10, 45, 10, EXTRA_LONG_CAST_TIME, true
    );
    export const MANKIND_DESTRUCTION_ATTACK_CUSTOM = new SagaAbility(
      AbilityNames.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM, 9, 60, 5, EXTRA_LONG_CAST_TIME, true
    );
  }
  
  export module Raditz {
    export const DOUBLE_SUNDAY = new SagaAbility(
      AbilityNames.Raditz.DOUBLE_SUNDAY, 10, 8, 5, SHORT_CAST_TIME
    );
    export const SATURDAY_CRASH = new SagaAbility(
      AbilityNames.Raditz.SATURDAY_CRASH, 10, 8, 4, SHORT_CAST_TIME
    );
  }

  export module Nappa {
    export const BLAZING_STORM = new SagaAbility(
      AbilityNames.Nappa.BLAZING_STORM, 10, 14, 10, MEDIUM_CAST_TIME
    );
    export const GIANT_STORM = new SagaAbility(
      AbilityNames.Nappa.GIANT_STORM, 10, 20, 5, LONG_CAST_TIME
    );
    export const BREAK_CANNON = new SagaAbility(
      AbilityNames.Nappa.BREAK_CANNON, 10, 35, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module Vegeta {
    export const GALICK_GUN = new SagaAbility(
      AbilityNames.Vegeta.GALICK_GUN, 9, 14, 10, SHORT_CAST_TIME
    );
    export const ENERGY_BLAST_VOLLEY = new SagaAbility(
      AbilityNames.Vegeta.ENERGY_BLAST_VOLLEY, 10, 15, 5, SHORT_CAST_TIME
    );
    export const BIG_BANG_ATTACK = new SagaAbility(
      AbilityNames.Vegeta.BIG_BANG_ATTACK, 10, 30, 5, MEDIUM_CAST_TIME
    );
    export const FINAL_FLASH = new SagaAbility(
      AbilityNames.Vegeta.FINAL_FLASH, 10, 35, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module LordSlug {
    export const SLAPPY_HAND = new SagaAbility(
      AbilityNames.Piccolo.SLAPPY_HAND, 5, 12, 10, SHORT_CAST_TIME
    );
  }

  export module Broly {
    export const ENERGY_PUNCH = new SagaAbility(
      AbilityNames.Broly.ENERGY_PUNCH, 10, 12, 10, SHORT_CAST_TIME
    );
    export const POWER_LEVEL_RISING = new SagaAbility(
      AbilityNames.Broly.POWER_LEVEL_RISING, 7, 7, 10, SHORT_CAST_TIME
    );
    export const PLANET_CRUSHER = new SagaAbility(
      AbilityNames.Broly.PLANET_CRUSHER, 10, 35, 3, MEDIUM_CAST_TIME
    );
    export const GIGANTIC_ROAR = new SagaAbility(
      AbilityNames.Broly.GIGANTIC_ROAR, 10, 20, 5, SHORT_CAST_TIME
    );
    export const GIGANTIC_OMEGASTORM = new SagaAbility(
      AbilityNames.Broly.GIGANTIC_OMEGASTORM, 10, 25, 3, LONG_CAST_TIME
    );
  }

  export module Frieza {
    export const DEATH_BEAM = new SagaAbility(
      AbilityNames.Frieza.DEATH_BEAM, 10, 6, 10, SHORT_CAST_TIME
    );
  }

  export module Cooler {
    export const SUPERNOVA_COOLER = new SagaAbility(
      AbilityNames.Cooler.SUPERNOVA_COOLER, 10, 20, 5, MEDIUM_CAST_TIME
    );
    export const SUPERNOVA_GOLDEN = new SagaAbility(
      AbilityNames.Cooler.SUPERNOVA_GOLDEN, 10, 25, 5, MEDIUM_CAST_TIME
    );
    export const NOVA_CHARIOT = new SagaAbility(
      AbilityNames.Cooler.NOVA_CHARIOT, 10, 26, 3, SHORT_CAST_TIME
    );
    export const GETI_STAR_REPAIR = new SagaAbility(
      AbilityNames.Cooler.GETI_STAR_REPAIR, 10, 35, 5, SHORT_CAST_TIME
    );
  }

  export module Android17DBS {
    export const POWER_BLITZ = new SagaAbility(
      AbilityNames.Android17DBS.POWER_BLITZ, 10, 12, 10, SHORT_CAST_TIME
    );
    export const POWER_BLITZ_BARRAGE = new SagaAbility(
      AbilityNames.Android17DBS.POWER_BLITZ_BARRAGE, 10, 20, 5, MEDIUM_CAST_TIME
    );
    export const BARRIER_PRISON = new SagaAbility(
      AbilityNames.Android17DBS.BARRIER_PRISON, 10, 16, 10, SHORT_CAST_TIME
    );
    export const BARRIER_PRISO3N = new SagaAbility(
      AbilityNames.Android17DBS.BARRIER_WALL, 10, 30, 5, MEDIUM_CAST_TIME
    );
    export const ANDROID_BARRIER = new SagaAbility(
      AbilityNames.Android17DBS.ANDROID_BARRIER, 10, 45, 5, MEDIUM_CAST_TIME
    );
    export const SUPER_ELECTRIC_STRIKE = new SagaAbility(
      AbilityNames.Android17DBS.SUPER_ELECTRIC_STRIKE, 10, 22, 3, EXTRA_LONG_CAST_TIME
    );
  }

  export module Android13 {
    export const ENERGY_BEAM = new SagaAbility(
      AbilityNames.Android13.ENERGY_BEAM, 7, 14, 10, SHORT_CAST_TIME
    );
    export const NUKE = new SagaAbility(
      AbilityNames.Android13.NUKE, 10, 21, 10, MEDIUM_CAST_TIME
    );
    export const SS_DEADLY_BOMBER = new SagaAbility(
      AbilityNames.Android13.SS_DEADLY_BOMBER, 10, 23, 5, LONG_CAST_TIME
    );
    export const SS_DEADLY_HAMMER = new SagaAbility(
      AbilityNames.Android13.SS_DEADLY_HAMMER, 10, 23, 5, MEDIUM_CAST_TIME
    );
    export const ANDROID_BARRIER = new SagaAbility(
      AbilityNames.Android13.ANDROID_BARRIER, 10, 45, 5, MEDIUM_CAST_TIME
    );
    export const OVERCHARGE = new SagaAbility(
      AbilityNames.Android13.OVERCHARGE, 5, 45, 3, SHORT_CAST_TIME
    );
  }

  export module Cell {
    export const KAMEHAMEHA = new SagaAbility(
      AbilityNames.Cell.KAMEHAMEHA, 10, 13, 10, SHORT_CAST_TIME
    );
    export const MASENKO = new SagaAbility(
      AbilityNames.Cell.MASENKO, 10, 14, 10, SHORT_CAST_TIME
    );
    export const SPECIAL_BEAM_CANNON = new SagaAbility(
      AbilityNames.Cell.SPECIAL_BEAM_CANNON, 10, 15, 10, SHORT_CAST_TIME
    );
  }

  export module Babidi {
    export const HARETSU = new SagaAbility(
      AbilityNames.Babidi.HARETSU, 10, 15, 10, SHORT_CAST_TIME
    );
    export const BABIDI_BARRIER = new SagaAbility(
      AbilityNames.Babidi.BABIDI_BARRIER, 10, 30, 5, SHORT_CAST_TIME
    );
  }

  export module Buu {
    export const FLESH_ATTACK = new SagaAbility(
      AbilityNames.Buu.FLESH_ATTACK, 10, 15, 10, SHORT_CAST_TIME
    );
    export const INNOCENCE_BREATH = new SagaAbility(
      AbilityNames.Buu.INNOCENCE_BREATH, 10, 22, 10, SHORT_CAST_TIME
    );
    export const ANGRY_EXPLOSION = new SagaAbility(
      AbilityNames.Buu.ANGRY_EXPLOSION, 10, 30, 10, MEDIUM_CAST_TIME
    );
    export const VANISHING_BALL = new SagaAbility(
      AbilityNames.Buu.VANISHING_BALL, 10, 20, 10, SHORT_CAST_TIME
    );
    export const MANKIND_DESTRUCTION_ATTACK = new SagaAbility(
      AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, 10, 40, 20, LONG_CAST_TIME
    );
  }

  export module GokuBlack {
    export const KAMEHAMEHA = new SagaAbility(
      AbilityNames.Goku.KAMEHAMEHA, 10, 14, 10, SHORT_CAST_TIME
    );
    export const GOD_KAMEHAMEHA = new SagaAbility(
      AbilityNames.Goku.GOD_KAMEHAMEHA, 10, 17, 10, SHORT_CAST_TIME
    );
  }

  export module NuovaShenron {
    export const BURNING_ATTACK = new SagaAbility(
      AbilityNames.FutureTrunks.BURNING_ATTACK, 10, 20, 5, MEDIUM_CAST_TIME
    );
  }

  export module Whis {
    export const ULTRA_INSTINCT = new SagaAbility(
      AbilityNames.Goku.ULTRA_INSTINCT, 1, 180, 1, EXTRA_LONG_CAST_TIME
    );
  }
  
}