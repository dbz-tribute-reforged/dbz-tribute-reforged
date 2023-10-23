import { TimerManager } from "Core/Utility/TimerManager";

export module CameraZoom {

    const ZOOM_DEFAULT = 3600.0;
    const ANGLE_DEFAULT = 295.0;
    // const FOV_DEFAULT = ((4000.00 - 1400.0) / 45.0) + 70.0; //?? but it works tho, thanks adam
    const FOV_DEFAULT = ((4000.00 - 1400.0) / 45.0) + 50.0; //?? but it works tho, thanks adam
    const PERIOD = 1.0;

    const ZOOM_MIN = 1400.0;
    const ZOOM_MAX = 6000.0;

    const ANGLE_MIN = 270.0;
    const ANGLE_MAX = 360.0;

    class PlayerCam {
        constructor(
            public p: player,
            public zoom: number,
            public angle: number,
        ) {

        }

        public performZoom() {
            if (GetLocalPlayer() == this.p) {
                SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, this.zoom, 0.0);
                SetCameraField(CAMERA_FIELD_FARZ, 10000, 0.0);
                SetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK, this.angle, 0.0);
                SetCameraField(CAMERA_FIELD_FIELD_OF_VIEW, FOV_DEFAULT, 0.0);
                SetCameraField(CAMERA_FIELD_ZOFFSET, 0.0, 0.0);
            }
        }
    }

    let arr: PlayerCam[] = [];

    export function onInit() {

        let zoomTrig = CreateTrigger();
        let angleTrig = CreateTrigger();
        for (let i = 0; i < bj_MAX_PLAYERS; i++) {
            arr.push(new PlayerCam(Player(i), ZOOM_DEFAULT, ANGLE_DEFAULT));
            if (GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING) {
                TriggerRegisterPlayerChatEvent(zoomTrig, Player(i), "-cam ", false);
                TriggerRegisterPlayerChatEvent(zoomTrig, Player(i), "-zoom ", false);
                TriggerRegisterPlayerChatEvent(angleTrig, Player(i), "-ang ", false);
            }
        }

        TriggerAddCondition(zoomTrig, Condition(() => {
            let cam = arr[GetPlayerId(GetTriggerPlayer())];
            const chatString = GetEventPlayerChatString();
            const command = SubString(chatString, 0, 5);

            let newZoom = 3000;
            if (command == "-cam ") {
                newZoom = S2R(SubString(chatString, 5, StringLength(GetEventPlayerChatString())));
            } else if (command == "-zoom") {
                newZoom = S2R(SubString(chatString, 6, StringLength(GetEventPlayerChatString())));
            } 

            if (newZoom > ZOOM_MAX) newZoom = ZOOM_MAX;
            else if (newZoom < ZOOM_MIN) newZoom = ZOOM_MIN;

            cam.zoom = newZoom;
            cam.performZoom();

            return false;
        }));

        TriggerAddCondition(angleTrig, Condition(() => {
            let cam = arr[GetPlayerId(GetTriggerPlayer())];
            let newAngle = ANGLE_MAX - S2R(SubString(GetEventPlayerChatString(), 5, StringLength(GetEventPlayerChatString())));

            if (newAngle > ANGLE_MAX) newAngle = ANGLE_MAX;
            else if (newAngle < ANGLE_MIN) newAngle = ANGLE_MIN;

            cam.angle = newAngle;
            cam.performZoom();

            return false;
        }));

        
        arr.forEach(element => {
            if (
                GetCameraField(CAMERA_FIELD_TARGET_DISTANCE) != element.zoom
                && GetLocalPlayer() == element.p
            ) {
                element.performZoom();
            }
        });

        const timer = TimerManager.getInstance().get();
        TimerStart(timer, 1, false, () => {
            TimerStart(CreateTimer(), PERIOD, true, () => {
                arr.forEach(element => {
                    if (
                        GetCameraField(CAMERA_FIELD_TARGET_DISTANCE) != element.zoom
                        && GetLocalPlayer() == element.p
                    ) {
                        element.performZoom();
                    }
                });
            });
            TimerManager.getInstance().recycle(timer);
        });
    }
}