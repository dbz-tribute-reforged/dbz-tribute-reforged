import { CustomHero } from "CustomHero/CustomHero";
import { SagaAIData } from "./SagaAIData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { Constants } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";
import { CoordMath } from "Common/CoordMath";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { PathingCheck } from "Common/PathingCheck";


// TODO:
// split the logic and actions separately
// logic -> figure out what to do
// action -> do what u just figured out what to do
// will simplify it significantly...
export class SagaHeroAI {


  protected sagaCustomHero: CustomHero;

  // 1 tick is defined as 0.01s in this case
  protected currentTick: number;
  protected currentAction: SagaAIData.Action;

  protected aggroTarget: unit | undefined;

  protected numAttacks: number;
  protected numDodges: number;

  protected numBeams: number;

  // refactor strong and weak beam into just a singular class
  // with timer delay etc
  protected weakBeams: string[];
  protected strongBeams: string[];
  protected weakBeamDelay: number;
  protected strongBeamDelay: number;
  protected weakBeamTimer: timer;
  protected strongBeamTimer: timer;
  protected usingWeakBeamTimer: boolean;
  protected usingStrongBeamTimer: boolean;

  constructor (
    public readonly sagaUnit: unit,
    public isEnabled: boolean = true,
    public actionInterval: number = SagaAIData.defaultActionInterval,
    public consecutiveAttacksAllowed: number = SagaAIData.defaultConsecutiveAttacksAllowed,
    public maxBeamsToDodge: number = SagaAIData.defaultBeamsToDodge,
    public consecutiveDodgesAllowed: number = SagaAIData.defaultConsecutiveDodgesAllowed,
    public consecutiveBeamsAllowed: number = SagaAIData.defaultConsecutiveBeamsAllowed,
    public weakBeamCooldown: number = SagaAIData.defaultWeakBeamCooldown,
    public strongBeamCooldown: number = SagaAIData.defaultStrongBeamCooldown,
    public weakBeamCastTime: number = SagaAIData.defaultWeakBeamCastTime,
    public strongBeamCastTime: number = SagaAIData.defaultStrongBeamCastTime,
    public beamRange: number = SagaAIData.defaultBeamRange,
  ) {
    this.sagaCustomHero = new CustomHero(sagaUnit);
    this.currentTick = 0;
    this.currentAction = SagaAIData.Action.REAGGRO;
    this.aggroTarget = undefined;

    this.numAttacks = 0;
    this.numDodges = 0;
    this.numBeams = 0;
    
    this.weakBeams = [];
    this.strongBeams = [];
    this.weakBeamDelay = 0;
    this.strongBeamDelay = 0;
    this.weakBeamTimer = CreateTimer();
    this.strongBeamTimer = CreateTimer();
    this.usingWeakBeamTimer = false;
    this.usingStrongBeamTimer = false;

    this.initialize();
  }

  public initialize() {
    if (this.sagaCustomHero.getNumAbilities() <= Constants.maxSubAbilities) {
      this.addWeakBeams([AbilityNames.Saga.GENERIC_BEAM]);
      this.addStrongBeams([AbilityNames.Saga.GENERIC_BOMB]);
    }
  }

  public getBeamLevel() {
    // minimum beam = 1
    // maximum beam = 10
    // lvl of beam = max (lvl of saga / 5, int of saga / 1000)
    return ( 
      Math.max(
        1, 
        Math.min(
          10, 
          Math.max(
            Math.floor(
              GetHeroLevel(this.sagaUnit) * 0.1
            ),
            Math.floor(
              GetHeroInt(this.sagaUnit, true) * 0.001
            )
          )
        ),
      )
    );
  }

  public addWeakBeams(names: string[]): this {
    for (const name of names) {
      if (!this.sagaCustomHero.hasAbility(name)) {
        this.sagaCustomHero.addAbilityFromAll(name);
      }
      this.weakBeams.push(name);
    }
    return this;
  }

  public addStrongBeams(names: string[]): this {
    for (const name of names) {
      if (!this.sagaCustomHero.hasAbility(name)) {
        this.sagaCustomHero.addAbilityFromAll(name);
      }
      this.strongBeams.push(name);
    }
    return this;
  }

