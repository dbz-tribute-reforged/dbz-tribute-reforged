import { TimerManager } from "Core/Utility/TimerManager"
import { Buffs, Globals, Id } from "./Constants"

export module SoundHelper {
  export function playSoundOnUnit(target: unit, soundFile: string, duration: number) {
    udg_TempSound = CreateSound(soundFile, false, true, false, 1, 1, "SpellsEAX")
    SetSoundDuration(udg_TempSound, duration)
    SetSoundChannel(udg_TempSound, 0)
    SetSoundVolume(udg_TempSound, 127)
    SetSoundPitch(udg_TempSound, 1.0)
    SetSoundDistances(udg_TempSound, 600.0, 15000.0)
    SetSoundDistanceCutoff(udg_TempSound, 5000.0)
    SetSoundConeAngles(udg_TempSound, 0.0, 0.0, 127)
    SetSoundConeOrientation(udg_TempSound, 0.0, 0.0, 0.0)
    PlaySoundOnUnitBJ(udg_TempSound, 100, target)
    KillSoundWhenDone(udg_TempSound)
  }
  
  export function SetupSpellSoundEffects() {
    const trigger = CreateTrigger();
    TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
    TriggerAddCondition(trigger, Condition(() => {
      const unit = GetTriggerUnit();
      const spellId = GetSpellAbilityId();
      playUnitSpellSound(unit, spellId);
      return false;
    }));
  }

  export function playTwoSoundsWithDelay(
    unit: unit, 
    s1: string, dur1: number,
    timerDelay: number,
    s2: string, dur2: number
  ) {
    SoundHelper.playSoundOnUnit(unit, s1, dur1);
    const tim = TimerManager.getInstance().get();
    TimerStart(tim, timerDelay, false, () => {
      SoundHelper.playSoundOnUnit(unit, s2, dur2);
      TimerManager.getInstance().recycle(tim);
    });
  }
  
  export function playUnitSpellSound(unit: unit, spellId: number) {
    const unitId = GetUnitTypeId(unit);
    let rng = Math.random() * 100;

    if (spellId == Id.cosmicIllusion || spellId == Id.extremeSpeed) {
      const nearbyNappa = CreateGroup();
      GroupEnumUnitsInRange(
        nearbyNappa,
        GetUnitX(unit), GetUnitY(unit), 
        2000,
        null,
      )
      
      let keepSpeaking = true;
      ForGroup(nearbyNappa, () => {
        const unit = GetEnumUnit();
        if (GetUnitTypeId(unit) == Id.nappa) {
          if (keepSpeaking && rng < 40) {
            keepSpeaking = false;
            playSoundOnUnit(unit, "Audio/Effects/NappaWhereDidHeGo.mp3", 16512);
          } else {
            rng = Math.random() * 100;
          }
        }
      });

      DestroyGroup(nearbyNappa);
    }


    switch (spellId) {
      case Id.summonShenron:
        if (unitId == Id.krillin) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinSummonIt.mp3", 1992);
          }
        }
        break;
      
      // ainz ooal gown
      case Id.ainzRealitySlash:
        if (unitId == Id.ainzOoalGown) {
          SoundHelper.playTwoSoundsWithDelay(
            unit,
            "Audio/Voice/Ainz/RealitySlash.mp3", 2000, 1.5,
            "Audio/Effects/Ainz/RealitySlash.mp3", 2000
          );
        }
        break;
      
      case Id.ainzBlackHole:
        if (unitId == Id.ainzOoalGown) {
          SoundHelper.playTwoSoundsWithDelay(
            unit,
            "Audio/Voice/Ainz/BlackHole.mp3", 1200, 1.1,
            "Audio/Effects/Ainz/BlackHole.mp3", 2200
          );
        }
        break;
      
