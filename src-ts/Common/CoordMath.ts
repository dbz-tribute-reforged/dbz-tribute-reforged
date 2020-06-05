import { Vector2D } from "./Vector2D";

export module CoordMath {
  export const degreesToRadians = Math.PI / 180.0;
  export const radiansToDegrees = 180.0 / Math.PI;


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

  export function isInsideMapBounds(position: Vector2D): boolean {
    return (
      position.x > -8500 &&
      position.x < 31500 &&
      position.y > -8500 &&
      position.y < 31500
    )
  }

}