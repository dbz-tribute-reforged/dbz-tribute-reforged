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

  protected sourceCoord: Vector2D;
  protected dodgeCoord: Vector2D;
  protected dodgeDirection: Vector2D;

  protected affectedGroup: group;

  public isStarted: boolean = false;
  public isFinished: boolean = true;

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
    public ignoreHeroes: boolean = false,
  ) {
    this.sourceCoord = new Vector2D();
    this.dodgeCoord = new Vector2D();
    this.dodgeDirection = new Vector2D();
    this.affectedGroup = CreateGroup();
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.isFinished = false;
    }
    
    this.sourceCoord.setPos(GetUnitX(source), GetUnitY(source));

    GroupEnumUnitsInRange(
      this.affectedGroup, 
      this.sourceCoord.x, 
      this.sourceCoord.y, 
      this.knockbackData.aoe,
      null
    );
    
    let currentEnemies = 0;
    this.dodgeDirection.setPos(0,0);

    ForGroup(this.affectedGroup, () => {
      const enemy = GetEnumUnit();
      if (UnitHelper.isUnitAlive(enemy) && UnitHelper.isUnitTargetableForPlayer(source, GetOwningPlayer(enemy))) {
        if (currentEnemies < this.maxEnemies || this.maxEnemies == Dodge.UNLIMITED_ENEMIES) {
          if (!IsUnitType(enemy, UNIT_TYPE_HERO) || !this.ignoreHeroes) {
            const enemyCoord = new Vector2D(GetUnitX(enemy), GetUnitY(enemy));
            let dodgeAngle = CoordMath.angleBetweenCoords(enemyCoord, this.sourceCoord);
            if (this.addRandomAngle) {
              dodgeAngle += Math.random() * this.knockbackData.angle - this.knockbackData.angle / 2;
            } else {
              dodgeAngle += this.knockbackData.angle;
            }
            this.dodgeCoord.polarProjectCoords(this.sourceCoord, dodgeAngle, this.knockbackData.speed);
            this.dodgeDirection.add(this.dodgeCoord);
            ++currentEnemies;
          }
        }
      }
    });

    GroupClear(this.affectedGroup);

    if (currentEnemies > 0) {
      this.dodgeDirection.x = this.dodgeDirection.x / currentEnemies;
      this.dodgeDirection.y = this.dodgeDirection.y / currentEnemies;
      if (this.groundOnly) {
        PathingCheck.moveGroundUnitToCoord(source, this.dodgeDirection);
      } else {
        PathingCheck.moveFlyingUnitToCoord(source, this.dodgeDirection);
      }
    }

    
    if (ability.isFinishedUsing(this)) {
      this.isStarted = false;
      this.isFinished = true;
    }
  }

  cleanup() {
    DestroyGroup(this.affectedGroup);
  }
  

  clone(): AbilityComponent {
    return new Dodge(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.groundOnly, this.knockbackData, 
      this.maxEnemies, this.addRandomAngle,
      this.ignoreHeroes,
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
      ignoreHeroes: boolean;
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
    this.ignoreHeroes = input.ignoreHeroes;
    return this;
  }
}