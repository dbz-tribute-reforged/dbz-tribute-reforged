import { DualTech } from "./DualTech";
import { DualTechPart } from "./DualTechPart";
import { DualTechList } from "./DualTechList";
import { DualTechPartList } from "./DualTechPartList";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Globals } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";

export class DualTechManager {
  private static instance: DualTechManager; 
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DualTechManager();
    }
    return this.instance;
  }

  public dualTechParts: Map<string, DualTechPart> = new Map();
  public dualTechMap: Map<number, Map<string, DualTech>> = new Map();

  constructor() {


    for (const data of DualTechPartList) {
      const dtp = DualTechPart.deserialize(data);
      this.dualTechParts.set(dtp.name, dtp);
    }


    for (const data of DualTechList) {
      const dt = DualTech.deserialize(data);
      for (const part of data.parts) {
        const getPart = this.dualTechParts.get(part.name);
        if (getPart) {
          dt.addPart(getPart.clone());
        }
      }
      if (!this.dualTechMap.has(dt.sourceAbility)) {
        this.dualTechMap.set(dt.sourceAbility, new Map());
      }
      const arr = this.dualTechMap.get(dt.sourceAbility);
      arr.set(dt.name, dt);
    }
  }

  has(abilityId: number): boolean {
    return this.dualTechMap.has(abilityId);
  }

  execute(abilityId: number, input: CustomAbilityInput): boolean {
    const dtMap = this.dualTechMap.get(abilityId);
    if (!dtMap) return false;
    
    let useOnEmpty = false;
    for (const dt of dtMap.values()) {
      if (dt.useOriginalOnEmpty) useOnEmpty = true;
      const count = dt.execute(input);
      if (count > 0) {
        if (dt.replaceAbilityName) {
          input.caster.useAbility(dt.replaceAbilityName, input);
          if (Globals.showAbilityFloatingText) {
            TextTagHelper.showPlayerColorTextOnUnit(
              dt.replaceAbilityName, 
              GetPlayerId(input.casterPlayer), 
              GetTriggerUnit()
            );
          }
        }
        return dt.useOriginalAbility;
      }
    }
    return useOnEmpty;
  }
}