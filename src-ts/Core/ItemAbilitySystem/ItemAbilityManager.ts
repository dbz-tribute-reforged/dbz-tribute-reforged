import { Hooks } from "Libs/TreeLib/Hooks";
import { Constants } from "Common/Constants";
import { ItemConstants } from "./ItemConstants";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { itemAbilityConfig } from "./ItemAbility/ItemAbilityConfig";

export class ItemAbilityManager {
  static instance: ItemAbilityManager;

  protected upgradeItemTrigger: trigger;
  protected battleArmorLimitTrigger: trigger;
  protected itemActiveAbilityTrigger: trigger;
  protected itemPassiveAbilityTrigger: trigger;


  constructor (
  ) {
    this.upgradeItemTrigger = CreateTrigger();
    this.battleArmorLimitTrigger = CreateTrigger();
    this.itemActiveAbilityTrigger = CreateTrigger();
    this.itemPassiveAbilityTrigger = CreateTrigger();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ItemAbilityManager();
      Hooks.set("SagaItemManager", this.instance);
    }
    return this.instance;
  }

  initialize() {
    this.setupUpgradeItems();
    this.setupBattleArmorLimit();
    this.setupItemActiveAbilityTrigger();
    this.setupItemPassiveAbilityTrigger();
  }

  setupUpgradeItems() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEvent(
        this.upgradeItemTrigger, 
        player, 
        EVENT_PLAYER_UNIT_SPELL_EFFECT,
        Condition(() => {
          return GetSpellAbilityId() == ItemConstants.ABILITY_UPGRADE_ITEM;
        })
      );
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
  }

  setupBattleArmorLimit() {
    // probably move this to an item-limiting manager...
    // that can limit num items to X per hero for any item
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.battleArmorLimitTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM,
      );
    }

    TriggerAddCondition(
      this.battleArmorLimitTrigger,
      Condition(() => {
        const unit = GetManipulatingUnit();
        const item = GetManipulatedItem();
        let isBattleArmor = false;
        for (const battleArmor of ItemConstants.battleArmor) {
          if (GetItemTypeId(item) == battleArmor) {
            isBattleArmor = true;
            break;
          }
        }
        if (isBattleArmor) {
          let carried = 0;
          for (const battleArmor of ItemConstants.battleArmor) {
            for (let j = 0; j < 6; ++j) {
              if (GetItemTypeId(UnitItemInSlot(unit, j)) == battleArmor) {
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
  
            const x = GetUnitX(unit);
            const y = GetUnitY(unit);
            // UnitDropItemPoint(unit, GetManipulatedItem(), x, y);
            SetItemPosition(GetManipulatedItem(), x, y);
          }
        }
        return false;
      })
    )
  }

  setupItemActiveAbilityTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.itemActiveAbilityTrigger, 
        player, 
        EVENT_PLAYER_UNIT_SPELL_EFFECT
      );
    }

    TriggerAddCondition(
      this.itemActiveAbilityTrigger,
      Condition(() => {
        const itemAbility = itemAbilityConfig.get(GetSpellAbilityId());
        if (itemAbility) {
          itemAbility.performTriggerAction();
        }
        return false;
      })
    );
  }

  setupItemPassiveAbilityTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.itemPassiveAbilityTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM,
      );
    }

    TriggerAddCondition(
      this.itemPassiveAbilityTrigger,
      Condition(() => {
        const itemAbility = itemAbilityConfig.get(GetItemTypeId(GetManipulatedItem()));
        if (itemAbility) {
          itemAbility.performTriggerAction();
        }
        return false;
      })
    );
  }
}