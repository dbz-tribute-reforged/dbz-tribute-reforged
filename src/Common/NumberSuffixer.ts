
export function SuffixNumber(integer: number): string {
  const single = integer % 10;
  let suffix: string;
  switch (single) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
      break;
  }
  return suffix;
}