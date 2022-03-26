import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { AbilityComponentHelper } from "./AbilityComponentHelper";
import { AddableComponent } from "./AddableComponent";

export class AOEApplyComponent implements 
  AbilityComponent, 
  Serializable<AOEApplyComponent>,
  AddableComponent 
{

  protected sourceCoords: Vector2D;
  protected affectedGroup: group;

  constructor(
    public name: string = "AOEApplyComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public aoe: number = 900,
    public affectsNonSummons: boolean = false,
    public affectsNonHeroes: boolean = false,
    public affectsAllies: boolean = false,
    public components: AbilityComponent[] = [],
  ) {
    this.sourceCoords = new Vector2D();
    this.affectedGroup = CreateGroup();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoords.setUnit(source);

    GroupEnumUnitsInRange(
      this.affectedGroup, 
      this.sourceCoords.x, 
      this.sourceCoords.y, 
      this.aoe, 
      null
    );

    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (
        UnitHelper.isUnitAlive(target) &&
        IsUnitAlly(target, input.casterPlayer) && 
        (IsUnitType(target, UNIT_TYPE_HERO) || this.affectsNonHeroes) && 
        (IsUnitType(target, UNIT_TYPE_SUMMONED) || this.affectsNonSummons) &&
        (IsUnitOwnedByPlayer(target, input.casterPlayer) || this.affectsAllies)
      ) {
        for (const component of this.components) {
          if (ability.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
            component.performTickAction(ability, input, target);
          }
        }
      }
    })
    
    GroupClear(this.affectedGroup);
  }

  cleanup() {
    for (const component of this.components) {
      component.cleanup();
    }
    this.components.splice(0, this.components.length);
    DestroyGroup(this.affectedGroup);
  }
  

  clone(): AbilityComponent {
    return new AOEApplyComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.aoe, this.affectsNonSummons, this.affectsNonHeroes, this.affectsAllies, 
      AbilityComponentHelper.clone(this.components)
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      aoe: number;
      affectsNonSummons: boolean;
      affectsNonHeroes: boolean;
      affectsAllies: boolean;
      components: {
        name: string,
      }[];
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.aoe = input.aoe;
    this.affectsNonSummons = input.affectsNonSummons;
    this.affectsNonHeroes = input.affectsNonHeroes;
    this.affectsAllies = input.affectsAllies;
    return this;
  }
  
  addComponent(component: AbilityComponent) {
    return this.components.push(component);
  }
}