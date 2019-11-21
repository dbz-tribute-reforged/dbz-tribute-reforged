export class SfxData {
  // maybe move to Commmon, not sure, should only used for CustomAbility right now
  constructor(
    public models: string[],
    public repeatIntervals: number[],
  ) {
    this.models = [...models];
    this.repeatIntervals = [...repeatIntervals];
  }


}