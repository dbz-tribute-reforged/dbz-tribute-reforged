import { Constants, Globals } from "Common/Constants";
import { AbilityNames } from "CustomAbility/AbilityNames";
import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { CustomAbilityButton } from "CustomPlayer/AbilityButton";
import { CustomPlayer } from "CustomPlayer/CustomPlayer";
import { Frame, Trigger } from "w3ts"
import { AbilityShopData } from "./AbilityShopData";

export class AbilityShop {
  static readonly INVALID_INDEX = -1;
  static readonly DEFAULT_SELECT_ABILITIES = [
    AbilityNames.BasicAbility.ZANZOKEN,
    AbilityNames.BasicAbility.GUARD,
    AbilityNames.BasicAbility.MAX_POWER,
    AbilityNames.BasicAbility.DEFLECT,
  ];
  static readonly DEFAULT_SHOP_ABILITIES = [
    AbilityNames.BasicAbility.ZANZOKEN,
    AbilityNames.BasicAbility.GUARD,
    AbilityNames.BasicAbility.MAX_POWER,
    AbilityNames.BasicAbility.DEFLECT,
    AbilityNames.BasicAbility.SPARKING_BLAST,
    AbilityNames.BasicAbility.ZANZO_DASH,
    AbilityNames.BasicAbility.MAX_CHARGE,
  ];

  canSwap: boolean = false;
  playerSelectIndex: number[] = [];
  playerSelectIndex2: number[] = [];
  playerShopIndex: number[] = [];
  playerKeyFlag: boolean[] = [];
  playerShopMap: Map<player, string[]> = new Map();

  AbilitySelectBase: Frame
  AbilitySelectBG: Frame
  AbilitySelectButtonT: Frame[] = []
  BackdropAbilitySelectButtonT: Frame[] = [] 
  AbilityShopBG: Frame
  AbilityKeyT: Frame[] = []
  AbilityShopButtonT: Frame[] = []
  BackdropAbilityShopButtonT: Frame[] = [] 
  AbilityTooltipBG: Frame
  AbilityTooltip: Frame

  highlightSprite: Frame;

  constructor() {
    let t: Trigger;

      this.AbilitySelectBase = new Frame("QuestButtonDisabledBackdropTemplate", Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.00000, 0.124000)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.142000, 0.00000)
    
      this.AbilityShopBG = new Frame("QuestButtonPushedBackdropTemplate", this.AbilitySelectBase, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBase, FRAMEPOINT_TOPLEFT, 0.0000, -0.064000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBase, FRAMEPOINT_BOTTOMRIGHT, 0.0000, 0.0000)
    
