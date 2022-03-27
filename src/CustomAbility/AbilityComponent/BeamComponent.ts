import { AbilityComponent, ComponentConstants } from "./AbilityComponent";
import { HeightVariation } from "Common/HeightVariation";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CustomAbility } from "CustomAbility/CustomAbility";
import { CoordMath } from "Common/CoordMath";
import { PathingCheck } from "Common/PathingCheck";
import { AbilityComponentHelper } from "./AbilityComponentHelper";
import { AddableComponent } from "./AddableComponent";
import { Constants, Id } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";

export class BeamComponent implements 
  AbilityComponent, 
  Serializable<BeamComponent>,
  AddableComponent
{
  static readonly BEAM_UNIT_SPAWN_CASTER = 0;
  static readonly BEAM_UNIT_SPAWN_SOURCE = 1;
  static readonly BEAM_UNIT_SPAWN_TARGET = 2;
  static readonly BEAM_UNIT_SPAWN_TARGET_UNIT = 3;
  static readonly BEAM_UNIT_SPAWN_BEAM = 4;

  static readonly BEAM_HP_MODIFIER = 0.75;

  static readonly BEAM_SPEED_ULTRA_SLOW = 25;
  static readonly BEAM_SPEED_SUPER_SLOW = 30;
  static readonly BEAM_SPEED_VERY_SLOW = 35;
  static readonly BEAM_SPEED_SLOW = 40;
  static readonly BEAM_SPEED_MEDIUM_SLOW = 45;
  static readonly BEAM_SPEED_MEDIUM = 50;
  static readonly BEAM_SPEED_MEDIUM_FAST = 55;
  static readonly BEAM_SPEED_FAST = 60;
  static readonly BEAM_SPEED_VERY_FAST = 65;
  static readonly BEAM_SPEED_SUPER_FAST = 70;

  static readonly BEAM_STUCK_DELAY_TICKS = 16;

  public beamUnit: unit | null;
  public delayTicks: number;
  public angle: number;
  public previousHp: number;
  protected hasBeamUnit: boolean;
  protected beamCoord: Vector2D;
  protected targetCoord: Vector2D;
  protected beamTargetPoint: Vector2D;
  protected nextMoveTick: number;
  protected boundaryTicks: number;
  // time to explode = 
  // distance from start position to cast point
  // divided by speed
  protected explodeTick: number;
  protected explodeMinDistance: number;
  protected explodePosition: Vector2D;
  protected forcedExplode: boolean;
  protected hasExploded: boolean;
  protected beamClashGroup: group;


  protected oldIsBeamClash: boolean | undefined;


  constructor(
    public name: string = "BeamComponent",
    public repeatInterval: number = 1,
    public startTick: number = 0,
    public endTick: number = -1,
    public beamHpMult: number = 0.5,
    public beamHpAttribute: number = bj_HEROSTAT_INT,
    public speed: number = 16,
    public aoe: number = 250,
    public clashingDelayTicks: number = 1,
    public maxDelayTicks: number = 8,
    public durationIncPerDelay: number = 15,
    public boundaryRemoveDelay: number = 1,
    public turnSpeed: number = 0.1,
    public heightVariation: HeightVariation = new HeightVariation(
      250, 0, HeightVariation.LINEAR_VARIATION
    ),
    public isTracking: boolean = false,
    public isFixedAngle: boolean = true,
    public isGroundPathing: boolean = false,
    public canClashWithHero: boolean = true,
    public useLastCastPoint: boolean = true,
    public explodeAtCastPoint: boolean = false,
    public explodeOnDeath: boolean = false,
    public explodeOnContact: boolean = false,
    public setAsSpawnedBeam: boolean = false,
    public beamUnitSpawn: number = BeamComponent.BEAM_UNIT_SPAWN_SOURCE,
    public beamUnitType: number = Constants.dummyBeamUnitId,
    public beamUnitSkin: number = Constants.dummyBeamUnitId,
    public components: AbilityComponent[] = [],
  ) {
    this.beamUnit = null;
    this.delayTicks = 0;
    this.angle = 0;
    this.previousHp = 0;
    this.hasBeamUnit = false;
    this.beamCoord = new Vector2D();
    this.targetCoord = new Vector2D();
    this.beamTargetPoint = new Vector2D();
    this.nextMoveTick = 0;
    this.boundaryTicks = 0;
    this.explodeTick = 0;
    this.explodeMinDistance = 0;
    this.explodePosition = new Vector2D(0, 0);
    this.forcedExplode = false;
    this.hasExploded = false;
    this.beamClashGroup = CreateGroup();
  }

  protected checkForBeamClash(input: CustomAbilityInput): this {
    if (!this.beamUnit) return this;

    if (this.clashingDelayTicks > 0) {
      const currentHp = GetUnitState(this.beamUnit, UNIT_STATE_LIFE);

      GroupEnumUnitsInRange(
        this.beamClashGroup, 
        this.beamCoord.x, 
        this.beamCoord.y, 
        this.aoe,
        null
      );
      
      const numEnemyHeroes = UnitHelper.countEnemyHeroes(this.beamClashGroup, input.casterPlayer, false);
      
      const beamClashTest = (currentHp < this.previousHp && CountUnitsInGroup(this.beamClashGroup) > 0);
      
      if (
        this.explodeOnContact && 
        numEnemyHeroes > 0
      ) {
        this.forcedExplode = true;
      }

      if (
        (beamClashTest) || 
        (this.canClashWithHero && numEnemyHeroes > 0)
      ) {
        this.delayTicks = Math.min(this.maxDelayTicks, (this.delayTicks + this.clashingDelayTicks));

        if (beamClashTest) {
          input.isBeamClash = true;
        }
      }
      this.previousHp = currentHp;
      GroupClear(this.beamClashGroup);
    }
    return this;
  }

  protected moveBeamUnit(ability: CustomAbility, input: CustomAbilityInput): this {
    if (!this.beamUnit) return this;

    if (this.delayTicks <= 0) {
      if (ability.currentTick >= this.nextMoveTick) {
        if (!this.isFixedAngle) {
          this.angle = GetUnitFacing(this.beamUnit);
        }
        this.targetCoord.polarProjectCoords(this.beamCoord, this.angle, this.speed);
      
        let hasMoved = false;
        if (!this.isGroundPathing) {
          hasMoved = PathingCheck.moveFlyingUnitToCoord(this.beamUnit, this.targetCoord);
        } else {
          hasMoved = PathingCheck.moveGroundUnitToCoord(this.beamUnit, this.targetCoord);
        }

        if (!hasMoved) {
          this.nextMoveTick = ability.currentTick + BeamComponent.BEAM_STUCK_DELAY_TICKS;
        }

        if (!PathingCheck.isFlyingWalkable(this.targetCoord)) {
          this.boundaryTicks += 1;
        }
      }
      // if wanting to explode prematurely then
      // check if at maximal explode tick AND close enough to target
      if (
        this.explodeAtCastPoint && 
        !this.forcedExplode &&
        ability.currentTick > this.explodeTick &&
        CoordMath.distance(this.beamCoord, this.explodePosition) < this.explodeMinDistance
      ) {
        this.forcedExplode = true;
      }

      if (
        this.boundaryRemoveDelay > 0 && 
        !this.forcedExplode && 
        this.boundaryTicks >= this.boundaryRemoveDelay
      ) {
        this.forcedExplode = true;
      }

    } else {
      --this.delayTicks;
      // when delaying movement, if duration inc per delay > 0
      // there is a chance that the current tick is reduced by 1
      // i.e. total duration of beam is increased by 1
      // e.g. a durationIncPerDelay of 1, would on average 
      // increase the beam duration by 1 per 100 ticks
      // thus duractionIncPerDelay X produces a +X% incerease in total duration
      if (this.durationIncPerDelay > Math.random()*99 + 0.0001) {
        ability.reduceCurrentTick(1);
      }
    }

    // move beam unit on Z axis
    let finishHeightTick = this.endTick;
    if (this.explodeTick > 0) {
      finishHeightTick = this.explodeTick;
    }
    if (this.heightVariation.start >= 0) {
      SetUnitFlyHeight(
        this.beamUnit, 
        this.heightVariation.start + (
          (
            this.heightVariation.finish - this.heightVariation.start
          ) * 
          ability.calculateTimeRatio(this.startTick, finishHeightTick)
        ),
        0
      );
    }

    return this;
  }

  protected fakeExplode(ability: CustomAbility, input: CustomAbilityInput) {
    if (!this.beamUnit) return;

    const oldCurrentTick = ability.currentTick;
    if (this.endTick == -1) {
      ability.currentTick = ability.duration;
    } else {
      ability.currentTick = this.endTick;
    }
    for (const component of this.components) {
      if (ability.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
        component.performTickAction(ability, input, this.beamUnit);
      }
    }
    ability.currentTick = oldCurrentTick;
  }

  protected setupBeamUnit(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    this.boundaryTicks = 0;
    this.beamCoord.setPos(GetUnitX(source), GetUnitY(source));
    if (!this.useLastCastPoint) {
      this.beamTargetPoint.setVector(input.targetPoint);
    } else {
      this.beamTargetPoint.setVector(input.castPoint);
    }

    this.angle = CoordMath.angleBetweenCoords(this.beamCoord, this.beamTargetPoint);
    if (this.beamUnitSpawn == BeamComponent.BEAM_UNIT_SPAWN_SOURCE) {
      // move beam slightly out of the source unit
      this.beamCoord.polarProjectCoords(this.beamCoord, this.angle, Constants.beamSpawnOffset);
    } 
    else if (this.beamUnitSpawn == BeamComponent.BEAM_UNIT_SPAWN_TARGET) {
      this.beamCoord.setVector(this.beamTargetPoint);
    } 
    else if (this.beamUnitSpawn == BeamComponent.BEAM_UNIT_SPAWN_TARGET_UNIT) {
      if (input.targetUnit) {
        this.beamCoord.setPos(GetUnitX(input.targetUnit), GetUnitY(input.targetUnit));
      } else {
        this.beamCoord.setPos(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
        this.beamCoord.polarProjectCoords(this.beamCoord, this.angle, Constants.beamSpawnOffset);
      }
    } 
    else if (this.beamUnitSpawn == BeamComponent.BEAM_UNIT_SPAWN_CASTER) {
      // caster
      this.beamCoord.setPos(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      this.beamCoord.polarProjectCoords(this.beamCoord, this.angle, Constants.beamSpawnOffset);
    } 
    else if (this.beamUnitSpawn == BeamComponent.BEAM_UNIT_SPAWN_BEAM) {
      if (input.spawnedBeam) {
        this.beamCoord.setUnit(input.spawnedBeam);
        this.angle = CoordMath.angleBetweenCoords(this.beamCoord, this.beamTargetPoint);
      }
      this.beamCoord.polarProjectCoords(this.beamCoord, this.angle, Constants.beamSpawnOffset);
    }

    this.beamUnit = CreateUnit(
      input.casterPlayer, 
      this.beamUnitType, 
      this.beamCoord.x, 
      this.beamCoord.y, 
      this.angle,
    );
    BlzSetUnitSkin(this.beamUnit, this.beamUnitSkin);

    SetUnitTurnSpeed(this.beamUnit, this.turnSpeed);

    if (this.heightVariation.start >= 0) {
      UnitHelper.giveUnitFlying(this.beamUnit);
      SetUnitFlyHeight(this.beamUnit, this.heightVariation.start, 0);
    }
    
    let endHeightTick = this.endTick;
    if (this.endTick == -1) {
      endHeightTick = ability.duration;
    }

    if (this.explodeAtCastPoint) {
      this.explodePosition.setPos(input.castPoint.x, input.castPoint.y);

      this.explodeMinDistance = this.aoe * 0.5;

      this.explodeTick = ability.currentTick + Math.floor(
        CoordMath.distance(this.beamCoord, input.castPoint) / Math.floor(this.speed)
      )
      endHeightTick = this.explodeTick;
    }

    // SetUnitFlyHeight(
    //   this.beamUnit, 
    //   this.heightVariation.finish, 
    //   Math.abs(
    //     (this.heightVariation.finish - this.heightVariation.start) 
    //     / 
    //     ((endHeightTick - ability.currentTick) * ability.updateRate)
    //   ),
    // );
    // hp MUST be a multiple of 50??? or something
    // else it causes a crash / uncatched exception
    // and prevents the rest of the beam code from firing
    let maxHp = GetUnitState(this.beamUnit, UNIT_STATE_LIFE);

    maxHp = Math.max(
      50, 
      50 * 
      Math.floor(
        BeamComponent.BEAM_HP_MODIFIER * 
        input.level * 
        this.beamHpMult * 
        GetHeroStatBJ(this.beamHpAttribute, input.caster.unit, true)
      )
    );

    BlzSetUnitMaxHP(this.beamUnit, maxHp);
    // SetUnitState(this.beamUnit, UNIT_STATE_LIFE, maxHp);
    SetUnitLifePercentBJ(this.beamUnit, 100);
    this.previousHp = GetUnitState(this.beamUnit, UNIT_STATE_LIFE);
    BlzSetUnitName(this.beamUnit, this.name);

    // causes bug where the caster will be teleported southwards
    // most likely some sort of weird collision issue
    // SetUnitPathing(this.beamUnit, false);
    // UnitAddAbility(this.beamUnit, Id.ghostNonVis);
    // UnitAddAbility(this.beamUnit, Id.ghostVisible);
    
    if (!this.isTracking) {
      PauseUnit(this.beamUnit, true);
      // hidden units cannot be selected by GroupEnumUnit
      // hence beams cannot be hidden unless they are invulnerable
      // ShowUnit(this.beamUnit, false);
    } else {
      // possible selection bug again?
      // SelectUnitAddForPlayer(this.beamUnit, input.casterPlayer);
      if (input.castUnit) {
        IssueTargetOrder(this.beamUnit, "attack", input.castUnit);
      } else if (input.targetUnit) {
        IssueTargetOrder(this.beamUnit, "attack", input.targetUnit);
      } else {
        IssuePointOrder(this.beamUnit, "move", this.beamTargetPoint.x, this.beamTargetPoint.y);
      }
    }

    if (this.setAsSpawnedBeam) {
      input.spawnedBeam = this.beamUnit;
    }
  }
  
  performTickAction(ability: CustomAbility, input: CustomAbilityInput, source: unit) {
    if (!this.hasBeamUnit && !ability.isFinishedUsing(this)) {
      this.setupBeamUnit(ability, input, source);
      this.hasBeamUnit = true;
      this.nextMoveTick = ability.currentTick;
    }
    
    if (this.hasBeamUnit && !this.hasExploded && this.beamUnit) {
      const isBeamDead = UnitHelper.isUnitDead(this.beamUnit);
      if ((isBeamDead && this.explodeOnDeath) || this.forcedExplode) {
        this.hasExploded = true;
        this.fakeExplode(ability, input);
        this.removeBeamUnit();
      } else if (!isBeamDead) {
        this.beamCoord.setUnit(this.beamUnit);
        this.oldIsBeamClash = input.isBeamClash;
        this.checkForBeamClash(input);
        if (this.speed > 0) {
          this.moveBeamUnit(ability, input);
        }
        for (const component of this.components) {
          if (ability.isReadyToUse(component.repeatInterval, component.startTick, component.endTick)) {
            component.performTickAction(ability, input, this.beamUnit);
          }
        }
        input.isBeamClash = this.oldIsBeamClash;
      }
    }
    if (ability.isFinishedUsing(this)) {
      if (!this.hasExploded){
        if (this.explodeOnDeath) {
          this.fakeExplode(ability, input);
        }
        this.removeBeamUnit();
      }
      this.hasBeamUnit = false;
      this.forcedExplode = false;
      this.hasExploded = false;
    }
  }

  removeBeamUnit() {
    if (this.beamUnit) {
      if (GetUnitTypeId(this.beamUnit) != 0) {
        RemoveUnit(this.beamUnit);
      }
      this.beamUnit = null;
    }
  }

  cleanup() {
    this.removeBeamUnit();
    for (const component of this.components) {
      component.cleanup();
    }
    this.components.splice(0, this.components.length);
    DestroyGroup(this.beamClashGroup);
  }

  clone(): AbilityComponent {
    return new BeamComponent(
      this.name, this.repeatInterval, this.startTick, this.endTick, 
      this.beamHpMult, this.beamHpAttribute, 
      this.speed, this. aoe, this.clashingDelayTicks, this.maxDelayTicks,
      this.durationIncPerDelay, 
      this.boundaryRemoveDelay,
      this.turnSpeed,
      this.heightVariation, this.isTracking,
      this.isFixedAngle, this.isGroundPathing, 
      this.canClashWithHero, 
      this.useLastCastPoint, this.explodeAtCastPoint,
      this.explodeOnDeath,
      this.explodeOnContact,
      this.setAsSpawnedBeam,
      this.beamUnitSpawn,
      this.beamUnitType, this.beamUnitSkin,
      AbilityComponentHelper.clone(this.components),
    );
  }

  deserialize(
    input: {
      name: string;
      repeatInterval: number;
      startTick: number;
      endTick: number;
      beamHpMult: number;
      beamHpAttribute: number;
      speed: number;
      aoe: number;
      clashingDelayTicks: number;
      maxDelayTicks: number;
      durationIncPerDelay: number;
      boundaryRemoveDelay: number;
      turnSpeed: number;
      heightVariation: {
        start: number;
        finish: number;
        scaling: number;
      };
      isTracking: boolean;
      isFixedAngle: boolean;
      isGroundPathing: boolean;
      canClashWithHero: boolean;
      useLastCastPoint: boolean;
      explodeAtCastPoint: boolean;
      explodeOnDeath: boolean;
      explodeOnContact: boolean;
      setAsSpawnedBeam: boolean;
      beamUnitSpawn: number;
      beamUnitType: number;
      beamUnitSkin: number;
      components: {
        name: string,
      }[];
    },
  ) {
    this.name = input.name;
    this.repeatInterval = input.repeatInterval;
    this.startTick = input.startTick;
    this.endTick = input.endTick;
    this.beamHpMult = input.beamHpMult;
    this.beamHpAttribute = input.beamHpAttribute;
    this.speed = input.speed;
    this.aoe = input.aoe;
    this.clashingDelayTicks = input.clashingDelayTicks;
    this.maxDelayTicks = input.maxDelayTicks;
    this.durationIncPerDelay = input.durationIncPerDelay;
    this.boundaryRemoveDelay = input.boundaryRemoveDelay;
    this.turnSpeed = input.turnSpeed;
    this.heightVariation = new HeightVariation().deserialize(input.heightVariation);
    this.isTracking = input.isTracking;
    this.isFixedAngle = input.isFixedAngle;
    this.isGroundPathing = input.isGroundPathing;
    this.canClashWithHero = input.canClashWithHero;
    this.useLastCastPoint = input.useLastCastPoint;
    this.explodeAtCastPoint = input.explodeAtCastPoint;
    this.explodeOnDeath = input.explodeOnDeath;
    this.explodeOnContact = input.explodeOnContact;
    this.setAsSpawnedBeam = input.setAsSpawnedBeam;
    this.beamUnitSpawn = input.beamUnitSpawn;
    this.beamUnitType = input.beamUnitType;
    this.beamUnitSkin = input.beamUnitSkin;
    return this;
  }

  addComponent(component: AbilityComponent) {
    return this.components.push(component);
  }
}