  public getNumWeakBeams(): number {
    return this.weakBeams.length;
  }

  public getNumStrongBeams(): number {
    return this.strongBeams.length;
  }

  public performTickActions() {
    if (this.isEnabled) {
      if (this.currentTick > this.actionInterval) {
        this.currentTick = 0;
        this.performThink();
        this.performAction();
        // this.performIntent();
        this.reduceCooldowns();
      } else {
        ++this.currentTick;
      }
    }
  }

  public reduceCooldowns() {
    if (this.weakBeamDelay > 0) {
      --this.weakBeamDelay;
    }
    if (this.strongBeamDelay > 0) {
      --this.strongBeamDelay;
    }
  } 


  public performThink() {
    switch (this.currentAction) {
      case SagaAIData.Action.ATTACK:
        this.thinkAttack();
        break;
      case SagaAIData.Action.BEAM:
        this.thinkBeam();
        break;
      case SagaAIData.Action.DODGE:
        this.thinkDodge();
        break;
      default:
      case SagaAIData.Action.REAGGRO:
        this.thinkReaggro();
        break;
    }
  }

  public thinkAttack() {
    if (this.aggroTarget == undefined || UnitHelper.isUnitDead(this.aggroTarget)) {
      this.currentAction = SagaAIData.Action.REAGGRO;
    } else if (this.numAttacks < this.consecutiveAttacksAllowed) {
      const bossCoord = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
      const targetCoord = new Vector2D(GetUnitX(this.aggroTarget), GetUnitY(this.aggroTarget));
      const targetDistance = CoordMath.distance(bossCoord, targetCoord);

      if (targetDistance > GetUnitAcquireRange(this.sagaUnit)) {
        this.currentAction = SagaAIData.Action.REAGGRO;
      } else if (this.numAttacks > 0 && targetDistance < this.beamRange) {
        this.currentAction = SagaAIData.Action.BEAM;
      }
    } else {
      this.numAttacks = 0;
      this.currentAction = SagaAIData.Action.DODGE;
    }
  }

  public thinkDodge() {
    if (this.numDodges < this.consecutiveDodgesAllowed) {
      this.currentAction = SagaAIData.Action.DODGE;
    } else {
      this.numDodges = 0;
      this.currentAction = SagaAIData.Action.REAGGRO;
    }
  }

  public thinkBeam() {
    if (this.numBeams < this.consecutiveBeamsAllowed) {
      this.currentAction = SagaAIData.Action.ATTACK;
    } else {
      this.numBeams = 0;
      this.currentAction = SagaAIData.Action.DODGE;
    }
  }

  public thinkReaggro() {
    if (this.aggroTarget != undefined && UnitHelper.isUnitAlive(this.aggroTarget)) {
      this.currentAction == SagaAIData.Action.ATTACK;
    }
  }

  public performAction() {
    switch (this.currentAction) {
      case SagaAIData.Action.ATTACK:
        this.performAttack();
        break;
      case SagaAIData.Action.BEAM:
        this.performBeam();
        break;
      case SagaAIData.Action.DODGE:
        this.performDodge();
        break;
      default:
      case SagaAIData.Action.REAGGRO:
        this.performReaggro();
        break;
    }
  }

  public performAttack() {
    ++this.numAttacks;
    if (this.aggroTarget) {
      // faster than mod
      switch (this.numAttacks) {
        case 0:
        case 3:
        case 6:
        case 9:
        case 12:
          this.useCustomAbility(AbilityNames.BasicAbility.ZANZO_DASH);
          IssueTargetOrder(this.sagaUnit, SagaAIData.ORDER_ATTACK, this.aggroTarget);  
          break;
        default:
          break;
      }
    }
  }

  public performBeam() {
    const rng = Math.random();
    if (
      rng < 0.7 && 
      this.weakBeamDelay == 0 && 
      this.weakBeams.length > 0 && 
      !this.usingWeakBeamTimer
    ) {
      ++this.numBeams;
      this.useWeakBeam();
    } else if (
      this.strongBeamDelay == 0 && 
      this.strongBeams.length > 0 && 
      !this.usingStrongBeamTimer
    ) {
      ++this.numBeams;
      this.useStrongBeam();
    }
  }

