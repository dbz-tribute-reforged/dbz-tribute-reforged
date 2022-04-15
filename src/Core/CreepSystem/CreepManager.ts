import { Constants } from "Common/Constants";
import { CustomCreep } from "./CustomCreep";
import { Vector2D } from "Common/Vector2D";
import { DefaultCreepUpgradeConfig, CreepUpgradeConfig, CreepResearchUpgrade } from "./CreepUpgradeConfig";
import { RandomCreepTypeHelper } from "./CreepUpgradeTypes";
import { CoordMath } from "Common/CoordMath";

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
    
    let creepPlayerIndex = Constants.maxActivePlayers;
    ForGroup(allCreeps, () => {
      const creepUnit = GetEnumUnit();
      creepPlayerIndex = (creepPlayerIndex+1) % (this.creepPlayers.length);
      while (
        creepPlayerIndex + Constants.maxActivePlayers >= Constants.maxPlayers || 
        creepPlayerIndex == Constants.heavenHellCreepPlayerId
      ) {
        creepPlayerIndex = (creepPlayerIndex+1) % (this.creepPlayers.length);
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
          new Vector2D(GetUnitX(creepUnit), GetUnitY(creepUnit)), 
          GetUnitFacing(creepUnit),
          false
        )
      );
    });
    return this;
  }

  doCreepRespawn(oldCreep: unit, customCreep: CustomCreep) {
    let newCreepUnit = CreateUnit(
      customCreep.owner, 
      customCreep.unitTypeId, 
      customCreep.position.x, 
      customCreep.position.y, 
      customCreep.facing,
    );

    if (IsUnitType(newCreepUnit, UNIT_TYPE_HERO)) {
      if (GetHeroLevel(oldCreep) < Constants.heavenHellMaxHeroLevel) {
        SetHeroLevel(newCreepUnit, GetHeroLevel(oldCreep) + 1, false);
      } else {
        SetHeroLevel(newCreepUnit, GetHeroLevel(oldCreep), false);
      }
      SetHeroStr(newCreepUnit, Math.floor(GetHeroStr(oldCreep, false) * 1.07 + 60), false);
      SetHeroAgi(newCreepUnit, Math.floor(GetHeroAgi(oldCreep, false) * 1.07 + 60), false);
      SetHeroInt(newCreepUnit, Math.floor(GetHeroInt(oldCreep, false) * 1.07 + 60), false);
    } else {
      SetUnitAcquireRange(newCreepUnit, Constants.creepAggroRange);
    }
    
    // in with the new, out with the old
    this.customCreeps.set(newCreepUnit, new CustomCreep(
      newCreepUnit,
      customCreep.unitTypeId,
      customCreep.owner,
      new Vector2D(customCreep.position.x, customCreep.position.y),
      customCreep.facing,
      false,
    ));
    this.customCreeps.delete(oldCreep);
    RemoveUnit(oldCreep);
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
            wait = Math.random() + 0.1;
          }
          TimerStart(CreateTimer(), wait, false, () => {
            this.doCreepRespawn(creepUnit, customCreep);
            DestroyTimer(GetExpiredTimer());
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
            unitY >= customCreep.position.y - Constants.creepChainErrorMargin &&
            unitY <= customCreep.position.y + Constants.creepChainErrorMargin &&
            unitX >= customCreep.position.x - Constants.creepChainErrorMargin &&
            unitX <= customCreep.position.x + Constants.creepChainErrorMargin
          ) {
            customCreep.isUpgrading = true;
            UnitApplyTimedLife(
              unit, 
              Constants.creepUpgradeBuff, 
              1 + Math.random() * Constants.creepUpgradeDeathDelay,
            )
          }
        }
      }
    }
  }

}