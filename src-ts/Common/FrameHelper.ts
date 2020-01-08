export module FrameHelper {
  export function loseFocusFromTriggeringFrame() {
    BlzFrameSetEnable(BlzGetTriggerFrame(), false);
    BlzFrameSetEnable(BlzGetTriggerFrame(), true);
  }

  export function setFramesVisibility(frames: framehandle[], visible: boolean) {
    for (const frame of frames) {
      BlzFrameSetVisible(frame, visible);
    }
  }

  export function getFrameFromString(
    input: string, 
    start: number, 
    doPrint: boolean = false,
  ): framehandle 
  {
    BJDebugMsg("Input: " + input.substring(start));

    const context = S2I(input.substring(start, start+2));
    const name = input.substring(start+3);
    const frame = BlzGetFrameByName(name, context);
  
    if (doPrint) { 
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        5,
        "BlzGetFrameByName(" + name + ", " + context + ") = " + 
         BlzFrameGetName(frame) + "(" + frame + ")"
      );
    }

    return frame;
  }
}