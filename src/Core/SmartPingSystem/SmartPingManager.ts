import { Colorizer } from "Common/Colorizer";
import { Constants, Globals } from "Common/Constants";
import { CoordMath } from "Common/CoordMath";
import { ForceHelper } from "Common/ForceHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { KeyInput } from "Core/KeyInputSystem/KeyInput";
import { KeyInputManager } from "Core/KeyInputSystem/KeyInputManager";
import { TimerManager } from "Core/Utility/TimerManager";

export class SmartPingManager {
  static instance: SmartPingManager;
  static readonly PING_ALERT: number = 1;
  static readonly PING_X: number = 2;
  static readonly PING_GATHER: number = 3;

  static readonly FADE_PERIOD: number = 3;
  static readonly MESSAGE_DELAY_PERIOD: number = 15;
  static readonly MAX_PINGS: number = 10;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SmartPingManager();
    }
    return this.instance;
  }

  public timeSinceLastPing: Map<player, number> = new Map();
  public pingsPerPlayer: Map<player, number> = new Map();
  public pingTrigger: trigger = CreateTrigger();

  constructor() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerMouseEventBJ(this.pingTrigger, Player(i), bj_MOUSEEVENTTYPE_DOWN);
    }
    TriggerAddCondition(this.pingTrigger, Condition(() => {
      const player = GetTriggerPlayer();
      const playerId = GetPlayerId(player);

      const mouseButton = BlzGetTriggerPlayerMouseButton();

      if (mouseButton == MOUSE_BUTTON_TYPE_LEFT) {
        const xPos = BlzGetTriggerPlayerMouseX();
        const yPos = BlzGetTriggerPlayerMouseY();
        const ki_alt = Globals.customPlayers[playerId].getOsKeyInput(OSKEY_LALT);
        const ki_shift = Globals.customPlayers[playerId].getOsKeyInput(OSKEY_LSHIFT);
        const ki_ctrl = Globals.customPlayers[playerId].getOsKeyInput(OSKEY_LCONTROL);

        const is_retreat_ping = (
          (ki_alt && ki_alt.isDown && ki_alt.meta == KeyInput.META_CONTROL + KeyInput.META_ALT)
          || (ki_ctrl && ki_ctrl.isDown && ki_ctrl.meta == KeyInput.META_CONTROL + KeyInput.META_ALT)
        );
        const is_generic_ping = (
          (ki_alt && ki_alt.isDown && ki_alt.meta == KeyInput.META_NONE + KeyInput.META_ALT)
        );
        const is_group_ping = (
          (ki_alt && ki_alt.isDown && ki_alt.meta == KeyInput.META_SHIFT + KeyInput.META_ALT)
          || (ki_shift && ki_shift.isDown && ki_shift.meta == KeyInput.META_SHIFT + KeyInput.META_ALT)
        )
        
        if (is_retreat_ping) {
          this.doPing(player, SmartPingManager.PING_X, xPos, yPos);
        } else if (is_group_ping) {
          this.doPing(player, SmartPingManager.PING_GATHER, xPos, yPos);
        } else if (is_generic_ping) {
          this.doPing(player, SmartPingManager.PING_ALERT, xPos, yPos);
        }
      }
      return false;
    }));

    const lastPingTimer = TimerManager.getInstance().get();
    TimerStart(lastPingTimer, 1, true, () => {
      const keys = this.timeSinceLastPing.keys();
      for (let key of keys) {
        const val = this.timeSinceLastPing.get(key);
        if (val > 0) {
          this.timeSinceLastPing.set(
            key,
            (val + 1) % SmartPingManager.MESSAGE_DELAY_PERIOD
          );
        }
      }
    });

  }

  doPing(player: player, type: number, xPos: number, yPos: number) {
    if (
      xPos == 0 
      && yPos == 0
    ) return;
    
    Globals.tmpVector.setPos(xPos, yPos);
    if (!CoordMath.isInsideMapBounds(Globals.tmpVector)) return;


    const numPings = this.pingsPerPlayer.get(player);
    if (!numPings || numPings == 0) {
      this.pingsPerPlayer.set(player, 1);
    } else {
      if (numPings > SmartPingManager.MAX_PINGS) return;
      this.pingsPerPlayer.set(player, numPings+1);
    }


    const delay = this.timeSinceLastPing.get(player);
    if (!delay || delay == 0) {
      this.timeSinceLastPing.set(player, 1);
      for (let p of Constants.activePlayers) {
        if (IsPlayerAlly(p, player)) {
          let msg = Colorizer.getPlayerColorText(GetPlayerId(player)) + GetPlayerName(player) + " ";
          if (type == SmartPingManager.PING_ALERT) {
            msg += "is sending an alert!|r";
          } else if (type == SmartPingManager.PING_X) {
            msg += "wants to retreat!|r";
          } else if (type == SmartPingManager.PING_GATHER) {
            msg += "wants to group up!|r";
          }
          DisplayTimedTextToPlayer(p, 0, 0, SmartPingManager.FADE_PERIOD, msg);
        }
      }

      const shortMsg = Colorizer.getPlayerColorText(GetPlayerId(player)) + GetPlayerName(player) + "|r";
      ForceClear(Globals.tmpForce);
      ForceHelper.addAllies(Globals.tmpForce, GetPlayerId(player));
      TextTagHelper.showTempText(
        shortMsg, xPos, yPos, 10,
        SmartPingManager.FADE_PERIOD, 1,
        Globals.tmpForce
      );
      ForceClear(Globals.tmpForce);
    }


    let sfx1 = "";
    let sfx2 = "";
    let sfx3 = "Abilities/Spells/Other/TalkToMe/TalkToMe.mdl";
    if (type == SmartPingManager.PING_ALERT) {
      sfx1 = "Spell_Marker_Gray.mdl";
      sfx2 = "Radiance_Silver.mdl";
    } else if (type == SmartPingManager.PING_X) {
      sfx1 = "Spell_Marker_Red.mdl";
      sfx2 = "Radiance_Crimson.mdl";
    } else if (type == SmartPingManager.PING_GATHER) {
      sfx1 = "Spell_Marker_Green.mdl";
      sfx2 = "Radiance_Nature.mdl";
    }

    if (IsPlayerEnemy(player, GetLocalPlayer())) {
      sfx1 = "";
      sfx2 = "";
      sfx3 = "";
    }

    const effect1 = AddSpecialEffect(sfx1, xPos, yPos); // spell marker
    const effect2 = AddSpecialEffect(sfx2, xPos, yPos); // radiance
    const effect3 = AddSpecialEffect(sfx3, xPos, yPos); // exclamation mark
    BlzSetSpecialEffectScale(effect1, 2.0);
    BlzSetSpecialEffectScale(effect2, 3.5);
    BlzSetSpecialEffectScale(effect3, 5.0);
    BlzSetSpecialEffectYaw(effect3, 90 * CoordMath.degreesToRadians);
    if (type == SmartPingManager.PING_ALERT) {
      BlzSetSpecialEffectColor(effect3, 255, 255, 255);
    } else if (type == SmartPingManager.PING_X) {
      BlzSetSpecialEffectColor(effect3, 255, 0, 0);
    } else if (type == SmartPingManager.PING_GATHER) {
      BlzSetSpecialEffectColor(effect3, 0, 255, 0);
    }
    BlzSetSpecialEffectAlpha(effect1, 185);
    BlzSetSpecialEffectAlpha(effect2, 155);
    BlzSetSpecialEffectAlpha(effect3, 205);

    let counter = 255;
    const sfxFadeTimer = TimerManager.getInstance().get();
    TimerStart(sfxFadeTimer, 0.03, true, () => {
      if (counter >= 0) {
        BlzSetSpecialEffectAlpha(effect1, counter);
        BlzSetSpecialEffectAlpha(effect2, counter);
        BlzSetSpecialEffectAlpha(effect3, counter);
        counter -= 1;
      }
    });

    const disappearTimer = TimerManager.getInstance().get();
    TimerStart(disappearTimer, SmartPingManager.FADE_PERIOD, false, () => {
      this.pingsPerPlayer.set(player, this.pingsPerPlayer.get(player)-1);
      DestroyEffect(effect1);
      DestroyEffect(effect2);
      DestroyEffect(effect3);
      TimerManager.getInstance().recycle(sfxFadeTimer);
      TimerManager.getInstance().recycle(disappearTimer);
    });
  }
}