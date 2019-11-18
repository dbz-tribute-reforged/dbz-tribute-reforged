import { TextFrame } from './TextFrame';
import { FramePosition } from './FramePosition';
import { Vector2D } from './Vector2D';
import { TextFrameData } from './TextFrameData';
import { Backdrop } from './Backdrop';
import { Button } from './Button';
import { FrameTrigger } from './FrameTrigger';
import { Color, randomColor } from './Colorizer';
import { SliderData } from './SliderData';
import { Timer } from 'w3ts';
import { ButtonMenu } from './ButtonMenu';
import { BasicButton } from './BasicButton';
import { BasicTitledSlider } from './BasicTitledSlider';
import { StatusBar } from './StatusBar';
import { StatusBarData } from './StatusBarData';
import { TextureData } from './TextureData';
import { HPBar } from './HPBar';
import { MPBar } from './MPBar';
import { LevelBar } from './LevelBar';


// need to add promise + error catching
function LoadToc(path: string): boolean {
	const loaded = BlzLoadTOCFile(path);
	if(loaded) {
		BJDebugMsg("Loaded: " + path);
	} else {
		BJDebugMsg("Failed to load: " + path);
	}
	return loaded;
}

function loseFocusFromTriggeringFrame() {
	BlzFrameSetEnable(BlzGetTriggerFrame(), false);
	BlzFrameSetEnable(BlzGetTriggerFrame(), true);
}

const smallButtonSize = new Vector2D(0.085, 0.021);
const defaultSliderSize = new Vector2D(0.139, 0.012);

// perhaps a map of all ui elements, instead of these globals
let helloWorldBackdrop: Backdrop;
let catches: number = 0;
let mainMenu: ButtonMenu;
const buttonMenus: Map<String, ButtonMenu> = new Map();

function moveButton3Around() {
	const x = Math.min(0.75, Math.max(0.04, Math.random()));
	const y = Math.min(0.55, Math.max(0.2, Math.random()));
	const handle = BlzGetFrameByName("helloWorldButton3", 0);
	BlzFrameClearAllPoints(handle);
	BlzFrameSetAbsPoint(handle, FRAMEPOINT_CENTER, x, y);
}