      this.AbilitySelectBG = new Frame("QuestButtonBaseTemplate", this.AbilitySelectBase, 0, 0)
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.0000900000, 0.126000)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.142090, 0.0620000)
        
      this.AbilityTooltipBG = new Frame("QuestButtonBaseTemplate", this.AbilitySelectBase, 0, 0)
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.00000, 0.240000)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.200000, 0.120000)
  
      this.AbilityTooltip = new Frame("name", this.AbilityTooltipBG, 0, 0, "Text", "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.00800, 0.232000)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.198000, 0.120000)
        .setText("|cffFFCC00|r")
        .setEnabled(true)
        .setScale(1.0)
      BlzFrameSetTextAlignment(this.AbilityTooltip.handle, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_LEFT);
    
      this.AbilityShopButtonT[0] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.0080000, -0.0040000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.11000, 0.032000)
    
      this.BackdropAbilityShopButtonT[0] = new Frame("BackdropAbilityShopButtonT[0]", this.AbilityShopButtonT[0], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[0])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[0], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[0].enabled = false 
    this.AbilityShopButtonT[0].enabled = true 
    })
    
      this.AbilityShopButtonT[1] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.034000, -0.0040000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.084000, 0.032000)
    
      this.BackdropAbilityShopButtonT[1] = new Frame("BackdropAbilityShopButtonT[1]", this.AbilityShopButtonT[1], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[1])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[1], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[1].enabled = false 
    this.AbilityShopButtonT[1].enabled = true 
    })
    
      this.AbilityShopButtonT[2] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.060000, -0.0040000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.058000, 0.032000)
    
      this.BackdropAbilityShopButtonT[2] = new Frame("BackdropAbilityShopButtonT[2]", this.AbilityShopButtonT[2], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[2])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[2], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[2].enabled = false 
    this.AbilityShopButtonT[2].enabled = true 
    })
    
      this.AbilityShopButtonT[3] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.086000, -0.0040000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.032000, 0.032000)
    
      this.BackdropAbilityShopButtonT[3] = new Frame("BackdropAbilityShopButtonT[3]", this.AbilityShopButtonT[3], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[3])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[3], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[3].enabled = false 
    this.AbilityShopButtonT[3].enabled = true 
    })
    
      this.AbilityShopButtonT[4] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.11200, -0.0040000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.0060000, 0.032000)
    
      this.BackdropAbilityShopButtonT[4] = new Frame("BackdropAbilityShopButtonT[4]", this.AbilityShopButtonT[4], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[4])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[4], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[4].enabled = false 
    this.AbilityShopButtonT[4].enabled = true 
    })
    
      this.AbilityShopButtonT[5] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.0080000, -0.030000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.11000, 0.0060000)
    
      this.BackdropAbilityShopButtonT[5] = new Frame("BackdropAbilityShopButtonT[5]", this.AbilityShopButtonT[5], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[5])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[5], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[5].enabled = false 
    this.AbilityShopButtonT[5].enabled = true 
    })
    
      this.AbilityShopButtonT[6] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.034000, -0.030000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.084000, 0.0060000)
    
      this.BackdropAbilityShopButtonT[6] = new Frame("BackdropAbilityShopButtonT[6]", this.AbilityShopButtonT[6], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[6])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[6], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[6].enabled = false 
    this.AbilityShopButtonT[6].enabled = true 
    })
    
      this.AbilityShopButtonT[7] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.060000, -0.030000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.058000, 0.0060000)
    
      this.BackdropAbilityShopButtonT[7] = new Frame("BackdropAbilityShopButtonT[7]", this.AbilityShopButtonT[7], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[7])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[7], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[7].enabled = false 
    this.AbilityShopButtonT[7].enabled = true 
    })
    
      this.AbilityShopButtonT[8] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.086000, -0.030000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.032000, 0.0060000)
    
      this.BackdropAbilityShopButtonT[8] = new Frame("BackdropAbilityShopButtonT[8]", this.AbilityShopButtonT[8], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[8])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[8], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[8].enabled = false 
    this.AbilityShopButtonT[8].enabled = true 
    })
    
      this.AbilityShopButtonT[9] = new Frame("IconButtonTemplate", this.AbilityShopBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilityShopBG, FRAMEPOINT_TOPLEFT, 0.11200, -0.030000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilityShopBG, FRAMEPOINT_BOTTOMRIGHT, -0.0060000, 0.0060000)
    
      this.BackdropAbilityShopButtonT[9] = new Frame("BackdropAbilityShopButtonT[9]", this.AbilityShopButtonT[9], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilityShopButtonT[9])
        .setTexture("Blank.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityShopButtonT[9], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityShopButtonT[9].enabled = false 
    this.AbilityShopButtonT[9].enabled = true 
    })
    
      this.AbilitySelectButtonT[0] = new Frame("IconButtonTemplate", this.AbilitySelectBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBG, FRAMEPOINT_TOPLEFT, 0.0080100, -0.0080000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBG, FRAMEPOINT_BOTTOMRIGHT, -0.10999, 0.032000)
    
      this.BackdropAbilitySelectButtonT[0] = new Frame("BackdropAbilitySelectButtonT[0]", this.AbilitySelectButtonT[0], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilitySelectButtonT[0])
        .setTexture("BTNBasicZanzo.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[0], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilitySelectButtonT[0].enabled = false 
    this.AbilitySelectButtonT[0].enabled = true 
    })
    
      this.AbilitySelectButtonT[1] = new Frame("IconButtonTemplate", this.AbilitySelectBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBG, FRAMEPOINT_TOPLEFT, 0.034010, -0.0080000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBG, FRAMEPOINT_BOTTOMRIGHT, -0.083990, 0.032000)
    
      this.BackdropAbilitySelectButtonT[1] = new Frame("BackdropAbilitySelectButtonT[1]", this.AbilitySelectButtonT[1], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilitySelectButtonT[1])
        .setTexture("BTNBasicZanzo.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[1], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilitySelectButtonT[1].enabled = false 
    this.AbilitySelectButtonT[1].enabled = true 
    })
    
      this.AbilitySelectButtonT[2] = new Frame("IconButtonTemplate", this.AbilitySelectBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBG, FRAMEPOINT_TOPLEFT, 0.060010, -0.0080000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBG, FRAMEPOINT_BOTTOMRIGHT, -0.057990, 0.032000)
    
      this.BackdropAbilitySelectButtonT[2] = new Frame("BackdropAbilitySelectButtonT[2]", this.AbilitySelectButtonT[2], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilitySelectButtonT[2])
        .setTexture("BTNBasicZanzo.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[2], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilitySelectButtonT[2].enabled = false 
    this.AbilitySelectButtonT[2].enabled = true 
    })
    
      this.AbilitySelectButtonT[3] = new Frame("IconButtonTemplate", this.AbilitySelectBG, 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectBG, FRAMEPOINT_TOPLEFT, 0.086010, -0.0080000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectBG, FRAMEPOINT_BOTTOMRIGHT, -0.031990, 0.032000)
    
      this.BackdropAbilitySelectButtonT[3] = new Frame("BackdropAbilitySelectButtonT[3]", this.AbilitySelectButtonT[3], 0, 0, 'BACKDROP', "")
      .setAllPoints(this.AbilitySelectButtonT[3])
        .setTexture("BTNBasicZanzo.blp", 0, true)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilitySelectButtonT[3], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilitySelectButtonT[3].enabled = false 
    this.AbilitySelectButtonT[3].enabled = true 
    })
    
      this.AbilityKeyT[0] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[0], 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[0], FRAMEPOINT_TOPLEFT, -0.00010000, -0.026000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[0], FRAMEPOINT_BOTTOMRIGHT, -0.00010000, -0.026000)
        .setText("|cffFCD20DZ|r")
        .setScale(1.00)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityKeyT[0], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityKeyT[0].enabled = false 
    this.AbilityKeyT[0].enabled = true 
    })
    
      this.AbilityKeyT[1] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[1], 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[1], FRAMEPOINT_TOPLEFT, -0.00010000, -0.026000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[1], FRAMEPOINT_BOTTOMRIGHT, -0.00010000, -0.026000)
        .setText("|cffFCD20DX|r")
        .setScale(1.00)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityKeyT[1], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityKeyT[1].enabled = false 
    this.AbilityKeyT[1].enabled = true 
    })
    
      this.AbilityKeyT[2] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[2], 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[2], FRAMEPOINT_TOPLEFT, -0.00010000, -0.026000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[2], FRAMEPOINT_BOTTOMRIGHT, -0.00010000, -0.026000)
        .setText("|cffFCD20DC|r")
        .setScale(1.00)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityKeyT[2], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityKeyT[2].enabled = false 
    this.AbilityKeyT[2].enabled = true 
    })
    
      this.AbilityKeyT[3] = new Frame("ScriptDialogButton", this.AbilitySelectButtonT[3], 0, 0)
        .setPoint(FRAMEPOINT_TOPLEFT, this.AbilitySelectButtonT[3], FRAMEPOINT_TOPLEFT, -0.00010000, -0.026000)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.AbilitySelectButtonT[3], FRAMEPOINT_BOTTOMRIGHT, -0.00010000, -0.026000)
        .setText("|cffFCD20DV|r")
        .setScale(1.00)
    t = new Trigger() 
    t.triggerRegisterFrameEvent(this.AbilityKeyT[3], FRAMEEVENT_CONTROL_CLICK) 
    t.addAction( () => {
    this.AbilityKeyT[3].enabled = false 
    this.AbilityKeyT[3].enabled = true 
    })

    this.highlightSprite = new Frame("SpriteName", this.AbilitySelectBase, 0, 0, "SPRITE", "")
      .setAllPoints(this.AbilitySelectButtonT[0])
      .setModel("UI\\Feedback\\Autocast\\UI-ModalButtonOn.mdl", 0)
      .setScale(0.024 / 0.039)
      .setEnabled(false)
    
  }

  public setCanSwap(b: boolean) {
    this.canSwap = b;
    this.highlightSprite.setModel(
      this.canSwap ?
        "UI\\Feedback\\Autocast\\UI-ModalButtonOn.mdl" :
        "war3mapImported\\HeroSelectorBan.mdl"
      , 0
    );
  }

  public setup() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      this.playerKeyFlag.push(false);
      this.playerSelectIndex.push(AbilityShop.INVALID_INDEX);
      this.playerSelectIndex2.push(AbilityShop.INVALID_INDEX);
      this.playerShopIndex.push(AbilityShop.INVALID_INDEX);
      this.playerShopMap.set(
        Player(i), 
        AbilityShop.DEFAULT_SHOP_ABILITIES
      )
    }

    // requires HeroSelectorRaceBox to exist
    this.AbilitySelectBase.setParent(Frame.fromName("HeroSelectorRaceBox", 0));


    for (let i = 0; i < this.AbilityKeyT.length; ++i) {
      this.registerHotkeyPress(i);
    }

    // create shop with default abilities
    for (let i = 0; i < this.AbilitySelectButtonT.length; ++i) {
      this.registerSelectPress(i);
      // this.registerSelectTooltip(i);
    }

    for (let i = 0; i < this.AbilityShopButtonT.length; ++i) {
      this.registerShopPress(i);
      // this.registerShopTooltip(i);
    }

    // setup
    for (const player of Constants.activePlayers) {
      this.displayShop(player);
      this.displaySelected(player);
      this.tooltipSelect(player, 0);
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
        DisplayTimedTextToPlayer(player, 0, 0, 2, 
          "|cffff2222INVALID KEY: " + 
          Constants.oskeyToTextMap.get(newKey) + "|r"
        );
      } else {
        const ki = customPlayer.getOsKeyInput(newKey);

        let keyText = Constants.oskeyToTextMap.get(ki.oskey);
        if (!keyText) keyText = "?";

        customPlayer.abilityButtons[index].key = ki.oskey;
        if (player == GetLocalPlayer()) this.AbilityKeyT[index].setText(keyText); 

        DisplayTimedTextToPlayer(player, 0, 0, 2, 
          "|cffffcc00KEY: " + keyText + "|r"
        );
      }

      this.playerKeyFlag[playerId] = false;
      DestroyTimer(GetExpiredTimer());
    });
  }

  public registerSelectPress(index: number) {
    const hotkeyTrig = new Trigger();
    hotkeyTrig.triggerRegisterFrameEvent(this.AbilitySelectButtonT[index], FRAMEEVENT_CONTROL_CLICK);
    hotkeyTrig.addAction(() => {
      this.clickSelect(index);
    })
  }

  public registerShopPress(index: number) {
    const hotkeyTrig = new Trigger();
    hotkeyTrig.triggerRegisterFrameEvent(this.AbilityShopButtonT[index], FRAMEEVENT_CONTROL_CLICK);
    hotkeyTrig.addAction(() => {
      this.clickShop(index);
    })
  }

  public clickSelect(index: number) {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    this.playerSelectIndex[playerId] = index;
    // if (this.playerSelectIndex[playerId] == AbilityShop.INVALID_INDEX) {
    //   this.playerSelectIndex[playerId] = index;
    // } else {
    //   this.playerSelectIndex2[playerId] = index;
    // }
    this.doAbilitySelection(player);
  }

  public clickShop(index: number) {
    const player = GetTriggerPlayer();
    const playerId = GetPlayerId(player);
    this.playerShopIndex[playerId] = index;
    this.doAbilitySelection(player);
  }

  public resetIndex(playerId: number) {
    this.playerSelectIndex[playerId] = AbilityShop.INVALID_INDEX;
    this.playerSelectIndex2[playerId] = AbilityShop.INVALID_INDEX;
    this.playerShopIndex[playerId] = AbilityShop.INVALID_INDEX;
  }

  public isAbilitySelectValid(customPlayer: CustomPlayer, newAbil: string) {
    // ensure no duplicates
    // ensure no double zanzo
    for (const abil of customPlayer.abilityButtons) {
      if (newAbil == abil.name) {
        return false;
      }
      if (
        (
          newAbil == AbilityNames.BasicAbility.ZANZO_DASH 
          && abil.name == AbilityNames.BasicAbility.ZANZOKEN
        ) || (
          newAbil == AbilityNames.BasicAbility.ZANZOKEN 
          && abil.name == AbilityNames.BasicAbility.ZANZO_DASH
        )
      ) {
        return false;
      }
    }
    return true;
  }

  public doAbilitySelection(player: player) {
    const playerId = GetPlayerId(player);
    const selectIndex = this.playerSelectIndex[playerId];
    const selectIndex2 = this.playerSelectIndex2[playerId];
    const shopIndex = this.playerShopIndex[playerId];

    const customPlayer = Globals.customPlayers[playerId];

    if (
      selectIndex == AbilityShop.INVALID_INDEX
      || (
        selectIndex2 == AbilityShop.INVALID_INDEX
        && shopIndex == AbilityShop.INVALID_INDEX
      )
    ) {
      if (selectIndex != AbilityShop.INVALID_INDEX) {
        this.tooltipSelect(player, selectIndex);
      } else if (shopIndex != AbilityShop.INVALID_INDEX) {
        this.tooltipShop(player, shopIndex);
      }
      if (!this.canSwap) {
        this.resetIndex(playerId);
      }
      return;
    }

    if (selectIndex2 == AbilityShop.INVALID_INDEX) {
      const shopAbils = this.playerShopMap.get(player);
      const shopAbilName = shopAbils[shopIndex];
      if (!this.isAbilitySelectValid(customPlayer, shopAbilName)) {
        DisplayTimedTextToPlayer(player, 0, 0, 2, 
          "|cffff2222INVALID ABILITY: " + shopAbilName
        );
        this.resetIndex(playerId);
        return;
      }

      // give player shop abil
      customPlayer.abilityButtons[selectIndex].name = shopAbilName;
      this.tooltipSelect(player, selectIndex);
    } else {
      // swap
      const tmp = customPlayer.abilityButtons[selectIndex].name;
      customPlayer.abilityButtons[selectIndex].name = customPlayer.abilityButtons[selectIndex2].name;
      customPlayer.abilityButtons[selectIndex2].name = tmp;
      this.tooltipSelect(player, selectIndex2);
    }

    this.displaySelected(player);
    this.resetIndex(playerId);
  }

  public displaySelected(player: player) {
    const playerId = GetPlayerId(player);
    Globals.customPlayers[playerId].abilityButtons.forEach((value: CustomAbilityButton, i: number) => {
      const abil = CustomAbilityManager.getInstance().getAbility(value.name);
      if (player == GetLocalPlayer()) {
        this.BackdropAbilitySelectButtonT[i].setTexture(
          abil ? abil.icon.enabled : "Blank.blp", 0, true
        );
      }
    });
  }

  public displayShop(player: player) {
    const shopAbils = this.playerShopMap.get(player);
    let j = 0;
    shopAbils.forEach((name: string, i: number) => {
      const abil = CustomAbilityManager.getInstance().getAbility(name);
      if (player == GetLocalPlayer()) {
        this.BackdropAbilityShopButtonT[i].setTexture(
          abil ? abil.icon.enabled : "Blank.blp", 0, true
        );
      }
      j = i;
    });
    for (j = j+1; j < this.BackdropAbilityShopButtonT.length; ++j) {
      if (player == GetLocalPlayer()) {
        this.BackdropAbilityShopButtonT[j].setTexture("Blank.blp", 0, true);
      }
    }
  }

  // FRAMEEVENT_MOUSE_ENTER has infinite loop bug that glitches the mouse
  // public registerSelectTooltip(index: number) {
  //   const trig = new Trigger();
  //   trig.triggerRegisterFrameEvent(this.AbilitySelectButtonT[index], FRAMEEVENT_MOUSE_ENTER);
  //   trig.addAction(() => {
  //     this.tooltipSelect(GetTriggerPlayer(), index);
  //   })
  // }

  // public registerShopTooltip(index: number) {
  //   const trig = new Trigger();
  //   trig.triggerRegisterFrameEvent(this.AbilityShopButtonT[index], FRAMEEVENT_MOUSE_ENTER);
  //   trig.addAction(() => {
  //     this.tooltipShop(GetTriggerPlayer(), index);
  //   })
  // }

  public tooltipSelect(player: player, index: number) {
    const playerId = GetPlayerId(player);
    if (index < Globals.customPlayers[playerId].abilityButtons.length) {
      this.displayTooltip(player, Globals.customPlayers[playerId].abilityButtons[index].name);
      if (player == GetLocalPlayer()) {
        this.highlightSprite
          .setAllPoints(this.AbilitySelectButtonT[index])
          .setEnabled(true)
      }
    }
  }

  public tooltipShop(player: player, index: number) {
    const abilNames = this.playerShopMap.get(player);
    if (index < abilNames.length) {
      this.displayTooltip(player, abilNames[index]);
      if (player == GetLocalPlayer()) {
        this.highlightSprite
          .setAllPoints(this.AbilityShopButtonT[index])
          .setEnabled(true);
      }
    }
  }

  public displayTooltip(player: player, abilName: string) {
    const abil = CustomAbilityManager.getInstance().getAbility(abilName);
    const str  = abil.tooltip.title + "|n|n" + abil.tooltip.body;
    if (player == GetLocalPlayer()) {
      this.AbilityTooltip.setText(str);
    }
  }

  public setPlayerShop(player: player, unitCode: number) {
    // change shop to allow more abilities

    this.resetPlayerShop(player, unitCode);
    this.resetPlayerSelected(player);

    this.displaySelected(player);
    this.displayShop(player);
    this.tooltipSelect(player, 0);
  }

  public resetPlayerShop(player: player, unitCode: number) {
    const abils: string[] = [];
    const shopData = AbilityShopData.get(unitCode);
    if (shopData && shopData[0].length > 0) {
      abils.push(...shopData[0]);
    }
    for (let i = 0; i < AbilityShop.DEFAULT_SHOP_ABILITIES.length; ++i) {
      if (shopData && shopData[1].length > 0) {
        const removeIndex = shopData[1].findIndex((str: string) => {
          return str == AbilityShop.DEFAULT_SHOP_ABILITIES[i];
        });
        if (removeIndex >= 0) continue;
      }
      abils.push(AbilityShop.DEFAULT_SHOP_ABILITIES[i]);
    }

    this.playerShopMap.set(player, abils);
  }

  public resetPlayerSelected(player: player) {
    const abilNames = this.playerShopMap.get(player);
    const playerId = GetPlayerId(player);
    const customPlayer = Globals.customPlayers[playerId];

    customPlayer.abilityButtons.forEach((playerAbil: CustomAbilityButton, i: number) => {
      // if ability isnt in player's shop
      // replace it with another valid ability
      const val = abilNames.findIndex((str: string) => {
        return playerAbil.name == str;
      });
      if (val < 0) {
        for (const name of abilNames) {
          if (this.isAbilitySelectValid(customPlayer, name)) {
            playerAbil.name = name;
            break;
          }
        }
      }
    });
  }

}
