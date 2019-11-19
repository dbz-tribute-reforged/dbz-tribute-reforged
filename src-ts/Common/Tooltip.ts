export class Tooltip {
  static readonly defaultTitle = "Tooltip Title";
  static readonly defaultBody = "Tooltip Body";
  
  constructor(
    public title: string = Tooltip.defaultTitle, 
    public body: string = Tooltip.defaultBody,
  ) {

  }
}