  public performDodge() {
    this.numBeams += this.dodgeNearbyBeams();
  }

  public performReaggro() {
    this.aggroTarget = undefined;
    this.findNewAggroTarget();
    if (this.aggroTarget == undefined || UnitHelper.isUnitDead(this.aggroTarget)) {
      IssueImmediateOrder(this.sagaUnit, SagaAIData.ORDER_STOP);
    }
  }

  public useCustomAbility(
    abilityName: string, 
    showText: boolean = true,
    abilityLevel: number = 1,
    targetEnemy: boolean = true,
  ) {
    if (this.aggroTarget && UnitHelper.isUnitAlive(this.sagaUnit)) {
      const bossCoord = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
      let targetCoord = new Vector2D(GetUnitX(this.aggroTarget), GetUnitY(this.aggroTarget));
      if (!targetEnemy) {
        targetCoord = bossCoord;
      }
      const abilityInput = new CustomAbilityInput(
        this.sagaCustomHero, 
        Constants.sagaPlayer,
        abilityLevel,
        targetCoord,
        targetCoord,
        targetCoord,
        this.aggroTarget,
        this.sagaUnit,
      );
      if (showText && this.sagaCustomHero.canCastAbility(abilityName, abilityInput)) {
        TextTagHelper.showPlayerColorTextOnUnit(
          abilityName, 
          Constants.sagaPlayerId,
          this.sagaUnit
        )
      }
      this.sagaCustomHero.useAbility(abilityName, abilityInput);
    }
  }

  public useWeakBeam() {
    const weakBeamAbility = this.weakBeams[
      Math.floor(Math.random() * this.weakBeams.length)
    ];
    this.weakBeamDelay = this.weakBeamCooldown;
    this.usingWeakBeamTimer = true;

    TextTagHelper.showPlayerColorTextOnUnit(
      weakBeamAbility, 
      Constants.sagaPlayerId,
      this.sagaUnit
    );

    TimerStart(this.weakBeamTimer, this.weakBeamCastTime, false, () => {
      this.usingWeakBeamTimer = false;
      this.useCustomAbility(AbilityNames.BasicAbility.MAX_POWER, true, 1, false);
      this.useCustomAbility(weakBeamAbility, false, this.getBeamLevel());
    });
  }

  public useStrongBeam() {
    const strongBeamAbility = this.strongBeams[
      Math.floor(Math.random() * this.strongBeams.length)
    ];
    this.strongBeamDelay = this.strongBeamCooldown;
    this.usingStrongBeamTimer = true;

    TextTagHelper.showPlayerColorTextOnUnit(
      strongBeamAbility, 
      Constants.sagaPlayerId,
      this.sagaUnit
    );

    TimerStart(this.strongBeamTimer, this.strongBeamCastTime, false, () => {
      this.usingStrongBeamTimer = false;
      this.useCustomAbility(AbilityNames.BasicAbility.MAX_POWER, true, 1, false);
      this.useCustomAbility(strongBeamAbility, false, this.getBeamLevel());
    });
  }


