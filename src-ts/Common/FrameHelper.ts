export module FrameHelper {
  export function loseFocusFromTriggeringFrame() {
    BlzFrameSetEnable(BlzGetTriggerFrame(), false);
    BlzFrameSetEnable(BlzGetTriggerFrame(), true);
  }
}