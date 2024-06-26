import { Constants, Globals, Id } from "Common/Constants";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { UnitHelper } from "Common/UnitHelper";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { TransformationSystem } from "Core/TransformationSystem/TransformationSystem";
import { TimerManager } from "Core/Utility/TimerManager";

export class FusionUnit {
  public static readonly FUSION_FLAG = FourCC("A14V");
  public static readonly FUSION_PAIR_UNIT_KEY = StringHash("fusion_pair_unit");
  public static readonly FUSION_SIDE_KEY = StringHash("fusion_side");

  public static unitFusionNameMap = new Map<number, string[]>([
    [Id.goku, ["Go", "ku"]],
    [Id.vegeta, ["Vege", "geta"]],
    [Id.gohan, ["Go", "han"]],
    [Id.gotenks, ["Go", "tenks"]],
    [Id.ft, ["Future Tru", "unks"]],
    [Id.piccolo, ["Picc", "olo"]],
    [Id.superAndroid13, ["Andro", "droid 13"]],
    [Id.broly, ["Bro", "ly"]],
    [Id.cellPerfect, ["Cell", "ell"]],
    [Id.babidi, ["Babi", "idi"]],
    [Id.fatBuu, ["Buu", "uu"]],
    [Id.kidBuu, ["Buu", "uu"]],
    [Id.fifthCooler, ["Coo", "ler"]],
    [Id.metalCooler, ["Meta", "ooler"]],
    [Id.bardock, ["Bar", "dock"]],
    [Id.pan, ["Pan", "an"]],
    [Id.farmerWithShotgun, ["Farm", "mer"]],
    [Id.raditz, ["Rad", "itz"]],
    [Id.nappa, ["Napp", "appa"]],
    [Id.moro, ["Mor", "oro"]],
    [Id.android17dbs, ["Andro", "droid 17"]],
    [Id.janemba, ["Janem", "nemba"]],
    [Id.videl, ["Vid", "del"]],
    [Id.upa, ["Up", "pa"]],
    [Id.kkr, ["King K", "k Rool"]],
    [Id.tapion, ["Tap", "ion"]],
    [Id.eisShenron, ["Eis", "enron"]],
    [Id.toppo, ["Topp", "oppo"]],
    [Id.ginyu, ["Gin", "yu"]],
    [Id.frieza, ["Frie", "ieza"]],
    [Id.omegaShenron, ["Omega", "enron"]],
    [Id.dyspo, ["Dys", "yspo"]],
    [Id.krillin, ["Krill", "illin"]],
    [Id.yamchaR, ["Yam", "cha"]],
    [Id.guldo, ["Gul", "uldo"]],
    [Id.jiren, ["Jir", "iren"]],
    [Id.roshi, ["Rosh", "oshi"]],
    [Id.zamasu, ["Zama", "amasu"]],
    [Id.allMight, ["All Mi", "might"]],
    [Id.sephiroth, ["Seph", "phiroth"]],
    [Id.hit, ["Hit", "it"]],
    [Id.mario, ["Mar", "rio"]],
    [Id.tien, ["Ti", "en"]],
    [Id.ichigo, ["Ichi", "chigo"]],
    [Id.dartFeld, ["Dart", "feld"]],
    [Id.rustTyranno, ["Rusty", "yranno"]],
    [Id.crono, ["Cron", "no"]],
    [Id.frog, ["Fro", "glenn"]],
    [Id.magus, ["Mag", "anus"]],
    [Id.lucca, ["Lucc", "ucca"]],
    [Id.ayla, ["Ayl", "yla"]],
    [Id.marle, ["Mar", "le"]],
    [Id.lucario, ["Lucar", "cario"]],
    [Id.saitama, ["Saita", "tama"]],
    [Id.donkeyKong, ["Donkey", "ey Kong"]],
    [Id.hirudegarn, ["Hirude", "degarn"]],
    [Id.super17, ["Super Andro", "droid 17"]],
    [Id.schala, ["Scha", "ala"]],
    [Id.shotoTodoroki, ["Shoto Todo", "doroki"]],
    [Id.skurvy, ["Kaptain Skur", "kurvy"]],
    [Id.sonic, ["Son", "nic"]],
    [Id.appule, ["App", "ppule"]],
    [Id.guts, ["Gu", "uts"]],
    [Id.jaco, ["Jac", "aco"]],
    [Id.waluigi, ["Wal", "luigi"]],
    [Id.gokuBlack, ["Goku Bla", "lack"]],
    [Id.getiStarHero, ["Big Geti", "eti Star"]],
    [Id.leonSKennedy, ["Leon S", "ennedy"]],
    [Id.megumin, ["Megu", "gumin"]],
    [Id.pecorine, ["Peco", "orine"]],
    [Id.dende, ["Dend", "ende"]],
    [Id.linkTwilight, ["Lin", "ink"]],
    [Id.cellMax, ["Cell Ma", "max"]],
    [Id.ainzOoalGown, ["Ainz Ooal Go", "oal Gown"]],
    [Id.albedo, ["Albe", "bedo"]],
    [Id.shalltearBloodfallen, ["Shalltear Blood", "loodfallen"]],
    [Id.demiurge, ["Demiur", "miurge"]],
    [Id.vegetaMajin, ["Majin Veg", "geta"]],
    [Id.minato, ["Mina", "nato Namikaze"]],
    [Id.mightGuy, ["Might", "ight Guy"]],
    [Id.genos, ["Geno", "enos"]],
    [Id.tatsumaki, ["Tatsu", "sumaki"]],
    [Id.granolah, ["Grano", "nolah"]],
    [Id.whis, ["Whi", "his"]],
    [Id.beerus, ["Beer", "eerus"]],
    [Id.gojo, ["Goj", "jo Satoru"]],
    [Id.cheongMyeong, ["Cheong", "myeong"]],
    [Id.aggronor, ["Aggro", "ggronor"]],
  ])
  public static getSpecialFusionName(unit1: unit, unit2: unit) {
    const unit1Id = GetUnitTypeId(unit1);
    const unit2Id = GetUnitTypeId(unit2);
    if (unit1Id == Id.goku && unit2Id == Id.vegeta) return "Gogeta";
    if (unit1Id == Id.vegeta && unit2Id == Id.goku) return "Vegito";
    if (unit1Id == Id.cellPerfect && unit2Id == Id.frieza) return "Cellza";
    if (unit1Id == Id.cellMax && unit2Id == Id.frieza) return "Cellza Max";
    return "";
  }
  public static getUnitFusionName(unit: unit, index: number) {
    const mappedName = FusionUnit.unitFusionNameMap.get(GetUnitTypeId(unit));
    if (mappedName && mappedName.length > index) {
      return mappedName[index];
    }

    const name = GetHeroProperName(unit);
    if (name.includes(" ")) {
      const words = name.split(" ");
      const halfSize = Math.floor(words.length/2);
      const startIndex = index == 0 ? 0 : halfSize;
      return words.splice(startIndex, words.length-halfSize).join(" ") + " ";
    } else {
      const halfSize = Math.floor(name.length/2);
      const startIndex = index == 0 ? 0 : halfSize;
      const endIndex = index == 0 ? halfSize+1 : name.length;
      return name.substring(startIndex, endIndex);
    }
  }
  
