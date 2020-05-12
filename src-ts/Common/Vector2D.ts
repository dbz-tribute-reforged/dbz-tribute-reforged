export class Vector2D {
  private static degreesToRadians = Math.PI / 180.0;
  private static radiansToDegrees = 180.0 / Math.PI;

  constructor(public x: number = 0, public y:number = 0) {}

  public add(v: Vector2D): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public setVector(v: Vector2D): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public setPos(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public polarProjectCoords(source: Vector2D, angle: number, distance: number): this {
    this.x = source.x + distance * Math.cos(angle * Vector2D.degreesToRadians);
    this.y = source.y + distance * Math.sin(angle * Vector2D.degreesToRadians);
    return this;
  }

  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }
}