import { Colorizer } from "./Colorizer";

export module TextTagHelper {
  export function showTempText(
    text: string, 
    x: number, 
    y: number, 
    duration: number = 5.0, 
    fading: number = 4.0,
    force: force = GetPlayersAll(),
  ) {
    const tagLoc = Location(x, y);
    let tag = CreateTextTagLocBJ(text, tagLoc, 0, 10, 100, 100, 100, 0);
    RemoveLocation(tagLoc);
    ShowTextTagForceBJ(true, tag, force);
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

  export function showPlayerColorTextToForce(
    text: string,
    xPos: number,
    yPos: number,
    offsetX: number = 0,
    offsetY: number = 0,
    offsetZ: number = 0,
    force: force = GetPlayersAll(),
    size: number = 10,
    red: number = 255,
    green: number = 255,
    blue: number = 255,
    transparency: number = 255,
    speed: number = 64,
    angle: number = 90,
    fading: number = 4.0,
    duration: number = 5.0,
  ) {
    const tag = CreateTextTag();
    SetTextTagPos(tag, xPos + offsetX, yPos + offsetY, offsetZ);
    SetTextTagTextBJ(tag, text, size);
    SetTextTagColor(tag, red, green, blue, transparency);

    ShowTextTagForceBJ(true, tag, force);

    SetTextTagVelocityBJ(tag, speed, angle);

    SetTextTagPermanent(tag, false);
    SetTextTagLifespan(tag, duration);
    SetTextTagFadepoint(tag, fading);
  }
}