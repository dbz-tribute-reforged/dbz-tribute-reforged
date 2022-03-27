export class Icon implements Serializable<Icon> {
  static readonly defaultEnabled = "Replaceabletextures\\CommandButtons\\BTNSelectHeroOn.blp";
  static readonly defaultDisabled = "Replaceabletextures\\CommandButtonsDisabled\\DISBTNSelectHeroOn.blp";

  constructor(
    public enabled: string = Icon.defaultEnabled, 
    public disabled: string = Icon.defaultDisabled,
  ) {

  }

  deserialize(
    input: {
      enabled: string;
      disabled: string;
    },
  ) {
    this.enabled = input.enabled;
    this.disabled = input.disabled;
    return this;
  }
}