export class Vector3D {
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
}