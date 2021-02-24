import { Id } from "./Constants"

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

  export function playUnitSpellSound(unit: unit, spellId: number) {
    const unitId = GetUnitTypeId(unit);
    let rng = Math.random() * 100;

    if (spellId == Id.cosmicIllusion) {
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
        }
        break;

      case Id.superElectricStrike:
        if (unitId == Id.android17dbs) {
          playSoundOnUnit(unit, "Audio/Voice/Android17BeatYouLikeARug.mp3", 1608);
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

      // cooler 
      case Id.deathBeamCooler:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerGrunt1.mp3", 480);
        } else if (unitId == Id.metalCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalGrunt1.mp3", 864);
        }
        playSoundOnUnit(unit, "Audio/Effects/DeathBeamFast.mp3", 1724);
        break;

      case Id.supernovaCooler:
      case Id.goldenSupernova:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerSupernova.mp3", 1416);
        } else if (unitId == Id.metalCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerMetalSupernova.mp3", 1944);
        }
        break;

      case Id.novaChariot:
        if (unitId == Id.fourthCooler || unitId == Id.fifthCooler) {
          playSoundOnUnit(unit, "Audio/Voice/CoolerGrunt2.mp3", 552);
        } else if (unitId == Id.metalCooler) {
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
        if (unitId == Id.metalCooler) {
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
        if (unitId == Id.vegeta) {
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
        if (unitId == Id.gotenks) {
          if (rng < 20) {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/TooSlow.mp3", 2496);
          } else {
            playSoundOnUnit(unit, "Audio/Voice/Gotenks/IGotcha.mp3", 2304);
          }
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
        if (unitId == Id.vegeta) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaGalickGun.mp3", 2352);
        }
        playSoundOnUnit(unit, "Audio/Effects/GenericBeam2.mp3", 8097);
        break;

      case Id.finalFlash:
      case Id.finalFlash2:
        if (unitId == Id.vegeta) {
          playSoundOnUnit(unit, "Audio/Voice/VegetaFinalFlash.mp3", 3408);
        } else if (unitId == Id.farmerWithShotgun) {
          playSoundOnUnit(unit, "Audio/Voice/FarmerHeyYou.mp3", 1384);
        }
        playSoundOnUnit(unit, "Audio/Effects/FinalFlash.mp3", 4257);
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
    }
  }
}