export class Vector2D {
  constructor(public x: number = 0, public y:number = 0) {}

  public add(v: Vector2D): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
}