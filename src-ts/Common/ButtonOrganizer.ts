import { Button } from "CustomUI/Button";
import { FramePosition } from "CustomUI/FramePosition";

export module ButtonOrganizer {
  
  export function autoAlignButtonPositions(
    topLeftHandle: framehandle, 
    buttons: Map<string, Button>, 
    maxX: number,
    initialButtonXOffset: number,
    initialButtonYOffset: number,
  )  {
    let xOffset = 0;
    let yOffset = 0;
    let leftHandle = topLeftHandle;
    let isFirstButton = true;

    // will abstract this later, probably
    for (const [name, button] of buttons) {
      if (isFirstButton) {
        button.position = new FramePosition(
          FRAMEPOINT_TOPLEFT, 
          topLeftHandle, 
          FRAMEPOINT_TOPLEFT, 
          initialButtonXOffset,
          initialButtonYOffset
        );
        isFirstButton = false;
        topLeftHandle = button.frameHandle;
        leftHandle = button.frameHandle;
        xOffset = button.size.x + initialButtonXOffset;
        yOffset = -initialButtonYOffset;
      } else {
        if (xOffset + button.size.x < maxX) {
          button.position = new FramePosition(
            FRAMEPOINT_LEFT, 
            leftHandle, 
            FRAMEPOINT_RIGHT, 
            0,
            0
          );
          leftHandle = button.frameHandle;
          xOffset += button.size.x;
          yOffset = button.size.y > yOffset ? button.size.y : yOffset;
        } else {
          button.position = new FramePosition(
            FRAMEPOINT_TOP, 
            topLeftHandle, 
            FRAMEPOINT_BOTTOM, 
            0,
            0
          );
          topLeftHandle = button.frameHandle;
          leftHandle = button.frameHandle;
          xOffset = button.size.x + initialButtonXOffset;
          yOffset = button.size.y;
        }
      }
      button.resetRenderPosition().setRenderPosition(button.position);
    }
  }
}