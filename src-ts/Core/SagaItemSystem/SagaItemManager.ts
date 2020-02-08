import { Hooks } from "Libs/TreeLib/Hooks";
import { Constants } from "Common/Constants";
import { SagaItemConstants } from "./SagaItemConstants";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";

export class SagaItemManager {
  static instance: SagaItemManager;

  protected upgradeItemTrigger: trigger;
  protected battleArmorLimitTrigger: trigger;
  protected bioLabTrigger: trigger;

  constructor (
  ) {
    this.upgradeItemTrigger = CreateTrigger();
    this.battleArmorLimitTrigger = CreateTrigger();
    this.bioLabTrigger = CreateTrigger();
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
    this.setupUpgradeItems();
    this.setupBattleArmorLimit();
    this.setupBioLab();
  }

  setupUpgradeItems() {
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
      TriggerRegisterPlayerUnitEvent(
        this.battleArmorLimitTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM,
        Condition(() => {
          for (const battleArmor of SagaItemConstants.battleArmor) {
            if (GetItemTypeId(GetManipulatedItem()) == battleArmor) {
              return true;
            }
          }
          return false;
        })
      );
    }

    TriggerAddCondition(
      this.battleArmorLimitTrigger,
      Condition(() => {
        const unit = GetManipulatingUnit();
        let carried = 0;
        for (const battleArmor of SagaItemConstants.battleArmor) {
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
        return false;
      })
    )
  }

  setupBioLab() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEvent(
        this.bioLabTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM, 
        Condition(() => {
          return GetItemTypeId(GetManipulatedItem()) == SagaItemConstants.bioLabResearch[0];
        }
      ));
    }

    TriggerAddCondition(
      this.bioLabTrigger,
      Condition(() => {
        const unit = GetTriggerUnit();
        if (IsUnitType(unit, UNIT_TYPE_HERO)) {
          const bioLab = GetManipulatedItem();
          const position = new Vector2D(GetUnitX(unit), GetUnitY(unit));
          const player = GetOwningPlayer(unit);
          TimerStart(CreateTimer(), 1.0, true, () => {
            if (UnitHasItem(unit, bioLab)) {
              position.x = GetUnitX(unit);
              position.y = GetUnitY(unit);
              const damagedGroup = UnitHelper.getNearbyValidUnits(
                position, 
                SagaItemConstants.BIO_LAB_AOE, 
                () => {
                  return UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player);
                }
              )

              ForGroup(damagedGroup, () => {
                const target = GetEnumUnit();
                const damage = GetUnitState(target, UNIT_STATE_LIFE) * SagaItemConstants.BIO_LAB_DAMAGE;
                UnitDamageTarget(
                  unit, 
                  target, 
                  damage,
                  true,
                  false,
                  ATTACK_TYPE_HERO,
                  DAMAGE_TYPE_UNKNOWN,
                  WEAPON_TYPE_WHOKNOWS,
                )
              })
              
              DestroyGroup(damagedGroup);
            } else {
              DestroyTimer(GetExpiredTimer());
            }
          })
        }
        return false;
      })
    )
  }
}