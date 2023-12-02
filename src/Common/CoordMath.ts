import { Vector2D } from "./Vector2D";

export module CoordMath {
  export const degreesToRadians = Math.PI / 180.0;
  export const radiansToDegrees = 180.0 / Math.PI;


  export function angleBetweenCoords(source: Vector2D, target: Vector2D): number {
    return radiansToDegrees * Atan2(target.y - source.y, target.x - source.x);
  }

  export function angleBetweenXY(x1: number, y1: number, x2: number, y2: number): number {
    return radiansToDegrees * Atan2(y2 - y1, x2 - x1);
  }

  export function distance(source: Vector2D, target: Vector2D): number {
    const xDifference = source.x - target.x;
    const yDifference = source.y - target.y;
    return Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  }

  // legacy function
  export function polarProjectCoords(source: Vector2D, target: Vector2D, angle: number, distance: number) {
    target.setPos(
      source.x + distance * Math.cos(angle * degreesToRadians),
      source.y + distance * Math.sin(angle * degreesToRadians)
    );
  }

  export function magnitude(source: Vector2D): number {
    return Math.sqrt(source.x * source.x + source.y * source.y);
  }

  export function normalize(source: Vector2D) {
    const m = magnitude(source);
    if (m > 0) {
      source.x /= m;
      source.y /= m;
    }
  }

  export function multiply(source: Vector2D, amount: number) {
    source.x *= amount;
    source.y *= amount;
  }

  export function isInsideMapBounds(position: Vector2D): boolean {
    return (
      position.x > -8500 &&
      position.x < 31500 &&
      position.y > -8500 &&
      position.y < 31500
    )
  }

  export function extendToMaxDist(
    src: Vector2D, 
    target: Vector2D, 
    maxDist: number
  ) {
    if (CoordMath.distance(src, target) > maxDist) {
      target.polarProjectCoords(
        src, 
        CoordMath.angleBetweenCoords(src, target),
        maxDist
      );
    }
    return target;
  }

}