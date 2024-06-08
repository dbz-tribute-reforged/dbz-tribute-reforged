import { Globals, Id } from "Common/Constants";
import { SkinData } from "./SkinData";
import { TimerManager } from "Core/Utility/TimerManager";

export class TransformationSystem {
  public static KEY_SKIN_ID = 45;

  private static instance: TransformationSystem;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new TransformationSystem();
    }
    return this.instance;
  }

  public unitTypeIdToTriggerMap: Map<number, trigger>;

  constructor() {
    // triggers arent created at static time
    this.unitTypeIdToTriggerMap = new Map([
      [Id.goku, gg_trg_Transformations_Goku],
      [Id.vegeta, gg_trg_Transformations_Vegeta],
      [Id.gohan, gg_trg_Transformations_Gohan],
      [Id.ft, gg_trg_Transformations_Future_Trunks],
      [Id.broly, gg_trg_Transformations_Broly],
      [Id.fourthCooler, gg_trg_Transformations_Cooler_Base],
      [Id.fifthCooler, gg_trg_Transformations_Cooler_Final_Form],
      [Id.metalCooler, gg_trg_Transformations_Metal_Cooler],
      [Id.cellUnformed, gg_trg_Transformations_Cell_Larval],
      [Id.cellFirst, gg_trg_Transformations_Cell_First],
      [Id.cellSemi, gg_trg_Transformations_Cell_Second],
      [Id.cellPerfect, gg_trg_Transformations_Cell_Perfect],
      [Id.cellMax, gg_trg_Transformations_Cell_Max],
      [Id.android13, gg_trg_Transformations_Androids_13],
      [Id.android14, gg_trg_Transformations_Androids_13_14_15],
      [Id.android15, gg_trg_Transformations_Androids_13_14_15],
      [Id.superAndroid13, gg_trg_Transform_to_Super_13],
      [Id.babidi, gg_trg_Transformations_Babidi],
      [Id.fatBuu, gg_trg_Transformations_Fat_Buu],
      [Id.superBuu, gg_trg_Transformations_Super_Buu],
      [Id.kidBuu, gg_trg_Transformations_Kid_Buu],
      [Id.piccolo, gg_trg_Transformations_Piccolo],
      [Id.bardock, gg_trg_Transformations_Bardock],
      [Id.pan, gg_trg_Transformations_Pan],
      [Id.farmerWithShotgun, gg_trg_Transformations_Farmer_with_Shotgun_MUI],
      [Id.raditz, gg_trg_Transformations_Raditz],
      [Id.nappa, gg_trg_Transformations_Nappa],
      [Id.moro, gg_trg_Transformations_Moro],
      [Id.android17dbs, gg_trg_Transformations_Android_17_DBS],
      [Id.janemba, gg_trg_Transformations_Super_Janemba],
      [Id.videl, gg_trg_Transformations_Videl],
      [Id.upa, gg_trg_Transformations_Upa],
      [Id.kkr, gg_trg_Transformations_King_K_Rool],
      [Id.tapion, gg_trg_Transformations_Tapion],
      [Id.eisShenron, gg_trg_Transformations_Eis_Shenron],
      [Id.toppo, gg_trg_Transformations_Toppo],
      [Id.ginyu, gg_trg_Transformations_Ginyu],
      [Id.frieza, gg_trg_Transformations_Frieza],
      [Id.omegaShenron, gg_trg_Transformations_Omega_Shenron],
      [Id.dyspo, gg_trg_Transformations_Dyspo],
      [Id.krillin, gg_trg_Transformations_Krillin],
      [Id.yamchaR, gg_trg_Transformations_Yamcha],
      [Id.guldo, gg_trg_Transformations_Guldo],
      [Id.jiren, gg_trg_Transformations_Jiren],
      [Id.roshi, gg_trg_Transformations_Roshi],
      [Id.zamasu, gg_trg_Transformations_Zamasu],
      [Id.allMight, gg_trg_Transformations_All_Might],
      [Id.sephiroth, gg_trg_Transformations_Sephiroth],
      [Id.hit, gg_trg_Transformations_Hit],
      [Id.mario, gg_trg_Transformations_Mario],
      [Id.tien, gg_trg_Transformations_Tien],
      [Id.kidTrunks, gg_trg_Transformations_Kid_Trunks],
      [Id.goten, gg_trg_Transformations_Goten],
      [Id.gotenks, gg_trg_Transformations_Gotenks],
      [Id.ichigo, gg_trg_Transformations_Ichigo],
      [Id.dartFeld, gg_trg_Transformations_Dart_Feld],
      [Id.rustTyranno, gg_trg_Transformations_Rust_Tyranno],
      [Id.crono, gg_trg_Transformations_Crono],
      [Id.frog, gg_trg_Transformations_Frog],
      [Id.robo, gg_trg_Transformations_Robo],
      [Id.magus, gg_trg_Transformations_Magus],
      [Id.lucca, gg_trg_Transformations_Lucca],
      [Id.ayla, gg_trg_Transformations_Ayla],
      [Id.marle, gg_trg_Transformations_Marle],
      [Id.lucario, gg_trg_Transformations_Lucario],
      [Id.saitama, gg_trg_Transformations_Saitama],
      [Id.donkeyKong, gg_trg_Transformations_Donkey_Kong],
      [Id.hirudegarn, gg_trg_Transformations_Hirudegarn],
      [Id.super17, gg_trg_Transformations_Super_17],
      [Id.schala, gg_trg_Transformations_Schala],
      [Id.shotoTodoroki, gg_trg_Transformations_Shoto_Todoroki],
      [Id.skurvy, gg_trg_Transformations_Skurvy],
      [Id.sonic, gg_trg_Transformations_Sonic],
      [Id.appule, gg_trg_Transformations_Appule],
      [Id.guts, gg_trg_Transformations_Guts],
      [Id.jaco, gg_trg_Transformations_Jaco],
      [Id.waluigi, gg_trg_Transformations_Waluigi],
      [Id.gokuBlack, gg_trg_Transformations_Goku_Black],
      [Id.getiStarHero, gg_trg_Transformations_Geti_Star],
      [Id.leonSKennedy, gg_trg_Transformations_Leon],
      [Id.megumin, gg_trg_Transformations_Megumin],
      [Id.pecorine, gg_trg_Transformations_Peco],
      [Id.dende, gg_trg_Transformations_Dende],
      [Id.linkTwilight, gg_trg_Transformations_Link],
      [Id.ainzOoalGown, gg_trg_Transformations_Ainz],
      [Id.albedo, gg_trg_Transformations_Albedo],
      [Id.shalltearBloodfallen, gg_trg_Transformations_Shalltear],
      [Id.demiurge, gg_trg_Transformations_Demiurge],
      [Id.vegetaMajin, gg_trg_Transformations_Majin_Vegeta],
      [Id.minato, gg_trg_Transformations_Minato],
      [Id.mightGuy, gg_trg_Transformations_Might_Guy],
      [Id.genos, gg_trg_Transformations_Genos],
      [Id.tatsumaki, gg_trg_Transformations_Tatsumaki],
      [Id.granolah, gg_trg_Transformations_Granolah],
      [Id.whis, gg_trg_Transformations_Whis],
      [Id.beerus, gg_trg_Transformations_Beerus],
      [Id.gojo, gg_trg_Transformations_Gojo],
      [Id.cheongMyeong, gg_trg_Transformations_Cheong_Myeong],
    ]);
    
    this.init();
  }

  init() {
    // override stuff
    TriggerAddAction(gg_trg_Transformations_Parse_String, () => {
      const playerId = GetPlayerId(udg_TransformationPlayer);
      const units = udg_StatMultPlayerUnits[playerId];
      for (let i = 0; i < BlzGroupGetSize(units); ++i) {
        this.transform(udg_TransformationPlayer, BlzGroupUnitAt(units, i));
      }
    });
  }

  // udg_TransformationPlayer
  // udg_TransformationString
  transform(player: player, unit: unit) {
    if (unit == null) return;
    const unitTypeId = GetUnitTypeId(unit);
    const trig = this.unitTypeIdToTriggerMap.get(unitTypeId);
    this.transformSkinCheck(udg_StatMultUnit);
    if (trig) {
      udg_TransformationPlayer = player;
      udg_StatMultUnit = unit;
      TriggerExecute(trig);
    }
  }

  transformSkinCheck(unit: unit) {
    const unitId = GetHandleId(unit);
    const transformTime = LoadReal(udg_StatMultHashtable, unitId, 9);
    udg_TransformationID = 0;
    if (transformTime > 0) return;

    const skinId = LoadInteger(udg_StatMultHashtable, unitId, TransformationSystem.KEY_SKIN_ID);
    if (skinId && skinId != 0 && skinId != GetUnitTypeId(unit)) {
      udg_TransformationID = skinId;
      if (skinId == SkinData.SKIN_ALTERNATE) {
        AddUnitAnimationProperties(unit, "alternate", true);
      } else {
        BlzSetUnitSkin(unit, skinId);
      }
    }
  }

  changeSkin(player: player) {
    const playerId = GetPlayerId(player);
    const playerProfile = Globals.playerProfiles[playerId];

    const units = udg_StatMultPlayerUnits[playerId];
    for (let i = 0; i < BlzGroupGetSize(units); ++i) {
      const unit = BlzGroupUnitAt(units, i);
      if (unit == null) continue;
      const unitTypeId = GetUnitTypeId(unit);
      const skins = SkinData.getSkinData(unitTypeId);
      DisplayTimedTextToPlayer(player, 0, 0, 1, 
        skins ? 
          "Changing skins for " + GetHeroProperName(unit):
          "No skins found for " + GetHeroProperName(unit)
      );
      if (!skins) continue;
      const unitId = GetHandleId(unit);
      
      let currentSkin = LoadInteger(udg_StatMultHashtable, unitId, TransformationSystem.KEY_SKIN_ID);
      let found = false;
      let foundPrev = currentSkin == unitTypeId;
      for (let i = 0; i < skins.length; ++i) {
        const skin = skins[i];
        const isValid = skin.isValid(playerProfile);

        if (currentSkin == 0 || foundPrev) {
          if (isValid) {
            SaveInteger(udg_StatMultHashtable, unitId, TransformationSystem.KEY_SKIN_ID, skin.targetId);
            found = true;
            break;
          }
        } else if (currentSkin == skin.targetId) {
          foundPrev = true;
          if (skin.targetId == SkinData.SKIN_ALTERNATE) {
            AddUnitAnimationProperties(unit, "alternate", false);
          }
        }
      }
      if (!found) {
        SaveInteger(udg_StatMultHashtable, unitId, TransformationSystem.KEY_SKIN_ID, unitTypeId);
      }
      this.autoTransformPlayerUnit(player, unit);
    }
  }

  autoTransformPlayer(player: player) {
    const playerId = GetPlayerId(player);
    const units = udg_StatMultPlayerUnits[playerId];
    for (let i = 0; i < BlzGroupGetSize(units); ++i) {
      this.autoTransformPlayerUnit(player, BlzGroupUnitAt(units, i));
    }
  }

  autoTransformPlayerUnit(player: player, unit: unit) {
    udg_TransformationPlayer = player;
    udg_StatMultUnit = unit;
    let skip = false;
    for (let i = udg_MaxTransformationStrings-1; i >= 0 && !skip; --i) {
      udg_TransformationString = udg_TransformationCommands[i];
      this.transform(player, unit);
      if (udg_StatMultReal > 0) {
        skip = true;
      }
      TriggerExecute(gg_trg_Transformations_Exit_Point);
    }
  }
}