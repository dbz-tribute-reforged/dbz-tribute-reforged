import { Globals } from "Common/Constants";
import { Vector2D } from "Common/Vector2D";

export class KOTHStage {
  
  public spawn1: Vector2D; // losing side
  public spawn2: Vector2D; // winning side
  public capturePoint: Vector2D;
  public arenaRect: rect;

  constructor(
    public name: string,
    s1: Vector2D,
    s2: Vector2D,
    cap: Vector2D,
    rect: rect,
  ) {
    this.spawn1 = new Vector2D(s1.x, s1.y);
    this.spawn2 = new Vector2D(s2.x, s2.y);
    this.capturePoint = new Vector2D(cap.x, cap.y);
    this.arenaRect = rect;
  }

  copyStage(stage: KOTHStage) {
    this.name = stage.name;
    this.spawn1.setVector(stage.spawn1);
    this.spawn2.setVector(stage.spawn2);
    this.capturePoint.setVector(stage.capturePoint);
    this.arenaRect = stage.arenaRect;
  }

  swapSides() {
    Globals.tmpVector.setVector(this.spawn1);
    this.spawn1.setVector(this.spawn2);
    this.spawn2.setVector(Globals.tmpVector);
  }
}