  public updateTimer: timer = TimerManager.getInstance().get();
  public offsetAng: number = 0;

  constructor(
    public unit1: unit,
    public unit2: unit
  ) {
    this.initialize();
  }

  replaceEarring(unit: unit) {
    let it = GetItemOfTypeFromUnitBJ(unit, ItemConstants.potaraEarrings);
    if (it) RemoveItem(it);
    it = CreateItem(ItemConstants.potaraFusion, GetUnitX(unit), GetUnitY(unit));
    UnitAddItem(unit, it);
  }

  fuseNames(unit1: unit, unit2: unit) {
    const specialName = FusionUnit.getSpecialFusionName(unit1, unit2);
    const fusedName = specialName != "" ?
      specialName :
      FusionUnit.getUnitFusionName(unit1, 0) + FusionUnit.getUnitFusionName(unit2, 1)
    ;
    BlzSetHeroProperName(unit1, fusedName);
    BlzSetHeroProperName(unit2, fusedName);
    const p1 = GetOwningPlayer(unit1);
    const p2 = GetOwningPlayer(unit2);
    SetPlayerName(p1, fusedName + " (" + udg_OriginalPlayerNames[GetPlayerId(p1)] + ")");
    SetPlayerName(p2, fusedName + " (" + udg_OriginalPlayerNames[GetPlayerId(p2)] + ")");
  }

  initialize() {
    this.fuseNames(this.unit1, this.unit2);
    UnitAddAbility(this.unit1, FusionUnit.FUSION_FLAG);
    UnitAddAbility(this.unit2, FusionUnit.FUSION_FLAG);

    UnitAddAbility(this.unit2, Id.ghostVisible);
    this.replaceEarring(this.unit1);
    this.replaceEarring(this.unit2);

    const unit1Id = GetHandleId(this.unit1);
    const unit2Id = GetHandleId(this.unit2);
    SaveUnitHandle(Globals.genericDDSHashtable, unit1Id, FusionUnit.FUSION_PAIR_UNIT_KEY, this.unit2);
    SaveUnitHandle(Globals.genericDDSHashtable, unit2Id, FusionUnit.FUSION_PAIR_UNIT_KEY, this.unit1);

    SaveInteger(Globals.genericSpellHashtable, unit1Id, FusionUnit.FUSION_SIDE_KEY, 0);
    SaveInteger(Globals.genericSpellHashtable, unit2Id, FusionUnit.FUSION_SIDE_KEY, 1);
    
    TimerStart(this.updateTimer, 0.03, true, () => {
      Globals.tmpVector.setUnit(this.unit1);
      Globals.tmpVector2.polarProjectCoords(Globals.tmpVector, this.offsetAng, 128);
      PathingCheck.moveFlyingUnitToCoord(this.unit2, Globals.tmpVector2);

      SetUnitPathing(this.unit2, false);
      if (
        UnitHelper.isUnitAlive(this.unit1)
        && UnitHelper.isUnitAlive(this.unit2)
      ) {
        SetUnitLifePercentBJ(this.unit2, GetUnitLifePercent(this.unit1));
      }
    });

    TransformationSystem.getInstance().autoTransformPlayerUnit(
      GetOwningPlayer(this.unit1), this.unit1
    );
    TransformationSystem.getInstance().setTransformSkin(this.unit2, Constants.dummyBeamUnitId);
    TransformationSystem.getInstance().autoTransformPlayerUnit(
      GetOwningPlayer(this.unit2), this.unit2
    );
  }

  recycle() {
    TimerManager.getInstance().recycle(this.updateTimer);
  }
};