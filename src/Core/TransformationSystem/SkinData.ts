import { Id } from "Common/Constants";
import { PlayerProfile } from "Core/PlayerProfile/PlayerProfile";


export class SkinData {
  public static CONDITION_WINS = "W";
  public static CONDITION_GAMES = "G";
  public static CONDITION_WINS_ON_HERO = "WH";
  public static CONDITION_GAMES_ON_HERO = "GH";

  public static SKIN_ALTERNATE = StringHash("skin_alternate");

  public static getSkinData(unitTypeId: number) {
    return SkinData.SKIN_TO_UNIT_MAP.get(unitTypeId);
  }

  public static SKIN_TO_UNIT_MAP = new Map<number, SkinData[]>([
    [Id.goku, [
      new SkinData(Id.gokuXeno, [
        [SkinData.CONDITION_GAMES, 5],
      ]),
    ]],
    [Id.fatBuu, [
      new SkinData(Id.fatBuuThin, [
        [SkinData.CONDITION_GAMES, 15],
      ]),
    ]],
    [Id.videl, [
      new SkinData(Id.hercule, [
        [SkinData.CONDITION_GAMES, 1],
      ]),
      new SkinData(Id.videlLongHair, [
        [SkinData.CONDITION_WINS, 1],
      ]),
    ]],
    [Id.jiren, [
      new SkinData(Id.elHermano, [
        [SkinData.CONDITION_WINS, 50],
      ]),
    ]],
    [Id.krillin, [
      new SkinData(Id.krillinKid, [
        [SkinData.CONDITION_WINS, 5],
      ]),
    ]],
    [Id.allMight, [
      new SkinData(Id.allMightCape, [
        [SkinData.CONDITION_GAMES, 10],
      ]),
    ]],
    [Id.sephiroth, [
      new SkinData(Id.sephirothSkin2, [
        [SkinData.CONDITION_GAMES, 10],
      ]),
      new SkinData(Id.sephirothSkin3, [
        [SkinData.CONDITION_GAMES, 10],
      ]),
      new SkinData(Id.sephirothSkin4, [
        [SkinData.CONDITION_GAMES, 10],
      ]),
    ]],
    [Id.albedo, [
      new SkinData(SkinData.SKIN_ALTERNATE, [
        [SkinData.CONDITION_WINS, 10],
      ]),
    ]],
    [Id.beerus, [
      new SkinData(Id.champa, [
        [SkinData.CONDITION_WINS, 20],
      ]),
    ]],
    [Id.whis, [
      new SkinData(Id.vados, [
        [SkinData.CONDITION_GAMES, 20],
      ]),
    ]],
    // Hmkg scale too small
    // [Id.aggronor, [
    //   new SkinData(FourCC("Hmkg"), [
    //     [SkinData.CONDITION_WINS, 25],
    //   ]),
    // ]],
  ]);

  constructor(
    public targetId: number,
    public conditions: any[],
  ) {
  }

  isValid(playerProfile: PlayerProfile) {
    // return true;
    for (const condition of this.conditions) {
      if (condition[0] == SkinData.CONDITION_GAMES) {
        if (playerProfile.numFinishGames < condition[1]) return false;
      } else if (condition[0] == SkinData.CONDITION_WINS) {
        if (playerProfile.numWins < condition[1]) return false;
      }
    }
    return true;
  }
}
