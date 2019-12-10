import { SagaUnit } from "./SagaUnit";
import { Vector2D } from "Common/Vector2D";

export const sagaUnitsConfig = new Map<string, SagaUnit>(
  [
    // dead zone movie
    ["Garlic Jr", new SagaUnit(FourCC("U00D"), 5, 30, 25, 20, new Vector2D(6000, 22500))],
    ["Ginger", new SagaUnit(FourCC("O002"), 1, 5, 5, 5, new Vector2D(5860, 21638))],
    ["Nicky", new SagaUnit(FourCC("O002"), 1, 5, 5, 5, new Vector2D(5500, 22000))],
    ["Sansho", new SagaUnit(FourCC("N00C"), 1, 10, 5, 5, new Vector2D(6292, 22000))],

    // raditz saga
    ["Raditz", new SagaUnit(FourCC("U01D"), 5, 60, 50, 75, new Vector2D(17333, -7358))],

    // saiyan saga
    ["Nappa", new SagaUnit(FourCC("U019"), 7, 100, 100, 100, new Vector2D(-3300, -5500))],
    ["Vegeta", new SagaUnit(FourCC("E003"), 15, 200, 200, 400, new Vector2D(-3300, -5500))],

    // namek saga
    ["Dodoria", new SagaUnit(FourCC("U015"), 15, 250, 150, 200, new Vector2D(8765, 1400))],
    ["Zarbon", new SagaUnit(FourCC("U016"), 17, 300, 300, 250, new Vector2D(8765, 1400))],
    ["Zarbon 2", new SagaUnit(FourCC("U01B"), 18, 500, 300, 250, new Vector2D(8765, 1400))],

    // ginyu force
    ["Guldo", new SagaUnit(FourCC("U00Y"), 20, 200, 200, 600, new Vector2D(8765, 1400))],
    ["Recoome", new SagaUnit(FourCC("U005"), 22, 600, 200, 300, new Vector2D(8765, 1400))],
    ["Burter", new SagaUnit(FourCC("U00Z"), 23, 200, 600, 350, new Vector2D(8765, 1400))],
    ["Jeice", new SagaUnit(FourCC("U010"), 23, 600, 250, 600, new Vector2D(8765, 1400))],
    ["Ginyu", new SagaUnit(FourCC("U000"), 25, 700, 250, 650, new Vector2D(8765, 1400))],

    // frieza
    ["Frieza 1", new SagaUnit(FourCC("U011"), 25, 800, 200, 800, new Vector2D(8765, 1400))],
    ["Frieza 2", new SagaUnit(FourCC("U012"), 26, 1000, 300, 800, new Vector2D(8765, 1400))],
    ["Frieza 3", new SagaUnit(FourCC("U013"), 27, 1100, 350, 850, new Vector2D(8765, 1400))],
    ["Frieza 4", new SagaUnit(FourCC("U014"), 28, 1200, 400, 1200, new Vector2D(8765, 1400))],
    ["Frieza 5", new SagaUnit(FourCC("U018"), 29, 1500, 400, 1500, new Vector2D(8765, 1400))],

    // garlic jr saga
    ["Garlic Jr 2", new SagaUnit(FourCC("U00D"), 25, 750, 350, 750, new Vector2D(6000, 22500))],
    ["Salt", new SagaUnit(FourCC("U00E"), 23, 500, 300, 600, new Vector2D(6292, 22000))],
    ["Vinegar", new SagaUnit(FourCC("U00F"), 23, 500, 300, 600, new Vector2D(5861, 21285))],
    ["Mustard", new SagaUnit(FourCC("U00G"), 23, 600, 300, 500, new Vector2D(5860, 21638))],
    ["Spice", new SagaUnit(FourCC("U00H"), 23, 600, 300, 500, new Vector2D(5500, 22000))],

  ],
);