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
    force: force, x: number, y: number, aoe: number,
    playerId: number
  ) {
    const nearbyEnemies = UnitHelper.getNearbyValidUnits(
      new Vector2D(x, y),
      aoe,
      () => {
        const enemy = GetOwningPlayer(GetFilterUnit());
        const enemyId = GetPlayerId(enemy);
        if (
          enemyId >= 0 && enemyId < Constants.maxActivePlayers && 
          IsPlayerEnemy(Player(playerId), enemy) && 
          !IsPlayerInForce(enemy, force)
        ) {
          ForceAddPlayer(force, enemy);
          const enemyAllies = GetPlayersAllies(enemy);
          ForForce(enemyAllies, () => {
            ForceAddPlayer(force, GetEnumPlayer());
          })
          DestroyForce(enemyAllies);
        }
        return false;
      }
    );

    DestroyGroup(nearbyEnemies);
  }
}