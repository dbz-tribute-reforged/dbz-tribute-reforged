import { Constants, Globals } from "Common/Constants";
import { AbilityButtonHotbar } from "./AbilityButtonHotbar";
import { ButtonMenu } from "./ButtonMenu";
import { HPBar, LevelBar, MPBar, SPBar } from "./MyBars";

// perhaps a map of all ui elements, instead of these globals
export module CustomUI {

export function show(flag: boolean, ignoreCustomUIFlag: boolean, who?: player) {
  if (who && !ignoreCustomUIFlag) {
    const playerId = GetPlayerId(who);
    if (
      playerId >= 0 
      && playerId <= Globals.customPlayers.length
      && Globals.customPlayers[playerId].usingCustomUI
    ) {
      return;
    }
  }

  const hpBar = BlzGetFrameByName("MyHPBar", 0);
  const mpBar = BlzGetFrameByName("MyMPBar", 0);
  const spBar = BlzGetFrameByName("MySPBar", 0);
  const spellPowerbar = BlzGetFrameByName("MySpellPowerBar", 0);
  const abilityButton0 = BlzGetFrameByName("MyAbilityIconBar", 0);
  const abilityButton1 = BlzGetFrameByName("MyAbilityIconBar", 1);
  const abilityButton2 = BlzGetFrameByName("MyAbilityIconBar", 2);
  const abilityButton3 = BlzGetFrameByName("MyAbilityIconBar", 3);
  const abilityButtonHotbar = BlzGetFrameByName("abilityButtonHotBar", 0);

  if (!who || who == GetLocalPlayer()) {
    BlzFrameSetVisible(hpBar, flag);
    BlzFrameSetVisible(mpBar, flag);
    BlzFrameSetVisible(spBar, flag);
    BlzFrameSetVisible(spellPowerbar, flag);
    BlzFrameSetVisible(abilityButton0, flag);
    BlzFrameSetVisible(abilityButton1, flag);
    BlzFrameSetVisible(abilityButton2, flag);
    BlzFrameSetVisible(abilityButton3, flag);
    BlzFrameSetVisible(abilityButtonHotbar, flag);
  }
}

}

export function toggleFrameHandle(fh: framehandle, b:boolean):void {
  BlzFrameSetVisible(fh, b);
  BlzFrameSetEnable(fh, b);
}