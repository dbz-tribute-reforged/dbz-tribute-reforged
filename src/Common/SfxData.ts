import { Vector3D } from "Common/Vector3D";

// maybe move to Commmon, not sure, should only used for CustomAbility right now
export class SfxData implements Serializable<SfxData> {
  public static readonly SHOW_ALL_GROUPS = -1;
  
  public effects: effect[];

  constructor(
    public model: string = "none.mdl",
    public repeatInterval: number = 1,
    public group: number = 0,
    public scale: number = 1.0,
    public endScale: number = -1,
    public startHeight: number = 0.0,
    public endHeight: number = 0.0,
    public extraDirectionalYaw: number = 0.0,
    public extraPitch: number = 0.0,
    public extraRoll: number = 0.0,
    public animSpeed: number = 1.0, 
    public color: Vector3D = new Vector3D(255, 255, 255),
    public updateCoordsOnly: boolean = false,
    public persistent: boolean = false,
    public attachmentPoint: string = "origin",
  ) {
    this.effects = [];
  }

  cleanup() {
    for (const effect of this.effects) {
      DestroyEffect(effect);
    }
    this.effects.splice(0, this.effects.length);
  }

  clone(): SfxData {
    return new SfxData(
      this.model, this.repeatInterval, this.group,
      this.scale, 
      this.endScale,
      this.startHeight, this.endHeight,
      this.extraDirectionalYaw,
      this.extraPitch,
      this.extraRoll,
      this.animSpeed,
      this.color,
      this.updateCoordsOnly,
      this.persistent,
      this.attachmentPoint,
    );
  }
  
  deserialize(
    input: {
      model: string;
      repeatInterval: number;
      group: number;
      scale: number;
      endScale: number;
      startHeight: number;
      endHeight: number;
      extraDirectionalYaw: number;
      extraPitch: number;
      extraRoll: number;
      animSpeed: number;
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
    this.endScale = input.endScale;
    this.startHeight = input.startHeight;
    this.endHeight = input.endHeight;
    this.extraDirectionalYaw = input.extraDirectionalYaw;
    this.extraPitch = input.extraPitch;
    this.extraRoll = input.extraRoll;
    this.animSpeed = input.animSpeed;
    this.color = new Vector3D().deserialize(input.color);
    this.updateCoordsOnly = input.updateCoordsOnly;
    this.persistent = input.persistent;
    this.attachmentPoint = input.attachmentPoint;
    return this;
  }

}