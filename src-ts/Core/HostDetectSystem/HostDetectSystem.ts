export module HostDetectSystem {
    let HostDetectHT = InitHashtable();
    let LocalHostFlag = !HaveSavedString(HostDetectHT, 0, 0) && (BlzGetFrameByName("NameMenu", 1) == null) && Location(0, 0) != null && SaveStr(HostDetectHT, 0, 0, "1");
    let SyncTrig = CreateTrigger();
    let EventTrig = CreateTrigger();
    let HostPlayer: player;

    export function GetHost() : player {
        return HostPlayer;
    }

    export function IsHostDetected() : boolean {
        return HostPlayer != null
    }

    export function HostDetectAddAction(callback: () => void) : triggeraction {
        return TriggerAddAction(EventTrig, callback);
    }

    export function HostDetectRemoveAction(action: triggeraction) {
        TriggerRemoveAction(EventTrig, action)
    }

    function IsLocalPlayerHost() {
        return LocalHostFlag;
    }

    function OnHostSync() {
        HostPlayer = GetTriggerPlayer()
        TriggerExecute(EventTrig)
        DisableTrigger(GetTriggeringTrigger())
    }

    export function onInit() {
        for(let i = 0; i <= bj_MAX_PLAYERS; i++) {
            BlzTriggerRegisterPlayerSyncEvent(SyncTrig, Player(i), "hostdetect", false);
        }
        TriggerAddAction(SyncTrig, OnHostSync);
        if(IsLocalPlayerHost()) {
            BlzSendSyncData("hostdetect", "1");
        }
    }
}

