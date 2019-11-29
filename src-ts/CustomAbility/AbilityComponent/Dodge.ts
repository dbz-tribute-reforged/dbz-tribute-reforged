import { AbilityComponent } from "./AbilityComponent";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { KnockbackData } from "Common/KnockbackData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";

export class Dodge implements AbilityComponent, Serializable<Dodge> {
  static readonly UNLIMITED_ENEMIES = -1;

  // dodge is knocking back the caster from enemy units in a given aoe
  constructor(
    public name: string = "Dodge",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public groundOnly: boolean = true,
    public knockbackData: KnockbackData = new KnockbackData(
      20, 0, 200
    ),
    public maxEnemies: number = 3,
    public addRandomAngle: boolean = false,
  ) {
    
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    const sourceCoord = new Vector2D(GetUnitX(source), GetUnitY(source));
    const affectedGroup = UnitHelper.getNearbyValidUnits(
      sourceCoord, 
      this.knockbackData.aoe,
      () => {
        return UnitHelper.isUnitTargetableForPlayer(source, GetOwningPlayer(GetFilterUnit()));
      }
    );
    
    let currentEnemies = 0;
    let dodgeVector = new Vector2D(0,0);

    ForGroup(affectedGroup, () => {
      if (currentEnemies < this.maxEnemies || this.maxEnemies == Dodge.UNLIMITED_ENEMIES) {
        const enemy = GetEnumUnit();
        const enemyCoord = new Vector2D(GetUnitX(enemy), GetUnitY(enemy));
        let dodgeAngle = CoordMath.angleBetweenCoords(enemyCoord, sourceCoord);
        if (this.addRandomAngle) {
          dodgeAngle += Math.random() * this.knockbackData.angle - 90;
        } else {
          dodgeAngle += this.knockbackData.angle;
        }
        const dodgeCoord = CoordMath.polarProjectCoords(sourceCoord, dodgeAngle, this.knockbackData.speed);
        dodgeVector.add(dodgeCoord);
        /*
        const newDodgeAngle = CoordMath.angleBetweenCoords(newSourceCoord, dodgeCoord);
        const newDodgeDistance = CoordMath.distance(newSourceCoord, dodgeCoord);
        newSourceCoord = CoordMath.polarProjectCoords(newSourceCoord, newDodgeAngle, newDodgeDistance / 2);
        */
        ++currentEnemies;
      }
    });

    if (currentEnemies > 0) {
      dodgeVector.x = dodgeVector.x / currentEnemies;
      dodgeVector.y = dodgeVector.y / currentEnemies;
      if (this.groundOnly) {
        PathingCheck.moveGroundUnitToCoord(source, dodgeVector);
      } else {
        PathingCheck.moveFlyingUnitToCoord(source, dodgeVector);
      }
    }
  }
  

  clone(): AbilityComponent {
    return new Dodge(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.groundOnly, this.knockbackData, 
      this.maxEnemies, this.addRandomAngle
    );
  }
  
  deserialize(
    input: { 
      name: string; 
      repeatInterval: number; 
      startTick: number;
      endTick: number;
      groundOnly: boolean;
      knockbackData: {
        speed: number; 
        angle: number; 
        aoe: number;
      }; 
      maxEnemies: number;
      addRandomAngle: boolean;
    }
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.groundOnly = input.groundOnly;
    this.knockbackData = new KnockbackData().deserialize(input.knockbackData);
    this.maxEnemies = input.maxEnemies;
    this.addRandomAngle = input.addRandomAngle;
    return this;
  }
}