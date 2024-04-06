import { Globals } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";
import { abilityCodesToNames } from "CustomAbility/AbilityCodesToNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class DualTechPart {

  public isStarted: boolean = false;

  constructor(
    public name: string,

    public reqUnitTypeId: number = 0,
    public reqAbilityId: number = 0,
    public forceCastAbilityName: string = "",

    public castNothing: boolean = false,
    public showForceCastText: boolean = false,
    public useReqAbilityLevel: boolean = false,
    public includeAllies: boolean = false,
    public setTargetUnitToSrcCaster: boolean = false,
    public applyCd: boolean = true,
    public applyOriginalCd: boolean = true,
    public cdPenalty: number = 0,
  ) {

  }

  isValid(input: CustomAbilityInput, u: unit): boolean {
    if (this.isStarted) return false;
    if (!IsUnitAlly(u, input.casterPlayer)) return false;
    if (GetOwningPlayer(u) != input.casterPlayer) {
      if (!this.includeAllies) return false;
      // check owning player for dual tech receive flag
      const playerId = GetPlayerId(GetOwningPlayer(u));
      if (!Globals.customPlayers[playerId].dualTechReceiveFlag) return false;
    }
    return (
      (
        this.reqUnitTypeId != 0
        && GetUnitTypeId(u) == this.reqUnitTypeId
      )
      || 
      (
        this.reqAbilityId != 0
        && GetUnitAbilityLevel(u, this.reqAbilityId) > 0
        && BlzGetUnitAbilityCooldownRemaining(u, this.reqAbilityId) <= 0
      )
    );
  }
  
  execute(input: CustomAbilityInput, source: unit) {
    // do somethin
    this.isStarted = true;
 
    let abilityName = this.forceCastAbilityName;

    const sourcePlayer = GetOwningPlayer(source);
    const sourcePlayerId = GetPlayerId(sourcePlayer);

    const customHero = Globals.customPlayers[sourcePlayerId].getCustomHero(source);

    if (customHero) {
      let casted = this.castNothing;
      if (!this.castNothing) {
        if (abilityName == "") {
          abilityName = abilityCodesToNames.get(this.reqAbilityId);
        }
        const abil = customHero.getAbility(abilityName);
        if (abil && abil.canCastAbility(input)) {
          const input2 = input.clone();
          input2.caster = customHero;
          if (this.useReqAbilityLevel) input2.level = GetUnitAbilityLevel(source, this.reqAbilityId);
          if (this.setTargetUnitToSrcCaster) input2.targetUnit = input.caster.unit;
          customHero.useAbility(abilityName, input2);
  
          if (Globals.showAbilityFloatingText) {
            // show ability name on activation
            TextTagHelper.showPlayerColorTextOnUnit(
              abilityName, 
              sourcePlayerId, 
              source
            );
          }
          casted = true;
        }
      }

      if (this.applyCd && this.reqAbilityId != 0) {
        let newCd = 0;
        if (this.applyOriginalCd) {
          newCd = BlzGetAbilityCooldown(
            this.reqAbilityId,
            GetUnitAbilityLevel(source, this.reqAbilityId)-1
          );
        }
        if (this.cdPenalty != 0) newCd += this.cdPenalty;
        if (newCd > 0) {
          BlzStartUnitAbilityCooldown(source, this.reqAbilityId, newCd);
        }
      }
      return casted;
    }
    return false;
  }

  reset() {
    this.isStarted = false;
  }

  clone(): DualTechPart {
    return new DualTechPart(
      this.name,
      this.reqUnitTypeId,
      this.reqAbilityId,
      this.forceCastAbilityName,
      this.castNothing,
      this.showForceCastText,
      this.useReqAbilityLevel,
      this.includeAllies,
      this.setTargetUnitToSrcCaster,
      this.applyCd,
      this.applyOriginalCd,
      this.cdPenalty,
    );
  }

  static deserialize(
    input: { 
      name: string; 
      reqUnitTypeId: number;
      reqAbilityId: number;
      forceCastAbilityName: string;
      castNothing: boolean;
      showForceCastText: boolean;
      useReqAbilityLevel: boolean;
      includeAllies: boolean;
      setTargetUnitToSrcCaster: boolean;
      applyCd: boolean;
      applyOriginalCd: boolean;
      cdPenalty: number;
    }
  ) {
    const dtp = new DualTechPart(input.name);
    dtp.reqUnitTypeId = input.reqUnitTypeId;
    dtp.reqAbilityId = input.reqAbilityId;
    dtp.forceCastAbilityName = input.forceCastAbilityName;
    dtp.castNothing = input.castNothing;
    dtp.showForceCastText = input.showForceCastText;
    dtp.useReqAbilityLevel = input.useReqAbilityLevel;
    dtp.includeAllies = input.includeAllies;
    dtp.setTargetUnitToSrcCaster = input.setTargetUnitToSrcCaster;
    dtp.applyCd = input.applyCd;
    dtp.applyOriginalCd = input.applyOriginalCd;
    dtp.cdPenalty = input.cdPenalty;
    return dtp;
  }
}