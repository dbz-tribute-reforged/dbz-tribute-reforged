import { Constants, Globals } from "Common/Constants";
import { Frame, Trigger } from "w3ts"

export class AbilityShop {

  playerKeyFlag: boolean[] = [];
  playerKeyMap: Map<player, [Number, Number]> = new Map();

  AbilitySelectBase: Frame
  AbilitySelectButtonT: Frame[] = []
  BackdropAbilitySelectButtonT: Frame[] = [] 
  AbilityShop: Frame
  AbilityKeyT: Frame[] = []
  AbilityShopButtonT: Frame[] = []
  BackdropAbilityShopButtonT: Frame[] = [] 

  constructor() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      this.playerKeyFlag.push(false);
    }

    let t: Trigger;



 this.AbilitySelectBase = new Frame("QuestButtonDisabledBackdropTemplate", Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
   .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.00000, 0.160000)
   .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.150000, 0.00000)

 this.AbilitySelectButtonT[0] = new Frame("IconButtonTemplate", this.AbilitySelectBase, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.0080000, -0.0060000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, -0.11800, 0.13000)

 this.BackdropAbilitySelectButtonT[0] = new Frame("BackdropAbilitySelectButtonT[0]", this.AbilitySelectButtonT[0], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilitySelectButtonT[0])
   .setTexture("BTNBasicZanzo.blp", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[0], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilitySelectButtonT[0].enabled = false 
this.AbilitySelectButtonT[0].enabled = true 
})

 this.AbilitySelectButtonT[1] = new Frame("IconButtonTemplate", this.AbilitySelectBase, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.034000, -0.0060000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, -0.092000, 0.13000)

 this.BackdropAbilitySelectButtonT[1] = new Frame("BackdropAbilitySelectButtonT[1]", this.AbilitySelectButtonT[1], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilitySelectButtonT[1])
   .setTexture("BTNBasicGuard.blp", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[1], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilitySelectButtonT[1].enabled = false 
this.AbilitySelectButtonT[1].enabled = true 
})

 this.AbilitySelectButtonT[2] = new Frame("IconButtonTemplate", this.AbilitySelectBase, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.060000, -0.0060000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, -0.066000, 0.13000)

 this.BackdropAbilitySelectButtonT[2] = new Frame("BackdropAbilitySelectButtonT[2]", this.AbilitySelectButtonT[2], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilitySelectButtonT[2])
   .setTexture("BTNBasicMaxPower.blp", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[2], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilitySelectButtonT[2].enabled = false 
this.AbilitySelectButtonT[2].enabled = true 
})

 this.AbilitySelectButtonT[3] = new Frame("IconButtonTemplate", this.AbilitySelectBase, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.086000, -0.0060000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, -0.040000, 0.13000)

 this.BackdropAbilitySelectButtonT[3] = new Frame("BackdropAbilitySelectButtonT[3]", this.AbilitySelectButtonT[3], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilitySelectButtonT[3])
   .setTexture("BTNBasicDeflect.blp", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[3], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilitySelectButtonT[3].enabled = false 
this.AbilitySelectButtonT[3].enabled = true 
})

 this.AbilityShop = new Frame("QuestButtonPushedBackdropTemplate", this.AbilitySelectBase, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.0000, -0.10000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, 0.0000, 0.0000)

 this.AbilityKeyT[0] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[0], 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[0], FRAMEPOINT_TOPLEFT, 0.0000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[0], FRAMEPOINT_BOTTOMRIGHT, 0.0000, -0.030000)
   .setText("|cffFCD20DZ|r")
   .setScale(1.00)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityKeyT[0], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityKeyT[0].enabled = false 
this.AbilityKeyT[0].enabled = true 
})

 this.AbilityKeyT[1] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[1], 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[1], FRAMEPOINT_TOPLEFT, 0.0000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[1], FRAMEPOINT_BOTTOMRIGHT, 0.0000, -0.030000)
   .setText("|cffFCD20DX|r")
   .setScale(1.00)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityKeyT[1], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityKeyT[1].enabled = false 
this.AbilityKeyT[1].enabled = true 
})

 this.AbilityKeyT[2] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[2], 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[2], FRAMEPOINT_TOPLEFT, 0.0000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[2], FRAMEPOINT_BOTTOMRIGHT, 0.0000, -0.030000)
   .setText("|cffFCD20DC|r")
   .setScale(1.00)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityKeyT[2], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityKeyT[2].enabled = false 
this.AbilityKeyT[2].enabled = true 
})

 this.AbilityKeyT[3] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[3], 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[3], FRAMEPOINT_TOPLEFT, 0.0000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[3], FRAMEPOINT_BOTTOMRIGHT, 0.0000, -0.030000)
   .setText("|cffFCD20DV|r")
   .setScale(1.00)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityKeyT[3], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityKeyT[3].enabled = false 
this.AbilityKeyT[3].enabled = true 
})

 this.AbilityShopButtonT[0] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.0080000, -0.0040000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.11800, 0.032000)

 this.BackdropAbilityShopButtonT[0] = new Frame("BackdropAbilityShopButtonT[0]", this.AbilityShopButtonT[0], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[0])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[0], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[0].enabled = false 
this.AbilityShopButtonT[0].enabled = true 
})

 this.AbilityShopButtonT[1] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.034000, -0.0040000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.092000, 0.032000)

 this.BackdropAbilityShopButtonT[1] = new Frame("BackdropAbilityShopButtonT[1]", this.AbilityShopButtonT[1], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[1])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[1], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[1].enabled = false 
