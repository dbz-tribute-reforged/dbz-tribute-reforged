import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class Deflector implements AbilityComponent, Serializable<Deflector> {

  protected sourceCoord: Vector2D;
  protected targetCoord: Vector2D;

  protected affectedGroup: group;

  constructor(
    public name: string = "Deflector",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public aoe: number = 300,
    public extraAngle: number = 0,
    public affectAllies: boolean = false,
  ) {
    this.sourceCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.affectedGroup = CreateGroup();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));
    GroupEnumUnitsInRange(
      this.affectedGroup, 
      this.sourceCoord.x, 
      this.sourceCoord.y, 
      this.aoe,
      null
    );

    ForGroup(this.affectedGroup, () => {
      const target = GetEnumUnit();
      if (UnitHelper.isUnitTargetableForPlayer(target, input.casterPlayer, this.affectAllies)) {
        this.targetCoord.x = GetUnitX(target);
        this.targetCoord.y = GetUnitY(target);
        const deflectionAngle = this.extraAngle + 
          CoordMath.angleBetweenCoords(this.sourceCoord, this.targetCoord);
        SetUnitTurnSpeed(target, 999);
        SetUnitFacing(target, deflectionAngle);
        SetUnitTurnSpeed(target, GetUnitDefaultTurnSpeed(target));
      }
    });
    GroupClear(this.affectedGroup);
  }

  cleanup() {
    DestroyGroup(this.affectedGroup);
  }
  

  clone(): AbilityComponent {
    return new Deflector(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.aoe, this.extraAngle, this.affectAllies,
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      aoe: number;
      extraAngle: number;
      affectAllies: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.aoe = input.aoe;
    this.extraAngle = input.extraAngle;
    this.affectAllies = input.affectAllies;
    return this;
  }
}