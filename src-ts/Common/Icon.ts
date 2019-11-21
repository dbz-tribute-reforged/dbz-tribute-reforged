export class Icon {
  static readonly defaultEnabled = "Replaceabletextures\\CommandButtons\\BTNSelectHeroOn.blp";
  static readonly defaultDisabled = "Replaceabletextures\\CommandButtonsDisabled\\DISBTNSelectHeroOn.blp";

  constructor(
    public enabled: string = Icon.defaultEnabled, 
    public disabled: string = Icon.defaultDisabled,
  ) {

  }
}