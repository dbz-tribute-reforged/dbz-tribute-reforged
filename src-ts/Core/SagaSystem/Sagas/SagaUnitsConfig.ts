import { SagaUnit } from "./SagaUnit";
import { Vector2D } from "Common/Vector2D";

export const sagaUnitsConfig = new Map<string, SagaUnit>(
  [
    // dead zone
    ["Garlic Jr", new SagaUnit(FourCC("U00D"), 5, 30, 25, 20, new Vector2D(6000, 22500))],
    ["Ginger", new SagaUnit(FourCC("O002"), 1, 5, 5, 5, new Vector2D(5860, 21638))],
    ["Nicky", new SagaUnit(FourCC("O003"), 1, 5, 5, 5, new Vector2D(5500, 22000))],
    ["Sansho", new SagaUnit(FourCC("N00C"), 1, 10, 5, 5, new Vector2D(6300, 22000))],

    // raditz
    ["Raditz", new SagaUnit(FourCC("U01D"), 5, 45, 45, 60, new Vector2D(17333, -7358))],

    // saiyan saga
    ["Nappa", new SagaUnit(FourCC("U019"), 8, 120, 80, 80, new Vector2D(-3300, -5500))],
    ["Vegeta", new SagaUnit(FourCC("E003"), 15, 200, 200, 300, new Vector2D(-3300, -5500))],
    
    // wheelo
    ["Kishime", new SagaUnit(FourCC("O00P"), 6, 75, 75, 75, new Vector2D(800, 18000))],
    ["Misokatsun", new SagaUnit(FourCC("O00O"), 5, 50, 80, 50, new Vector2D(400, 18200))],
    ["Ebifurya", new SagaUnit(FourCC("O00N"), 7, 150, 80, 75, new Vector2D(-600, 17500))],
    ["Dr. Kochin", new SagaUnit(FourCC("O00Q"), 1, 2, 1, 1, new Vector2D(-600, 17500))],
    ["Wheelo", new SagaUnit(FourCC("U006"), 17, 320, 150, 450, new Vector2D(-300, 18000))],

    // turles
    ["Turles", new SagaUnit(FourCC("H01H"), 22, 300, 250, 300, new Vector2D(12600, 6950))],

    // slug
    ["Lord Slug", new SagaUnit(FourCC("O00L"), 27, 600, 300, 500, new Vector2D(4500, 9300))],

    // namek saga
    ["Dodoria", new SagaUnit(FourCC("U015"), 15, 300, 150, 200, new Vector2D(8800, 1400))],
    ["Zarbon", new SagaUnit(FourCC("U016"), 17, 350, 300, 250, new Vector2D(8800, 1400))],
    ["Zarbon 2", new SagaUnit(FourCC("U01B"), 18, 500, 300, 250, new Vector2D(8800, 1400))],

    // ginyu force
    ["Guldo", new SagaUnit(FourCC("U00Y"), 20, 200, 200, 650, new Vector2D(8800, 1400))],
    ["Recoome", new SagaUnit(FourCC("U005"), 22, 650, 200, 300, new Vector2D(8800, 1400))],
    ["Burter", new SagaUnit(FourCC("U00Z"), 23, 200, 650, 350, new Vector2D(8800, 1400))],
    ["Jeice", new SagaUnit(FourCC("U010"), 23, 650, 250, 600, new Vector2D(8800, 1400))],
    ["Ginyu", new SagaUnit(FourCC("U000"), 25, 800, 250, 650, new Vector2D(8800, 1400))],

    // frieza
    ["Frieza 1", new SagaUnit(FourCC("U011"), 25, 800, 200, 800, new Vector2D(8800, 1400))],
    ["Frieza 2", new SagaUnit(FourCC("U012"), 26, 1000, 300, 800, new Vector2D(8800, 1400))],
    ["Frieza 3", new SagaUnit(FourCC("U013"), 27, 1100, 350, 850, new Vector2D(8800, 1400))],
    ["Frieza 4", new SagaUnit(FourCC("U014"), 28, 1200, 400, 1300, new Vector2D(8800, 1400))],
    ["Frieza 5", new SagaUnit(FourCC("U018"), 29, 1500, 400, 1600, new Vector2D(8800, 1400))],

    // garlic jr
    ["Garlic Jr 2", new SagaUnit(FourCC("U00D"), 25, 750, 350, 750, new Vector2D(6000, 22500))],
    ["Salt", new SagaUnit(FourCC("U00E"), 23, 500, 300, 600, new Vector2D(6292, 22000))],
    ["Vinegar", new SagaUnit(FourCC("U00F"), 23, 500, 300, 600, new Vector2D(5861, 21285))],
    ["Mustard", new SagaUnit(FourCC("U00G"), 23, 600, 300, 500, new Vector2D(5860, 21638))],
    ["Spice", new SagaUnit(FourCC("U00H"), 23, 600, 300, 500, new Vector2D(5500, 22000))],

    // cooler's revenge
    ["Cooler", new SagaUnit(FourCC("H042"), 28, 1500, 400, 1600, new Vector2D(4500, 9300))],

    // return of cooler
    ["Metal Cooler 1", new SagaUnit(FourCC("H01A"), 35, 2000, 400, 2000, new Vector2D(-6000, 17200))],
    ["Metal Cooler 2", new SagaUnit(FourCC("H01A"), 35, 2000, 400, 2000, new Vector2D(-6000, 17200))],
    ["Metal Cooler 3", new SagaUnit(FourCC("H01A"), 35, 2000, 400, 2000, new Vector2D(-6000, 17200))],

    // trunks saga
    ["Mecha Frieza", new SagaUnit(FourCC("U00J"), 32, 2200, 410, 1000, new Vector2D(18000, 2000))],
    ["King Cold", new SagaUnit(FourCC("U00K"), 32, 2200, 410, 2000, new Vector2D(18000, 2000))],

    // androids 19/20 saga
    ["Android 19", new SagaUnit(FourCC("O00A"), 33, 3000, 350, 2500, new Vector2D(-5000, -5000))],
    ["Android 20", new SagaUnit(FourCC("H04T"), 33, 2500, 350, 3000, new Vector2D(-5000, -5000))],

    // androids 16/17/18 saga
    ["Android 16", new SagaUnit(FourCC("H08O"), 37, 4500, 350, 4000, new Vector2D(14000, 7500))],
    ["Android 17", new SagaUnit(FourCC("H05C"), 35, 4000, 350, 4000, new Vector2D(14000, 7500))],
    ["Android 18", new SagaUnit(FourCC("H05D"), 35, 3500, 350, 3500, new Vector2D(14000, 7500))],

    // super android 13
    ["Android 13", new SagaUnit(FourCC("H01V"), 36, 4000, 350, 4000, new Vector2D(-5000, -5000))],
    ["Android 14", new SagaUnit(FourCC("H01S"), 35, 3000, 350, 2000, new Vector2D(-5000, -5000))],
    ["Android 15", new SagaUnit(FourCC("H01T"), 35, 2000, 350, 3000, new Vector2D(-5000, -5000))],
    ["Super Android 13", new SagaUnit(FourCC("H01U"), 38, 5000, 400, 4500, new Vector2D(-5000, -5000))],

  ],
);