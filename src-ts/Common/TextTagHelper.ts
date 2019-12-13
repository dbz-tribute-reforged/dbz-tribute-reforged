import { Colorizer } from "./Colorizer";

export module TextTagHelper {
  export function showTempText(
    text: string, 
    x: number, 
    y: number, 
    duration: number = 5.0, 
    fading: number = 4.0,
  ) {
    const tagLoc = Location(x, y);
    let tag = CreateTextTagLocBJ(text, tagLoc, 0, 10, 100, 100, 100, 0);
    RemoveLocation(tagLoc);
    ShowTextTagForceBJ(true, tag, GetPlayersAll());
    SetTextTagVelocityBJ(tag, 64, 90);
    SetTextTagPermanentBJ(tag, false);
    SetTextTagLifespanBJ(tag, duration);
    SetTextTagFadepointBJ(tag, fading);
  }

  export function showPlayerColorTextOnUnit(colorText: string, playerId: number, unit: unit) {
    TextTagHelper.showTempText(
      Colorizer.getPlayerColorText(playerId) + colorText + "|r", 
      GetUnitX(unit), 
      GetUnitY(unit),
    );
  }
}