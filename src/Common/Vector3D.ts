export class Vector3D implements Serializable<Vector3D> {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,  
  ){

  }

  // alternate access format
  get r(): number {
    return this.x;
  }

  set r(red: number) {
    this.x = red;
  }

  get g(): number {
    return this.y;
  }

  set g(green: number) {
    this.y = green;
  }

  get b(): number {
    return this.z;
  }

  set b(blue: number) {
    this.z = blue;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static textString(color: Vector3D, ...input: any[]) {
    const colorer = "|cFF" + string.format('%02x', color.r)
      + string.format('%02x', color.g)
      + string.format('%02x', color.b);

    let ret = colorer;
    for (let i = 0; i < input.length; i++) {
      ret += tostring(input[i]);
      if (i != input.length - 1) ret += " ";
    }
    // ret = ret.replaceAll("|r", colorer);
    ret += "|r";
    return ret
  }
  
  public static textStringSolo(color: Vector3D, input: any) {
    const colorer = "|cFF" + string.format('%02x', color.r)
      + string.format('%02x', color.g)
      + string.format('%02x', color.b);

    return colorer
      + String(input)
      // + (tostring(input).replaceAll("|r", colorer)) //Re add tip color
      + "|r"
  }

  deserialize(
    input: {
      x: number;
      y: number;
      z: number;
    },
  ) {
    this.x = input.x;
    this.y = input.y;
    this.z = input.z;
    return this;
  }
}