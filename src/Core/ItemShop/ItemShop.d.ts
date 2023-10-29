// /** @noSelf **/
// declare interface ItemShopInterface {
//     TasItemShopAddCategory(icon: string, name: string): number;
//     TasItemSetCategory(itemCode: number, category: number): void;

//     TasItemShopAddShop(unitCode: any, ...itemCodes: any[]): any;
// }
// declare const ItemShop: ItemShopInterface;

declare const TasItemData: any;

// TasItemShopAddShop('n01P', 'hlst', 'I004', 'I006')
declare function TasItemShopAddShop(unitCode: any, ...itemCodes: any[]): any;

// NOTE: CANNOT ADD CATEGORIES AFTER UI IS CREATED
// TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSteelMelee", "COLON_DAMAGE")
// declare function TasItemShopAddCategory(icon: string, name: string): number;

// TasItemShopAdd("bspd", catStr + catAgi)l
declare function TasItemShopAdd(itemCode: any, category: number): void;

// TasItemSetCategory('rst1', catStr)
declare function TasItemSetCategory(itemCode: any, category: number): void;

// TasItemFusionAdd('arsh', 'rde3', 'rde2')
declare function TasItemFusionAdd(itemCode: any, ...itemCodes: any[]): void;