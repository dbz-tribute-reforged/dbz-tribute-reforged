import { Constants, Globals } from "Common/Constants";
import { AbilityButtonHotbar } from "./AbilityButtonHotbar";
import { ButtonMenu } from "./ButtonMenu";
import { HPBar, LevelBar, MPBar, SPBar } from "./MyBars";
import { Frame, Trigger } from "w3ts";
import { PlayerCam } from "CustomPlayer/PlayerCam";
import { DDS } from "Core/DDS/DDS";
import { TransformationSystem } from "Core/TransformationSystem/TransformationSystem";

// perhaps a map of all ui elements, instead of these globals
export class CustomUI {
  private static instance: CustomUI;
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CustomUI();
    }
    return this.instance;
  }

  public toggleMinimapButton: Frame;
  public toggleMinimapButtonBackdrop: Frame;
  public toggleMinimapIconsTrigger: Trigger;
  
  public zoomDistSlider: Frame;
  public zoomDistTrigger: Trigger;
  
  public helpSkillsButton: Frame;
  public helpSkillsTrigger: Trigger;

  public dmgButton: Frame;
  public dmgButtonBackdrop: Frame;
  public dmgButtonTrigger: Trigger;

  public skinButton: Frame;
  public skinButtonBackdrop: Frame;
  public skinButtonTrigger: Trigger;
  

  constructor() {
    this.toggleMinimapButton = new Frame("IconButtonTemplate", Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0)
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.1560, 0.0020)
      .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.1770, 0.0230)
      .setText("|cffFFCC00M|r")
      .setScale(1.00)

    this.toggleMinimapButtonBackdrop = new Frame("ToggleMinimapButton[0]", this.toggleMinimapButton, 0, 0, 'BACKDROP', "")
      .setAllPoints(this.toggleMinimapButton)
      .setTexture("BTNItemScouter.blp", 0, true)

    this.toggleMinimapIconsTrigger = new Trigger();
    this.toggleMinimapIconsTrigger.triggerRegisterFrameEvent(this.toggleMinimapButton, FRAMEEVENT_CONTROL_CLICK);
    this.toggleMinimapIconsTrigger.addCondition(Condition(() => {
      this.toggleMinimapButton.enabled = false;
      this.toggleMinimapButton.enabled = true;
      this.toggleMinimapIcons(GetTriggerPlayer());
      return false;
    }));
    

    this.zoomDistSlider = new Frame("ZoomDistSlider", 
      Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0, 
      "SLIDER", "EscMenuSliderTemplate"
    )
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.010, 0.1540)
      .setMinMaxValue(PlayerCam.ZOOM_MIN, PlayerCam.ZOOM_MAX)
      .setValue(PlayerCam.ZOOM_MIN)
      .setStepSize(200)
    ;
    this.zoomDistTrigger = new Trigger();
    this.zoomDistTrigger.triggerRegisterFrameEvent(this.zoomDistSlider, FRAMEEVENT_SLIDER_VALUE_CHANGED);
    this.zoomDistTrigger.addCondition(Condition(() => {
      this.zoomDistSlider.enabled = false;
      this.zoomDistSlider.enabled = true;
      const playerId = GetPlayerId(GetTriggerPlayer());
      Globals.customPlayers[playerId].playerCam.setZoom(BlzGetTriggerFrameValue());
      return false;
    }));

    
    // this.helpSkillsButton = new Frame("IconButtonTemplate", Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0)
    //   .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.1960, 0.0960)
    //   .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.2200, 0.1200)
    //   .setText("?")
    //   .setScale(1.00)
    this.helpSkillsButton = new Frame("ScriptDialogButton", 
      Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0
    )
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.2300, 0.1100)
      .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.2800, 0.1305)
      .setText("|cffFFFFFFInfo|r")
      .setScale(1.00)

    this.helpSkillsTrigger = new Trigger();
    this.helpSkillsTrigger.triggerRegisterFrameEvent(this.helpSkillsButton, FRAMEEVENT_CONTROL_CLICK);
    this.helpSkillsTrigger.addCondition(Condition(() => {
      this.helpSkillsButton.enabled = false;
      this.helpSkillsButton.enabled = true;
      udg_TransformationPlayer = GetTriggerPlayer();
      udg_TransformationString = "hs";
      TriggerExecute(gg_trg_Transformations_Run_Command);
      return false;
    }));


    this.dmgButton = new Frame("IconButtonTemplate", Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0)
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.1840, 0.0020)
      .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.2050, 0.0230)
      .setScale(1.00)

    this.dmgButtonBackdrop = new Frame("DmgButton[0]", this.dmgButton, 0, 0, 'BACKDROP', "")
      .setAllPoints(this.dmgButton)
      .setTexture("BTNItemZSword.blp", 0, true)

    this.dmgButtonTrigger = new Trigger();
    this.dmgButtonTrigger.triggerRegisterFrameEvent(this.dmgButton, FRAMEEVENT_CONTROL_CLICK);
    this.dmgButtonTrigger.addCondition(Condition(() => {
      this.dmgButton.enabled = false;
      this.dmgButton.enabled = true;
      DisplayTimedTextToPlayer(GetTriggerPlayer(), 0, 0, 15, 
        DDS.getInstance().getDamageDataStr()
      );
      return false;
    }));

    this.skinButton = new Frame("IconButtonTemplate", Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0), 0, 0)
      .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, 0.1840, 0.0250)
      .setAbsPoint(FRAMEPOINT_TOPRIGHT, 0.2050, 0.0460)
      .setScale(1.00)

    this.skinButtonBackdrop = new Frame("SkinButton[0]", this.skinButton, 0, 0, 'BACKDROP', "")
      .setAllPoints(this.skinButton)
      .setTexture("BTNJusticePose.blp", 0, true)

    this.skinButtonTrigger = new Trigger();
    this.skinButtonTrigger.triggerRegisterFrameEvent(this.skinButton, FRAMEEVENT_CONTROL_CLICK);
    this.skinButtonTrigger.addCondition(Condition(() => {
      this.skinButton.enabled = false;
      this.skinButton.enabled = true;
      TransformationSystem.getInstance().changeSkin(GetTriggerPlayer());
      return false;
    }));
  }

  toggleMinimapIcons(player: player) {
    const playerId = GetPlayerId(player);
    const visible = Globals.customPlayers[playerId].toggleMMVisibleFlag();
    DisplayTimedTextToPlayer(player, 0, 0, 1, "|cffffff00Minimap Icons: |r" + 
      (visible ? 
        "|cff00ff00On|r" :
        "|cffff2222Off|r"
      )
    );
    for (const mm of Globals.minimapIcons) {
      if (player == GetLocalPlayer()) {
        SetMinimapIconVisible(mm, visible);
      }
    }
  }

  show(flag: boolean, ignoreCustomUIFlag: boolean, who?: player) {
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

export function toggleFrameHandle(fh: framehandle, b:boolean): void {
  BlzFrameSetVisible(fh, b);
  BlzFrameSetEnable(fh, b);
}