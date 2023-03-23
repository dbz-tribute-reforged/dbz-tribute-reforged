import { DualTech } from "./DualTech";
import { DualTechPart } from "./DualTechPart";
import { DualTechList } from "./DualTechList";
import { DualTechPartList } from "./DualTechPartList";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class DualTechManager {
  private static instance: DualTechManager; 
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DualTechManager();
    }
    return this.instance;
  }

  public dualTechParts: Map<string, DualTechPart> = new Map();
  public dualTechMap: Map<number, DualTech> = new Map();

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
      this.dualTechMap.set(dt.sourceAbility, dt);
    }
  }

  has(abilityId: number): boolean {
    return this.dualTechMap.has(abilityId);
  }

  execute(abilityId: number, input: CustomAbilityInput): boolean {
    const dt = this.dualTechMap.get(abilityId);
    if (dt) {
      return dt.execute(input);
    }
    return false;
  }
}