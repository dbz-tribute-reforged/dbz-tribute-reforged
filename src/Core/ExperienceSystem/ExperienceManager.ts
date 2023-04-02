import { Constants, Globals, Id } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";
import { TextTagHelper } from "Common/TextTagHelper";
import { UnitHelper } from "Common/UnitHelper";

  
// temporarily give xp until neutral hostile is fixed
function give_auto_exp() {
  const u = GetEnumUnit();
  const p = GetOwningPlayer(u);
  const pId = GetPlayerId(p);
  if (
    IsUnitType(u, UNIT_TYPE_HERO)
    && pId < Constants.maxActivePlayers
    && UnitHelper.isUnitAlive(u)
    && !IsUnitType(u, UNIT_TYPE_SUMMONED)
    && !IsUnitIllusion(u)
  ) {
    const xp = (
      ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(u)+1)
      - ExperienceManager.getInstance().getHeroReqLevelXP(GetHeroLevel(u))
    );

    if (xp > 0) {
      AddHeroXP(u, xp, false);
    } else {
      AddHeroXP(u, 50, false);
    }
  }
}

export module ExperienceConstants {
  // hero req exp
  // need additional (lvl X * 25) xp to reach lvl X
  // legacy 200, 1.0, 100 (but xp rate was 400% instead of 100%)
  export const reqBase = 50;
  export const reqPrevMult = 1.0;
  export const reqLevelMult = 25;
  export const reqConstant = 0;

  // creep xp table
  // legacy: 25, 1.0, 5, 5
  export const creepBase = 25;
  export const creepPrevMult = 1.0;
  export const creepLevelMult = 5;
  export const creepConstant = 5;

  // hero xp table
  // legacy 50, 1.0, 0.0, 100
  export const heroBase = 50;
  export const heroPrevMult = 1.0;
  export const heroLevelMult = 0.0;
  export const heroConstant = 100;

  export const creepXPModifier = 0.5;
  export const globalXPRateModifier = 1.1;
  export const nearbyPlayerXPMult = 0.15;
  export const bonusXPToNextLevel = 0.025;
  // legacy range: 3000
  export const expRange = 2500;
}

export class ExperienceManager {
  static instance: ExperienceManager;

  protected levelReqXP: number[];
  protected creepXP: number[];
  protected heroXP: number[];

  // protected unitXPModifier: Map<number, number>;
  protected rewardXPTrigger: trigger;
  protected dyingPos: Vector2D;

  protected rewardedGroup: group;