  // dodge distance and AOE are fixed for now
  public dodgeNearbyBeams(): number {
    let dodgeResult = SagaAIData.PERFORMED_NO_DODGE;
    if (this.maxBeamsToDodge <= 0) return dodgeResult;

    const nearbyBeams = CreateGroup();
    const bossPlayer = GetOwningPlayer(this.sagaUnit);
    const beamSearchRange = SagaAIData.defaultDodgeAOE;
    const bossCoord = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));

    GroupEnumUnitsInRange(
      nearbyBeams,
      bossCoord.x,
      bossCoord.y,
      beamSearchRange,
      Condition(() => {
        const testUnit = GetFilterUnit();
        return (
          GetUnitTypeId(testUnit) == Constants.dummyBeamUnitId &&
          IsUnitEnemy(testUnit, bossPlayer) &&
          !UnitHelper.isUnitDead(testUnit)
        );
      })
    );

    let beamsAccountedFor = 0;
    let beamsTooClose = 0;
    let dodgeAngle = SagaAIData.NO_DODGE_ANGLE;
    
    ForGroup(nearbyBeams, () => {
      if (
        beamsAccountedFor < this.maxBeamsToDodge || 
        this.maxBeamsToDodge == SagaAIData.UNLIMITED_BEAM_DODGES)
      {
        const beam = GetEnumUnit();
        const beamCoord = new Vector2D(GetUnitX(beam), GetUnitY(beam));
        if (CoordMath.distance(beamCoord, bossCoord) > SagaAIData.defaultDodgeDistance) {
          let beamDodgeAngle = CoordMath.angleBetweenCoords(beamCoord, bossCoord);
          if (beamDodgeAngle < 0) {
            beamDodgeAngle += 360;
          }
          let beamDodgeDirection = beamDodgeAngle - GetUnitFacing(beam);

          if (beamDodgeDirection > 0) {
            beamDodgeDirection = 1;
          } else {
            beamDodgeDirection = -1;
          }

          beamDodgeAngle = beamDodgeAngle + 
            beamDodgeDirection * (30 + Math.random() * 90);
          
          if (dodgeAngle == SagaAIData.NO_DODGE_ANGLE) {
            dodgeAngle = beamDodgeAngle;
          } else {
            dodgeAngle = (dodgeAngle + beamDodgeAngle) * 0.5;
          }

          ++beamsAccountedFor;
        } else {
          ++beamsTooClose;
        }
      }
    });
    DestroyGroup(nearbyBeams);

    if (beamsTooClose > beamsAccountedFor) {
      this.useCustomAbility(AbilityNames.BasicAbility.GUARD);
    }

    if (dodgeAngle != SagaAIData.NO_DODGE_ANGLE) {
      dodgeResult = SagaAIData.PERFORMED_DODGE;
      // TextTagHelper.showPlayerColorTextOnUnit(
      //   "Cant touch this!" + dodgeAngle, 
      //   Constants.sagaPlayerId, 
      //   this.sagaUnit
      // );
      let dodgeCoord = CoordMath.polarProjectCoords(
        bossCoord, 
        dodgeAngle, 
        SagaAIData.defaultDodgeDistance
      );
      for (let offset = 0; offset < 1000; offset += 60) {
        if (PathingCheck.isGroundWalkable(dodgeCoord)) {
          IssuePointOrder(this.sagaUnit, SagaAIData.ORDER_DODGE, dodgeCoord.x, dodgeCoord.y);
          break;
        }
        dodgeCoord = CoordMath.polarProjectCoords(
          bossCoord, 
          dodgeAngle, 
          SagaAIData.defaultDodgeDistance + offset
        );
      }
      // TextTagHelper.showTempText("|cffff2020X|r", dodgeCoord.x, dodgeCoord.y, 2, 1);
    }

    return dodgeResult;
  }


  public findNewAggroTarget() {
    const enemyGroup = CreateGroup();
    const bossPlayer = GetOwningPlayer(this.sagaUnit);
    const acquireRange = GetUnitAcquireRange(this.sagaUnit);
    const bossPos = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));

    GroupEnumUnitsInRange(
      enemyGroup,
      bossPos.x,
      bossPos.y,
      acquireRange,
      Condition(() => {
        const testUnit = GetFilterUnit();
        const x = GetUnitX(testUnit);
        const y = GetUnitY(testUnit);
        return (
          IsUnitEnemy(testUnit, bossPlayer) &&
          IsUnitType(testUnit, UNIT_TYPE_HERO) && 
          !IsUnitType(testUnit, UNIT_TYPE_SUMMONED) && 
          !UnitHelper.isUnitDead(testUnit) &&
          !BlzIsUnitInvulnerable(testUnit) && 
          !IsUnitHidden(testUnit) && 
          !(
            x > Constants.heavenHellBottomLeft.x &&
            y > Constants.heavenHellBottomLeft.y &&
            x < Constants.heavenHellTopRight.x &&
            y < Constants.heavenHellTopRight.y
          )
        )
      })
    );

    let closestUnit = this.sagaUnit;
    let closestDistance = acquireRange;
    ForGroup(enemyGroup, () => {
      const enemyUnit = GetEnumUnit();
      const enemyPos = new Vector2D(GetUnitX(enemyUnit), GetUnitY(enemyUnit));
      const enemyDistance = CoordMath.distance(enemyPos, bossPos);
      if (enemyDistance < closestDistance) {
        closestUnit = enemyUnit;
        closestDistance = enemyDistance;
      }
    });

    if (closestUnit != this.sagaUnit) {
      this.aggroTarget = closestUnit;
    }

    DestroyGroup(enemyGroup);
  }

  //  ==============  REFACTOR LINE =============
  // everything below this is probably deprecated

  public performIntent() {
    switch (this.currentAction) {
      case SagaAIData.Action.ATTACK:
        this.attackAggroTarget();
        break;

      case SagaAIData.Action.DODGE_OR_ATTACK:
        this.dodgeOrAttackLogic();
        break;

      case SagaAIData.Action.BEAM_OR_ATTACK:
        this.beamOrAttackLogic();
        break;

      case SagaAIData.Action.REAGGRO:
      default:
        this.reaggroLogic();
        this.currentAction = SagaAIData.Action.ATTACK;
        break;
    }
  }

  public attackAggroTarget() {
    if (this.aggroTarget != undefined && UnitHelper.isUnitAlive(this.aggroTarget)) {
      if (this.numAttacks < this.consecutiveAttacksAllowed) {
        ++this.numAttacks;

        const bossCoord = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
        const targetCoord = new Vector2D(GetUnitX(this.aggroTarget), GetUnitY(this.aggroTarget));
        const targetDistance = CoordMath.distance(bossCoord, targetCoord);

        switch (this.numAttacks) {
          case 0:
          case 3:
          case 6:
          case 9:
          case 12:
            if (targetDistance < GetUnitAcquireRange(this.sagaUnit)) {
              this.useCustomAbility(AbilityNames.BasicAbility.ZANZO_DASH);
              IssueTargetOrder(this.sagaUnit, SagaAIData.ORDER_ATTACK, this.aggroTarget);
            } else {
              IssueImmediateOrder(this.sagaUnit, SagaAIData.ORDER_STOP);
              this.currentAction = SagaAIData.Action.REAGGRO;
            }
            break;
          default:
            break;
        }

        if (
          this.numAttacks > 0 && 
          targetDistance < this.beamRange
        ) {
          this.currentAction = SagaAIData.Action.BEAM_OR_ATTACK;
        }
      } else {
        this.numAttacks = 0;
        this.currentAction = SagaAIData.Action.DODGE_OR_ATTACK;
      }
    } else {
      this.currentAction = SagaAIData.Action.REAGGRO;
    }
  }

  public dodgeNearbyBeamsLogic() {
    if (this.numDodges < this.consecutiveDodgesAllowed) {
      this.numDodges += this.dodgeNearbyBeams();
      return true;
    } else {
      this.numDodges = 0;
      this.currentAction = SagaAIData.Action.REAGGRO;
    }
    return false;
  }

  public dodgeOrAttackLogic() {
    const performedDodge = this.dodgeNearbyBeamsLogic();
    if (!performedDodge) {
      this.attackAggroTarget();
    }
  }

  public performBeams() {
    if (this.aggroTarget != undefined && UnitHelper.isUnitAlive(this.aggroTarget)) {
      const rng = Math.random();
      if (
        rng < 0.7 && 
        this.weakBeamDelay == 0 && 
        this.weakBeams.length > 0 && 
        !this.usingWeakBeamTimer
      ) {
        this.useWeakBeam();
      } else if (
        this.strongBeamDelay == 0 && 
        this.strongBeams.length > 0 && 
        !this.usingStrongBeamTimer
      ) {
        this.useStrongBeam();
      } else {
        return false;
      }
      // if beamed
      this.currentAction = SagaAIData.Action.DODGE_OR_ATTACK;
      return true;
    }
    return false;
  }

  public beamOrAttackLogic() {
    const performedBeam = this.performBeams();
    if (!performedBeam) {
      this.attackAggroTarget();
    }
  }

  public reaggroLogic() {
    // TODO: make more smart
    this.findNewAggroTarget();
  }
}