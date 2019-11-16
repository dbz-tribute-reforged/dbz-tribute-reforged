export class FramePosition {
  constructor(
    public sourcePoint: framepointtype,
    public targetFrame: framehandle, 
    public targetPoint: framepointtype, 
    public xOffset: number,
    public yOffset: number
  ) {
    
  }
}