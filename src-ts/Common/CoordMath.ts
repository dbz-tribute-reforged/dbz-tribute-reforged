import { Vector2D } from "./Vector2D";

export module CoordMath {
  const degreesToRadians = Math.PI / 180.0;
  const radiansToDegrees = 180.0 / Math.PI;


  export function angleBetweenCoords(source: Vector2D, target: Vector2D): number {
    return radiansToDegrees * Atan2(target.y - source.y, target.x - source.x);
  }

  export function distance(source: Vector2D, target: Vector2D): number {
    const xDifference = source.x - target.x;
    const yDifference = source.y - target.y;
    return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  }

  // x=rcos y=rsin
  // angle given in degrees
  export function polarProjectCoords(source: Vector2D, angle: number, distance: number): Vector2D {
    return new Vector2D(
      source.x + distance * Math.cos(angle * degreesToRadians),
      source.y + distance * Math.sin(angle * degreesToRadians)
    );
  }

}