
export function toggleFrameHandle(fh: framehandle, b:boolean):void {
  BlzFrameSetVisible(fh, b);
  BlzFrameSetEnable(fh, b);
}