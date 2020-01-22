import { CustomHero } from "CustomHero/CustomHero";
import { SagaAIData } from "./SagaAIData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { Constants } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";
import { CoordMath } from "Common/CoordMath";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";

export class SagaHeroAI {


  protected sagaCustomHero: CustomHero;

  // 1 tick is defined as 0.01s in this case
  protected currentTick: number;
  protected currentIntent: SagaAIData.Intent;

  protected aggroTarget: unit | undefined;

  protected numAttacks: number;
  protected numDodges: number;

  protected beamLevel: number;

  // refactor strong and weak beam into just a singular thing
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
    public actionInterval: number = SagaAIData.defaultActionInterval,
    public consecutiveAttacksAllowed: number = SagaAIData.defaultConsecutiveAttacksAllowed,
    public maxBeamsToDodge: number = SagaAIData.defaultBeamsToDodge,
    public consecutiveDodgesAllowed: number = SagaAIData.defaultConsecutiveDodgesAllowed,
    public weakBeamCooldown: number = SagaAIData.defaultWeakBeamCooldown,
    public strongBeamCooldown: number = SagaAIData.defaultStrongBeamCooldown,
    public weakBeamCastTime: number = SagaAIData.defaultWeakBeamCastTime,
    public strongBeamCastTime: number = SagaAIData.defaultStrongBeamCastTime,
    public beamRange: number = SagaAIData.defaultBeamRange,
  ) {
    this.sagaCustomHero = new CustomHero(sagaUnit);
    this.currentTick = 0;
    this.currentIntent = SagaAIData.Intent.REAGGRO;
    this.aggroTarget = undefined;

    this.numAttacks = 0;
    this.numDodges = 0;
    
    this.beamLevel = Math.max(1, Math.min(10, Math.floor(GetHeroLevel(sagaUnit) * 0.1)));
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
      this.addWeakBeam(AbilityNames.Saga.GENERIC_BEAM);
      this.addStrongBeam(AbilityNames.Saga.GENERIC_BOMB);
    }
  }

  public addWeakBeam(name: string) {
    if (!this.sagaCustomHero.hasAbility(name)) {
      this.sagaCustomHero.addAbilityFromAll(name);
    }
    this.weakBeams.push(name);
  }

  public addStrongBeam(name: string) {
    if (!this.sagaCustomHero.hasAbility(name)) {
      this.sagaCustomHero.addAbilityFromAll(name);
    }
    this.strongBeams.push(name);
  }

  public performTickActions() {
    if (this.currentTick > this.actionInterval) {
      this.currentTick = 0;
      this.performIntent();
      this.reduceCooldowns();
    } else {
      ++this.currentTick;
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

  public performIntent() {
    switch (this.currentIntent) {
      case SagaAIData.Intent.ATTACK:
        this.attackAggroTarget();
        break;

      case SagaAIData.Intent.DODGE_OR_ATTACK:
        this.dodgeOrAttackLogic();
        break;

      case SagaAIData.Intent.BEAM_OR_ATTACK:
        this.beamOrAttackLogic();
        break;

      case SagaAIData.Intent.REAGGRO:
      default:
        this.reaggroLogic();
        this.currentIntent = SagaAIData.Intent.ATTACK;
        break;
    }
  }

  public attackAggroTarget() {
    if (this.aggroTarget && UnitHelper.isUnitAlive(this.aggroTarget)) {
      if (this.numAttacks < this.consecutiveAttacksAllowed) {
        if (this.numAttacks == 0) {
          this.useCustomAbility(AbilityNames.BasicAbility.ZANZO_DASH);
          IssueTargetOrder(this.sagaUnit, SagaAIData.ATTACK_ORDER, this.aggroTarget);
        }
        ++this.numAttacks;

        const bossCoord = new Vector2D(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
        const targetCoord = new Vector2D(GetUnitX(this.aggroTarget), GetUnitY(this.aggroTarget));
        if (
          this.numAttacks > this.consecutiveAttacksAllowed * 0.5 && 
          CoordMath.distance(bossCoord, targetCoord) < this.beamRange
        ) {
          this.currentIntent = SagaAIData.Intent.BEAM_OR_ATTACK;
        }
      } else {
        this.numAttacks = 0;
        this.currentIntent = SagaAIData.Intent.DODGE_OR_ATTACK;
      }
    } else {
      this.currentIntent = SagaAIData.Intent.REAGGRO;
    }
  }

  public dodgeNearbyBeamsLogic() {
    if (this.numDodges < this.consecutiveDodgesAllowed) {
      this.numDodges += this.dodgeNearbyBeams();
      return true;
    } else {
      this.numDodges = 0;
      this.currentIntent = SagaAIData.Intent.REAGGRO;
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
    if (
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
      // TODO: REMOVE THIS TESTING CODE
      if (this.weakBeams.length == 0) {
        this.addWeakBeam(AbilityNames.Saga.GENERIC_BEAM);
      }
      if (this.strongBeams.length == 0) {
        this.addStrongBeam(AbilityNames.Saga.GENERIC_BOMB);
      }
      return false;
    }
    this.currentIntent = SagaAIData.Intent.DODGE_OR_ATTACK;
    return true;
  }

  public beamOrAttackLogic() {
    const performedBeam = this.performBeams();
    if (!performedBeam) {
      this.attackAggroTarget();
    }
  }

  public reaggroLogic() {
    // TODO: make more smart
    this.calculateAggroTarget();
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
      this.useCustomAbility(weakBeamAbility, false);
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
      this.useCustomAbility(strongBeamAbility, false);
    });
  }

  public useCustomAbility(
    abilityName: string, 
    showText: boolean = true,
    abilityLevel: number = 1,
    targetEnemy: boolean = true,
  ) {
    if (this.aggroTarget) {
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
    let dodgeAngle = SagaAIData.NO_DODGE_ANGLE;
    let beamsTooClose = 0;

    ForGroup(nearbyBeams, () => {
      if (
        beamsAccountedFor < this.maxBeamsToDodge || 
        this.maxBeamsToDodge == SagaAIData.UNLIMITED_BEAM_DODGES)
      {
        const beam = GetEnumUnit();
        const beamCoord = new Vector2D(GetUnitX(beam), GetUnitY(beam));
        if (CoordMath.distance(beamCoord, bossCoord) > SagaAIData.defaultDodgeDistance) {
          let beamDodgeAngle = CoordMath.angleBetweenCoords(beamCoord, bossCoord);
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
      const dodgeCoord = CoordMath.polarProjectCoords(
        bossCoord, 
        dodgeAngle, 
        SagaAIData.defaultDodgeDistance
      );
      IssuePointOrder(this.sagaUnit, SagaAIData.DODGE_ORDER, dodgeCoord.x, dodgeCoord.y);
      // TextTagHelper.showTempText("|cffff2020X|r", dodgeCoord.x, dodgeCoord.y, 2, 1);
    }

    return dodgeResult;
  }

  public calculateAggroTarget() {
    // find closest enemy hero
    // and go attack them
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

    this.aggroTarget = closestUnit;

    DestroyGroup(enemyGroup);
  }
}