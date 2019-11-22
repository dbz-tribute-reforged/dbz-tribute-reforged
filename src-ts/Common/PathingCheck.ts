import { Vector2D } from './Vector2D';
import { Item } from 'w3ts';
import { CoordMath } from './CoordMath';

export module PathingCheck {
  let item: Item;
  let rect: rect;
  let hiddenItems: item[];
  let hiddenMax: number;
  let maxRange: number;

  export function Init() {
    item = new Item(FourCC('wtlg'), -128, -128);
    item.visible = false;
    rect = Rect(0, 0, 128, 128);
    hiddenItems = [];
    hiddenMax = 0;
    maxRange = 100;
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

    const target = new Vector2D(item.x, item.y);
    item.visible = false;

    while (hiddenMax > 0) {
      --hiddenMax;
      SetItemVisible(hiddenItems[hiddenMax], true);
      hiddenItems[hiddenMax] = item.handle;
    }

    const distance = CoordMath.distance(source, target);
    
    return distance < maxRange;
  }

  export function moveUnitToCoord(unit: unit, target: Vector2D, checkPathing: boolean) {
    if (
      !checkPathing ||
        (
          PathingCheck.IsWalkable(target) && 
          !IsTerrainPathable(target.x, target.y, PATHING_TYPE_WALKABILITY)
        ) 
    ) {
      SetUnitX(unit, target.x);
      SetUnitY(unit, target.y);
    }
  }
}