  constructor (
  ) {
    this.levelReqXP = [];
    this.creepXP = [];
    this.heroXP = [];
    // this.unitXPModifier = new Map();
    this.rewardXPTrigger = CreateTrigger();
    this.dyingPos = new Vector2D();
    this.rewardedGroup = CreateGroup();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ExperienceManager();
    }
    return this.instance;
  }

  initialize(): this {
    this.levelReqXP.push(ExperienceConstants.reqBase);
    this.setupXPTables(
      this.levelReqXP, 
      ExperienceConstants.reqBase,
      ExperienceConstants.reqPrevMult,
      ExperienceConstants.reqLevelMult,
      ExperienceConstants.reqConstant,
      Constants.maxHeroLevel,
    )

    this.setupXPTables(
      this.heroXP, 
      ExperienceConstants.heroBase,
      ExperienceConstants.heroPrevMult,
      ExperienceConstants.heroLevelMult,
      ExperienceConstants.heroConstant,
      Constants.maxHeroLevel,
    );
    
    this.setupXPTables(
      this.creepXP,
      ExperienceConstants.creepBase,
      ExperienceConstants.creepPrevMult,
      ExperienceConstants.creepLevelMult,
      ExperienceConstants.creepConstant,
      Constants.maxCreepLvl,
    )

    this.setupUnitXPModifiers();

    this.setupRewardXPTrigger(this.rewardXPTrigger);


    // TimerStart(CreateTimer(), 60.0, true, () => {
    //   if (Globals.isMainGameStarted && !Globals.isFBSimTest) {
    //     GroupEnumUnitsInRect(Globals.tmpUnitGroup, GetPlayableMapRect(), null);
    //     ForGroup(Globals.tmpUnitGroup, give_auto_exp);
    //   }
    // });

    return this;
  }

  setupXPTables(
    table: number[], 
    base: number, 
    prevMult: number,
    levelMult: number,
    constant: number,
    maxLevel: number,
  ) {
    table.push(base);
    table.push(base);
    for (let i = table.length; i <= maxLevel; ++i) {
      const value = table[i-1] * prevMult + i * levelMult + constant;
      table.push(value);
    }
  }

  getHeroReqLevelXP(level: number) : number {
    if (level > 0 && level < this.levelReqXP.length) {
      return this.levelReqXP[level];
    }
    return 0;
  }

  getHeroKillXP(level: number): number {
    if (level > 0 && level < this.heroXP.length) {
      return this.heroXP[level];
    }
    return 0;
  }

  getCreepKillXP(level: number): number {
    if (level > 0 && level < this.creepXP.length) {
      return this.creepXP[level] * ExperienceConstants.creepXPModifier;
    }
    return 0;
  }

  setupUnitXPModifiers() {
    // androids 13/14/15
    // this.unitXPModifier.set(FourCC("H01V"), 0.5);
    // this.unitXPModifier.set(FourCC("H01S"), 0.5);
    // this.unitXPModifier.set(FourCC("H01T"), 0.5);
  }

  setupRewardXPTrigger(rewardTrigger: trigger) {
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      TriggerRegisterPlayerUnitEvent(rewardTrigger, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
    }
    TriggerRegisterPlayerUnitEvent(rewardTrigger, Player(PLAYER_NEUTRAL_AGGRESSIVE), EVENT_PLAYER_UNIT_DEATH, null);

    TriggerAddAction(rewardTrigger, () => {
      const dyingUnit = GetDyingUnit();
      const dyingPlayer = GetOwningPlayer(dyingUnit);
      const killingUnit = GetKillingUnit();
      const killingPlayer = GetOwningPlayer(killingUnit);

      // count number of nearby allies
      if (IsPlayerEnemy(dyingPlayer, killingPlayer)) {
        this.dyingPos.setUnit(dyingUnit);

        let rewardXP: number = 0;
        if (IsUnitType(dyingUnit, UNIT_TYPE_HERO)) {
          rewardXP = this.heroXP[GetHeroLevel(dyingUnit)];
        } else {
          rewardXP = this.creepXP[GetUnitLevel(dyingUnit)];
        }

        const dyingPlayerId = GetPlayerId(dyingPlayer);
        // const killingPlayerId = GetPlayerId(killingPlayer);
        
        if (dyingPlayerId >= Constants.maxActivePlayers) {
          // share exp with anyone else who is also nearby
          // treats dying player as an enemy
          // this.getNearbyXPHeroes(
          //   rewardedGroup, 
          //   dyingPos, 
          //   ExperienceConstants.expRange,
          //   dyingPlayer,
          // );
          GroupEnumUnitsInRange(
            this.rewardedGroup, 
            this.dyingPos.x, 
            this.dyingPos.y, 
            ExperienceConstants.expRange,
            null
          );
        } else {
          // share exp with allies only
          GroupEnumUnitsInRange(
            this.rewardedGroup, 
            this.dyingPos.x, 
            this.dyingPos.y, 
            ExperienceConstants.expRange,
            null
          );
        }

        ForGroup(this.rewardedGroup, () => {
          const testUnit = GetEnumUnit();
          if (
            IsUnitType(testUnit, UNIT_TYPE_HERO) &&
            IsUnitAlly(testUnit, killingPlayer) &&
            !IsUnitOwnedByPlayer(testUnit, Player(PLAYER_NEUTRAL_PASSIVE)) && 
            !IsUnitType(testUnit, UNIT_TYPE_DEAD) &&
            !IsUnitType(testUnit, UNIT_TYPE_SUMMONED) &&
            GetUnitTypeId(testUnit) != Id.metalCoolerClone
          ) {
            // leave in group
          } else {
            // remove that unit from group
            GroupRemoveUnit(this.rewardedGroup, testUnit);
          }
        })

        // count num different players nearby
        let numUniquePlayers = 0;
        let numPlayerUnits: number[] = [];
        for (let i = 0; i < Constants.maxActivePlayers; ++i) {
          numPlayerUnits[i] = 0;
        }
        ForGroup(this.rewardedGroup, () => {
          const playerId = GetPlayerId(GetOwningPlayer(GetEnumUnit()));
          if (playerId >= 0 && playerId < Constants.maxActivePlayers) {
            if (numPlayerUnits[playerId] == 0) {
              ++numUniquePlayers;
            }
            ++numPlayerUnits[playerId];
          }
        });

        // % that gets distributed,
        // minimum each hero gets 10%
        // per adam:
        // 1 : 100%
        // 2 : 90% * 2
        // 3 : 80% * 3 and so on

        // new
        // 1 : 100%
        // 2 : 85% * 2
        // 3 : 70% * 3
        // etc until 10%
        const rewardMult = Math.max(
          ExperienceConstants.nearbyPlayerXPMult, 
          Math.min(
            1 - ExperienceConstants.nearbyPlayerXPMult * (numUniquePlayers - 1),
            1,
          ),
        );

        rewardXP = Math.floor(
          rewardXP * rewardMult * ExperienceConstants.globalXPRateModifier
        );

        ForGroup(this.rewardedGroup, () => {
          const rewardedUnit = GetEnumUnit();

          const heroLevel = GetHeroLevel(rewardedUnit);
          rewardXP += (
            ExperienceConstants.bonusXPToNextLevel *
            rewardMult * 
            (
              this.levelReqXP[heroLevel + 1 % this.levelReqXP.length] 
              -
              this.levelReqXP[heroLevel % this.levelReqXP.length]
            ) *
            ExperienceConstants.globalXPRateModifier
          );

          let xpModifier = 1;
          const nearbyPlayerUnits = numPlayerUnits[GetPlayerId(GetOwningPlayer(rewardedUnit))];
          if (nearbyPlayerUnits == 3) {            
            xpModifier = 0.5;
          } else if (nearbyPlayerUnits == 2) {
            xpModifier = 0.75;
          } else if (nearbyPlayerUnits > 3) {
            xpModifier = Math.max(0.1, 1.5 / nearbyPlayerUnits);
          }

          AddHeroXP(
            rewardedUnit, 
            Math.floor(rewardXP * xpModifier), 
            true
          );
          
          // const xpModifier = this.unitXPModifier.get(GetUnitTypeId(rewardedUnit));
          // if (xpModifier != undefined) {
          //   AddHeroXP(
          //     rewardedUnit, 
          //     Math.floor(rewardXP * xpModifier), 
          //     true
          //   );
          // } else {
          //   AddHeroXP(
          //     rewardedUnit, 
          //     rewardXP, 
          //     true
          //   );
          // }
          // exp floating text is provided for us
          // although it might be possible to disable
          // and manually do it
          /*
          TextTagHelper.showPlayerColorTextToForce(
            "+" + rewardXP + " xp", 
            GetUnitX(rewardedUnit),
            GetUnitY(rewardedUnit),
            0, 0, 64, 
            GetPlayersAll(),
            8, 
            105, 155, 205, 205,
            24, 90, 
            3, 4
          )
          */
        });

        GroupClear(this.rewardedGroup);
      }

    });

  }
}