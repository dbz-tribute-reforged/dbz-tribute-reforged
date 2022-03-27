export class TextFrameData {
  /*
    textaligntype vertical TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_BOTTOM 
    textaligntype horizontal TEXT_JUSTIFY_LEFT, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_RIGHT
	*/
  constructor(
    public value: string,
    public verticalAlignment: textaligntype,
    public horizontalAlignment: textaligntype
  ) {
    
  }
}