import { Constants } from "./Constants";

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

  // seems buggy?
  export function colorize(inputString: string, color: Color): string {
    return color + string + "|r";
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