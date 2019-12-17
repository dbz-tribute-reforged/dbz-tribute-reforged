export class Vector2D {
  constructor(public x: number = 0, public y:number = 0) {}

  public add(v: Vector2D): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }
}