export function CustomUiTest() {
	BJDebugMsg("Testing ui ... ");

	let loaded = LoadToc("CustomUI\\templates.toc");

	const grandpa = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0);
	const questButtonHandle = BlzGetFrameByName("UpperButtonBarQuestsButton", 0);
	const chatButtonHandle = BlzGetFrameByName("UpperButtonBarChatButton", 0);
	
	/*
		constant textaligntype TEXT_JUSTIFY_TOP = ConvertTextAlignType(0)
		constant textaligntype TEXT_JUSTIFY_MIDDLE = ConvertTextAlignType(1)
		constant textaligntype TEXT_JUSTIFY_BOTTOM = ConvertTextAlignType(2)
		constant textaligntype TEXT_JUSTIFY_LEFT = ConvertTextAlignType(3)
		constant textaligntype TEXT_JUSTIFY_CENTER = ConvertTextAlignType(4)
		constant textaligntype TEXT_JUSTIFY_RIGHT = ConvertTextAlignType(5)	
		0, 1, 2 are for textaligntype vert
		3, 4, 5 are for textaligntype horz
	*/

	BJDebugMsg("Setting up button3");
	const helloButton3 = new Button(
		"helloWorldButton3",
		"GLUETEXTBUTTON", 
		grandpa,
		"ScriptDialogButton", 
		0, 
		new Vector2D(0.085, 0.021),
		new FramePosition(FRAMEPOINT_TOP, chatButtonHandle, FRAMEPOINT_BOTTOM, 0.0, 0.0),
		new TextFrameData("Catch me!", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
	)


	BJDebugMsg("Setting up button3 trigger");
	const t3 = new FrameTrigger();
	t3.registerFrameEvent(helloButton3.frameHandle, FRAMEEVENT_MOUSE_ENTER);
	t3.addAction(() => {
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			moveButton3Around();
			loseFocusFromTriggeringFrame();
		}
	});


	BJDebugMsg("Setting up button4 trigger");
	const t4 = new FrameTrigger();
	t4.registerFrameEvent(helloButton3.frameHandle, FRAMEEVENT_CONTROL_CLICK);
	t4.addAction(() => {
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			moveButton3Around();
			loseFocusFromTriggeringFrame();
		}
	});
	
	BJDebugMsg("making main menu");
	mainMenu = new ButtonMenu(
		"mainMenu", 
		"mainMenuTitle",
		grandpa, 
		0, 
		new Vector2D(0.3, 0.45), 
		new FramePosition(FRAMEPOINT_TOPLEFT, grandpa, FRAMEPOINT_TOPLEFT, 0, -0.035), 
		Color.White + "Tribute Reforged Menu"
	).setRenderVisible(false);

	BJDebugMsg("Setting up Main Menu Button");
	const mainMenuToggleButton = new BasicButton(
		"mainMenuToggleButton",
		grandpa,
		0, 
		smallButtonSize,
		new FramePosition(FRAMEPOINT_TOP, questButtonHandle, FRAMEPOINT_BOTTOM, 0, 0),
		Color.White + "TR Menu"
	);

	const mt = new FrameTrigger();
	mt.registerFrameEvent(BlzGetFrameByName("mainMenuToggleButton", 0), FRAMEEVENT_CONTROL_CLICK);
	mt.addAction(() => {
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			BlzFrameSetVisible(mainMenu.frameHandle, !BlzFrameIsVisible(mainMenu.frameHandle));
			loseFocusFromTriggeringFrame();
		}
	});

	BJDebugMsg("Setting up submenus");
	for (let i = 0; i < 9; ++i) {
		const subMenuButton = new BasicButton(
			"subMenuButton" + i, 
			mainMenu.frameHandle, 
			0, 
			smallButtonSize, 
			new FramePosition(FRAMEPOINT_TOPLEFT, mainMenu.frameHandle, FRAMEPOINT_TOPLEFT, 0, 0),
			randomColor() + "Button " + i
		);
		
		const subMenu = new ButtonMenu(
			"subMenu" + i,
			"subMenuTitle" + i,
			mainMenu.frameHandle,
			0, 
			new Vector2D(0.3, 0.3),
			new FramePosition(FRAMEPOINT_BOTTOM, mainMenu.frameHandle, FRAMEPOINT_BOTTOM, 0, 0),
			"Sub Menu " + i,
		);
		/*
		const subMenu = new ButtonMenu(
			"subMenu" + i,
			"subMenuTitle" + i,
			mainMenu.frameHandle,
			new Vector2D(0.3, 0.3),
			new FramePosition(FRAMEPOINT_LEFT, mainMenu.frameHandle, FRAMEPOINT_RIGHT, 0, 0),
			"Sub Menu " + i,
		);
		*/
		
		const subMenuBackButton = new BasicButton(
			"subMenuBackButton" + i, 
			subMenu.frameHandle, 
			0, 
			smallButtonSize, 
			new FramePosition(FRAMEPOINT_TOPLEFT, subMenu.frameHandle, FRAMEPOINT_TOPLEFT, 0, 0),
			randomColor() + "Back " + i
		);
		subMenu.addButton(subMenuBackButton);
		subMenu.autoAlignButtonPositions();
		subMenu.setRenderVisible(false);

		const st = new FrameTrigger();
		st.registerFrameEvent(subMenuButton.frameHandle, FRAMEEVENT_CONTROL_CLICK);
		st.addAction(() => {
			if (GetTriggerPlayer() == GetLocalPlayer()) {
				BlzFrameSetVisible(subMenu.frameHandle, !BlzFrameIsVisible(subMenu.frameHandle));
				loseFocusFromTriggeringFrame();
			}
		});

		const rt = new FrameTrigger();
		rt.registerFrameEvent(subMenuBackButton.frameHandle, FRAMEEVENT_CONTROL_CLICK);
		rt.addAction(() => {
			if (GetTriggerPlayer() == GetLocalPlayer()) {
				BlzFrameSetVisible(subMenu.frameHandle, !BlzFrameIsVisible(subMenu.frameHandle));
				loseFocusFromTriggeringFrame();
			}
		});

		mainMenu.addButton(subMenuButton);
	}
	mainMenu.autoAlignButtonPositions();

	BJDebugMsg("Setting up sliders");
	const camDistanceSlider = new BasicTitledSlider(
		"camDistanceSlider",
		"camDistanceSliderTitle",
		BlzGetFrameByName("subMenu1", 0),
		0, 
		defaultSliderSize, 
		new FramePosition(FRAMEPOINT_TOPLEFT, BlzGetFrameByName("subMenu1", 0), FRAMEPOINT_TOPLEFT, 0.03, -0.1),
		new SliderData(1400, 200, 4000, 50),
		"Distance: " + Color.White + "1400"
	)
	
	const camAngleSlider = new BasicTitledSlider(
		"camAngleSlider",
		"camAngleSliderTitle",
		BlzGetFrameByName("subMenu1", 0),
		0, 
		defaultSliderSize, 
		new FramePosition(FRAMEPOINT_TOPLEFT, BlzGetFrameByName("camDistanceSlider", 0), FRAMEPOINT_BOTTOMLEFT, 0.0, -0.03),
		new SliderData(304, 270, 360, 0.5),
		"Angle: " + Color.White + "34.0"
	)
	
	const camRotationSlider = new BasicTitledSlider(
		"camRotationSlider",
		"camRotationSliderTitle",
		BlzGetFrameByName("subMenu1", 0),
		0, 
		defaultSliderSize, 
		new FramePosition(FRAMEPOINT_TOPLEFT, BlzGetFrameByName("camAngleSlider", 0), FRAMEPOINT_BOTTOMLEFT, 0.0, -0.03),
		new SliderData(90, 90, 450, 5),
		"Rotation: " + Color.White + "90.0"
	)

	const distanceTrigger = new FrameTrigger();
	distanceTrigger.registerFrameEvent(BlzGetFrameByName("camDistanceSlider", 0), FRAMEEVENT_SLIDER_VALUE_CHANGED);
	distanceTrigger.addAction(() => {
		const value = BlzGetTriggerFrameValue();
		SetCameraFieldForPlayer(
			GetTriggerPlayer(),
			CAMERA_FIELD_TARGET_DISTANCE, 
			value, 
			0
		);
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			BlzFrameSetText(camDistanceSlider.title.frameHandle, "Distance: " + Color.White + value);
		}
	});
	distanceTrigger.addAction(loseFocusFromTriggeringFrame);

	const angleTrigger = new FrameTrigger();
	angleTrigger.registerFrameEvent(BlzGetFrameByName("camAngleSlider", 0), FRAMEEVENT_SLIDER_VALUE_CHANGED);
	angleTrigger.addAction(() => {
		const value = BlzGetTriggerFrameValue();
		SetCameraFieldForPlayer(
			GetTriggerPlayer(),
			CAMERA_FIELD_ANGLE_OF_ATTACK, 
			value, 
			0
		);
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			BlzFrameSetText(camAngleSlider.title.frameHandle, "Angle: " + Color.White + (value - camAngleSlider.slider.minValue));
		}
	});
	angleTrigger.addAction(loseFocusFromTriggeringFrame);

	const rotationTrigger = new FrameTrigger();
	rotationTrigger.registerFrameEvent(BlzGetFrameByName("camRotationSlider", 0), FRAMEEVENT_SLIDER_VALUE_CHANGED);
	rotationTrigger.addAction(() => {
		const value = BlzGetTriggerFrameValue();
		SetCameraFieldForPlayer(
			GetTriggerPlayer(),
			CAMERA_FIELD_ROTATION, 
			value, 
			0
		);
		if (GetTriggerPlayer() == GetLocalPlayer()) {
			BlzFrameSetText(camRotationSlider.title.frameHandle, "Rotation: " + Color.White + (value - camRotationSlider.slider.minValue));
		}
	});
	rotationTrigger.addAction(loseFocusFromTriggeringFrame);

	// status bars
	BJDebugMsg("Setting up status bars");
	let hpBar = new HPBar(
		grandpa,
		0, 
		new Vector2D(0.3, 0.02),
		new FramePosition(FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, 0, 0.16),
		new StatusBarData(0, 0, 100)
	);

	let mpBar = new MPBar(
		grandpa,
		0, 
		new Vector2D(0.3, 0.02),
		new FramePosition(FRAMEPOINT_BOTTOM, grandpa, FRAMEPOINT_BOTTOM, 0, 0.14),
		new StatusBarData(0, 0, 100)
	);

	let levelBar = new LevelBar(
		grandpa, 
		0,
		new Vector2D(0.06, 0.015),
		new FramePosition(FRAMEPOINT_RIGHT, hpBar.frameHandle, FRAMEPOINT_LEFT, -0.002, 0),
		new StatusBarData(0, 0, 100)
	)

	let playerSelectedUnit: unit[] = [];
	let selectAUnitTrigger = CreateTrigger();
	for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
		TriggerRegisterPlayerSelectionEventBJ(selectAUnitTrigger, Player(i), true);
	}
	TriggerAddAction(selectAUnitTrigger, () => {
		playerSelectedUnit[GetPlayerId(GetTriggerPlayer())] = GetTriggerUnit();
	});
		
	TimerStart(CreateTimer(), 0.03, true, () => {
		let unit = playerSelectedUnit[GetPlayerId(GetLocalPlayer())];
		const currentHp = Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_LIFE)));
		const maxHp = I2S(BlzGetUnitMaxHP(unit));
		const currentMp = Math.max(0, R2I(GetUnitState(unit, UNIT_STATE_MANA)));
		const maxMp = I2S(BlzGetUnitMaxMana(unit));
		const level = GetUnitLevel(unit);
		BlzFrameSetValue(BlzGetFrameByName("MyHPBar", 0), GetUnitLifePercent(unit));
		BlzFrameSetValue(BlzGetFrameByName("MyMPBar", 0), GetUnitManaPercent(unit));
		BlzFrameSetValue(BlzGetFrameByName("MyLevelBar", 0), Math.floor(level*0.1));
		BlzFrameSetText(BlzGetFrameByName("MyHPBarText", 0), currentHp + " / " + maxHp);
		BlzFrameSetText(BlzGetFrameByName("MyMPBarText", 0), currentMp + " / " + maxMp);
		BlzFrameSetText(BlzGetFrameByName("MyLevelBarText", 0), "LVL: " + I2S(level));
	});

}