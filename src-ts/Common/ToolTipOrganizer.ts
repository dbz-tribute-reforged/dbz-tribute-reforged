export module ToolTipOrganizer {
  const baseSize = 0.04;
  const sizeIncrement = 0.01;
  const maxTextPerLine = 36;
  
  export function resizeToolTipHeightByValue(tooltip: framehandle, value: string) {
    const height = baseSize + (value.length / maxTextPerLine) * sizeIncrement;
    BlzFrameSetSize(tooltip, BlzFrameGetWidth(tooltip), height);
  }

}