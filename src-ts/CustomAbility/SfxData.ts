export class SfxData {
  // maybe move to Commmon, not sure, should only used for CustomAbility right now
  constructor(
    public model: string,
    public repeatInterval: number,
    public scale: number,
    public sfxHeight: number,
  ) {

  }


}