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
}

export function colorize(inputString: string, color: Color): string {
  return color + string + "|r";
}