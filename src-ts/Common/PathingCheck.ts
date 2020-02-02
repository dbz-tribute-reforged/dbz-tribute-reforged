import { Vector2D } from './Vector2D';
import { Item } from 'w3ts';
import { CoordMath } from './CoordMath';

export module PathingCheck {
  let item: Item;
  let rect: rect;
  let hiddenItems: item[];
  let hiddenMax: number;
  let maxRange: number;
  let target: Vector2D;

  export function Init() {
    item = new Item(FourCC('wtlg'), -128, -128);
    item.visible = false;
    item.invulnerable = true;
    rect = Rect(0, 0, 128, 128);
    hiddenItems = [];
    hiddenMax = 0;
    maxRange = 100;
    target = new Vector2D();
  }

  export function IsWalkable(source: Vector2D): boolean {
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
    
    return distance < maxRange;
  }

  export function isGroundWalkable(target: Vector2D): boolean {
    return (
      PathingCheck.IsWalkable(target) && 
      !IsTerrainPathable(target.x, target.y, PATHING_TYPE_WALKABILITY)
    )
  }

  export function isFlyingWalkable(target: Vector2D): boolean {
    return !IsTerrainPathable(target.x, target.y, PATHING_TYPE_FLYABILITY);
  }

  export function moveGroundUnitToCoord(unit: unit, target: Vector2D) {
    if (isGroundWalkable(target)) {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
    }
  }

  export function moveFlyingUnitToCoord(unit: unit, target: Vector2D) {
    if (isFlyingWalkable(target)) {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
    }
  }
}