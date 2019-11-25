export class Tooltip implements Serializable<Tooltip> {
  static readonly defaultTitle = "Tooltip Title";
  static readonly defaultBody = "Tooltip Body";
  
  constructor(
    public title: string = Tooltip.defaultTitle, 
    public body: string = Tooltip.defaultBody,
  ) {

  }

  deserialize(
    input: {
      title: string;
      body: string;
    },
  ) {
    this.title = input.title;
    this.body = input.body;
    return this;
  }

}