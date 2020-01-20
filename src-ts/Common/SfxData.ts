import { Vector3D } from "Common/Vector3D";

export class SfxData implements Serializable<SfxData> {
  public static readonly SHOW_ALL_GROUPS = -1;
  // maybe move to Commmon, not sure, should only used for CustomAbility right now
  constructor(
    public model: string = "none.mdl",
    public repeatInterval: number = 1,
    public group: number = 0,
    public scale: number = 1.0,
    public startHeight: number = 0.0,
    public endHeight: number = 0.0,
    public extraDirectionalYaw: number = 0.0,
    public color: Vector3D = new Vector3D(255, 255, 255),
    public updateCoordsOnly: boolean = false,
    public persistent: boolean = false,
    public attachmentPoint: string = "origin",
  ) {

  }
  
  deserialize(
    input: {
      model: string;
      repeatInterval: number;
      group: number;
      scale: number;
      startHeight: number;
      endHeight: number;
      extraDirectionalYaw: number;
      color: {
        x: number,
        y: number,
        z: number,
      },
      updateCoordsOnly: boolean;
      persistent: boolean;
      attachmentPoint: string;
    },
  ) {
    this.model = input.model;
    this.repeatInterval = input.repeatInterval;
    this.group = input.group;
    this.scale = input.scale;
    this.startHeight = input.startHeight;
    this.endHeight = input.endHeight;
    this.extraDirectionalYaw = input.extraDirectionalYaw;
    this.color = new Vector3D().deserialize(input.color);
    this.updateCoordsOnly = input.updateCoordsOnly;
    this.persistent = input.persistent;
    this.attachmentPoint = input.attachmentPoint;
    return this;
  }

}