this.AbilityShopButtonT[1].enabled = true 
})

 this.AbilityShopButtonT[2] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.060000, -0.0040000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.066000, 0.032000)

 this.BackdropAbilityShopButtonT[2] = new Frame("BackdropAbilityShopButtonT[2]", this.AbilityShopButtonT[2], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[2])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[2], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[2].enabled = false 
this.AbilityShopButtonT[2].enabled = true 
})

 this.AbilityShopButtonT[3] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.086000, -0.0040000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.040000, 0.032000)

 this.BackdropAbilityShopButtonT[3] = new Frame("BackdropAbilityShopButtonT[3]", this.AbilityShopButtonT[3], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[3])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[3], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[3].enabled = false 
this.AbilityShopButtonT[3].enabled = true 
})

 this.AbilityShopButtonT[4] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.11200, -0.0040000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.014000, 0.032000)

 this.BackdropAbilityShopButtonT[4] = new Frame("BackdropAbilityShopButtonT[4]", this.AbilityShopButtonT[4], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[4])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[4], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[4].enabled = false 
this.AbilityShopButtonT[4].enabled = true 
})

 this.AbilityShopButtonT[5] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.0080000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.11800, 0.0060000)

 this.BackdropAbilityShopButtonT[5] = new Frame("BackdropAbilityShopButtonT[5]", this.AbilityShopButtonT[5], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[5])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[5], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[5].enabled = false 
this.AbilityShopButtonT[5].enabled = true 
})

 this.AbilityShopButtonT[6] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.034000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.092000, 0.0060000)

 this.BackdropAbilityShopButtonT[6] = new Frame("BackdropAbilityShopButtonT[6]", this.AbilityShopButtonT[6], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[6])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[6], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[6].enabled = false 
this.AbilityShopButtonT[6].enabled = true 
})

 this.AbilityShopButtonT[7] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.060000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.066000, 0.0060000)

 this.BackdropAbilityShopButtonT[7] = new Frame("BackdropAbilityShopButtonT[7]", this.AbilityShopButtonT[7], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[7])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[7], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[7].enabled = false 
this.AbilityShopButtonT[7].enabled = true 
})

 this.AbilityShopButtonT[8] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.086000, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.040000, 0.0060000)

 this.BackdropAbilityShopButtonT[8] = new Frame("BackdropAbilityShopButtonT[8]", this.AbilityShopButtonT[8], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[8])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[8], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[8].enabled = false 
this.AbilityShopButtonT[8].enabled = true 
})

 this.AbilityShopButtonT[9] = new Frame("IconButtonTemplate", this.AbilityShop, 0, 0)
   .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShop, FRAMEPOINT_TOPLEFT, 0.11200, -0.030000)
   .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShop, FRAMEPOINT_BOTTOMRIGHT, -0.014000, 0.0060000)

 this.BackdropAbilityShopButtonT[9] = new Frame("BackdropAbilityShopButtonT[9]", this.AbilityShopButtonT[9], 0, 0, 'BACKDROP', "")
 .setAllPoints(this.AbilityShopButtonT[9])
   .setTexture("CustomFrame.png", 0, true)
t = new Trigger() 
t.triggerRegisterFrameEvent(this.AbilityShopButtonT[9], FRAMEEVENT_CONTROL_CLICK) 
t.addAction( () => {
this.AbilityShopButtonT[9].enabled = false 
this.AbilityShopButtonT[9].enabled = true 
})
}

  public setup() {
    // requires HeroSelectorRaceBox to exist
    this.AbilitySelectBase.setParent(Frame.fromName("HeroSelectorRaceBox", 0));

    for (let i = 0; i < 4; ++i) {
      this.registerHotkeyPress(i);
    }
  }

  public registerHotkeyPress(index: number) {
    const hotkeyTrig = new Trigger();
    hotkeyTrig.triggerRegisterFrameEvent(this.AbilityKeyT[index], FRAMEEVENT_CONTROL_CLICK);
    hotkeyTrig.addAction(() => {
      this.hotkeyReassign(index);
    })
  }

  public hotkeyReassign(index: number) {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);

    if (this.playerKeyFlag[playerId]) return;
    this.playerKeyFlag[playerId] = true;

    const customPlayer = Globals.customPlayers[playerId];
    const lastKey = customPlayer.lastKey;

    // wait for change in key input
    TimerStart(CreateTimer(), 0.03, true, () => {
      const newKey = customPlayer.lastKey;
      if (newKey == lastKey) return;
      
      // reject QWER ASDF P
      if (
        newKey == OSKEY_Q
        || newKey == OSKEY_W
        || newKey == OSKEY_E
        || newKey == OSKEY_R
        || newKey == OSKEY_A
        || newKey == OSKEY_S
        || newKey == OSKEY_D
        || newKey == OSKEY_F
        || newKey == OSKEY_P
      ) {
        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffff2222INVALID KEY: " + 
          Constants.oskeyToTextMap.get(newKey) + "|r"
        );
      } else {
        const ki = customPlayer.getOsKeyInput(newKey);

        let keyText = Constants.oskeyToTextMap.get(ki.oskey);
        if (!keyText) keyText = "?";

        customPlayer.abilityButtons[index].key = ki.oskey;
        if (player == GetLocalPlayer()) this.AbilityKeyT[index].setText(keyText); 

        DisplayTimedTextToPlayer(player, 0, 0, 3, 
          "|cffffcc00KEY: " + keyText + "|r"
        );
      }

      this.playerKeyFlag[playerId] = false;
      DestroyTimer(GetExpiredTimer());
    });
  }


}
