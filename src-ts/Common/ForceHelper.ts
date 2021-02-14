import { UnitHelper } from "./UnitHelper";
import { Vector2D } from "./Vector2D";
import { Constants } from "./Constants";

export module ForceHelper {
  export function addAllies(force: force, playerId: number) {
    const friendlyAllies = GetPlayersAllies(Player(playerId));
    ForForce(friendlyAllies, () => {
      ForceAddPlayer(force, GetEnumPlayer());
    });
    DestroyForce(friendlyAllies);
  }

  export function addNearbyEnemyAlliedPlayers(
    force: force, pos: Vector2D, aoe: number,
    playerId: number
  ) {
    const player = Player(playerId);
    const nearbyEnemies = CreateGroup();
    GroupEnumUnitsInRange(
      nearbyEnemies, 
      pos.x, 
      pos.y, 
      aoe, 
      null
    );

    ForGroup(nearbyEnemies, () => {
      const enemy = GetOwningPlayer(GetEnumUnit());
      const enemyId = GetPlayerId(enemy);
      if (
        enemyId >= 0 && enemyId < Constants.maxActivePlayers && 
        IsPlayerEnemy(player, enemy) && 
        !IsPlayerInForce(enemy, force)
      ) {
        ForceAddPlayer(force, enemy);
        const enemyAllies = GetPlayersAllies(enemy);
        ForForce(enemyAllies, () => {
          ForceAddPlayer(force, GetEnumPlayer());
        })
        DestroyForce(enemyAllies);
      }
    });

    DestroyGroup(nearbyEnemies);
  }
}