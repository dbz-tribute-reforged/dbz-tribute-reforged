import { Constants, Globals } from "Common/Constants";
import { CustomCreep } from "./CustomCreep";
import { Vector2D } from "Common/Vector2D";
import { DefaultCreepUpgradeConfig, CreepUpgradeConfig, CreepResearchUpgrade } from "./CreepUpgradeConfig";
import { RandomCreepTypeHelper } from "./CreepUpgradeTypes";
import { CoordMath } from "Common/CoordMath";
import { TimerManager } from "Core/Utility/TimerManager";

// Possible Optimisations: 
// use custom value of a unit for O(1)
// use customCreepType: Map<unitType, Map<unit, CustomCreep>> for faster replacement.
export class CreepManager {
  private static instance: CreepManager;

  protected creepPlayers: player[];
  protected maxNumCreeps: number;
  // Note: this version of creep respawn forgoes using the custom value of a unit
  // thus, accessing the associated respawn data for a creep is slower;
  // O(1) vs O(log n), assuming we have around 500 or so creeps 
  // then this system is about 9 times slower, should be low impact
  protected customCreeps: Map<unit, CustomCreep>;
  protected creepRespawnTrigger: trigger;
  
  protected creepResearchUpgradeTimer: timer;


  
  constructor (
    public creepUpgradeConfigs: CreepUpgradeConfig = DefaultCreepUpgradeConfig
  ) {
    this.creepPlayers = [];
    this.maxNumCreeps = 0;
    this.customCreeps = new Map();
    this.creepRespawnTrigger = CreateTrigger();
    this.creepResearchUpgradeTimer = CreateTimer();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CreepManager(DefaultCreepUpgradeConfig);
    }
    return this.instance;
  }

  initialize(): this {
    SetCreepCampFilterState(false);

    // pikkon
    let x = CreateUnit(Constants.sagaPlayer, FourCC("U01N"), -6100, 21300, 135);
    SetHeroLevel(x, 10, false);
    SetHeroStr(x, 400, true);
    SetHeroAgi(x, 400, true);
    SetHeroInt(x, 400, true);

    // yamcha
    x = CreateUnit(Constants.sagaPlayer, FourCC("U01O"), -7800, 21300, 45);
    SetHeroLevel(x, 3, false);
    SetHeroStr(x, 30, true);
    SetHeroAgi(x, 30, true);
    SetHeroInt(x, 30, true);

    // olibu
    x = CreateUnit(Constants.sagaPlayer, FourCC("U01M"), -6100, 23000, 225);
    SetHeroLevel(x, 6, false);
    SetHeroStr(x, 100, true);
    SetHeroAgi(x, 100, true);
    SetHeroInt(x, 100, true);

    // annin
    x = CreateUnit(Constants.sagaPlayer, FourCC("U01L"), 2900, 21200, 45);
    SetHeroLevel(x, 10, false);
    SetHeroStr(x, 400, true);
    SetHeroAgi(x, 400, true);
    SetHeroInt(x, 400, true);

    // mez
    x = CreateUnit(Constants.sagaPlayer, FourCC("U01K"), 4500, 21200, 135);
    SetHeroLevel(x, 3, false);
    SetHeroStr(x, 30, true);
    SetHeroAgi(x, 30, true);
    SetHeroInt(x, 30, true);

    // goz
    x = CreateUnit(Constants.sagaPlayer, FourCC("U01J"), 2900, 22700, 315);
    SetHeroLevel(x, 6, false);
    SetHeroStr(x, 100, true);
    SetHeroAgi(x, 100, true);
    SetHeroInt(x, 100, true);

    this.setupCreepPlayers();
    this.setupCustomCreeps().setupCustomCreepRespawn();

    return this;
  }

  setupCreepResearchUpgrade() {
    TimerStart(this.creepResearchUpgradeTimer, CreepResearchUpgrade.INTERVAL, true, () => {
      for (const player of this.creepPlayers) {
        for (const upgrade of CreepResearchUpgrade.UPGRADES_TO_RESEARCH) {
          SetPlayerTechResearched(
            player, 
            upgrade, 
            Math.min(
              CreepResearchUpgrade.MAX_LEVEL,
              1 + 
              GetPlayerTechCount(
                player,
                upgrade,
                true,
              )
            )
          )
        }
      }
    });
  }


  setupCreepPlayers(): this {
    // reminder to change constants if adding more players in
    // init creep players who will have creeps distributed to
    for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
      let player = Player(i);
      this.creepPlayers.push(player);
      // gui does it for us
      // CreateFogModifierRectBJ(true, player, FOG_OF_WAR_VISIBLE, GetPlayableMapRect());
      if (i == Constants.heavenHellCreepPlayerId) {
        SetPlayerAllianceStateBJ(player, Constants.sagaPlayer, bj_ALLIANCE_ALLIED);
        SetPlayerAllianceStateBJ(Constants.sagaPlayer, player, bj_ALLIANCE_ALLIED);
      } else {
        SetPlayerAllianceStateBJ(player, Constants.sagaPlayer, bj_ALLIANCE_ALLIED_VISION);
        SetPlayerAllianceStateBJ(Constants.sagaPlayer, player, bj_ALLIANCE_ALLIED_VISION);
      }
      for (let j = 0; j < Constants.maxPlayers; ++j) {
        if (i == j) continue;

        let allianceState = bj_ALLIANCE_ALLIED_VISION;
        if (j < Constants.maxActivePlayers) {
          allianceState = bj_ALLIANCE_UNALLIED;
        } else if (
          i == Constants.heavenHellCreepPlayerId || 
          j == Constants.heavenHellCreepPlayerId 
        ) {
          allianceState = bj_ALLIANCE_ALLIED;
        }
        SetPlayerAllianceStateBJ(player, Player(j), allianceState);
        SetPlayerAllianceStateBJ(Player(j), player, allianceState);
      }
    }

    for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
      let player = Player(i);
      SetPlayerName(player, "Creeps");
      SetPlayerColorBJ(player, PLAYER_COLOR_COAL, false);
      if (i == Constants.heavenHellCreepPlayerId) continue;

      SetPlayerAllianceStateVisionBJ(Constants.heavenHellCreepPlayer, player, false);
      SetPlayerAllianceStateVisionBJ(player, Constants.heavenHellCreepPlayer, false);
    }
    SetPlayerColorBJ(Constants.sagaPlayer, PLAYER_COLOR_MAROON, false);

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      let player = Player(i);
      SetPlayerAllianceStateBJ(Constants.heavenHellCreepPlayer, player, bj_ALLIANCE_UNALLIED);
      SetPlayerAllianceStateBJ(player, Constants.heavenHellCreepPlayer, bj_ALLIANCE_UNALLIED);
      SetPlayerAllianceStateVisionBJ(Constants.heavenHellCreepPlayer, player, false);
      SetPlayerAllianceStateVisionBJ(player, Constants.heavenHellCreepPlayer, false);
      SetPlayerAllianceStateVisionBJ(Player(PLAYER_NEUTRAL_PASSIVE), player, false);
      SetPlayerAllianceStateVisionBJ(player, Player(PLAYER_NEUTRAL_PASSIVE), false);
    }
    
    // distribute creeps into neutral aggressive as well
    // this.creepPlayers.push(Constants.sagaPlayer);

    FogModifierStart(
      CreateFogModifierRadius(
        Constants.sagaPlayer,
        FOG_OF_WAR_FOGGED,
        (Constants.heavenHellBottomLeft.x + Constants.heavenHellTopRight.x) / 2,
        (Constants.heavenHellBottomLeft.y + Constants.heavenHellTopRight.y) / 2,
        CoordMath.distance(Constants.heavenHellBottomLeft, Constants.heavenHellTopRight) / 2,
        true, false
      )
    );

    return this;
  }

  setupCustomCreeps(): this {
    let allCreeps = GetUnitsOfPlayerAll(Constants.sagaPlayer);
    
    let creepPlayerIndex = 0;
    ForGroup(allCreeps, () => {
      const creepUnit = GetEnumUnit();
      creepPlayerIndex = (creepPlayerIndex+1) % (this.creepPlayers.length);
      while (
        creepPlayerIndex + Constants.maxActivePlayers >= Constants.maxPlayers
        || creepPlayerIndex + Constants.maxActivePlayers == Constants.heavenHellCreepPlayerId
      ) {
        creepPlayerIndex = 0;
      }
      let creepPlayer = Player(creepPlayerIndex + Constants.maxActivePlayers);

      const x = GetUnitX(creepUnit);
      const y = GetUnitY(creepUnit);
      if (
        x > Constants.heavenHellBottomLeft.x &&
        y > Constants.heavenHellBottomLeft.y &&
        x < Constants.heavenHellTopRight.x &&
        y < Constants.heavenHellTopRight.y
      ) {
        creepPlayer = Constants.heavenHellCreepPlayer;
      }
      SetUnitOwner(creepUnit, creepPlayer, false);

      if (!IsUnitType(creepUnit, UNIT_TYPE_HERO)) {
        SetUnitAcquireRange(creepUnit, Constants.creepAggroRange);
      }

      this.customCreeps.set(
        creepUnit, 
        new CustomCreep(
          creepUnit, 
          GetUnitTypeId(creepUnit), 
          creepPlayer, 
          GetUnitX(creepUnit),
          GetUnitY(creepUnit), 
          GetUnitFacing(creepUnit),
          false
        )
      );
    });
    return this;
  }

  doCreepRespawn(oldCreep: unit, customCreep: CustomCreep) {
    if (IsUnitType(oldCreep, UNIT_TYPE_HERO)) {
      if (GetHeroLevel(oldCreep) < Constants.heavenHellMaxHeroLevel) {
        SetHeroLevel(oldCreep, GetHeroLevel(oldCreep) + 1, false);
      } else {
        SetHeroLevel(oldCreep, GetHeroLevel(oldCreep), false);
      }
      SetHeroStr(oldCreep, Math.floor(GetHeroStr(oldCreep, false) * 1.07 + 60), false);
      SetHeroAgi(oldCreep, Math.floor(GetHeroAgi(oldCreep, false) * 1.07 + 60), false);
      SetHeroInt(oldCreep, Math.floor(GetHeroInt(oldCreep, false) * 1.07 + 60), false);
    
      ReviveHero(oldCreep, customCreep.posX, customCreep.posY, false);
    } else {
      const newCreepUnit = CreateUnit(
        customCreep.owner, 
        customCreep.unitTypeId, 
        customCreep.posX, 
        customCreep.posY, 
        customCreep.facing,
      );

      SetUnitAcquireRange(newCreepUnit, Constants.creepAggroRange);

      // in with the new, out with the old
      const cc = this.customCreeps.get(oldCreep);
      cc.unit = newCreepUnit;
      cc.unitTypeId = customCreep.unitTypeId;
      cc.owner = customCreep.owner;
      cc.posX = customCreep.posX;
      cc.posY = customCreep.posY;
      cc.facing = customCreep.facing;
      cc.isUpgrading = false;
      this.customCreeps.set(newCreepUnit, cc);
      this.customCreeps.delete(oldCreep);
      RemoveUnit(oldCreep);
    }
  }

  // note: only respawns creeps that are placed on the map during init
  setupCustomCreepRespawn(): this {
    for (const creepPlayer of this.creepPlayers) {
      TriggerRegisterPlayerUnitEventSimple(
        this.creepRespawnTrigger,
        creepPlayer,
        EVENT_PLAYER_UNIT_DEATH,
      );
    }

    TriggerAddAction(
      this.creepRespawnTrigger, 
      () => {
        const creepUnit = GetTriggerUnit();
        const customCreep = this.customCreeps.get(creepUnit);
        if (customCreep) {
          let wait = Constants.creepRespawnReviveDelay;
          if (
            GetPlayerId(customCreep.owner) == Constants.heavenHellCreepPlayerId
          ) {
            wait = Constants.creepHeavenHellHeroRespawnDelay;
          }
          if (customCreep.isUpgrading) {
            customCreep.isUpgrading = false;
            wait = 1.5;
          }
          const timer = TimerManager.getInstance().get();
          TimerStart(timer, wait, false, () => {
            this.doCreepRespawn(creepUnit, customCreep);
            TimerManager.getInstance().recycle(timer);
          });
        }
      }
    );


    return this;
  }

  // upgrade func taking in an upgrade config
  // replaces the unittype id of a unit and trues the isupgrading flag
  // also apply random expiry timer that will feed into the respawn system
  // forcing a replace of the creep to the upgrade version if it isnt being chained
  upgradeCreeps(configName: string) {
    const config = this.creepUpgradeConfigs.upgradeGroups[configName];
    if (config) {
      // Logger.LogDebug("Performing upgrade: " + configName);
      let delay = 0;
      for (const [unit, customCreep] of this.customCreeps) {
        const newType = config.map.get(customCreep.unitTypeId);
        if (newType) {
          const newUnitTypeId = RandomCreepTypeHelper.getType(newType);
          if (newUnitTypeId == -1) continue;
          customCreep.unitTypeId = newUnitTypeId;
          // if not chaining, force replace
          const unitY = GetUnitY(unit);
          const unitX = GetUnitX(unit);
          if (
            unitY >= customCreep.posY - Constants.creepChainErrorMargin &&
            unitY <= customCreep.posY + Constants.creepChainErrorMargin &&
            unitX >= customCreep.posX - Constants.creepChainErrorMargin &&
            unitX <= customCreep.posX + Constants.creepChainErrorMargin
          ) {
            customCreep.isUpgrading = true;
            UnitApplyTimedLife(
              unit, 
              Constants.creepUpgradeBuff, 
              1 + (delay + 1) % Constants.creepUpgradeDeathDelay,
            );
            delay++;
          }
        }
      }
    }
  }

}