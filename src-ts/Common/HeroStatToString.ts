const heroStatStrings = new Map([
  [bj_HEROSTAT_STR, "STR"], 
  [bj_HEROSTAT_AGI, "AGI"], 
  [bj_HEROSTAT_INT, "INT"], 
]);

export function HeroStatToString(heroStat: number): string {
  let statString = heroStatStrings.get(heroStat)
  if (statString) {
    return statString;
  }
  return "?";
}