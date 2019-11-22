import { Vector3D } from "Common/Vector3D";

export class SfxData {
  // maybe move to Commmon, not sure, should only used for CustomAbility right now
  constructor(
    public model: string,
    public repeatInterval: number,
    public scale: number,
    public startHeight: number,
    public endHeight: number,
    public directionalYawExtra: number,
    public color: Vector3D,
    public persistent: boolean,
  ) {

  }


}