      case Id.ainzGreaterThunder:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/CallGreaterThunder.mp3", 1500);
        }
        break;
      
      case Id.ainzExplodeMine:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/ExplodeMine.mp3", 3000);
        }
        break;
      
      case Id.ainzEnergyDrain:
        if (unitId == Id.ainzOoalGown) {
          if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/Ainz/NegativeBurst.mp3", 1300);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Ainz/EnergyDrain.mp3", 2000);
          }
        }
        break;
      
      case Id.ainzGraspHeart:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GraspHeart.mp3", 1500);
        }
        break;
      
      case Id.ainzWallOfSkeleton:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/WallOfSkeleton.mp3", 1500);
        }
        break;
      
      case Id.ainzHoldOfRibs:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/HoldOfRib.mp3", 1000);
        }
        break;
      
      case Id.ainzPerfectUnknowable:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/Genjutsu.mp3", 600);
        }
        break;
      
      case Id.ainzRemoteViewing:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/SeeThrough.mp3", 600);
        }
        break;
      
      case Id.ainzGreaterTeleportation:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GreaterTeleportation.mp3", 1500);
        }
        break;
      
      case Id.ainzGate:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/Gate.mp3", 600);
        }
        break;
      
      case Id.ainzBodyOfEffulgentBeryl:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/BodyOfEffulgentBeryl.mp3", 2000);
        }
        break;
      
      case Id.ainzGreaterHardening:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GreaterHardening.mp3", 1000);
        }
        break;
      
      case Id.ainzGreaterFullPotential:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GreaterFullPotential.mp3", 1200);
        }
        break;
      
      case Id.ainzGreaterMagicShield:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GreaterMagicShield.mp3", 1200);
        }
        break;
      
      case Id.ainzMagicBoost:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/MagicBoost.mp3", 1200);
        }
        break;
      
      case Id.ainzPenetrateUp:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/PenetrateUp.mp3", 1200);
        }
        break;
      
      case Id.ainzSummonAlbedo:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/Albedo.mp3", 1000);
        }
        break;
      
      case Id.ainzSummonShalltear:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/Shalltear.mp3", 1000);
        }
        break;
      
      case Id.ainzSummonDemiurge:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/Demiurge.mp3", 1000);
        }
        break;

      case Id.ainzSummonPandora:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/PandorasActor.mp3", 1000);
        }
        break;
      
      case Id.ainzTGOALID:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/TGOALID.mp3", 4000);
        }
        break;
      
      case Id.ainzFallenDown:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/FallenDown.mp3", 4000);
        }
        break;
      
      case Id.ainzLaShubNiggurath:
        if (unitId == Id.ainzOoalGown) {
          if (rng < 25) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Ainz/LaShubNiggurath.mp3", 5000, 6,
              "Audio/Voice/Ainz/Applaud.mp3", 5000
            );
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Ainz/LaShubNiggurath.mp3", 5000);
          }
        }
        break;
      
      case Id.ainzTimeStop:
        if (unitId == Id.ainzOoalGown) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/Ainz/ZaWarudo.mp3", 4500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Ainz/TimeStop.mp3", 1000);
          }
        }
        break;
      
      case Id.ainzResistance:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/GreaterResistance.mp3", 1200);
        }
        break;
      
      case Id.ainzWish:
        if (unitId == Id.ainzOoalGown) {
          playSoundOnUnit(unit, "Audio/Voice/Ainz/WishUponAStar.mp3", 3000);
        }
        break;
      
      // albedo
      case Id.albedoDecapitate:
        if (unitId == Id.albedo) {
          if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/Slash.mp3", 250);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/Decapitate.mp3", 2000);
          }
        }
        break;
      
      case Id.albedoDefensiveSlash:
        if (unitId == Id.albedo) {
          playSoundOnUnit(unit, "Audio/Voice/Albedo/Slash2.mp3", 250);
        }
        break;
      
      case Id.albedoChargeAttack:
        if (unitId == Id.albedo) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/Unforgivable.mp3", 2000);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/YouDare.mp3", 1000);
          }
        }
        break;
      
      case Id.albedoAegis:
        if (unitId == Id.albedo) {
          playSoundOnUnit(unit, "Audio/Voice/Albedo/Aegis.mp3", 3000);
        }
        break;
      
      case Id.albedoFormSwap:
        if (unitId == Id.albedo) {
          if (GetUnitAbilityLevel(unit, Buffs.ALBEDO_GUARDIAN_AURA) > 0) {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/Keikaku.mp3", 1500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Albedo/AinzSama.mp3", 1000);
          }
        }
        break;
      
      case Id.albedoSkillBoost:
        if (unitId == Id.albedo) {
          playSoundOnUnit(unit, "Audio/Voice/Albedo/SkillBoost.mp3", 1200);
        }
        break;
      
      case Id.albedoGinnungagap:
        if (unitId == Id.albedo) {
          playSoundOnUnit(unit, "Audio/Voice/Albedo/Worm.mp3", 3100);
        }
        break;

      // all might
      case Id.detroitSmash:
        if (unitId == Id.allMight) {
          if (rng < 85) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/DetroitSmash.mp3", 4205);
          } else if (rng < 95) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/TimeToDie.mp3", 1802);
          } else if (rng < 100) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/PlusUltra.mp3", 7758);
          }
        }
        break;

      case Id.leftSmash:
      case Id.rightSmash:
        if (unitId == Id.allMight) {
          if (rng < 15) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/Smash.mp3", 1854);
          } else if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/Grunt.mp3", 2011);
          }
        }
        break;
      
      case Id.unitedStatesOfSmash:
        if (unitId == Id.allMight) {
          playSoundOnUnit(unit, "Audio/Voice/AllMight/UnitedStatesOfSmash.mp3", 6791);
        }
        break;
      
      case Id.oneForAll:
        if (unitId == Id.allMight) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/IAmHere.mp3", 3526);
          } else if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/IAmHere2.mp3", 5224);
          } else if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/AllMight/PlusUltra.mp3", 7758);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/OneForAll.mp3", 5302);
        break;
      
      case Id.oklahomaSmash:
        if (unitId == Id.allMight) {
          playSoundOnUnit(unit, "Audio/Voice/AllMight/OklahomaSmash.mp3", 4466);
        }
        break;
      
      case Id.carolinaSmash:
        if (unitId == Id.allMight) {
          playSoundOnUnit(unit, "Audio/Voice/AllMight/CarolinaSmash.mp3", 3604);
        }
        break;
      
      case Id.californiaSmash:
        if (unitId == Id.allMight) {
          playSoundOnUnit(unit, "Audio/Voice/AllMight/CaliforniaSmash.mp3", 5172);
        }
        break;
      
      case Id.newHampshireSmash:
        if (unitId == Id.allMight) {
          playSoundOnUnit(unit, "Audio/Voice/AllMight/NewHampshireSmash.mp3", 3970);
        }
        break;

      // android 13
      case Id.android13EnergyBeam:
        if (unitId == Id.android13) {
          playSoundOnUnit(unit, "Audio/Voice/Android13TakeThis.mp3", 1392);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam3.mp3", 9822);
        break;
      
      case Id.android13Nuke:
        if (unitId == Id.android13) {
          playSoundOnUnit(unit, "Audio/Voice/Android13YoureFinished.mp3", 1488);
        }
        break;

      case Id.android13Overcharge:
        if (unitId == Id.android13) {
          playSoundOnUnit(unit, "Audio/Voice/Android13TimeToDie.mp3", 2016);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp3.mp3", 11598);
        break;

      case Id.ssDeadlyHammer:
        if (unitId == Id.android13 || unitId == Id.superAndroid13) {
          playSoundOnUnit(unit, "Audio/Voice/Android13HowsThat.mp3", 1392);
          playSoundOnUnit(unit, "Audio/Voice/Android13SSDB.mp3", 4224);
        }
        break;

      case Id.ssDeadlyBomber:
        if (unitId == Id.android13 || unitId == Id.superAndroid13) {
          playSoundOnUnit(unit, "Audio/Voice/Android13SSDB.mp3", 4224);
        }
        break;

      // android 17 dbs
      case Id.powerBlitz:
      case Id.powerBlitzBarrage:
        if (unitId == Id.android17dbs) {
          playSoundOnUnit(unit, "Audio/Voice/Android17TakeThis.mp3", 984);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam3.mp3", 9822);
        break;

      case Id.androidBarrier:
        if (unitId == Id.android17dbs) {
          playSoundOnUnit(unit, "Audio/Voice/Android17GetOutOfHere.mp3", 984);
        } else if (unitId == Id.super17) {
          playSoundOnUnit(unit, "Audio/Voice/Super17/YouFools.mp3", 1968);
        }
        break;

      case Id.superElectricStrike:
        if (unitId == Id.android17dbs) {
          playSoundOnUnit(unit, "Audio/Voice/Android17BeatYouLikeARug.mp3", 1608);
        }
        break;
      
      // appule
      case Id.appuleBlaster:
        if (unitId == Id.appule) {
          if (rng < 60) {
            playSoundOnUnit(unit, "Audio/Voice/Appule/Q1.mp3", 1728);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Appule/Q2.mp3", 2784);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;
      
      case Id.appuleEscape:
        if (unitId == Id.appule) {
          playSoundOnUnit(unit, "Audio/Voice/Appule/W1.mp3", 2160);
        }
        break;
      
      case Id.appuleVengeance:
        if (unitId == Id.appule) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Appule/Kill3.mp3", 6768);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Appule/E1.mp3", 2352);
          }
        }
        break;
      
      case Id.appuleClones:
        if (unitId == Id.appule) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/Appule/Death.mp3", 1920);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Appule/R1.mp3", 1824);
          }
        }
        break;
      
      // babidi
      case Id.haretsu:
        if (unitId == Id.babidi) {
          if (rng < 4) {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapaMeme.mp3", 2304);
          } else if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapa.mp3", 1968);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/BabidiHaretsu.mp3", 3984);
          }
        }
        break;

      case Id.babidiBarrier:
        if (unitId == Id.babidi) {
          if (rng < 4) {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapaMeme.mp3", 2304);
          } else if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/BabidiDontWantToDie.mp3", 5808);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapa.mp3", 1968);
          }
        }
        break;

      case Id.babidiMagic:
        if (unitId == Id.babidi) {
          if (rng < 4) {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapaMeme.mp3", 2304);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/BabidiPaparapapa.mp3", 1968);
          }
        }
        break;

      // bardock
      case Id.tyrantBreaker:
        if (unitId == Id.bardock) {
          playSoundOnUnit(unit, "Audio/Voice/BardockTakeYouDown.mp3", 1608);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.tyrantLancer:
        if (unitId == Id.bardock) {
          playSoundOnUnit(unit, "Audio/Voice/BardockGrunt1.mp3", 1032);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.riotJavelin:
        if (unitId == Id.bardock) {
          playSoundOnUnit(unit, "Audio/Voice/BardockEverything.mp3", 1392);
        }
        break;

      case Id.rebellionSpear:
        if (unitId == Id.bardock) {
          playSoundOnUnit(unit, "Audio/Voice/BardockPerish.mp3", 1440);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;

      case Id.saiyanSpirit:
        if (unitId == Id.bardock) {
          playSoundOnUnit(unit, "Audio/Voice/BardockThisIsTheEnd.mp3", 2736);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;
      
      // broly
      case Id.energyPunch:
        if (unitId == Id.broly) {
          playSoundOnUnit(unit, "Audio/Voice/BrolyRoar3.mp3", 2016);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.powerLevelRising:
        if (unitId == Id.broly) {
          playSoundOnUnit(unit, "Audio/Voice/BrolyRoar5.mp3", 1944);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp2.mp3", 4702);
        break;

      case Id.planetCrusher:
        if (unitId == Id.broly) {
          playSoundOnUnit(unit, "Audio/Voice/BrolyRoar1.mp3", 1896);
        }
        break;

      case Id.giganticRoar:
        if (unitId == Id.broly) {
          playSoundOnUnit(unit, "Audio/Voice/BrolyRoar6.mp3", 1560);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.giganticOmegastorm:
        if (unitId == Id.broly) {
          playSoundOnUnit(unit, "Audio/Voice/BrolyRoar2.mp3", 2880);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam1.mp3", 10919);
        break;

      // buu 
      case Id.candyBeam:
        if (unitId == Id.fatBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuCandyBeam.mp3", 1872);
        } else if (unitId == Id.superBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuSuperCandyBeam.mp3", 1752);
        }
        playSoundOnUnit(unit, "Audio/Effects/CandyBeam.mp3", 1436);
        break;

      case Id.innocenceBreath:
        if (unitId == Id.fatBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuDisappear.mp3", 1032);
        }
        break;

      case Id.fleshAttack:
      case Id.fleshAttackAbsorbTarget:
        if (unitId == Id.fatBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuYoureInTheWay.mp3", 1008);
        } else if (unitId == Id.superBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuSuperLaugh2.mp3", 1392);
        } else if (unitId == Id.kidBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuKidGrunt2.mp3", 792);
        }
        break;

      case Id.angryExplosion:
        if (unitId == Id.fatBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuExplosion.mp3", 2160);
        } else if (unitId == Id.superBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuSuperGrunt1.mp3", 1296);
        } else if (unitId == Id.kidBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuKidGrunt1.mp3", 1632);
        }
        break;

      case Id.vanishingBall:
        if (unitId == Id.superBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuSuperGrunt2.mp3", 1032);
        } else if (unitId == Id.kidBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuKidGrunt3.mp3", 816);
        }
        break;

      case Id.mankindDestructionAttack:
        if (unitId == Id.superBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuSuperLaugh3.mp3", 1272);
        } else if (unitId == Id.kidBuu) {
          playSoundOnUnit(unit, "Audio/Voice/BuuKidGrunt1.mp3", 1632);
        }
        break;
      
      // cell
      case Id.cellAbsorb1:
      case Id.cellAbsorb2:
      case Id.cellAbsorb3:
        if (rng < 5) {
          if (unitId == Id.cellFirst) {
            playSoundOnUnit(unit, "Audio/Voice/CellFirstDrinkThisGuy.mp3", 1536);
          }
        }
        break;
      
      // cell max
      case Id.cellMaxTailWhip:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.cellMaxScream:
        if (unitId == Id.cellMax) {
          playSoundOnUnit(unit, "Audio/Voice/Cell/MaxScream.mp3", 3200);
        }
        break;

      case Id.cellMaxBlock:
        if (unitId == Id.cellMax) {
          playSoundOnUnit(unit, "Audio/Voice/Cell/MaxBlock.mp3", 5000);
        }
        break;

      case Id.cellMaxBarrier:
        if (unitId == Id.cellMax) {
          playSoundOnUnit(unit, "Audio/Voice/Cell/MaxRoar.mp3", 5500);
        }
        break;

      case Id.cellMaxBarrier2:
        if (unitId == Id.cellMax) {
          playSoundOnUnit(unit, "Audio/Voice/Cell/MaxRoar2.mp3", 4000);
        }
        break;

      case Id.cellMaxDisaster:
        if (unitId == Id.cellMax) {
          playSoundOnUnit(unit, "Audio/Voice/Cell/MaxDisaster.mp3", 3000);
        }
        break;

      // cooler 
      case Id.deathBeamCooler:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerGrunt1.mp3", 480);
        } else if (unitId == Id.metalCooler || unitId == Id.getiStarHero) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalGrunt1.mp3", 864);
        }
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;

      case Id.supernovaCooler:
      case Id.goldenSupernova:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerSupernova.mp3", 1416);
        } else if (unitId == Id.metalCooler || unitId == Id.getiStarHero) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalSupernova.mp3", 1944);
        }
        break;

      case Id.novaChariot:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerGrunt2.mp3", 552);
        } else if (unitId == Id.metalCooler || unitId == Id.getiStarHero) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalGrunt2.mp3", 960);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.deafeningWave:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerTakeThis.mp3", 624);
        }
        break;

      case Id.getiStarRepair:
        if (unitId == Id.metalCooler || unitId == Id.getiStarHero) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalTakeThis.mp3", 960);
        }
        break;
      
      // dart feld
      case Id.doubleSlash:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/DoubleSlash.mp3", 1280);
        }
        break;

      case Id.burningRush:
      case Id.madnessSlash:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/BurningRush.mp3", 1253);
        }
        break;

      case Id.crushDance:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/CrushDance.mp3", 992);
        }
        break;

      case Id.heartOfFire:
      case Id.paragonOfFlame:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/ParagonOfFlame.mp3", 3683);
        }
        break;

      case Id.madnessHero:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/MadnessHero.mp3", 5120);
        }
        break;

      case Id.blazingDynamo:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/BlazingDynamo.mp3", 2377);
        }
        break;

      case Id.dragoonTransformation:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/DragoonTransform.mp3", 1541);
        }
        break;

      case Id.dragoonFlourish:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/DragoonFlourish.mp3", 1358);
        }
        break;

      case Id.flameShot:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/FlameShot.mp3", 1671);
        }
        break;

      case Id.finalBurst:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/FinalBurst.mp3", 2481);
        }
        break;

      case Id.redEyedDragonSummoning:
        if (unitId == Id.dartFeld) {
          playSoundOnUnit(unit, "Audio/Voice/DartFeld/DragonSummon.mp3", 3631);
        }
        break;

      // demiurge
      case Id.demiurgeHellfireWall:
        if (unitId == Id.demiurge) {
          playSoundOnUnit(unit, "Audio/Voice/Demiurge/HellfireWall.mp3", 1500);
        }
        break;
      
      case Id.demiurgeGiantArm:
        if (unitId == Id.demiurge) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Claws.mp3", 2500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/GiantArm.mp3", 2500);
          }
        }
        break;
      
      case Id.demiurgeCommand:
        if (unitId == Id.demiurge) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Command.mp3", 1500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Command2.mp3", 1000);
          }
        }
        break;
      
      case Id.demiurgeMeteorFall:
        if (unitId == Id.demiurge) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Gehenna.mp3", 750);
          } else if (rng < 20) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Foolish.mp3", 750);
          } else if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Why.mp3", 500);
          } else if (rng < 60) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Why4.mp3", 600);
          } else if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Why3.mp3", 500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Why2.mp3", 600);
          }
        }
        break;

      case Id.demiurgeJaldabaoth:
        if (unitId == Id.demiurge) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Jaldabaoth.mp3", 1500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Demiurge/Jaldabaoth2.mp3", 1000);
          }
        }
        break;
      
      // done inside HeroPasssive for HellfireMantle logic
      // case Id.demiurgeHellfireMantle:
      //   break;

      // skurvy
      case Id.skurvyBigKannon:
        if (rng<20) {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyQ2.mp3", 5004);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyQ1.mp3", 2920);
        }
          break;

      case Id.skurvyKannonFire:
        playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyQorBoat.mp3", 2279);
        break;

      case Id.skurvyRunThrough:
        playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyW.mp3", 2336);
        break;

      case Id.skurvyPlunder:
        if (rng<10) {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyE5.mp3", 3337);
        } else if (rng<25)  {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyE1.mp3", 2995);
        } else if (rng<50) {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyE3.mp3", 1465);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyE4.mp3", 1182);
        }        
        break;

      case Id.skurvyMirrorNeverLies:
        if (rng<25) {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyR1.mp3", 3540);
        } else if (rng<50)  {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyR2.mp3", 6079);
        } else if (rng<75) {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyR3.mp3", 5050);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyR4.mp3", 5515);
        }        
      break;

      case Id.skurvyPlank:
        playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyF.mp3", 3387);
        break;

      case Id.skurvyPower:
        playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyCoconutAcquire.mp3", 5929);
        break;
      
      case Id.skurvyScorn:
        playSoundOnUnit(unit, "Audio/Voice/Skurvy/SkurvyF.mp3", 2279);
        break;

      // donkey kong
      case Id.groundPound:
      case Id.dkBarrelRoll:
        if (rng < 25) {
          playSoundOnUnit(unit, "Audio/Voice/DK/Drum.mp3", 1671);
        }
        break;

      case Id.dkRoll:
        if (unitId == Id.donkeyKong) {
          if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/DK/Hurry.mp3", 3030);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/DK/Drum.mp3", 1671);
          }
        }
        break;

      case Id.dkBananaSlamma:
        if (unitId == Id.donkeyKong) {
          if (rng < 95) {
            playSoundOnUnit(unit, "Audio/Voice/DK/BananaSlamma.mp3", 1906); 
          } else {
            playSoundOnUnit(unit, "Audio/Voice/DK/BananaSlamma2.mp3", 3761);
          }
        }
        break;

      case Id.dkJungleRush:
        if (unitId == Id.donkeyKong) {
          playSoundOnUnit(unit, "Audio/Voice/DK/BigKahuna.mp3", 1906);
        }
        break;
      
      case Id.dkBarrelCannon:
        if (unitId == Id.donkeyKong) {
          playSoundOnUnit(unit, "Audio/Voice/DK/MonkeyBusiness.mp3", 3082);
        }
        break;
      
      // dyspo
      case Id.lightBullet:
        if (unitId == Id.dyspo) {
          if (rng < 95) {
            playSoundOnUnit(unit, "Audio/Voice/DyspoHyperSpeed.mp3", 835);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/DyspoYoullNeverHitMe.mp3", 2690);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Zanzo.mp3", 1149);
        break;

      case Id.justiceKick:
      case Id.justiceKick2:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.justiceCannon:
      case Id.justiceCannon2:
        if (unitId == Id.dyspo) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/DyspoWhyYou.mp3", 992);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/DyspoYoureThrough.mp3", 966);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/FinishBuster.mp3", 1593);
        break;

      case Id.circleFlash:
      case Id.circleFlash2:
        if (unitId == Id.dyspo) {
          playSoundOnUnit(unit, "Audio/Voice/DyspoCircleFlash.mp3", 1671);
        }
        break;

      case Id.justicePoseDyspo:
        if (unitId == Id.dyspo) {
          playSoundOnUnit(unit, "Audio/Voice/DyspoHammerOfJustice.mp3", 2377);
        }
        break;

      case Id.superMaximumLightSpeedMode:
        if (unitId == Id.dyspo) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/DyspoGoEvenFaster.mp3", 2037);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/DyspoRampUpMyOwnSpeed.mp3", 3343);
          }
        }
        break;
      
      // eis shenron
      case Id.frostClaws:
        // playSoundOnUnit(unit, "Audio/Effects/ShiningSword.mp3", 1488);
        break;
      
      case Id.iceSlash:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;
        
      case Id.absoluteZero:
        playSoundOnUnit(unit, "Audio/Effects/JusticePose.mp3", 1645);
        break;
      
      case Id.iceCannon:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;
      
      // frieza
      case Id.deathBeamFrieza:
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;

      case Id.deathCannon:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.novaStrike:
        break;
      
      case Id.supernovaFrieza:
      case Id.supernovaFrieza2:
        break;

      case Id.emperorsThrone:
        break;

      case Id.deathStorm:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp2.mp3", 4702);
        break;
      
      case Id.impalingRush:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.deathBeamBarrage:
        playSoundOnUnit(unit, "Audio/Effects/DeathBeam.mp3", 2768);
        break;

      case Id.novaRush:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;
      
      case Id.deathBall:
        break;
      
      case Id.tailWhip:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.lastEmperor:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam3.mp3", 9822);
        break;

      case Id.deathSaucer:
        break;
      
      case Id.deathBeamGolden:
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;

      case Id.deathCannonGolden:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.novaRushGolden:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp3.mp3", 11598);
        break;

      case Id.earthBreaker:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;

      case Id.cageOfLight:
        playSoundOnUnit(unit, "Audio/Effects/EnergyBlastVolley.mp3", 3134);
        break;

      // ft 
      case Id.ftss:
        playSoundOnUnit(unit, "Audio/Voice/FTSS.mp3", 1008);
        break;

      case Id.finishBuster:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTFinishBuster.mp3", 3504);
        }
        playSoundOnUnit(unit, "Audio/Effects/FinishBuster.mp3", 1593);
        break;

      case Id.heatDomeAttack:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTEraseYouCompletely.mp3", 3144);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam1.mp3", 10919);
        break;

      case Id.burningAttack:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTBurningAttack.mp3", 2496);
        }
        playSoundOnUnit(unit, "Audio/Effects/BurningAttack.mp3", 2136);
        break;

      case Id.bigBangAttack:
      case Id.vegetaMajinBigBangAttack2:
        if (unitId == Id.vegeta || unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaBigBangAttack.mp3", 3744);
        } else if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTTakeThis.mp3", 744);
        }
        break;

      case Id.blazingRush:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTGrunt3.mp3", 552);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.shiningSwordAttack:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FTGrunt2.mp3", 528);
        }
        break;

      case Id.ftSwordOfHope:
        if (unitId == Id.ft) {
          playSoundOnUnit(unit, "Audio/Voice/FT/SwordOfHope.mp3", 2500);
        }
        break;

      // ginyu
      case Id.milkyCannon:
        if (unitId == Id.ginyu) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/GinyuShout1.mp3", 936);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GinyuShout2.mp3", 912);
          }
        }
        break;
      
      case Id.galaxyDynamite:
        if (unitId == Id.ginyu) {
          playSoundOnUnit(unit, "Audio/Voice/GinyuShout3.mp3", 1752);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;
      
      case Id.ginyuTelekinesis:
        if (unitId == Id.ginyu) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/GinyuShout1.mp3", 936);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GinyuShout2.mp3", 912);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Telekinesis.mp3", 1149);
        break;
      
      case Id.ginyuPoseUltimate:
        if (unitId == Id.ginyu) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/GinyuSpecialFightingPose.mp3", 3840);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GinyuSpecialFightingPose2.mp3", 2472);
          }
        }
        break;
      
      case Id.ginyuPoseFighting:
        if (unitId == Id.ginyu) {
          if (rng < 20) {
            playSoundOnUnit(unit, "Audio/Voice/GinyuHasArrived.mp3", 4368);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GinyuTogetherWeAre.mp3", 2736);
          }
        }
        break;
      
      case Id.ginyuChangeNow:
        if (rng < 50) {
          playSoundOnUnit(unit, "Audio/Voice/GinyuBodyChange1.mp3", 3360);
        } else if (rng < 75) {
          playSoundOnUnit(unit, "Audio/Voice/GinyuBodyChange2.mp3", 2808);
        } else {
          playSoundOnUnit(unit, "Audio/Voice/GinyuBodyChange3.mp3", 1752);
        }
        break;

      // goku
      case Id.kamehameha:
        if (unitId == Id.goku) {
          playSoundOnUnit(unit, "Audio/Voice/GokuKamehameha.mp3", 2832);
        } else if (unitId == Id.gohan) {
          if (GetHeroLevel(unit) < 115) {
            playSoundOnUnit(unit, "Audio/Voice/GohanTeenKamehameha.mp3", 1201);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GohanAdultKamehameha.mp3", 1440);
          }
        } else if (unitId == Id.cellFirst) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/CellFirstImitation.mp3", 2808);
          }
        } else if (unitId == Id.krillin) {
          playSoundOnUnit(unit, "Audio/Voice/KrillinTakeThis.mp3", 1272);
        } else if (unitId == Id.gotenks) {
          playSoundOnUnit(unit, "Audio/Voice/Gotenks/TakeThat.mp3", 1584);
        }
        playSoundOnUnit(unit, "Audio/Effects/Kamehameha.mp3", 3160);
        break;
        
      case Id.dragonFist:
      case Id.superDragonFist:
        if (unitId == Id.goku) {
          playSoundOnUnit(unit, "Audio/Voice/GokuDragonFist.mp3", 3552);
        }
        playSoundOnUnit(unit, "Audio/Effects/DragonFist.mp3", 5093);
        break;
      
      case Id.solarFlare:
        if (unitId == Id.goku) {
          playSoundOnUnit(unit, "Audio/Voice/GokuSolarFlare.mp3", 2976);
        } else if (unitId == Id.cellFirst) {
          playSoundOnUnit(unit, "Audio/Voice/CellFirstSolarFlare.mp3", 1671);
        } else if (unitId == Id.cellSemi) {
          playSoundOnUnit(unit, "Audio/Voice/CellSemiSolarFlare.mp3", 2455);
        } else if (unitId == Id.krillin) {
          if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinUltimateTechnique.mp3", 2304);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/KrillinSolarFlare.mp3", 4922);
          }
        }
        break;
      
      case Id.ultraInstinct:
      case Id.masteredUltraInstinct:
        playSoundOnUnit(unit, "Audio/Effects/UltraInstinct.mp3", 9534);
        break;

      // goku black
      case Id.gokuBlackKamehameha:
        if (unitId == Id.gokuBlack) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/Q1.mp3", 2352);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/Q2.mp3", 2352);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;
      
      case Id.gokuBlackDivineLasso:
        if (unitId == Id.gokuBlack) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/W1.mp3", 1344);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/Kill4.mp3", 1200);
          }
        }
        break;
      
      case Id.gokuBlackDivineRetribution:
        if (unitId == Id.gokuBlack) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/E1.mp3", 720);
          } else if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/E2.mp3", 1080);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GokuBlack/E3.mp3", 1320);
          }
        }
        break;
      
      case Id.gokuBlackWorkOfGods:
        if (unitId == Id.gokuBlack) {
          playSoundOnUnit(unit, "Audio/Voice/GokuBlack/R1.mp3", 720);
        }
        break;

      case Id.gokuBlackSorrowfulScythe:
        if (unitId == Id.gokuBlack) {
          playSoundOnUnit(unit, "Audio/Voice/GokuBlack/R2.mp3", 2088);
        }
        playSoundOnUnit(unit, "Audio/Effects/ShiningSword.mp3", 1488);
        break;

      // gohan
      case Id.twinDragonShot:
        if (unitId == Id.gohan) {
        } else if (unitId == Id.farmerWithShotgun) {
          playSoundOnUnit(unit, "Audio/Voice/FarmerProtectMeGun.mp3", 1697);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam1.mp3", 10919);
        break;

      case Id.masenko:
      case Id.cellMasenko:
        if (unitId == Id.gohan) {
          if (GetHeroLevel(unit) < 115) {
            playSoundOnUnit(unit, "Audio/Voice/GohanTeenMasenko.mp3", 960);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GohanAdultMasenko.mp3", 1128);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Masenko.mp3", 1645);
        break;

      case Id.unlockPotential:
      case Id.potentialUnleashed:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;

      case Id.greatSaiyamanHasArrived:
        if (unitId == Id.gohan) {
          playSoundOnUnit(unit, "Audio/Voice/GohanGreatSaiyaman.mp3", 1896);
        }
        playSoundOnUnit(unit, "Audio/Effects/JusticePose.mp3", 1645);
        break;

      case Id.beastGohan:
        playSoundOnUnit(unit, "Audio/Voice/Gohan/Beast.mp3", 5496);
        break;
      
      case Id.specialBeastCannon:
        if (unitId == Id.gohan) {
          playSoundOnUnit(unit, "Audio/Voice/Gohan/BeastSBC.mp3", 5952);
        }
        break;

      case Id.superDragonFlight:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;
      
      case Id.psychoJavelin:
        if (unitId == Id.guldo) {
          playSoundOnUnit(unit, "Audio/Voice/GuldoTakeThis.mp3", 1071);
        }
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;
      
      case Id.psychicRockThrow:
        if (unitId == Id.guldo) {
          playSoundOnUnit(unit, "Audio/Voice/GuldoTakeThis.mp3", 1071);
        }
        break;
      
      case Id.guldoTelekinesis:
        if (unitId == Id.guldo) {
          playSoundOnUnit(unit, "Audio/Voice/GuldoMyPsychicPowers.mp3", 3500);
        }
        playSoundOnUnit(unit, "Audio/Effects/Telekinesis.mp3", 1149);
        break;
      
      case Id.guldoTimeStop:
        if (unitId == Id.guldo) {
          if (rng < 66) {
            playSoundOnUnit(unit, "Audio/Voice/GuldoZaWarudo.mp3", 1123);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GuldoHelpMe.mp3", 1358);
          }
        }
        break;
      
      case Id.ginyuPoseGuldo:
        if (unitId == Id.guldo) {
          if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/GuldoGinyuForceGuldo.mp3", 2115);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/GuldoGuldo.mp3", 522);
          }
        }
        break;
      
      // gotenks
      case Id.superGotenStrike:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;
      
      case Id.kidTrunksFinalCannon:    
        playSoundOnUnit(unit, "Audio/Effects/FinalFlash.mp3", 4257);  
        break;
      
      case Id.dieDieMissileBarrage:
        if (unitId == Id.gotenks) {
          playSoundOnUnit(unit, "Audio/Voice/Gotenks/DieDieMissile.mp3", 1728);
        }
        playSoundOnUnit(unit, "Audio/Effects/DeathBeam.mp3", 2768);
        break;
      
      case Id.galacticDonut:
      case Id.ultraVolleyball:
      case Id.vegetaMajinGalaxyDonut:
        if (unitId == Id.gotenks) {
          if (rng < 20) {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/TooSlow.mp3", 2496);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/IGotcha.mp3", 2304);
          }
        }
        if (unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaGalaxyDonut.mp3", 1000);
        }
        playSoundOnUnit(unit, "Audio/Effects/Gotenks/GalacticDonuts.mp3", 2351);
        break;

      case Id.superGhostKamikazeAttack:
      case Id.superGhostKamikazeAttack2:
        if (unitId == Id.gotenks) {
          if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/HereIGo.mp3", 1296);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/PrepareYourself.mp3", 2256);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Gotenks/SuperGhostKamikaze.mp3", 2481);
        break;
      
      case Id.gotenksSS3:
        if (unitId == Id.gotenks) {
          if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/GrimReaperOfJustice.mp3", 5280);
          } else if (rng < 60) {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/BringerOfJustice.mp3", 3936);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/UltimateForm.mp3", 5376);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp3.mp3", 11598);
        break;
      
      // hirudegarn
      case Id.hirudegarnFlameBreath:
      case Id.hirudegarnTailSweep:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/Q1.mp3", 3600);
        }
        break;
      
      case Id.hirudegarnFlameBall:
      case Id.hirudegarnTailAttack:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/W1.mp3", 1248);
        }
        break;

      case Id.hirudegarnDarkMist:
      case Id.hirudegarnDarkEyes:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/E1.mp3", 2208);
        }
        break;

      case Id.hirudegarnChouMakousen:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/Q1.mp3", 3600);
        }
        break;

      case Id.hirudegarnMolting:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/D1.mp3", 6912);
        }
        break;

      case Id.hirudegarnFlight:
        if (unitId == Id.hirudegarn) {
          playSoundOnUnit(unit, "Audio/Voice/Hirudegarn/F1.mp3", 1920);
        }
        break;

      // hit
      case Id.timeSkip:
        if (unitId == Id.hit) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/Hit/Donuts.mp3", 2768);
          }
        }
        playSoundOnUnit(unit, "Audio/Voice/Hit/HitQSound.mp3", 552);
        break;
      
      case Id.pocketDimension:
        if (unitId == Id.hit) {
          if (rng < 70) {
            playSoundOnUnit(unit, "Audio/Voice/Hit/PocketDimension2.mp3", 888);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Hit/PocketDimension1.mp3", 1056);
          }
        }
        break;
      
      case Id.flashFist:
        if (unitId == Id.hit) {
          playSoundOnUnit(unit, "Audio/Voice/Hit/FlashFist.mp3", 840);
        }
        break;

      case Id.timeCage:
        if (unitId == Id.hit) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Hit/TimeCage1.mp3", 600);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Hit/TimeCage2.mp3", 552);
          }
        }
        break;
      
      case Id.pureProgress:
        if (unitId == Id.hit) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Hit/Donuts.mp3", 2768);
          } else if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/Hit/PureProgress2.mp3", 2064);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Hit/PureProgress1.mp3", 1464);
          }
        }
        break;
      
      // ichigo
      case Id.getsugaTensho:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/GetsugaTensho.mp3", 1933);
        }
        break;
      
      case Id.getsugaKuroi:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/GetsugaKuroi.mp3", 1462);
        }
      break;
      
      case Id.getsugaGran:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/GetsugaGran.mp3", 4127);
        }
        break;

      case Id.getsugaJujisho:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/GetsugaJujisho.mp3", 1880);
        }
        break;
      
      case Id.ceroFire:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Cero.mp3", 1880);
        }
        break;

      case Id.bankai:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Bankai.mp3", 1018);
        }
        break;

      case Id.bankaiFinal:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Bankai2.mp3", 2768);
        }
        break;
      
      case Id.mugetsuUnleash:
      case Id.mugetsuSlash:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Mugetsu.mp3", 783);
        }
        break;

      case Id.shunpo:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Shunpo.mp3", 391);
        }
        playSoundOnUnit(unit, "Audio/Effects/Zanzo.mp3", 1149);
        break;
      
      case Id.hirenkyaku:
        if (unitId == Id.ichigo) {
          playSoundOnUnit(unit, "Audio/Voice/Ichigo/Shunpo.mp3", 391);
        }
        playSoundOnUnit(unit, "Audio/Effects/Zanzo.mp3", 1149);
        break;

      // janemba
      case Id.rakshasaClaw:
      case Id.devilClaw:
      case Id.demonicBlade:
        if (unitId == Id.janemba) {
          if (rng < 33) {
            playSoundOnUnit(unit, "Audio/Voice/JanembaSuperGrunt1.mp3", 528);
          } else if (rng < 66) {
            playSoundOnUnit(unit, "Audio/Voice/JanembaSuperGrunt2.mp3", 720);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/JanembaSuperGrunt3.mp3", 960);
          }
        }
        break;

      case Id.cosmicIllusion:
      case Id.bunkaiTeleport:
        playSoundOnUnit(unit, "Audio/Effects/JanembaSuperBunkai.mp3", 1985);
        break;

      case Id.hellsGate:
        if (unitId == Id.janemba) {
          playSoundOnUnit(unit, "Audio/Voice/JanembaSuperGrunt4.mp3", 1656);
        }
        break;

      case Id.lightningShowerRain:
        if (unitId == Id.janemba) {
          playSoundOnUnit(unit, "Audio/Voice/JanembaSuperGrunt5.mp3", 1848);
        }
        break;
      
      // jaco
      case Id.jacoEliteBeamCharge:
      case Id.jacoEliteBeamPrime:
        break;
      
      case Id.jacoEliteBeamFire:
        if (unitId == Id.jaco) {
          playSoundOnUnit(unit, "Audio/Voice/Jaco/Q1.mp3", 2016);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.jacoAnnihilationBomb:
        if (unitId == Id.jaco) {
          if (rng < 30) {
            playSoundOnUnit(unit, "Audio/Voice/Jaco/W1.mp3", 2016);
          } else if (rng < 60) {
            playSoundOnUnit(unit, "Audio/Voice/Jaco/W2.mp3", 1584);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Jaco/W3.mp3", 2112);
          }
        }
        break;
      
      case Id.jacoRocketBoots:
        if (unitId == Id.jaco) {
          playSoundOnUnit(unit, "Audio/Voice/Jaco/E1.mp3", 2352);
        }
        break;
      
      case Id.jacoEmergencyBoost:
        if (unitId == Id.jaco) {
          playSoundOnUnit(unit, "Audio/Voice/Jaco/E3.mp3", 5040);
        }
        break;
      
      case Id.jacoSuperEliteCombo:
        if (unitId == Id.jaco) {
          if (rng < 30) {
            playSoundOnUnit(unit, "Audio/Voice/Jaco/R1.mp3", 3072);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Jaco/R2.mp3", 4368);
          }
        }
        break;
      
      case Id.jacoElitePose:
        if (unitId == Id.jaco) {
          playSoundOnUnit(unit, "Audio/Voice/Jaco/E2.mp3", 4704);
        }
        playSoundOnUnit(unit, "Audio/Effects/JusticePose.mp3", 1645);
        break;

      // jiren
      case Id.powerImpact:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenPowerImpact.mp3", 809);
        }
        break;
      case Id.powerImpact2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenPowerImpact2.mp3", 835);
        }
        break;

      case Id.mightyPunch:
      case Id.mightyPunch2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenPunch.mp3", 862);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;
      
      case Id.followUp:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenPunch2.mp3", 470);
        }
        break;
      
      case Id.glare:
      case Id.glare2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenGlare.mp3", 992);
        }
        break;
      
      case Id.heatwave:
      case Id.heatwave2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenHeatwave.mp3", 1854);
        }
        break;
      
      case Id.meditate:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenMeditate.mp3", 1645);
        }
        break;
      case Id.meditate2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenFutile.mp3", 653);
        }
        break;
      
      case Id.ultimateBurningWarrior:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenBurning.mp3", 2011);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp2.mp3", 4702);
        break;
      case Id.ultimateBurningWarrior2:
        if (unitId == Id.jiren) {
          playSoundOnUnit(unit, "Audio/Voice/JirenBurning2.mp3", 3004);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp3.mp3", 11598);
        break;
      
      // krillin
      case Id.scatteringBullet:
        if (unitId == Id.krillin) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinLimitBreak.mp3", 3240);
          } else if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinUltimateTechnique.mp3", 2304);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam3.mp3", 9822);
        break;
      
      case Id.destructoDisc:
        if (unitId == Id.krillin) {
          if (rng < 70) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinDestructoDisc.mp3", 1824);
          } else if (rng < 97) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinKienzan.mp3", 1152);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/KrillinUltimateTechnique.mp3", 2304);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/DestructoDisc.mp3", 3317);
        break;
      
      case Id.senzuThrow:
        if (unitId == Id.krillin) {
          if (rng < 60) {
            playSoundOnUnit(unit, "Audio/Voice/KrillinSenzuBean1.mp3", 1632);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/KrillinSenzuBean2.mp3", 1487);
          }
        }
        break;

      // king k rool kkr
      case Id.bellyArmor:
        playSoundOnUnit(unit, "Audio/Effects/KKRBellyArmor.mp3", 552);
        break;

      case Id.krownToss:
        if (unitId == Id.kkr) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/KKRGrunt1.mp3", 432);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/KKRGrunt2.mp3", 384);
          }
        }
        break;

      case Id.kharge:
        if (unitId == Id.kkr) {
          playSoundOnUnit(unit, "Audio/Voice/KKRGrunt3.mp3", 792);
        }
        break;

      case Id.kannonblast:
        playSoundOnUnit(unit, "Audio/Effects/KKRKannonblast.mp3", 1440);
        break;

      case Id.monkeySmasher:
        if (unitId == Id.kkr) {
          playSoundOnUnit(unit, "Audio/Voice/KKRGrunt4.mp3", 480);
        }
        playSoundOnUnit(unit, "Audio/Voice/KKRKannonblast.mp3", 1440);
        break;
      
      case Id.kingsThrone:
        playSoundOnUnit(unit, "Audio/Effects/KKRThrone1.mp3", 2904);
        break;

      case Id.blasto:
        playSoundOnUnit(unit, "Audio/Effects/KKRBlasto.mp3", 4896);
        break;
      
      // mario
      case Id.fireball:
        playSoundOnUnit(unit, "Audio/Effects/Mario/Fireball.mp3", 252);
        break;
      

      // raditz
      case Id.doubleSunday:
        if (unitId == Id.raditz) {

        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;

      case Id.behindYou:
        if (unitId == Id.raditz) {

        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;
      
      // roshi
      case Id.roshiKameCharge:
      case Id.roshiKameCharge2:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiKameCharge.mp3", 720);
        }
        break;

      case Id.roshiKameFire:
      case Id.roshiKameFire2:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiKameFire.mp3", 757);
        }
        playSoundOnUnit(unit, "Audio/Effects/Kamehameha.mp3", 3160);
        break;

      case Id.roshiLightningSurprise:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiLightningSurprise.mp3", 3984);
        }
        break;

      case Id.roshiMafuba:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiMafuba.mp3", 2040);
        }
        break;

      case Id.roshiNewTrick:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiUhOh.mp3", 1968);
        }
        break;

      case Id.roshiMaxPower:
        if (unitId == Id.roshi) {
          playSoundOnUnit(unit, "Audio/Voice/RoshiMaxPower.mp3", 1968);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;
      
      // might guy
      case Id.mightGuyDynamicEntry:
        if (unitId == Id.mightGuy) {
          if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/DynamicEntry1.mp3", 3300);
          } else if (rng < 85) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/DynamicEntry2.mp3", 1200);
          } else if (rng < 95) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/DynamicEntryMeme2.mp3", 1350);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/DynamicEntryMeme.mp3", 3900);
          }
        }
        break;
      
      case Id.mightGuyLeafHurricane:
        if (unitId == Id.mightGuy) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/LeafHurricane2.mp3", 1600);
          } else if (rng < 66) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/LeafHurricane3.mp3", 1500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/LeafHurricane1.mp3", 1500);
          }
        }
        break;
      
      case Id.mightGuyFrontLotus:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/FrontLotus.mp3", 1200);
        }
        break;

      case Id.mightGuyReverseLotus:
        if (unitId == Id.mightGuy) {
          if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/ReverseLotus1.mp3", 1300);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/ReverseLotus2.mp3", 1400);
          }
        }
        break;

      case Id.mightGuySunsetOfYouth:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/SunsetOfYouth.mp3", 2600);
        }
        break;
      
      case Id.mightGuyGate5:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/Gate5.mp3", 2100);
        }
        break;
      
      case Id.mightGuyGate6:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/Gate6.mp3", 4600);
        }
        break;
      
      case Id.mightGuyGate7:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/Gate7.mp3", 6300);
        }
        break;
      
      case Id.mightGuyGate8:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/Gate8.mp3", 3700);
        }
        break;
      
      case Id.mightGuyAsaKujaku:
        if (unitId == Id.mightGuy) {
          playSoundOnUnit(unit, "Audio/Voice/MightGuy/AsaKujaku.mp3", 1400);
        }
        break;
      
      case Id.mightGuyHirudora:
        if (unitId == Id.mightGuy) {
          if (rng < 66) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Hirudora1.mp3", 1000);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Hirudora2.mp3", 1300);
          }
        }
        break;
      
      case Id.mightGuySekizo:
        if (unitId == Id.mightGuy) {
          const sekizoKey = StringHash("sekizo_count");
          const handleId = GetHandleId(unit);
          const val = LoadInteger(Globals.genericSpellHashtable, handleId, sekizoKey);
          if (val == 0) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Sekizo1.mp3", 1000);
          } else if (val == 1) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Sekizo2.mp3", 1000);
          } else if (val == 2) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Sekizo3.mp3", 600);
          } else if (val == 3) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Sekizo4.mp3", 1000);
          } else if (val == 4) {
            playSoundOnUnit(unit, "Audio/Voice/MightGuy/Sekizo5.mp3", 1000);
          }
          SaveInteger(Globals.genericSpellHashtable, handleId, sekizoKey, (val+1)%5);
        }
        break;
      
      // yagai is done in SimpleSpellSystem

      // minato
      case Id.minatoKunai:
        playSoundOnUnit(unit, "Audio/Effects/Minato/Kunai.mp3", 200);
        break;
      
      case Id.minatoFirstFlash:
        if (unitId == Id.minato) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Minato/HiraishinNoJutsu.mp3", 1000);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Minato/HiraishinNoJutsu2.mp3", 1000);
          }
        }
        if (rng < 25) {
          playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin1.mp3", 1000);
        } else if (rng < 50) {
          playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin2.mp3", 1100);
        } else if (rng < 75) {
          playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin3.mp3", 1000);
        } else {
          playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin4.mp3", 1000);
        }
        break;
      
      case Id.minatoSecondStep:
        if (unitId == Id.minato) {
          playSoundOnUnit(unit, "Audio/Voice/Minato/SecondStep1.mp3", 600);
        }
        break;
      
      case Id.minatoThirdStage:
        if (unitId == Id.minato) {
          playSoundOnUnit(unit, "Audio/Voice/Minato/ThirdStage.mp3", 800);
        }
        playSoundOnUnit(unit, "Audio/Effects/Minato/Kunai.mp3", 200);
        break;
      
      case Id.minatoSpiralFlash:
        if (unitId == Id.minato) {
          playSoundOnUnit(unit, "Audio/Voice/Minato/SpiralFlash.mp3", 1300);
        }
        break;

      case Id.minatoHiraishin:
        if (unitId == Id.minato && rng < 25) {
          if (rng < 12) {
            playSoundOnUnit(unit, "Audio/Voice/Minato/HiraishinNoJutsu.mp3", 1000);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Minato/HiraishinNoJutsu2.mp3", 1000);
          }
        }
        if (GetUnitAbilityLevel(unit, Id.minatoKuramaModeFlag) > 0) {
          playSoundOnUnit(unit, "Audio/Effects/Minato/HiraishinKurama.mp3", 700);
        } else {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin1.mp3", 1000);
          } else if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin2.mp3", 1100);
          } else if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin3.mp3", 1000);
          } else {
            playSoundOnUnit(unit, "Audio/Effects/Minato/Hiraishin4.mp3", 1000);
          }
        }
        break;

      // megumin
      case Id.meguminManatite:
        if (unitId == Id.megumin) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/Megumin/Bakuretsu.mp3", 5929);
          }
        }
        break;

      case Id.meguminExplosion1:
        if (unitId == Id.megumin) {
          playSoundOnUnit(unit, "Audio/Voice/Megumin/Explosion1.mp3", 1253);
        }
        break;
      
      case Id.meguminExplosion2:
        if (unitId == Id.megumin) {
          if (rng < 10) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/ChunChunMaru.mp3", 800, 0.8,
              "Audio/Voice/Megumin/Explosion3.mp3", 2507
            );
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Megumin/Explosion2.mp3", 2544);
          }
        }
        break;

      case Id.meguminExplosion3:
        if (unitId == Id.megumin) {
          if (rng < 50) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/WagaNaWa2.mp3", 1123, 1.1,
              "Audio/Voice/Megumin/Explosion3.mp3", 2507
            );
          } else {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/WagaNaWa3.mp3", 1436, 1.4,
              "Audio/Voice/Megumin/Explosion3.mp3", 2507
            );
          }
        }
        break;

      case Id.meguminExplosion4:
        if (unitId == Id.megumin) {
          if (rng < 25) {
            SoundHelper.playTwoSoundsWithDelay(
              unit, 
              "Audio/Voice/Megumin/Explosion4_1.mp3", 2063, 2.0,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          } else if (rng < 50) {
            SoundHelper.playTwoSoundsWithDelay(
              unit, 
              "Audio/Voice/Megumin/Explosion4_2.mp3", 3578, 3.6,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          } else if (rng < 75) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/Explosion4_3.mp3", 1959, 2.0,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          } else {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/Explosion4_4.mp3", 2821, 2.9,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          }
        }
        break;

      case Id.meguminExplosion5:
        if (unitId == Id.megumin) {
          if (rng < 5) {
            SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Megumin/Chant.mp3", 11598);
          } else if (rng < 10) {
            SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Megumin/Explosion6.mp3", 5851);
          } else if (rng < 40) {
            SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Megumin/Explosion5_3.mp3", 7056);
          } else if (rng < 70) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/Explosion5_1.mp3", 3160, 3.1,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          } else {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Megumin/Explosion5_2.mp3", 2857, 2.8,
              "Audio/Voice/Megumin/Explosion4.mp3", 2690
            );
          }
        }
        break;

      // nappa
      case Id.giantStorm:
        if (unitId == Id.nappa) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/NappaBlahBlahBlah.mp3", 5664);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/NappaDodgeBall.mp3", 1920);
          }
        }
        break;

      case Id.blazingStorm:
        if (unitId == Id.nappa) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/NappaBlazingStorm.mp3", 7488);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/NappaKapow.mp3", 7488);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;

      case Id.plantSaibamen:
        if (unitId == Id.nappa) {
          playSoundOnUnit(unit, "Audio/Voice/NappaUnitedWeStand.mp3", 5328);
        }
        break;
        
      case Id.breakCannon:
        if (unitId == Id.nappa) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/NappaSneeze.mp3", 1248);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/NappaBreakCannon.mp3", 1176);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;
      
      // omega shenron
      case Id.dragonFlashBullet:
        playSoundOnUnit(unit, "Audio/Effects/EnergyBlastVolley.mp3", 3134);
        break;

      case Id.negativeEnergyBall:
        break;

      case Id.shadowFist:
        playSoundOnUnit(unit, "Audio/Effects/DragonFist.mp3", 5093);
        break;

      case Id.dragonicRage:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;
        
      case Id.omegaIceCannon:
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.omegaDragonThunder:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp3.mp3", 11598);
        break;

      // pan
      case Id.honeyBeeCostume:
        if (unitId == Id.pan) {
          playSoundOnUnit(unit, "Audio/Voice/PanYouGottaSmile.mp3", 1824);
        }
        break;

      case Id.panKame:
        if (unitId == Id.pan) {
          playSoundOnUnit(unit, "Audio/Voice/PanKamehameha.mp3", 1296);
        }
        playSoundOnUnit(unit, "Audio/Effects/Kamehameha.mp3", 3160);
        break;

      case Id.maidenBlast:
        if (unitId == Id.pan) {
          playSoundOnUnit(unit, "Audio/Voice/PanCantStandYou.mp3", 1512);
        }
        break;

      case Id.reliableFriend:
        if (unitId == Id.pan) {
          playSoundOnUnit(unit, "Audio/Voice/PanTeachYouALesson.mp3", 1680);
        }
        break;

      case Id.summonGiru:
        if (unitId == Id.pan) {
          playSoundOnUnit(unit, "Audio/Voice/PanPrepareYourself.mp3", 1344);
        }
        break;
      
      // pecorine
      case Id.pecorinePrincessSplash:
        if (unitId == Id.pecorine) {
          playSoundOnUnit(unit, "Audio/Voice/Pecorine/Q1.mp3", 705);
        }
        playSoundOnUnit(unit, "Audio/Effects/Peco/Q1.mp3", 1358);
        break;
      
      case Id.pecorineRoyalSlash:
        if (unitId == Id.pecorine) {
          playSoundOnUnit(unit, "Audio/Voice/Pecorine/W1.mp3", 705);
        }
        SoundHelper.playTwoSoundsWithDelay(
          unit,
          "Audio/Effects/Peco/W1.mp3", 835, 0.8,
          "Audio/Effects/Peco/W2.mp3", 1227
        );
        break;
      
      case Id.pecorineOnigiriTime:
        if (unitId == Id.pecorine) {
          playSoundOnUnit(unit, "Audio/Voice/Pecorine/Eat.mp3", 1724);
        }
        playSoundOnUnit(unit, "Audio/Effects/Peco/Eat.mp3", 1123);
        break;
      
      case Id.pecorinePrincessStrike:
        if (unitId == Id.pecorine) {
          if (rng < 50) {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Pecorine/PrincessStrike1_1.mp3", 1488, 1.4,
              "Audio/Voice/Pecorine/PrincessStrike1_2.mp3", 1593
            );
          } else {
            SoundHelper.playTwoSoundsWithDelay(
              unit,
              "Audio/Voice/Pecorine/PrincessStrike2_1.mp3", 2272, 2.2,
              "Audio/Voice/Pecorine/PrincessStrike2_2.mp3", 1593
            );
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Peco/R1.mp3", 809);
        break;

      case Id.pecorinePrincessValiant:
        if (unitId == Id.pecorine) {
          playSoundOnUnit(unit, "Audio/Voice/Pecorine/Q1.mp3", 705);
        }
        playSoundOnUnit(unit, "Audio/Effects/Peco/Q1.mp3", 1358);
        break;
      
      case Id.pecorinePrincessForce:
        if (unitId == Id.pecorine) {
          playSoundOnUnit(unit, "Audio/Voice/Pecorine/Eat.mp3", 1724);
        }
        playSoundOnUnit(unit, "Audio/Effects/Peco/Eat.mp3", 1123);
        break;

      // piccolo
      case Id.kyodaika:
        if (unitId == Id.piccolo) {
          playSoundOnUnit(unit, "Audio/Voice/PiccoloGrunt2.mp3", 672);
        }
        break;

      case Id.piccoloSBC:
      case Id.piccoloCloneSBC:
      case Id.cellSBC:
        if (unitId == Id.piccolo) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/PiccoloSBCMeme.mp3", 6138);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/PiccoloSBC.mp3", 1776);
          }
        } else if (unitId == Id.cellFirst) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/CellFirstImitation.mp3", 2808);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/SBC.mp3", 2246);
        break;

      case Id.slappyHand:
        if (unitId == Id.piccolo) {
          playSoundOnUnit(unit, "Audio/Voice/PiccoloGrunt1.mp3", 552);
        }
        break;

      case Id.hellzoneGrenade:
        if (unitId == Id.piccolo) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/PiccoloHellzoneGrenade.mp3", 1200);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/PiccoloHellzoneGrenade2.mp3", 1296);
          }
        }
        break;
      
      case Id.lightGrenade:
        if (unitId == Id.piccolo) {
          playSoundOnUnit(unit, "Audio/Voice/Piccolo/LightGrenade.mp3", 1032);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp2.mp3", 4702);
        break;
      
      case Id.kyodaika:
        if (unitId == Id.piccolo) {
          playSoundOnUnit(unit, "Audio/Voice/Piccolo/Waiting.mp3", 1104);
        }
        break;

      
      // saitama
      case Id.saitamaNormalPunch:
        if (unitId == Id.saitama) {
          if (rng < 5) {
          playSoundOnUnit(unit, "Audio/Voice/Saitama/PunchYou.mp3", 768);
          } else if (rng < 30) {
            playSoundOnUnit(unit, "Audio/Voice/Saitama/Hyah.mp3", 288);
          } else if (rng < 80) {
            playSoundOnUnit(unit, "Audio/Voice/Saitama/Yah.mp3", 600);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Saitama/TakeThat.mp3", 528);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.saitamaConsecutivePunches:
        if (unitId == Id.saitama) {
          playSoundOnUnit(unit, "Audio/Voice/Saitama/ConsecutiveNormalPunches.mp3", 1944);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.saitamaLeap:
        if (unitId == Id.saitama) {
          if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/Saitama/AlleOop.mp3", 696);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Saitama/MovePlease.mp3", 864);
          }
        }
        break;
      
      case Id.saitamaTableFlip:
        if (unitId == Id.saitama) {
          playSoundOnUnit(unit, "Audio/Voice/Saitama/AskedForIt.mp3", 1224);
        }
        break;

      case Id.saitamaOK:
        if (unitId == Id.saitama) {
          playSoundOnUnit(unit, "Audio/Voice/Saitama/OK.mp3", 408);
        }
        break;
      
      case Id.saitamaSeriousSeries:
        playSoundOnUnit(unit, "Audio/Voice/Saitama/SeriousSeries.mp3", 2136);
        break;

      case Id.saitamaSeriousPunch:
        playSoundOnUnit(unit, "Audio/Voice/Saitama/SeriousPunch.mp3", 1320);
        break;

      case Id.saitamaSeriousSidewaysJumps:
        playSoundOnUnit(unit, "Audio/Voice/Saitama/SeriousSidewaysJumps.mp3", 1750);
        break;

      // sephiroth
      case Id.sephirothOctoslash:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/Octoslash.mp3", 653);
        }
        playSoundOnUnit(unit, "Audio/Effects/ShiningSword.mp3", 1488);
        break;
      
      case Id.hellsGate:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/HellsGate.mp3", 1959);
        }
        break;
      
      case Id.sephirothFerventBlow:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/FerventBlow.mp3", 1044);
        }
        break;
      
      case Id.sephirothFerventRush:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/Kill2.mp3", 1332);
        }
        break;
      
      case Id.sephirothBlackMateria:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/BlackMateria.mp3", 2194);
        }
        break;
      
      case Id.sephirothOneWingedAngel:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/OneWingedAngel.mp3", 2821);
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;
      
      case Id.sephirothParry:
        if (unitId == Id.sephiroth) {
          playSoundOnUnit(unit, "Audio/Voice/Sephiroth/ParryWait.mp3", 731);
        }
        break;
      
      // shalltear bloodfallen
      case Id.shalltearPurifyingJavelin:
        if (unitId == Id.shalltearBloodfallen) {
          playSoundOnUnit(unit, "Audio/Voice/Shalltear/PurifyingLance.mp3", 1500);
        }
        break;
      
      case Id.shalltearVermilionNova:
        if (unitId == Id.shalltearBloodfallen) {
          playSoundOnUnit(unit, "Audio/Voice/Shalltear/VermilionNova.mp3", 1500);
        }
        break;
      
      case Id.shalltearMistForm:
        if (unitId == Id.shalltearBloodfallen) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Shalltear/Laugh.mp3", 2500);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Shalltear/Laugh2.mp3", 2500);
          }
        }
        break;
      
      case Id.shalltearNegativeImpactShield:
        if (unitId == Id.shalltearBloodfallen) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Shalltear/Shield.mp3", 2000);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Shalltear/Shield2.mp3", 2500);
          }
        }
        break;
      
      case Id.shalltearEinherjar:
        playSoundOnUnit(unit, "Audio/Voice/Shalltear/Einherjar.mp3", 1200);
        playSoundOnUnit(unit, "Audio/Voice/Shalltear/Einherjar2.mp3", 2500);
        break;
      
      // Valhalla covered by SimpleSpellSystem

      case Id.shalltearTimeReverse:
        if (unitId == Id.shalltearBloodfallen) {
          playSoundOnUnit(unit, "Audio/Voice/Shalltear/TimeReverse.mp3", 2000);
        }
        break;

      // super 17
      case Id.super17FlashBomber:
      case Id.super17FlashBomber2:
        if (unitId == Id.super17) {
          playSoundOnUnit(unit, "Audio/Voice/Super17/TakeThat.mp3", 1248);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam4.mp3", 4493);
        break;
      
      case Id.super17HellStorm:
        if (unitId == Id.super17) {
          playSoundOnUnit(unit, "Audio/Voice/Super17/TakeThis.mp3", 3456);
        }
        break;
      
      case Id.super17ShockingDeathBall:
        if (unitId == Id.super17) {
          playSoundOnUnit(unit, "Audio/Voice/Super17/HellSphere.mp3", 2736);
        }
        break;

      // tapion
      case Id.shiningSword:
        playSoundOnUnit(unit, "Audio/Effects/ShiningSword.mp3", 1488);
        break;

      case Id.herosFlute:
        // playSoundOnUnit(unit, "Audio/Effects/HerosFlute.mp3", 11755);
        break;
      
      // tien
      case Id.dodonRay:
        if (unitId == Id.tien) {
          if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/TakeThat.mp3", 1584);
          } else if (rng < 90) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/Grunt2.mp3", 1056);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Tien/HereIGo.mp3", 1296);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;
      
      case Id.triBeamCharge:
        if (unitId == Id.tien) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/FuckYou.mp3", 17424);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Tien/TriBeamCharge.mp3", 1436);
          }
        }
        break;
      
      case Id.triBeam:
        if (unitId == Id.tien) {
          playSoundOnUnit(unit, "Audio/Voice/Tien/TriBeamFire.mp3", 2429);
        }
        break;
      
      case Id.tienKiai:
        if (unitId == Id.tien) {
          if (rng < 35) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/Grunt1.mp3", 1248);
          } else if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/Grunt3.mp3", 1488);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Tien/ReadYourMind.mp3", 2400);
          }
        }
        break;

      case Id.tienFourArms:
        if (unitId == Id.tien) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/IAmAWarrior.mp3", 14304);
          } else if (rng < 30) {
            playSoundOnUnit(unit, "Audio/Voice/Tien/EscapeThirdEye.mp3", 4464);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Tien/ResultsOfMyTraining.mp3", 4176);
          }
        }
        break;

      // toppo
      case Id.justiceFlash:
      case Id.justiceFlash2:
        if (unitId == Id.toppo) {
          playSoundOnUnit(unit, "Audio/Voice/ToppoJusticeFlash.mp3", 2742);
        }
        break;

      case Id.justicePunch:
      case Id.justicePunch2:
        if (unitId == Id.toppo) {
          playSoundOnUnit(unit, "Audio/Voice/ToppoJusticePunch.mp3", 2246);
        } else {
          playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        }
        break;
      
      case Id.justiceHold:
      case Id.justiceHold2:
        // playSoundOnUnit(unit, "Audio/Voice/ToppoJusticePose.mp3", 1410);
        break;

      case Id.justiceTornado:
      case Id.justiceTornado2:
        if (unitId == Id.toppo) {
          playSoundOnUnit(unit, "Audio/Voice/ToppoJusticeTornado.mp3", 2246);
        }
        break;

      case Id.justicePoseToppo:
        if (unitId == Id.toppo) {
          playSoundOnUnit(unit, "Audio/Voice/ToppoJusticePose.mp3", 1410);
        }
        if (rng < 5) {
          playSoundOnUnit(unit, "Audio/Voice/ZenoJustice.mp3", 4989);
        }
        break;
      
      // upa
      case Id.javelinThrow:
        break;

      case Id.whirlwindTempest:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.korinFlag:
      case Id.lastStand:
        break;

      // vegeta
      case Id.galickGun:
      case Id.egoGalickGun:
      case Id.vegetaMajinGalickGun:
        if (unitId == Id.vegeta || unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaGalickGun.mp3", 2352);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;
      
      case Id.vegetaMajinGalaxyBreaker:
        if (unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaGalaxyBreaker.mp3", 1000);
        }
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;

      case Id.finalFlash:
      case Id.finalFlash2:
      case Id.vegetaMajinFinalFlash:
        if (unitId == Id.vegeta || unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaFinalFlash.mp3", 3408);
        } else if (unitId == Id.farmerWithShotgun) {
          playSoundOnUnit(unit, "Audio/Voice/FarmerHeyYou.mp3", 1384);
        }
        playSoundOnUnit(unit, "Audio/Effects/FinalFlash.mp3", 4257);
        break;

      case Id.vegetaMajinFinalExplosion:
        if (unitId == Id.vegetaMajin) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaFinalExplosion.mp3", 5000);
        }
        break;

      case Id.energyBlastVolley:
        playSoundOnUnit(unit, "Audio/Effects/EnergyBlastVolley.mp3", 3134);
        break;
      
      case Id.angryShout:
        playSoundOnUnit(unit, "Audio/Effects/PowerUp1.mp3", 11441);
        break;
      
      // videl
      case Id.punch:
        // playSoundOnUnit(unit, "Audio/Effects/StrongHit1.mp3", 2716);
        break;

      case Id.kick:
        playSoundOnUnit(unit, "Audio/Effects/StrongHit2.mp3", 2644);
        break;
      
      case Id.flyingKick:
        if (unitId == Id.videl) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/VidelHereICome.mp3", 705);
          } else if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/VidelOutOfMyWay.mp3", 705);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/VidelHyaa.mp3", 679);
          }
        }
        break;
      
      // waluigi
      case Id.waluigiFireball:
      case Id.waluigiSuperFireball:
        if (unitId == Id.waluigi) {
          if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/Q1.mp3", 1152);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/Q2.mp3", 313);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/Mario/Fireball.mp3", 252);
        break;
      
      case Id.waluigiPiranhaPlant:
        if (unitId == Id.waluigi) {
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/Waluigi.mp3", 1776);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/W1.mp3", 1828);
          }
        }
        playSoundOnUnit(unit, "Audio/Effects/PowerDown.mp3", 900);
        break;
      
      case Id.waluigiSpin:
        if (unitId == Id.waluigi) {
          if (rng < 25) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/E1.mp3", 4101);
          } else if (rng < 50) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/E2.mp3", 3816);
          } else if (rng < 75) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/E3.mp3", 4248);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/E4.mp3", 2507);
          }
        }
        break;

      case Id.waluigiBomb:
        if (unitId == Id.waluigi) {
          if (rng < 5) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/Kill4.mp3", 2142);
          } else if (rng < 40) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/R1.mp3", 2736);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/R2.mp3", 1358);
          }
        }
        break;
      
      case Id.waluigiJump:
        if (unitId == Id.waluigi) {
          playSoundOnUnit(unit, "Audio/Voice/Waluigi/F1.mp3", 2455);
          if (rng < 10) {
            playSoundOnUnit(unit, "Audio/Voice/Waluigi/F2.mp3", 1872);
          }
        }
        break;
    }
  }
}