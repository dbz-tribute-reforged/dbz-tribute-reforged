import { Constants, Globals } from "./Constants";
import { Vector2D } from "./Vector2D";

export module VisionHelper {
  export function showFbArenaVision() {
    if (Globals.isFBArenaVision) return;
    
    Globals.isFBArenaVision = true;
    const FinalBattleArenaRHS = Rect(-1568.0, 23424.0, 2400.0, 31232.0);
    const FinalBattleArenaLHS = Rect(-5440.0, 23424.0, -1536.0, 31264.0);
    for (const player of Constants.activePlayers) {
      FogModifierStart(CreateFogModifierRect(player, FOG_OF_WAR_VISIBLE, FinalBattleArenaRHS, true, false));
      FogModifierStart(CreateFogModifierRect(player, FOG_OF_WAR_VISIBLE, FinalBattleArenaLHS, true, false));
    }
    RemoveRect(FinalBattleArenaRHS);
    RemoveRect(FinalBattleArenaLHS);
  }

  export function startFogModifierRadius(
    players: player[],
    pos: Vector2D,
    radius: number,
    fog_state: fogstate,
    start: boolean
  ): fogmodifier[] {
    const fogs: fogmodifier[] = [];
    for (const player of players) {
      const fog = CreateFogModifierRadius(player, fog_state, pos.x, pos.y, radius, true, false);
      if (start) FogModifierStart(fog);
      fogs.push(fog);
    }
    return fogs;
  }
}