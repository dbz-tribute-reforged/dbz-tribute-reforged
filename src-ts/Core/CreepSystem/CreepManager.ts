import { Constants } from "Common/Constants";
import { CustomCreep } from "./CustomCreep";
import { Vector2D } from "Common/Vector2D";

export class CreepManager {

  protected creepPlayers: player[];
  protected maxNumCreeps: number;
  protected customCreep: CustomCreep[];
  protected creepRespawnDeathDelay: number;
  protected creepRespawnReviveDelay: number;

  constructor (

  ) {
    this.creepPlayers = [];
    this.maxNumCreeps = 0;
    this.customCreep = [];
    this.creepRespawnDeathDelay = Constants.defaultCreepRespawnDeathDelay;
    this.creepRespawnReviveDelay = Constants.defaultCreepRespawnReviveDelay;
  }

  initialize(): this {
    SetCreepCampFilterState(false);
    // reminder to change constants if adding more players in
    // init creep players who will have creeps distributed to
    for (let i = Constants.maxActivePlayers; i < Constants.maxPlayers; ++i) {
      let player = Player(i);
      this.creepPlayers.push(player);
      CreateFogModifierRectBJ(true, player, FOG_OF_WAR_VISIBLE, GetPlayableMapRect());
      SetPlayerAllianceStateBJ(player, Player(PLAYER_NEUTRAL_AGGRESSIVE), bj_ALLIANCE_ALLIED_VISION);
      SetPlayerAllianceStateBJ(Player(PLAYER_NEUTRAL_AGGRESSIVE), player, bj_ALLIANCE_ALLIED_VISION);
      for (let j = 0; j < Constants.maxActivePlayers; ++j) {
        let allianceState = bj_ALLIANCE_ALLIED_VISION;
        if (j <= Constants.maxActivePlayers) {
          allianceState = bj_ALLIANCE_UNALLIED;
        }
        SetPlayerAllianceStateBJ(player, ConvertedPlayer(j), allianceState)
        SetPlayerAllianceStateBJ(ConvertedPlayer(j), player, allianceState)
      }
    }

    let allCreeps = GetUnitsOfPlayerAll(Player(PLAYER_NEUTRAL_AGGRESSIVE));
    
    let i = Constants.maxActivePlayers;
    ForGroup(allCreeps, () => {
      const unit = GetEnumUnit();
      const creepPlayer = Player(i + Constants.maxActivePlayers);
      i = (i+1) % (this.creepPlayers.length - 1);
      const customCreep = new CustomCreep(
        unit, GetUnitTypeId(unit), 
        creepPlayer, 
        new Vector2D(GetUnitX(unit), GetUnitY(unit)), false
      );
      this.customCreep.push(customCreep);
    })

    return this;
  }

}