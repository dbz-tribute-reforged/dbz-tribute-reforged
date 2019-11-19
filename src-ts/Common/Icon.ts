export class Icon {
  static readonly defaultEnabled = "Replaceabletextures\\CommandButtons\\BTNHeroBloodElfPrince.blp";
  static readonly defaultDisabled = "Replaceabletextures\\CommandButtonsDisabled\\DISBTNHeroBloodElfPrince.blp";

  constructor(
    public enabled: string = Icon.defaultEnabled, 
    public disabled: string = Icon.defaultDisabled,
  ) {

  }
}