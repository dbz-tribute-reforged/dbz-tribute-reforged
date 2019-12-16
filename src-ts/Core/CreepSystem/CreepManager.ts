import { Constants } from "Common/Constants";
import { CustomCreep } from "./CustomCreep";
import { Vector2D } from "Common/Vector2D";
import { DefaultCreepUpgradeConfig, CreepUpgradeConfig } from "./CreepUpgradeConfig";
import { Hooks } from "Libs/TreeLib/Hooks";
import { RandomCreepTypeHelper } from "./CreepUpgradeTypes";
import { Logger } from "Libs/TreeLib/Logger";

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
  // then this system is about 9 times slower, 
  protected customCreeps: Map<unit, CustomCreep>;
  protected creepRespawnTrigger: trigger;


  constructor (
    public creepUpgradeConfigs: CreepUpgradeConfig = DefaultCreepUpgradeConfig
  ) {
    this.creepPlayers = [];
    this.maxNumCreeps = 0;
    this.customCreeps = new Map();
    this.creepRespawnTrigger = CreateTrigger();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CreepManager(DefaultCreepUpgradeConfig);
      Hooks.set("CreepManager", this.instance);
    }
    return this.instance;
  }

  initialize(): this {
    SetCreepCampFilterState(false);

    this.setupCreepPlayers();
    this.setupCustomCreeps().setupCustomCreepRespawn();

    return this;
  }


  setupCreepPlayers(): this {
    // reminder to change constants if adding more players in
    // init creep players who will have creeps distributed to
    for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
      let player = Player(i);
      this.creepPlayers.push(player);
      // gui does it for us
      // CreateFogModifierRectBJ(true, player, FOG_OF_WAR_VISIBLE, GetPlayableMapRect());
      SetPlayerAllianceStateBJ(player, Player(PLAYER_NEUTRAL_AGGRESSIVE), bj_ALLIANCE_ALLIED_VISION);
      SetPlayerAllianceStateBJ(Player(PLAYER_NEUTRAL_AGGRESSIVE), player, bj_ALLIANCE_ALLIED_VISION);
      for (let j = 0; j < Constants.maxPlayers; ++j) {
        let allianceState = bj_ALLIANCE_ALLIED_VISION;
        if (j <= Constants.maxActivePlayers) {
          allianceState = bj_ALLIANCE_UNALLIED;
        }
        SetPlayerAllianceStateBJ(player, ConvertedPlayer(j), allianceState)
        SetPlayerAllianceStateBJ(ConvertedPlayer(j), player, allianceState)
      }
    }
    // distribute creeps into neutral aggressive as well
    this.creepPlayers.push(Player(PLAYER_NEUTRAL_AGGRESSIVE));

    return this;
  }

  setupCustomCreeps(): this {
    let allCreeps = GetUnitsOfPlayerAll(Player(PLAYER_NEUTRAL_AGGRESSIVE));
    
    let creepPlayerIndex = Constants.maxActivePlayers;
    ForGroup(allCreeps, () => {
      const creepUnit = GetEnumUnit();
      const creepPlayer = Player(creepPlayerIndex + Constants.maxActivePlayers);
      creepPlayerIndex = (creepPlayerIndex+1) % (this.creepPlayers.length);

      SetUnitOwner(creepUnit, creepPlayer, false);

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
      Logger.LogDebug("Performing upgrade: " + configName);
      for (const [unit, customCreep] of this.customCreeps) {
        const newType = config.map.get(customCreep.unitTypeId);
        if (newType) {
          customCreep.unitTypeId = RandomCreepTypeHelper.getType(newType);
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