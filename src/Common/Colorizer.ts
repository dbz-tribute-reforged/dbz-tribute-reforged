import { Constants } from "./Constants";
import { Vector3D } from "./Vector3D";

export module Colorizer {
  export enum Color {
    Red = "|cFFFF0202",
    Blue = "|cFF0041FF",
    Aqua = "|cFF1BE5B8",
    Purple = "|cFF530080",
    Yellow = "|cFFFFFF00",
    Orange = "|cFFFE890D",
    Green = "|cFF1FBF00",
    Pink = "|cFFE45AAA",
    Grey = "|cFF949596",
    LightBlue = "|cFF7DBEF1",
    DarkGreen = "|cFF0F6145",
    Brown = "|cFF4D2903",
    White = "|cFFFFFFFF",
    Default = "|cFFFFCC00",
  }

  export const RGB = {
    Red: new Vector3D(255,2,2),
    Blue: new Vector3D(0,41,255),
    Aqua: new Vector3D(27,229,184),
    Purple: new Vector3D(83,0,128),
    Yellow: new Vector3D(255,255,0),
    Orange: new Vector3D(254,137,13),
    Green: new Vector3D(31,191,0),
    Pink: new Vector3D(228,90,170),
    Grey: new Vector3D(148,149,150),
    LightBlue: new Vector3D(125,190,241),
    DarkGreen: new Vector3D(15,97,69),
    Brown: new Vector3D(77,41,3),
    White: new Vector3D(255,255,255),
    Default: new Vector3D(255,204,0),
  }

  export function rgb_to_str(v: Vector3D) {
    return "|cFF" + v.r.toString(16) + v.g.toString(16) + v.b.toString(16);
  }

  // seems buggy?
  export function colorize(inputString: string, color: Color): string {
    return color + inputString + "|r";
  }

  export function getPlayerRGB(playerId: number) {
    if (playerId == 0) {
      return RGB.Red;
    } else if (playerId == 1) {
      return RGB.Blue;
    } else if (playerId == 2) {
      return RGB.Aqua;
    } else if (playerId == 3) {
      return RGB.Purple;
    } else if (playerId == 4) {
      return RGB.Yellow;
    } else if (playerId == 5) {
      return RGB.Orange;
    } else if (playerId == 6) {
      return RGB.Green;
    } else if (playerId == 7) {
      return RGB.Pink;
    } else if (playerId == 8) {
      return RGB.Grey;
    } else if (playerId == 9) {
      return RGB.DarkGreen;
    }
    return RGB.Default;
  }

  export function getPlayerColorText(playerId: number): Color {
    let color = Color.Red;
    switch(playerId){
      case 0:
        color = Color.Red;
        break;
      case 1:
        color = Color.Blue;
        break;
      case 2:
        color = Color.Aqua;
        break;
      case 3:
        color = Color.Purple;
        break;
      case 4:
        color = Color.Yellow;
        break;
      case 5:
        color = Color.Orange;
        break;
      case 6:
        color = Color.Green;
        break;
      case 7:
        color = Color.Pink;
        break;
      case 8:
        color = Color.Grey;
        break;
      case 9:
        color = Color.LightBlue;
        break;
      case 10:
        color = Color.DarkGreen;
        break;
      case 11:
        color = Color.Brown;
        break;
      default:
        color = Color.Default;
        break;
    }
    return color;
  }

  export function randomColor(): string {
    const index = Math.floor(Math.random() * Object.keys(Color).length);
    return getPlayerColorText(index);
  }

  export function getColoredPlayerName(player: player): string {
    return (
      Colorizer.getPlayerColorText(GetPlayerId(player)) + 
      GetPlayerName(player) + "|r"
    );
  }
}