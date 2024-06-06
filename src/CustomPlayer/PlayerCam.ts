import { Constants, Globals } from "Common/Constants";
import { TimerManager } from "Core/Utility/TimerManager";

export class PlayerCam {
  public static ZOOM_DEFAULT = 3600.0;
  public static ANGLE_DEFAULT = 295.0;
  public static ROTATION_DEFAULT = 90.0;
  // const FOV_DEFAULT = ((4000.00 - 1400.0) / 45.0) + 70.0; //?? but it works tho, thanks adam
  public static FOV_DEFAULT = ((4000.00 - 1400.0) / 45.0) + 50.0; //?? but it works tho, thanks adam
  public static PERIOD = 0.1;

  public static ZOOM_MIN = 1400.0;
  public static ZOOM_MAX = 6000.0;

  public static ANGLE_MIN = 270.0;
  public static ANGLE_MAX = 360.0;

  public static ROTATION_MAX = 360.0;

  public static Init() {
    const zoomTimer = TimerManager.getInstance().get();
    TimerStart(zoomTimer, PlayerCam.PERIOD, true, () => {
      for (const player of Constants.activePlayers) {
        const playerId = GetPlayerId(player);
        if (
          GetLocalPlayer() == player
          && Globals.customPlayers[playerId].hasCamChanged()
        ) {
          Globals.customPlayers[playerId].performZoom();
        }
      }
    });

    const setCamZoom = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(setCamZoom, player, "-zoom",  false);
      TriggerRegisterPlayerChatEvent(setCamZoom, player, "-cam", false);
    }
    TriggerAddCondition(setCamZoom, Condition(() => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      const str = GetEventPlayerChatString();
      const zoom = SubString(str, 1, 4) == "zoo" ?
        S2R(SubString(str, 6, 10)) :
        S2R(SubString(str, 5, 9))
      ;
      Globals.customPlayers[playerId].playerCam.setZoom(zoom);
      return false;
    }));

    const setCamAng = CreateTrigger();
    for (const player of Constants.activePlayers) {
      TriggerRegisterPlayerChatEvent(setCamAng, player, "-ang", false);
    }
    TriggerAddCondition(setCamAng, Condition(() => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);
      const angle = S2R(SubString(GetEventPlayerChatString(), 5, 8));
      Globals.customPlayers[playerId].playerCam.setAngle(angle);
      return false;
    }));
  }

  constructor(
    public player: player,
    public zoom: number = PlayerCam.ZOOM_DEFAULT,
    public angle: number = PlayerCam.ANGLE_DEFAULT,
    public rotation: number = PlayerCam.ROTATION_DEFAULT,
  ) {
  }

  hasChanged() {
    return GetCameraField(CAMERA_FIELD_TARGET_DISTANCE) != this.zoom;
  }

  setNoUpdate(zoom: number, angle: number, rotation: number) {
    this.zoom = zoom;
    this.angle = angle;
    this.rotation = rotation;
  }

  setZoom(zoom: number) {
    this.zoom = Math.min(PlayerCam.ZOOM_MAX, Math.max(PlayerCam.ZOOM_MIN, zoom));
    this.update();
  }

  setAngle(angle: number) {
    this.angle = Math.min(PlayerCam.ANGLE_MAX, Math.max(PlayerCam.ANGLE_MIN, PlayerCam.ANGLE_MAX - angle));
    this.update();
  }

  setRotation(rotation: number) {
    this.rotation = Math.min(0, Math.max(PlayerCam.ROTATION_MAX, rotation));
    this.update();
  }

  update() {
    if (GetLocalPlayer() == this.player) {
      SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, this.zoom, 0.0);
      SetCameraField(CAMERA_FIELD_FARZ, 10000, 0.0);
      SetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK, this.angle, 0.0);
      SetCameraField(CAMERA_FIELD_ROTATION, this.rotation, 0.0);
      SetCameraField(CAMERA_FIELD_FIELD_OF_VIEW, PlayerCam.FOV_DEFAULT, 0.0);
      SetCameraField(CAMERA_FIELD_ZOFFSET, 0.0, 0.0);
    }
  }
}