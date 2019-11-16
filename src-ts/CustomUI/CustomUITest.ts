import { TextFrame } from './TextFrame';
import { FramePosition } from './FramePosition';
import { Vector2D } from './Vector2D';
import { TextFrameData } from './TextFrameData';
import { Backdrop } from './Backdrop';
import { Button } from './Button';
import { FrameTrigger } from './FrameTrigger';
import { Color, colorize } from './Colorizer';

function loseFocusFromTriggeringFrame() {
	BlzFrameSetEnable(BlzGetTriggerFrame(), false);
	BlzFrameSetEnable(BlzGetTriggerFrame(), true);
}

// promise + error catching
function LoadToc(path: string): boolean {
	return BlzLoadTOCFile(path);
}

// perhaps a map of all ui elements, instead of these globals
let helloWorldBackdrop: Backdrop;
let catches: number = 0;

function moveButton3Around() {
	const x = Math.min(0.75, Math.max(0.04, Math.random()));
	const y = Math.min(0.55, Math.max(0.2, Math.random()));
	const handle = BlzGetFrameByName("helloWorldButton3", 0);
	BlzFrameClearAllPoints(handle);
	BlzFrameSetAbsPoint(handle, FRAMEPOINT_CENTER, x, y);
}

export function CustomUiTest() {
	BJDebugMsg("Testing ui ... ");

	BlzLoadTOCFile("CustomUI\\templates.toc");
	


	const grandpa = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0);
	const questButtonHandle = BlzGetFrameByName("UpperButtonBarQuestsButton", 0);
	
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

	BJDebugMsg("Setting up button");
	const helloButton = new Button(
		"helloWorldButton",
		"GLUETEXTBUTTON", 
		grandpa,
		"ScriptDialogButton", 
		0, 
		new Vector2D(0.085, 0.021),
		new FramePosition(FRAMEPOINT_TOPLEFT, questButtonHandle, FRAMEPOINT_BOTTOMLEFT, 0.0, 0.0),
		new TextFrameData(Color.White + "Options", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
	)	
	

	BJDebugMsg("Setting up button2");
	const helloButton2 = new Button(
		"helloWorldButton2",
		"GLUETEXTBUTTON", 
		grandpa,
		"ScriptDialogButton", 
		0, 
		new Vector2D(0.085, 0.021),
		new FramePosition(FRAMEPOINT_LEFT, helloButton.frameHandle, FRAMEPOINT_RIGHT, 0.0, 0.0),
		new TextFrameData(Color.Green + "Resize", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
	)
	

	BJDebugMsg("Setting up button3");
	const helloButton3 = new Button(
		"helloWorldButton3",
		"GLUETEXTBUTTON", 
		grandpa,
		"ScriptDialogButton", 
		0, 
		new Vector2D(0.085, 0.021),
		new FramePosition(FRAMEPOINT_LEFT, helloButton2.frameHandle, FRAMEPOINT_RIGHT, 0.0, 0.0),
		new TextFrameData("Catch me!", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
	)


	BJDebugMsg("Setting up button1 trigger");
	const t = new FrameTrigger();
	t.registerFrameEvent(helloButton.frameHandle, FRAMEEVENT_CONTROL_CLICK);
	t.addAction(() => {
		let handle = BlzGetFrameByName("helloWorldBackdrop", 0);
		BlzFrameSetVisible(handle, !BlzFrameIsVisible(handle));
		
		handle = BlzGetFrameByName("helloWorldText", 0);
		BlzFrameSetVisible(handle, !BlzFrameIsVisible(handle));
	});
	t.addAction(loseFocusFromTriggeringFrame);

	
	BJDebugMsg("Setting up button2 trigger");
	const t2 = new FrameTrigger();
	t2.registerFrameEvent(helloButton2.frameHandle, FRAMEEVENT_CONTROL_CLICK);
	t2.addAction(() => {
		const resize = Math.max(0.1, Math.random());
		print("Hello2(Mouse click): resize bdrop: " + resize);
		helloWorldBackdrop.setRenderSize(resize, resize);
	});
	t2.addAction(loseFocusFromTriggeringFrame);


	BJDebugMsg("Setting up button3 trigger");
	const t3 = new FrameTrigger();
	t3.registerFrameEvent(helloButton3.frameHandle, FRAMEEVENT_MOUSE_ENTER);
	t3.addAction(() => {
		print("Mouse Hover detected bye!");
		moveButton3Around();
	});
	t3.addAction(loseFocusFromTriggeringFrame);


	BJDebugMsg("Setting up button4 trigger");
	const t4 = new FrameTrigger();
	t4.registerFrameEvent(helloButton3.frameHandle, FRAMEEVENT_CONTROL_CLICK);
	t4.addAction(() => {
		++catches;
		print("You've caught me " + catches + " times!");
		moveButton3Around();
	});
	t3.addAction(loseFocusFromTriggeringFrame);


	BJDebugMsg("Setting up hello backdrop");
	helloWorldBackdrop = new Backdrop(
		"helloWorldBackdrop", 
		"BACKDROP", 
		grandpa, 
		"EscMenuBackdrop", 
		0,
		new Vector2D(0.3, 0.45), 
		new FramePosition(FRAMEPOINT_TOPLEFT, helloButton.frameHandle, FRAMEPOINT_BOTTOMLEFT, 0.0, -0.01)
	)


	BJDebugMsg("Setting up hello text");
	const helloWorld = new TextFrame(
		"helloWorldText", 
		"TEXT", 
		helloWorldBackdrop.frameHandle, 
		"EscMenuTitleTextTemplate", 
		0, 
		new Vector2D(0, 0), 
		new FramePosition(FRAMEPOINT_TOP, helloWorldBackdrop.frameHandle, FRAMEPOINT_TOP, 0.0, -0.03), 
		new TextFrameData("Hello world! Hello Hello", TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
	)

/* 
	let moreText = BlzCreateFrameByType("TEXT", "MenuMainBackdropTitle", helloWorldBackdrop.frameHandle, "EscMenuTitleTextTemplate", 0);
	BlzFrameSetPoint(moreText, FRAMEPOINT_TOP, helloWorldBackdrop.frameHandle, FRAMEPOINT_TOP, 0, -0.03)
	BlzFrameSetText(moreText, "|cffffffffTribute Reforged Settings|r")
	BlzFrameSetEnable(moreText, false);
	BlzFrameSetEnable(moreText, true); */

}