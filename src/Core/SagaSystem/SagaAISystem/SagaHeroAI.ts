import { CustomHero } from "CustomHero/CustomHero";
import { SagaAIData } from "./SagaAIData";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { Constants, OrderIds, Globals, Buffs } from "Common/Constants";
import { TextTagHelper } from "Common/TextTagHelper";
import { CoordMath } from "Common/CoordMath";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { PathingCheck } from "Common/PathingCheck";
import { SagaAbility } from "../SagaAbility";
import { ItemConstants } from "Core/ItemAbilitySystem/ItemConstants";
import { doTimeRingSwap } from "Core/ItemAbilitySystem/ItemActiveAbilitiesConfig";


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

  // number of attack/dodge/beam actions performed for a given thought
  protected numAttacks: number;
  protected numDodges: number;
  protected numBeams: number;
  protected numWaits: number;

  protected timeSinceLastDodge: number;
  protected previousLifePercent: number;

  protected maxWait: number;

  protected isAggroLost: boolean;

  protected canUseItem: boolean;

  protected abilitiesNames: string[];
  protected sagaAbilities: SagaAbility[];
  protected maxAbilityChance: number;

  protected abilityInput: CustomAbilityInput;
  protected aggroPos: Vector2D;

  protected bossPos: Vector2D;
  protected tmpPos: Vector2D;
  protected abilityTargetPos: Vector2D;

  protected nearbyBeams: group;
  protected nearbyEnemies: group;

  constructor (
    public readonly sagaUnit: unit,
    public isEnabled: boolean = true,
    public owningPlayer: player = Constants.sagaPlayer,
    public spellPowerModifier: number = SagaAIData.defaultSpellPowerModifier,
    public actionInterval: number = SagaAIData.defaultActionInterval,
    public consecutiveAttacksAllowed: number = SagaAIData.defaultConsecutiveAttacksAllowed,
    public consecutiveDodgesAllowed: number = SagaAIData.defaultConsecutiveDodgesAllowed,
    public consecutiveBeamsAllowed: number = SagaAIData.defaultConsecutiveBeamsAllowed,
    public maxBeamsToDodge: number = SagaAIData.defaultBeamsToDodge,
    public maxTimeSinceLastDodge: number = SagaAIData.defaultMaxTimeSinceLastDodge,
    public beamRange: number = SagaAIData.defaultBeamRange,
    public aggressiveZanzoThreshold: number = SagaAIData.defaultAggressiveZanzoThreshold,
    public guardLifePercentThreshold: number = SagaAIData.defaultGuardLifePercentThreshold,
  ) {
    this.sagaCustomHero = new CustomHero(sagaUnit);
    this.sagaCustomHero.addAbilityFromAll(AbilityNames.Saga.ZANZO_DASH);
    this.sagaCustomHero.addAbilityFromAll(AbilityNames.Saga.MAX_POWER);
    this.sagaCustomHero.addSpellPower(spellPowerModifier);
    
    this.currentTick = 0;
    this.currentAction = SagaAIData.Action.REAGGRO;
    this.aggroTarget = undefined;

    this.numAttacks = 0;
    this.numDodges = 0;
    this.numBeams = 0;
    this.numWaits = 0;

    this.timeSinceLastDodge = 0;
    this.previousLifePercent = 0;
    
    this.maxWait = 0;

    this.isAggroLost = false;

    this.canUseItem = true;

    this.abilitiesNames = [];
    this.sagaAbilities = [];
    this.maxAbilityChance = 0;

    this.aggroPos = new Vector2D();
    this.abilityInput = new CustomAbilityInput(
      this.sagaCustomHero, 
      this.owningPlayer,
      1,
      this.aggroPos,
      this.aggroPos,
      this.aggroPos,
    );
    this.abilityInput.castUnit = this.sagaUnit;
    
    this.bossPos = new Vector2D();
    this.tmpPos = new Vector2D();
    this.abilityTargetPos = new Vector2D();

    this.nearbyBeams = CreateGroup();
    this.nearbyEnemies = CreateGroup();
  }

  public cleanup(): this {
    this.abilitiesNames.splice(0, this.abilitiesNames.length);
    this.sagaAbilities.splice(0, this.sagaAbilities.length);
    this.sagaCustomHero.cleanup();
    DestroyGroup(this.nearbyBeams);
    DestroyGroup(this.nearbyEnemies);
    return this;
  }

  public getBeamLevel(maxLevel: number = 10): number {
    // minimum beam = 1
    // maximum beam = 10
    // lvl of beam = max (lvl of saga * 0.18, int of saga * 0.0018)
    return Math.max(
      1, 
      Math.min(
        maxLevel, 
        Math.max(
          Math.floor(
            GetHeroLevel(this.sagaUnit) * 0.20
          ),
          Math.floor(
            GetHeroInt(this.sagaUnit, true) * 0.0020
          )
        )
      ),
    )
  }

  public addAbilities(abilitiesToAdd: SagaAbility[]): this {
    for (const ability of abilitiesToAdd) {
      const addedAbility = ability.clone();
      addedAbility.maxCd *= 100 / Math.max(1, this.actionInterval);

      this.abilitiesNames.push(addedAbility.name);
      this.sagaAbilities.push(addedAbility);

      this.sagaCustomHero.addAbilityFromAll(ability.name);
      if (!this.sagaCustomHero.hasAbility(addedAbility.name)) {
        this.sagaCustomHero.addAbilityFromAll(addedAbility.name);
      }
      this.maxAbilityChance += ability.castChance;
    }
    return this;
  }

  public performTickActions() {
    if (this.isEnabled && UnitHelper.isUnitAlive(this.sagaUnit)) {
      if (this.currentTick > this.actionInterval) {
        this.currentTick = 0;
        this.preUpdate();
        this.performThink();
        this.performAction();
        this.postUpdate();
      } else {
        // increment tick based on speed of Saga's Update rate
        this.currentTick += 3;
      }
    }
  }

  public preUpdate() {
    if (this.aggroTarget) {
      this.aggroPos.setUnit(this.aggroTarget);
      this.abilityInput.targetUnit = this.aggroTarget;
    }
    for (const ability of this.sagaAbilities) {
      ability.updateCd();
    }
  }

  public postUpdate() {
    this.previousLifePercent = GetUnitLifePercent(this.sagaUnit);
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
      case SagaAIData.Action.WAIT:
        this.thinkWait();
        break;
      case SagaAIData.Action.ITEM:
        this.thinkItem();
        break;
      case SagaAIData.Action.REAGGRO:
      default:
        this.thinkReaggro();
        break;
    }
  }

  public thinkAttack() {
    if (this.aggroTarget == undefined || UnitHelper.isUnitDead(this.aggroTarget)) {
      this.currentAction = SagaAIData.Action.REAGGRO;
    } else if (this.numAttacks < this.consecutiveAttacksAllowed) {
      this.bossPos.setPos(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
      this.tmpPos.setPos(GetUnitX(this.aggroTarget), GetUnitY(this.aggroTarget));
      const targetDistance = CoordMath.distance(this.bossPos, this.tmpPos);

      if (targetDistance > GetUnitAcquireRange(this.sagaUnit)) {
        this.currentAction = SagaAIData.Action.REAGGRO;
      } else if (
        this.numAttacks > 0 && 
        targetDistance < this.beamRange && 
        this.sagaAbilities.length > 0
      ) {
        this.currentAction = SagaAIData.Action.BEAM;
      }
    } else {
      this.numAttacks = 0;
      this.currentAction = SagaAIData.Action.DODGE;
    }
  }

  public thinkDodge() {
    if (
      this.numDodges < this.consecutiveDodgesAllowed &&
      this.timeSinceLastDodge < this.maxTimeSinceLastDodge && 
      this.aggroTarget != undefined &&
      UnitHelper.isUnitAlive(this.aggroTarget)
    ) {
      this.currentAction = SagaAIData.Action.DODGE;
    } else {
      this.numDodges = 0;
      this.timeSinceLastDodge = 0;
      this.numWaits = 0;
      this.maxWait = 0;
      if (this.canUseItem) {
        this.thinkItem();
      } else {
        this.currentAction = SagaAIData.Action.REAGGRO;
      }
    }
  }

  public thinkWait() {
    if (
      this.numWaits < this.maxWait
    ) {
      this.currentAction = SagaAIData.Action.WAIT;
    } else {
      this.numWaits = 0;
      this.maxWait = 0;
      if (this.aggroTarget) {
        IssueTargetOrder(this.sagaUnit, SagaAIData.Order.ATTACK, this.aggroTarget);
      }
      this.thinkBeam();
    }
  }

  public thinkBeam() {
    if (this.maxWait > 0) {
      this.currentAction = SagaAIData.Action.WAIT;
    } else if (this.numBeams < this.consecutiveBeamsAllowed) {
      this.currentAction = SagaAIData.Action.ATTACK;
    } else {
      this.numBeams = 0;
      this.currentAction = SagaAIData.Action.DODGE;
    }
  }

  public thinkItem() {
    if (this.maxWait == 0 || this.numWaits < this.maxWait) {
      this.currentAction = SagaAIData.Action.ITEM;
    } else {
      this.currentAction = SagaAIData.Action.REAGGRO;
    }
  }

  public thinkReaggro() {
    if (this.aggroTarget != undefined && UnitHelper.isUnitAlive(this.aggroTarget)) {
      this.currentAction = SagaAIData.Action.ATTACK;
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
      case SagaAIData.Action.WAIT:
        this.performWait();
        break;
      case SagaAIData.Action.ITEM:
        this.performItem();
        break;
      case SagaAIData.Action.REAGGRO:
      default:
        this.performReaggro();
        break;
    }
  }

  public performAttack() {
    if (this.aggroTarget) {
      // faster than mod
      switch (this.numAttacks) {
        case 0:
        case 3:
        case 6:
        case 9:
        case 12: 
          if (GetUnitLifePercent(this.sagaUnit) > this.aggressiveZanzoThreshold) {
            this.useCustomAbility(AbilityNames.Saga.ZANZO_DASH);
          }
          IssueTargetOrder(this.sagaUnit, SagaAIData.Order.ATTACK, this.aggroTarget); 
          break;
        default:
          break;
      }
      ++this.numAttacks;
    }
  }

  public performBeam() {
    if (this.aggroTarget) {
      const rng = Math.random() * this.maxAbilityChance;
      let currentChance = 0;
      for (const ability of this.sagaAbilities) {
        currentChance += ability.castChance;
        if (currentChance >= rng && ability.readyToUse()) {
          ability.applyCd();
          ++this.numBeams;

          TextTagHelper.showPlayerColorTextOnUnit(
            ability.name, 
            GetPlayerId(this.owningPlayer),
            this.sagaUnit
          );
          
          let abilityInput = this.abilityInput;
          if (!ability.isTracking) {
            this.abilityTargetPos.setUnit(this.aggroTarget);
            // abilityInput.level = this.getBeamLevel(ability.maxLevel);
            // abilityInput.targetPoint = this.abilityTargetPos;
            // abilityInput.mouseData = this.abilityTargetPos;
            // abilityInput.castPoint = this.abilityTargetPos;
            // abilityInput.targetUnit = this.aggroTarget;
            // abilityInput.castUnit = this.sagaUnit;
            abilityInput = new CustomAbilityInput(
              this.sagaCustomHero,
              this.owningPlayer,
              this.getBeamLevel(ability.maxLevel),
              this.abilityTargetPos,
              this.abilityTargetPos,
              this.abilityTargetPos,
              this.aggroTarget,
              this.sagaUnit
            )
          }

          this.numWaits = 0;
          
          let delay = ability.castDelay;
          if (Globals.isNightmare) {
            delay *= 0.75;
          }
          this.maxWait = delay * SagaAIData.DELAY_TO_INTERVALS;
          this.performWait();

          TimerStart(CreateTimer(), delay, false, () => {
            if (UnitHelper.isUnitAlive(this.sagaUnit)) {
              this.useCustomAbility(AbilityNames.Saga.MAX_POWER, true, 1);
              this.useCustomAbilityWithInput(ability.name, abilityInput, false);
            }
            DestroyTimer(GetExpiredTimer());
          });
          break;
        }
      }
    }
  }

  public performItem() {
    // wait if casting item
    if (this.maxWait > 0) {
      if (this.numWaits < this.maxWait) {
        ++this.numWaits;
      }
      return;
    }
      
    let hasUsedItem = false;
    const item1 = UnitItemInSlot(this.sagaUnit, 0);

    if (
      this.canUseItem && 
      !hasUsedItem
    ) {
      if (GetItemTypeId(item1) == ItemConstants.SagaDrops.TIME_RING) {
        this.bossPos.setPos(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));
        
        GroupEnumUnitsInRange(
          this.nearbyBeams,
          this.bossPos.x,
          this.bossPos.y,
          1300,
          null
        );

        ForGroup(this.nearbyBeams, () => {
          const ally = GetEnumUnit();
          if (
            !hasUsedItem
            && IsUnitType(ally, UNIT_TYPE_HERO)
            && IsUnitOwnedByPlayer(ally, Constants.sagaPlayer)
            && ally != this.sagaUnit
            && UnitHelper.isUnitAlive(ally)
            && GetUnitLifePercent(ally) < 90
          ) {
            TextTagHelper.showPlayerColorTextOnUnit(
              "Time Ring", 
              Constants.sagaPlayerId,
              this.sagaUnit
            );

            doTimeRingSwap(this.sagaUnit, ally);
            hasUsedItem = true;
            this.canUseItem = false;

            TimerStart(CreateTimer(), 40.0, false, () => {
              this.canUseItem = true;
              DestroyTimer(GetExpiredTimer());
            });
          }
        });

        GroupClear(this.nearbyBeams);
      }

    }

    if (hasUsedItem) {
      this.numWaits = 0;
      this.maxWait = 0.5 * SagaAIData.DELAY_TO_INTERVALS;
    } else {
      this.currentAction = SagaAIData.Action.REAGGRO;
      this.performReaggro();
    }
  }

  public performDodge() {
    const dodgeResult = this.dodgeNearbyBeams();
    if (dodgeResult == SagaAIData.PERFORMED_DODGE) {
      ++this.numDodges;
      this.timeSinceLastDodge = 0;
    } else {
      ++this.timeSinceLastDodge;
    }
  }

  // really just a helper for beam cast delay
  public performWait() {
    if (this.numWaits < this.maxWait) {
      IssueImmediateOrder(this.sagaUnit, SagaAIData.Order.WAIT);
      ++this.numWaits;
    }
  }

  public performReaggro() {
    this.aggroTarget = this.findNewAggroTarget();
    if (this.aggroTarget == undefined || UnitHelper.isUnitDead(this.aggroTarget)) {
      if (!this.isAggroLost) {
        this.isAggroLost = true;
        IssuePointOrder(
          this.sagaUnit, 
          SagaAIData.Order.MOVE, 
          GetUnitX(this.sagaUnit), 
          GetUnitY(this.sagaUnit)
        );
      }
    } else {
      this.isAggroLost = false;
    }
  }

  public useCustomAbility(
    abilityName: string, 
    showText: boolean = true,
    abilityLevel: number = 1,
  ) {
    if (UnitHelper.isUnitAlive(this.sagaUnit)) {
      this.abilityInput.level = abilityLevel;
      this.abilityInput.targetPoint = this.aggroPos;
      this.abilityInput.mouseData = this.aggroPos;
      this.abilityInput.castPoint = this.aggroPos;
      this.abilityInput.targetUnit = this.aggroTarget;
      this.useCustomAbilityWithInput(abilityName, this.abilityInput, showText);
    }
  }

  public useCustomAbilityWithInput(
    abilityName: string, 
    abilityInput: CustomAbilityInput,
    showText: boolean = true,
  ) {
    if (
      this.sagaCustomHero.canCastAbility(abilityName, abilityInput) && 
      !UnitHelper.isUnitStunned(this.sagaUnit) && 
      !UnitHasBuffBJ(this.sagaUnit, Constants.silenceBuff) &&
      !UnitHasBuffBJ(this.sagaUnit, Buffs.MAFUBA_SEALED) &&
      !UnitHasBuffBJ(this.sagaUnit, Buffs.MAFUBA_SEALING)
    ) {
      if (showText) {
        TextTagHelper.showPlayerColorTextOnUnit(
          abilityName, 
          GetPlayerId(this.owningPlayer),
          this.sagaUnit
        )
      }
      this.sagaCustomHero.useAbility(abilityName, abilityInput);
    }
  }

  // dodge distance and AOE are fixed for now
  public dodgeNearbyBeams(): number {
    let dodgeResult = SagaAIData.PERFORMED_NO_DODGE;
    if (this.maxBeamsToDodge <= 0) return dodgeResult;

    const bossPlayer = this.owningPlayer;
    const beamSearchRange = SagaAIData.defaultDodgeAOE;
    this.bossPos.setPos(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));

    GroupEnumUnitsInRange(
      this.nearbyBeams,
      this.bossPos.x,
      this.bossPos.y,
      beamSearchRange,
      null
    );

    let beamsAccountedFor = 0;
    let beamsTooClose = 0;
    let dodgeAngle = SagaAIData.NO_DODGE_ANGLE;
    
    ForGroup(this.nearbyBeams, () => {
      const beam = GetEnumUnit();
      if (
        GetUnitTypeId(beam) == Constants.dummyBeamUnitId &&
        IsUnitEnemy(beam, bossPlayer) &&
        !UnitHelper.isUnitDead(beam)
      ) {
        if (
          beamsAccountedFor < this.maxBeamsToDodge || 
          this.maxBeamsToDodge == SagaAIData.UNLIMITED_BEAM_DODGES)
        {
          this.tmpPos.setPos(GetUnitX(beam), GetUnitY(beam));
          if (CoordMath.distance(this.tmpPos, this.bossPos) > SagaAIData.defaultDodgeDistance) {
            let beamDodgeAngle = CoordMath.angleBetweenCoords(this.tmpPos, this.bossPos);
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
      }
    });
    GroupClear(this.nearbyBeams);

    const currentLife = GetUnitLifePercent(this.sagaUnit);
    if (
      beamsTooClose > beamsAccountedFor && 
      this.previousLifePercent - currentLife > this.guardLifePercentThreshold
    ) {
      this.useCustomAbility(AbilityNames.BasicAbility.GUARD);
    }

    if (dodgeAngle != SagaAIData.NO_DODGE_ANGLE) {
      dodgeResult = SagaAIData.PERFORMED_DODGE;
      // TextTagHelper.showPlayerColorTextOnUnit(
      //   "Cant touch this!" + dodgeAngle, 
      //   GetPlayerId(this.owningPlayer), 
      //   this.sagaUnit
      // );

      this.tmpPos.polarProjectCoords(
        this.bossPos,
        dodgeAngle,
        SagaAIData.defaultDodgeDistance
      );

      for (let offset = 0; offset < 1000; offset += 60) {
        if (PathingCheck.isGroundWalkable(this.tmpPos)) {
          IssuePointOrder(this.sagaUnit, SagaAIData.Order.DODGE, this.tmpPos.x, this.tmpPos.y);
          if (
            currentLife <= this.aggressiveZanzoThreshold && 
            this.previousLifePercent - currentLife > this.guardLifePercentThreshold
          ) {
            this.aggroPos.setVector(this.tmpPos);
            this.useCustomAbility(
              AbilityNames.Saga.ZANZO_DASH, 
              true,
            );
          }
          break;
        }
        
        this.tmpPos.polarProjectCoords(
          this.bossPos, 
          dodgeAngle, 
          SagaAIData.defaultDodgeDistance + offset
        );
      }
      // TextTagHelper.showTempText("|cffff2020X|r", dodgeCoord.x, dodgeCoord.y, 2, 1);
    }

    return dodgeResult;
  }

  public findNewAggroTarget(): unit | undefined {
    let result = undefined;
    const bossPlayer = this.owningPlayer;
    const acquireRange = GetUnitAcquireRange(this.sagaUnit);
    this.bossPos.setPos(GetUnitX(this.sagaUnit), GetUnitY(this.sagaUnit));

    GroupEnumUnitsInRange(
      this.nearbyEnemies,
      this.bossPos.x,
      this.bossPos.y,
      acquireRange,
      null
    );

    let closestUnit = undefined;
    let closestNonSummonUnit = undefined;
    let closestUnitDistance = acquireRange;
    let closestNonSummonDistance = acquireRange;

    ForGroup(this.nearbyEnemies, () => {
      const enemyUnit = GetEnumUnit();
      const x = GetUnitX(enemyUnit);
      const y = GetUnitY(enemyUnit);
      if (
        IsUnitEnemy(enemyUnit, bossPlayer) &&
        IsUnitType(enemyUnit, UNIT_TYPE_HERO) && 
        !UnitHelper.isUnitDead(enemyUnit) &&
        !BlzIsUnitInvulnerable(enemyUnit) && 
        !IsUnitHidden(enemyUnit) && 
        !(
          x > Constants.heavenHellBottomLeft.x &&
          y > Constants.heavenHellBottomLeft.y &&
          x < Constants.heavenHellTopRight.x &&
          y < Constants.heavenHellTopRight.y
        )
      ) {
        this.tmpPos.setPos(x, y);
        const enemyDistance = CoordMath.distance(this.tmpPos, this.bossPos);
        if (enemyDistance < closestUnitDistance) {
          closestUnit = enemyUnit;
          closestUnitDistance = enemyDistance;
        }
        if (
          !IsUnitType(enemyUnit, UNIT_TYPE_SUMMONED)
          && enemyDistance < closestNonSummonDistance
        ) {
          closestNonSummonUnit = enemyUnit;
          closestNonSummonDistance = enemyDistance;
        }
      }
    });
    GroupClear(this.nearbyEnemies);

    if (
      closestNonSummonUnit != undefined
      && (
        closestNonSummonDistance < closestUnitDistance
        || closestNonSummonDistance < acquireRange * 0.15
      )
    ) {
      result = closestNonSummonUnit
    } else if (closestUnit != undefined) {
      result = closestUnit;
    }

    return result;
  }
}