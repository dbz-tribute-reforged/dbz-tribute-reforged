export class KeyInput {
  static readonly META_NONE = 0;
  static readonly META_SHIFT = 1;
  static readonly META_CONTROL = 2;
  static readonly META_ALT = 4;
  static readonly META_WINDOWS = 8;

  public isDown: boolean = false;
  public meta: number = 0;

  constructor(
    public oskey: oskeytype,
  ) {
    
  }
}