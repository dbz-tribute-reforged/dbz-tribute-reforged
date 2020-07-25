import { Hooks } from "Libs/TreeLib/Hooks";
import { Constants } from "Common/Constants";
import { ItemConstants } from "./ItemConstants";
import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { TournamentManager } from "Core/TournamentSystem/TournamentManager";
import { itemActiveAbilityConfig } from "./ItemActiveAbilitiesConfig";
import { itemPassiveAbilityConfig } from "./ItemPassiveAbilitiesConfig";

export class ItemAbilityManager {
  static instance: ItemAbilityManager;

  protected upgradeItemTrigger: trigger;
  protected battleArmorLimitTrigger: trigger;
  protected itemActiveAbilityTrigger: trigger;
  protected itemPassiveAbilityTrigger: trigger;
  protected itemFinalBattleTrigger: trigger;

  constructor (
  ) {
    this.upgradeItemTrigger = CreateTrigger();
    this.battleArmorLimitTrigger = CreateTrigger();
    this.itemActiveAbilityTrigger = CreateTrigger();
    this.itemPassiveAbilityTrigger = CreateTrigger();
    this.itemFinalBattleTrigger = CreateTrigger();
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
    this.setupItemFinalBattleTrigger();
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
          let worstArmorSlot = -1;
          let worstArmorValue = ItemConstants.battleArmor.length;
          for (let i = 0; i < bj_MAX_INVENTORY; ++i) {
            for (let j = 0; j < ItemConstants.battleArmor.length; ++j) {
              if (GetItemTypeId(UnitItemInSlot(unit, i)) == ItemConstants.battleArmor[j]) {
                ++carried;
                if (j < worstArmorValue) {
                  worstArmorValue = j;
                  worstArmorSlot = i;
                }
              }
            }
          }
          if (carried > 1) {
            let armorMessage;

            const droppedItem = UnitItemInSlot(unit, worstArmorSlot);
            if (droppedItem != GetManipulatedItem()) {
              armorMessage = "|cffff2020Armor " + (worstArmorValue + 1) + "/5 has been replaced.|r"
            } else {
              armorMessage = "|cffff2020You can only carry 1 set of battle armor!|r";
            }

            const messageForce = CreateForce();
            ForceAddPlayer(messageForce, GetTriggerPlayer());
            DisplayTimedTextToForce(
              messageForce, 
              10, 
              armorMessage
            );
            DestroyForce(messageForce);
  
            const x = GetUnitX(unit);
            const y = GetUnitY(unit);
            // UnitDropItemPoint(unit, GetManipulatedItem(), x, y);
            SetItemPosition(droppedItem, x, y);
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
        const itemAbility = itemActiveAbilityConfig.get(GetSpellAbilityId());
        if (itemAbility) {
          itemAbility();
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
        const itemAbility = itemPassiveAbilityConfig.get(GetItemTypeId(GetManipulatedItem()));
        if (itemAbility) {
          itemAbility();
        }
        return false;
      })
    );
  }

  setupItemFinalBattleTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.itemFinalBattleTrigger,
        player,
        EVENT_PLAYER_UNIT_USE_ITEM,
      );
    }

    TriggerAddCondition(
      this.itemFinalBattleTrigger,
      Condition(() => {
        if (GetItemTypeId(GetManipulatedItem()) == ItemConstants.CLEANSED_DRAGONBALL) {
          TournamentManager.getInstance().startTournament(Constants.finalBattleName);
        }
        return false;
      })
    )
  }
}