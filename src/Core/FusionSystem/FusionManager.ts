
// export class FusionManager {
//   static readonly FUSION_INIT_ITEM: number = 3; 

//   static instance: FusionManager;

//   public fusionInitTrigger: trigger;

//   constructor() {
//     this.fusionInitTrigger = CreateTrigger();
//     this.initialize();
//   }

//   public static getInstance() {
//     if (this.instance == null) {
//       this.instance = new FusionManager();
//     }

//     return this.instance;
//   }

//   initialize() {
//     TriggerRegisterAnyUnitEventBJ(
//       this.fusionInitTrigger, 
//       EVENT_PLAYER_UNIT_USE_ITEM
//     );

//     TriggerAddCondition(this.fusionInitTrigger, 
//       Condition(() => {
//         const item = GetManipulatedItem();
//         const itemId = GetItemTypeId(item);
//         const owner = GetOwningPlayer(GetTriggerUnit());
//         if (itemId == FusionManager.FUSION_INIT_ITEM) {
//           DisplayTimedTextToPlayer(owner, 0, 0, 5, "Fusion is not yet implemented.");
//         }
//         return false;
//       })
//     )


    
//     // select 2 units for fusion
//     // graft the second to the first
//     // enforce positioning rules onto both (somehow)
    

//   }


// }