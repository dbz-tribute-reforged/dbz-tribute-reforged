import { Vector2D } from "Common/Vector2D";
import { FramePosition } from "./FramePosition";
import { StatusBarData } from "./StatusBarData";
import { StatusBarSimpleFrame } from "./StatusBarSimpleFrame";
import { TextureData } from "./TextureData";

export class HPBar extends StatusBarSimpleFrame {
  static readonly frameType = "MyHPBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(HPBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}

export class LevelBar extends StatusBarSimpleFrame {
  static readonly frameType = "MyLevelBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(LevelBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}

export class MPBar extends StatusBarSimpleFrame {
  static readonly frameType = "MyMPBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(MPBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}

export class SPBar extends StatusBarSimpleFrame {
  static readonly frameType = "MySPBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(SPBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}

export class SpellPowerBar extends StatusBarSimpleFrame {
  static readonly frameType = "MySpellPowerBar";

  constructor(
    owner: framehandle,
    createContext: number,
    size: Vector2D,
    position: FramePosition,
    public statusBar: StatusBarData,
    texture?: TextureData,
  ) {
    super(SpellPowerBar.frameType, owner, createContext, size, position, statusBar, texture);
  }
}