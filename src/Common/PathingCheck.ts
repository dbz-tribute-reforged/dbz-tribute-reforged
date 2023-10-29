import { Vector2D } from './Vector2D';
import { Item } from 'w3ts';
import { CoordMath } from './CoordMath';

export module PathingCheck {
  let item: Item;
  let rect: rect;
  let hiddenItems: item[];
  let hiddenMax: number;
  let defaultMaxRange: number;
  let target: Vector2D;
  let unstuckPos: Vector2D;
  let smoothPos: Vector2D;
  let tmpVec: Vector2D;
  const unstuckOffsets = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [0, 0], [1, 0],
    [-1,-1], [0,-1], [1,-1],
  ];

  export function Init() {
    item = new Item(FourCC('wtlg'), -128, -128);
    item.visible = false;
    item.invulnerable = true;
    rect = Rect(0, 0, 128, 128);
    hiddenItems = [];
    hiddenMax = 0;
    defaultMaxRange = 100;
    target = new Vector2D();
    unstuckPos = new Vector2D();
    smoothPos = new Vector2D();
    tmpVec = new Vector2D();
  }

  export function IsWalkable(
    source: Vector2D, 
    maxDist: number = defaultMaxRange,
  ): boolean {
    MoveRectTo(rect, source.x, source.y);
    EnumItemsInRect(rect, null, () => {
      let i = GetEnumItem();
      if (IsItemVisible(i)) {
        hiddenItems[hiddenMax] = i;
        SetItemVisible(i, false);
        hiddenMax += 1;
      }
    })

    item.setPosition(source.x, source.y);

    target.x = item.x; 
    target.y = item.y;
    item.visible = false;

    while (hiddenMax > 0) {
      --hiddenMax;
      SetItemVisible(hiddenItems[hiddenMax], true);
      hiddenItems[hiddenMax] = item.handle;
    }

    const distance = CoordMath.distance(source, target);
    return distance < maxDist;
  }

  export function isGroundWalkable(
    target: Vector2D,
    range: number = defaultMaxRange,
  ): boolean {
    return (
      PathingCheck.IsWalkable(target, range) && 
      !IsTerrainPathable(target.x, target.y, PATHING_TYPE_WALKABILITY)
    )
  }

  export function isFlyingWalkable(target: Vector2D): boolean {
    return !IsTerrainPathable(target.x, target.y, PATHING_TYPE_FLYABILITY);
  }

  export function isDeepWater(target: Vector2D): boolean {
    return (
      !IsTerrainPathable(target.x, target.y, PATHING_TYPE_AMPHIBIOUSPATHING) &&
      IsTerrainPathable(target.x, target.y, PATHING_TYPE_WALKABILITY)
    )
  }

  export function moveGroundUnitToCoord(
    unit: unit, 
    target: Vector2D, 
    range: number = defaultMaxRange,
  ): boolean {
    if (isGroundWalkable(target, range)) {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
      return true;
    }
    return false;
  }

  export function moveFlyingUnitToCoord(unit: unit, target: Vector2D): boolean {
    if (isFlyingWalkable(target)) {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
      return true;
    }
    return false;
  }

  export function moveFlyingUnitToCoordExcludingDeepWater(unit: unit, target: Vector2D): boolean {
    if (isFlyingWalkable(target) && !isDeepWater(target))
    {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
      return true;
    }
    return false;
  }

  export function isGroundSmooth(target: Vector2D): boolean {
    const smoothDistance = 32;
    for (const smoothOffset of unstuckOffsets) {
      smoothPos.setPos(
        target.x + smoothOffset[0] * smoothDistance,
        target.y + smoothOffset[1] * smoothDistance
      );
      if (!isGroundWalkable(smoothPos, smoothDistance)) {
        return false;
      }
    }
    return true;
  }

  export function unstuckGroundUnitFromCliff(unit: unit, dest: Vector2D) {
    // test 3x3 box around the unit for a free spot
    const unstuckSearchRange = [16, 32, 64, 128, 256];

    for (const unstuckDistance of unstuckSearchRange) {
      for (const offset of unstuckOffsets) {
        if (offset[0] == 0 && offset[1] == 0) continue;

        const newX = dest.x + offset[0] * unstuckDistance;
        const newY = dest.y + offset[1] * unstuckDistance;
        unstuckPos.setPos(newX, newY);
        if (!isDeepWater(unstuckPos)) {
          if (isGroundSmooth(unstuckPos)) {
            SetUnitX(unit, newX);
            SetUnitY(unit, newY);
            return;
          }
        }
      }
    }
  }

  // result is modified
  export function extendVectorUntilGroundUnwalkable(
    start: Vector2D,
    end: Vector2D,
    result: Vector2D,
    moveSpeed: number,
    maxDistance: number = 0,
  ) {
    result.setVector(start);
    tmpVec.setVector(result);

    const angle = CoordMath.angleBetweenCoords(start, end);
    const distance = CoordMath.distance(start, end);
    const intervals = 1 + Math.floor(Math.min(Math.max(0, maxDistance), distance) / moveSpeed);

    for (let i = 0; i < intervals; ++i) {
      if (CoordMath.distance(result, end) < moveSpeed) {
        result.setVector(end);
        i = intervals;
      } else {
        tmpVec.setVector(result);
        result.polarProjectCoords(result, angle, moveSpeed);
      }
      if (!PathingCheck.isGroundWalkable(result, moveSpeed)) {
        result.setVector(tmpVec);
        break;
      }
    }
    return result;
  }
}