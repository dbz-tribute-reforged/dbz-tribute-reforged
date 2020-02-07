import { Hooks } from "Libs/TreeLib/Hooks";
import { Constants } from "Common/Constants";
import { SagaItemConstants } from "./SagaItemConstants";

export class SagaItemManager {
  static instance: SagaItemManager;

  protected upgradeItemTrigger: trigger;
  protected battleArmorLimitTrigger: trigger;

  constructor (
  ) {
    this.upgradeItemTrigger = CreateTrigger();
    this.battleArmorLimitTrigger = CreateTrigger();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SagaItemManager();
      Hooks.set("SagaItemManager", this.instance);
    }
    return this.instance;
  }

  initialize() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEvent(
        this.upgradeItemTrigger, 
        player, 
        EVENT_PLAYER_UNIT_SPELL_EFFECT,
        Condition(() => {
          return GetSpellAbilityId() == SagaItemConstants.upgradeItemAbility;
        })
      );

      TriggerRegisterPlayerUnitEvent(
        this.battleArmorLimitTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM,
        Condition(() => {
          for (let i = 0; i < SagaItemConstants.battleArmor.length; ++i) {
            if (GetItemTypeId(GetManipulatedItem()) == SagaItemConstants.battleArmor[i]) {
              return true;
            }
          }
          return false;
        })
      )
    }

    TriggerAddCondition(
      this.upgradeItemTrigger, 
      Condition(() => {
        const messageForce = CreateForce();
        ForceAddPlayer(messageForce, GetTriggerPlayer());
        DisplayTimedTextToForce(
          messageForce, 
          10, 
          "|cffff2020Item Upgrades not yet implemented|r"
        );
        DestroyForce(messageForce);
        return false;
      })
    );

    // probably move this to an item-limiting manager...
    // that can limit num items to X per hero for any item

    TriggerAddCondition(
      this.battleArmorLimitTrigger,
      Condition(() => {
        const unit = GetManipulatingUnit();
        let carried = 0;
        for (let i = 0; i < SagaItemConstants.battleArmor.length; ++i) {
          for (let j = 0; j < 6; ++j) {
            if (GetItemTypeId(UnitItemInSlot(unit, j)) == SagaItemConstants.battleArmor[i]) {
              ++carried;
            }
          }
        }
        if (carried > 1) {
          const messageForce = CreateForce();
          ForceAddPlayer(messageForce, GetTriggerPlayer());
          DisplayTimedTextToForce(
            messageForce, 
            10, 
            "|cffff2020You can only carry 1 set of battle armor!|r"
          );
          DestroyForce(messageForce);
          UnitDropItemPoint(unit, GetManipulatedItem(), GetUnitX(unit), GetUnitY(unit));
        }
        return false;
      })
    )
  }
}