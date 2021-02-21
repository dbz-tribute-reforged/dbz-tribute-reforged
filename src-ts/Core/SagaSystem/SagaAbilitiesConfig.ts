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
      AbilityNames.Saga.MANKIND_DESTRUCTION_ATTACK_CUSTOM, 9, 60, 5, EXTRA_LONG_CAST_TIME
    );
    export const SOLAR_KAMEHAMEHA_CUSTOM = new SagaAbility(
      AbilityNames.Saga.SOLAR_KAMEHAMEHA_CUSTOM, 10, 120, 3, MEDIUM_CAST_TIME,
    );
    export const NOVA_STAR_OMEGA_CUSTOM = new SagaAbility(
      AbilityNames.Saga.NOVA_STAR_OMEGA_CUSTOM, 1, 120, 3, MEDIUM_CAST_TIME
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
      AbilityNames.Nappa.GIANT_STORM, 10, 18, 5, LONG_CAST_TIME
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
      AbilityNames.Piccolo.SLAPPY_HAND, 10, 15, 10, SHORT_CAST_TIME
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
      AbilityNames.Frieza.DEATH_BEAM, 10, 6, 20, SHORT_CAST_TIME
    );
    export const DEATH_CANNON = new SagaAbility(
      AbilityNames.Frieza.DEATH_CANNON, 10, 18, 15, SHORT_CAST_TIME
    );
    export const NOVA_STRIKE = new SagaAbility(
      AbilityNames.Frieza.NOVA_STRIKE, 10, 18, 10, MEDIUM_CAST_TIME
    );
    
    export const SUPERNOVA = new SagaAbility(
      AbilityNames.Frieza.SUPERNOVA, 10, 20, 10, MEDIUM_CAST_TIME
    );

    export const DEATH_STORM = new SagaAbility(
      AbilityNames.Frieza.DEATH_STORM, 10, 12, 10, MEDIUM_CAST_TIME
    );
    export const IMPALING_RUSH = new SagaAbility(
      AbilityNames.Frieza.IMPALING_RUSH, 10, 12, 10, MEDIUM_CAST_TIME
    );

    export const DEATH_BEAM_BARRAGE = new SagaAbility(
      AbilityNames.Frieza.DEATH_BEAM_BARRAGE, 10, 24, 5, LONG_CAST_TIME
    );
    export const NOVA_RUSH = new SagaAbility(
      AbilityNames.Frieza.NOVA_RUSH, 10, 12, 10, MEDIUM_CAST_TIME
    );
    
    export const DEATH_BALL = new SagaAbility(
      AbilityNames.Frieza.DEATH_BALL, 10, 20, 5, LONG_CAST_TIME
    );
    export const SUPERNOVA_2 = new SagaAbility(
      AbilityNames.Frieza.SUPERNOVA_2, 10, 20, 5, LONG_CAST_TIME
    );
    export const TAIL_WHIP = new SagaAbility(
      AbilityNames.Frieza.TAIL_WHIP, 10, 4, 15, SHORT_CAST_TIME
    );

    export const LAST_EMPEROR = new SagaAbility(
      AbilityNames.Frieza.LAST_EMPEROR, 10, 45, 1, SHORT_CAST_TIME
    );
    export const DEATH_SAUCER = new SagaAbility(
      AbilityNames.Frieza.DEATH_SAUCER, 10, 90, 3, MEDIUM_CAST_TIME, true
    );

    export const DEATH_BEAM_GOLDEN = new SagaAbility(
      AbilityNames.Frieza.DEATH_BEAM_GOLDEN, 10, 5, 20, SHORT_CAST_TIME
    );
    export const DEATH_CANNON_GOLDEN = new SagaAbility(
      AbilityNames.Frieza.DEATH_CANNON_GOLDEN, 10, 10, 15, SHORT_CAST_TIME
    );
    export const NOVA_RUSH_GOLDEN = new SagaAbility(
      AbilityNames.Frieza.NOVA_RUSH_GOLDEN, 10, 15, 10, SHORT_CAST_TIME
    );
    export const CAGE_OF_LIGHT = new SagaAbility(
      AbilityNames.Frieza.NOVA_RUSH_GOLDEN, 10, 90, 5, EXTRA_LONG_CAST_TIME
    );
  }

  export module Cooler {
    export const DEATH_BEAM = new SagaAbility(
      AbilityNames.Cooler.DEATH_BEAM, 10, 6, 10, SHORT_CAST_TIME
    );
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
      AbilityNames.Cell.MASENKO, 9, 11, 10, SHORT_CAST_TIME
    );
    export const SPECIAL_BEAM_CANNON = new SagaAbility(
      AbilityNames.Cell.SPECIAL_BEAM_CANNON, 10, 14, 10, SHORT_CAST_TIME
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

  export module Dabura {
    export const EVIL_SPEAR = new SagaAbility(
      AbilityNames.Dabura.EVIL_SPEAR, 8, 17, 10, MEDIUM_CAST_TIME
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
      AbilityNames.Buu.ANGRY_EXPLOSION, 10, 45, 10, MEDIUM_CAST_TIME
    );
    export const VANISHING_BALL = new SagaAbility(
      AbilityNames.Buu.VANISHING_BALL, 10, 20, 10, SHORT_CAST_TIME
    );
    export const MANKIND_DESTRUCTION_ATTACK = new SagaAbility(
      AbilityNames.Buu.MANKIND_DESTRUCTION_ATTACK, 10, 40, 20, LONG_CAST_TIME
    );
  }

  export module SuperJanemba {
    export const RAKSHASA_CLAW = new SagaAbility(
      AbilityNames.SuperJanemba.RAKSHASA_CLAW, 10, 6, 15, SHORT_CAST_TIME
    );
    export const BUNKAI_TELEPORT = new SagaAbility(
      AbilityNames.SuperJanemba.BUNKAI_TELEPORT, 10, 16, 10, MEDIUM_CAST_TIME
    );
    export const DEMONIC_BLADE = new SagaAbility(
      AbilityNames.SuperJanemba.DEMONIC_BLADE, 10, 5, 5, SHORT_CAST_TIME
    );
    export const HELLS_GATE = new SagaAbility(
      AbilityNames.SuperJanemba.HELLS_GATE, 10, 22, 5, MEDIUM_CAST_TIME
    );
    export const LIGHTNING_SHOWER_RAIN = new SagaAbility(
      AbilityNames.SuperJanemba.LIGHTNING_SHOWER_RAIN, 10, 40, 3, LONG_CAST_TIME
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

  export module EisShenron {
    export const FROST_CLAWS = new SagaAbility(
      AbilityNames.EisShenron.FROST_CLAWS, 10, 14, 10, MEDIUM_CAST_TIME
    );
    export const ICE_SLASH = new SagaAbility(
      AbilityNames.EisShenron.ICE_SLASH, 10, 3, 10, SHORT_CAST_TIME
    );
    export const ICE_CANNON = new SagaAbility(
      AbilityNames.EisShenron.ICE_CANNON, 10, 30, 5, EXTRA_LONG_CAST_TIME
    );
  }

  export module Ginyu {
    export const MILKY_CANNON = new SagaAbility(
      AbilityNames.Ginyu.MILKY_CANNON, 10, 20, 10, MEDIUM_CAST_TIME
    );
    export const GALAXY_DYNAMITE = new SagaAbility(
      AbilityNames.Ginyu.GALAXY_DYNAMITE, 10, 15, 10, SHORT_CAST_TIME
    );
    export const GINYU_POSE_FIGHTING = new SagaAbility(
      AbilityNames.Ginyu.GINYU_POSE_FIGHTING, 10, 25, 5, MEDIUM_CAST_TIME
    );
  }

  export module Guldo {
    export const PSYCHO_JAVELIN = new SagaAbility(
      AbilityNames.Guldo.PSYCHO_JAVELIN, 10, 15, 15, EXTRA_LONG_CAST_TIME
    );
    export const PSYCHIC_ROCK_THROW = new SagaAbility(
      AbilityNames.Guldo.PSYCHIC_ROCK_THROW, 10, 15, 15, MEDIUM_CAST_TIME
    );
    export const TELEKINESIS = new SagaAbility(
      AbilityNames.Guldo.TELEKINESIS, 10, 40, 3, LONG_CAST_TIME
    );
    export const GINYU_POSE_GULDO = new SagaAbility(
      AbilityNames.Guldo.GINYU_POSE_GULDO, 10, 40, 5, SHORT_CAST_TIME
    );
  }

  export module OmegaShenron {
    export const DRAGON_FLASH_BULLET = new SagaAbility(
      AbilityNames.OmegaShenron.DRAGON_FLASH_BULLET, 10, 15, 20, SHORT_CAST_TIME
    );
    export const NEGATIVE_ENERGY_BALL = new SagaAbility(
      AbilityNames.OmegaShenron.NEGATIVE_ENERGY_BALL, 10, 24, 10, MEDIUM_CAST_TIME
    );
    export const DRAGONIC_RAGE = new SagaAbility(
      AbilityNames.OmegaShenron.DRAGONIC_RAGE, 10, 50, 5, EXTRA_LONG_CAST_TIME
    );
    export const ICE_CANNON = new SagaAbility(
      AbilityNames.OmegaShenron.ICE_CANNON, 1, 90, 3, SHORT_CAST_TIME
    );
    export const DRAGON_THUNDER = new SagaAbility(
      AbilityNames.OmegaShenron.DRAGON_THUNDER, 1, 90, 3, LONG_CAST_TIME
    );
  }

  export module Zamasu {
    export const DIVINE_AUTHORITY = new SagaAbility(
      AbilityNames.Zamasu.DIVINE_AUTHORITY, 10, 15, 20, MEDIUM_CAST_TIME
    );
    export const HOLY_LIGHT_GRENADE = new SagaAbility(
      AbilityNames.Zamasu.HOLY_LIGHT_GRENADE, 10, 30, 5, EXTRA_LONG_CAST_TIME
    );
    export const HEAVENLY_RUSH = new SagaAbility(
      AbilityNames.Zamasu.HEAVENLY_RUSH, 10, 40, 5, LONG_CAST_TIME
    );
    export const GOD_SLASH = new SagaAbility(
      AbilityNames.Zamasu.GOD_SLASH, 10, 3, 10, SHORT_CAST_TIME
    );
    export const ENERGY_BLADES = new SagaAbility(
      AbilityNames.Zamasu.ENERGY_BLADES, 1, 60, 2, SHORT_CAST_TIME
    );
  }

  export module Whis {
    export const ULTRA_INSTINCT = new SagaAbility(
      AbilityNames.Goku.ULTRA_INSTINCT, 1, 180, 1, EXTRA_LONG_CAST_TIME
    );
  }

  export module RustTyranno {
    export const TYRANNO_FLAME = new SagaAbility(
      AbilityNames.RustTyranno.TYRANNO_FLAME, 12, 6, 30, SHORT_CAST_TIME
    );
    export const TYRANNO_FLAME_2 = new SagaAbility(
      AbilityNames.RustTyranno.TYRANNO_FLAME, 12, 6, 25, SHORT_CAST_TIME
    );
    export const RUST_CHOMP = new SagaAbility(
      AbilityNames.RustTyranno.RUST_CHOMP, 12, 10, 25, SHORT_CAST_TIME
    );
    export const TYRANNO_ROAR = new SagaAbility(
      AbilityNames.RustTyranno.TYRANNO_ROAR, 12, 25, 20, LONG_CAST_TIME
    );
  }
  
}