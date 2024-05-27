import { CustomHeroAbilityManager } from "CustomHero/CustomHeroAbilityManager";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { CastTimeHelper } from "./CastTimeHelper";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { AbilityComponentHelper } from "CustomAbility/AbilityComponent/AbilityComponentHelper";
import { HeroAbilitiesList } from "./HeroData/HeroAbilitiesList";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { HeroPassive, HeroPassiveManager } from "./HeroPassive/HeroPassive";
import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { Constants, Id, Globals } from "Common/Constants";
import { UnitHelper } from "Common/UnitHelper";
import { MinimapHelper } from "Common/MinimapHelper";

export class CustomHero {
  public abilities: CustomHeroAbilityManager;
  public isCasting: Map<CustomAbility, boolean>;

  public channelFlag: boolean;
  public channelAbilityId: number;
  public isCastTimeWaiting: boolean;
  public spellPower: number;
  public currentSp: number;
  public maxSp: number;

  public passiveTrigger: trigger[];
  public timers: timer[];

  public minimapIconBG: minimapicon;
  public minimapIcon: minimapicon;

  public teamSfx: effect;

  constructor(
    public readonly unit: unit,
  ) {
    // remove these defaults for actual heroes, i think
    this.abilities = new CustomHeroAbilityManager(
      [
        
      ]
    );
    this.isCasting = new Map();
    
    this.channelFlag = false;
    this.channelAbilityId = Id.goku;
    this.isCastTimeWaiting = false;
    this.spellPower = 1.0;
    this.currentSp = Constants.BASE_STAMINA;
    this.maxSp = Constants.BASE_STAMINA;

    const id = GetUnitTypeId(unit);
    if (
      IsUnitType(unit, UNIT_TYPE_SUMMONED)
      && id != Id.babidiDaburaUnit 
      && id != Id.babidiYakonUnit
    ) {
      this.currentSp *= 0.55;
      this.maxSp *= 0.55;
    }

    this.passiveTrigger = [];
    this.timers = [];

    const cancelChannelTrigger = CreateTrigger();
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_SPELL_FINISH);
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_ISSUED_ORDER);
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_ISSUED_POINT_ORDER);
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_ISSUED_TARGET_ORDER);
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_DEATH);
    TriggerRegisterUnitEvent(cancelChannelTrigger, unit, EVENT_UNIT_SPELL_ENDCAST);
    TriggerAddCondition(cancelChannelTrigger, Condition(() => {
      this.channelFlag = false;
      this.channelAbilityId = Id.goku;
      return false;
    }));
    this.passiveTrigger.push(cancelChannelTrigger);
    
    const startChannelTrigger = CreateTrigger();
    TriggerRegisterUnitEvent(startChannelTrigger, unit, EVENT_UNIT_SPELL_CHANNEL);
    TriggerRegisterUnitEvent(startChannelTrigger, unit, EVENT_UNIT_SPELL_EFFECT);
    TriggerAddCondition(startChannelTrigger, Condition(() => {
      this.channelFlag = true;
      this.channelAbilityId = GetSpellAbilityId();
      return false;
    }));
    this.passiveTrigger.push(startChannelTrigger);

    // TODO: assign basic abilities to all heroes
    // then read some data and apply special abilities for
    // relevant heroes
    const playerId = GetPlayerId(GetOwningPlayer(unit));

    if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
      for (let i = 0; i < Globals.customPlayers[playerId].abilityButtons.length; ++i) {
        this.addAbilityFromAll(Globals.customPlayers[playerId].abilityButtons[i].name);
      }
    } else {
      this.addAbilityFromAll(AbilityNames.BasicAbility.ZANZO_DASH);
      this.addAbilityFromAll(AbilityNames.BasicAbility.GUARD);
      this.addAbilityFromAll(AbilityNames.BasicAbility.MAX_POWER);
      this.addAbilityFromAll(AbilityNames.BasicAbility.DEFLECT);
    }

    // if (id == Id.minato) {
    //   this.addAbilityFromAll(AbilityNames.Minato.HIRAISHIN_ZANZO);
    // } else {
    //   if (
    //     playerId >= 0 
    //     && playerId < Constants.maxActivePlayers 
    //     && Globals.customPlayers[playerId].useZanzoDash
    //   ) {
    //     this.addAbilityFromAll(AbilityNames.BasicAbility.ZANZO_DASH);
    //   } else {
    //     this.addAbilityFromAll(AbilityNames.BasicAbility.ZANZOKEN);
    //   }
    // }
    // this.addAbilityFromAll(AbilityNames.BasicAbility.GUARD);

    // if (id == Id.cellPerfect) {
    //   this.addAbilityFromAll(AbilityNames.Cell.SUPER_CHARGE);
    // } else {
    //   this.addAbilityFromAll(AbilityNames.BasicAbility.MAX_POWER);
    // }

    // if (id == Id.donkeyKong) {
    //   this.addAbilityFromAll(AbilityNames.DonkeyKong.THRILLA_GORILLA);
    // } else if (id == Id.genos) {
    //   this.addAbilityFromAll(AbilityNames.Genos.STAND_UP);
    // } else {
    //   this.addAbilityFromAll(AbilityNames.BasicAbility.DEFLECT);
    // }
    
    // TODO: fix item abilities for heroes... 
    // item workaround.... for now
    this.addAbilityFromAll(AbilityNames.Items.ANDROID_BOMB);
    this.addAbilityFromAll(AbilityNames.Items.GETI_STAR_FRAGMENT);
    this.addAbilityFromAll(AbilityNames.Items.EIS_RAYS);
    this.addAbilityFromAll(AbilityNames.Items.NUOVA_HEAT_ARMOR);
    this.addAbilityFromAll(AbilityNames.Items.KING_COLD_ARMOR);
    this.addAbilityFromAll(AbilityNames.Items.CELL_MAX_WINGS);

    const unitTypeId = GetUnitTypeId(unit);

    const abilities = HeroAbilitiesList.get(unitTypeId);
    if (abilities) {
      for (const ability of abilities) {
        this.addAbilityFromAll(ability);
      }
    }

    HeroPassiveManager.getInstance().setupHero(this);

    if (
      UnitHelper.isUnitRealHero(unit)
      && playerId >= 0 
      && playerId < Constants.maxActivePlayers
    ) {
      this.minimapIconBG = CreateMinimapIconOnUnit(
        unit, 255, 255, 255, 
        MinimapHelper.getMinimapIconBG(unit),
        FOG_OF_WAR_VISIBLE 
      );
      this.minimapIcon = CreateMinimapIconOnUnit(
        unit, 255, 255, 255, 
        MinimapHelper.getMinimapIcon(unit),
        FOG_OF_WAR_VISIBLE 
      );
    } else {
      this.minimapIconBG = null;
      this.minimapIcon = null;
    }

    this.teamSfx = null;
    this.setTeamSfx();
  }

  public resetTeamSfx() {
    if (this.teamSfx) DestroyEffect(this.teamSfx);
    this.setTeamSfx();
  }

  public setTeamSfx() {
    const player = GetOwningPlayer(this.unit);
    const playerId = GetPlayerId(player);
    if (playerId >= Constants.maxActivePlayers) return;

    let isTeam1 = false;
    for (const p of Constants.defaultTeam1) {
      if (p == player) isTeam1 = true;
    }
    this.teamSfx = AddSpecialEffect(
      isTeam1 ? 
        "Spell_Marker_Red.mdl" : 
        "Spell_Marker_Blue.mdl"
      ,
      GetUnitX(this.unit),
      GetUnitY(this.unit),
    );
    BlzSetSpecialEffectScale(this.teamSfx,
      Math.max(1, Math.min(4, 
        BlzGetUnitRealField(this.unit, UNIT_RF_SELECTION_SCALE)
      ))
    );
  }

  public addAbilityFromAll(name: string) {
    const abil = CustomAbilityManager.getInstance().getAbility(name);
    if (abil) {
      // possiblity that ability was not fully copied correctly
      const abilCopy = new CustomAbility(
        abil.name, 0, abil.maxCd, abil.costType, 
        abil.costAmount, abil.duration,
        abil.updateRate, abil.castTime, 
        abil.canMultiCast, abil.waitsForNextClick,
        abil.canUseWhenStunned,
        abil.animation, abil.icon, abil.tooltip,
        AbilityComponentHelper.clone(abil.components),
      )
      this.abilities.add(abilCopy.name, abilCopy);
    }
    return (abil != undefined);
  }

  public useAbility(name: string, input: CustomAbilityInput) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(input, false, false)) {
      if (
        !this.isCastTimeWaiting 
        || customAbility.canMultiCast
        || this.isCasting.has(customAbility) // cast yourself again is okay, but not others
      ) {
        this.isCastTimeWaiting = true;
        this.isCasting.set(customAbility, true);
        CastTimeHelper.getInstance().waitCastTimeThenActivate(this, customAbility, input);
      }
    }
  }

  public canCastAbility(name: string, input: CustomAbilityInput): boolean {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility) {
      return customAbility.canCastAbility(input);
    }
    return false;
  }

  public getAbilityByIndex(index: number): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByIndex(index);
  }

  public getNumAbilities(): number {
    return this.abilities.size();
  }

  public hasAbility(name: string): boolean {
    return this.abilities.hasAbility(name);
  }

  public getAbility(name: string): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByName(name);
  }

  public getCustomAbilities(): IterableIterator<CustomAbility> {
    return this.abilities.getCustomAbilities();
  }

  public addAbility(name: string, ability: CustomAbility): this {
    this.abilities.add(name, ability);
    return this;
  }

  public addSpellPower(modifier: number) {
    this.spellPower += modifier;
  }
  
  public removeSpellPower(modifier: number) {
    this.spellPower -= modifier;
  }

  public addPassiveTrigger(trig: trigger) {
    this.passiveTrigger.push(trig);
  }

  public addTimer(timer: timer) {
    this.timers.push(timer);
  }

  public setCurrentSP(sp: number) {
    if (sp < this.maxSp) {
      this.currentSp = sp;
    } else {
      this.currentSp = this.maxSp;
    }
  }

  public getCurrentSP(): number {
    return this.currentSp;
  }

  public getMaxSP(): number {
    return this.maxSp;
  }

  public setMaxSP(sp: number) {
    this.maxSp = sp;
  }

  public isChanneling(): boolean {
    return this.channelFlag;
  }

  public setIsChanneling(b: boolean): this {
    this.channelFlag = b;
    return this;
  }

  public forceEndAllAbilities() {
    for (const ability of this.abilities.getCustomAbilities()) {
      if (ability.isInUse()) {
        CastTimeHelper.getInstance().forceEndActivatedAbility(ability);
      }
    }
    // end stat mult transforms as well
    const unitId = GetHandleId(this.unit);
    const tmp = LoadReal(udg_StatMultHashtable, unitId, 9);
    if (tmp > 0) SaveReal(udg_StatMultHashtable, unitId, 9, 1);
  }

  public forceEndAbility(name: string) {
    const ability = this.abilities.getCustomAbilityByName(name);
    if (ability && ability.isInUse()) {
      CastTimeHelper.getInstance().forceEndActivatedAbility(ability);
    }
  }

  public isAbilityInUse(name: string) {
    const ability = this.abilities.getCustomAbilityByName(name);
    if (ability) {
      return ability.isInUse();
    }
    return false;
  }

  public resetMinimapIconBG() {
    if (this.minimapIconBG) DestroyMinimapIcon(this.minimapIconBG);
    this.minimapIconBG = CreateMinimapIconOnUnit(
      this.unit, 255, 255, 255, 
      MinimapHelper.getMinimapIconBG(this.unit),
      FOG_OF_WAR_FOGGED 
    );
  }

  public cleanup() {
    this.isCasting.clear();
    this.abilities.cleanup();
    for (const trig of this.passiveTrigger) {
      DestroyTrigger(trig);
    }
    for (const timer of this.timers) {
      DestroyTimer(timer);
    }
    const unitId = GetHandleId(this.unit);
    FlushChildHashtable(Globals.genericSpellHashtable, unitId);
    FlushChildHashtable(Globals.simpleSpellCDHashtable, unitId);
    if (this.minimapIconBG) DestroyMinimapIcon(this.minimapIconBG);
    if (this.minimapIcon) DestroyMinimapIcon(this.minimapIcon);
    if (this.teamSfx) {
      DestroyEffect(this.teamSfx);
      this.teamSfx = null;
    }
  }
}