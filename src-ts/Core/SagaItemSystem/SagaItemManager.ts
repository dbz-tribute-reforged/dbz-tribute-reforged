import { Hooks } from "Libs/TreeLib/Hooks";
import { Constants } from "Common/Constants";
import { SagaItemConstants } from "./SagaItemConstants";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { SagaItemAbility } from "./SagaitemAbility/SagaItemAbility";
import { TimeRing } from "./SagaitemAbility/TimeRing";
import { sagaItemAbilityConfig } from "./SagaitemAbility/SagaItemAbilityConfig";

export class SagaItemManager {
  static instance: SagaItemManager;

  protected upgradeItemTrigger: trigger;
  protected battleArmorLimitTrigger: trigger;
  protected bioLabTrigger: trigger;
  protected sagaItemAbilityTrigger: trigger;


  constructor (
  ) {
    this.upgradeItemTrigger = CreateTrigger();
    this.battleArmorLimitTrigger = CreateTrigger();
    this.bioLabTrigger = CreateTrigger();
    this.sagaItemAbilityTrigger = CreateTrigger();
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
    this.setupSagaItemAbilityTrigger();
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
        for (const battleArmor of SagaItemConstants.battleArmor) {
          if (GetItemTypeId(item) == battleArmor) {
            isBattleArmor = true;
            break;
          }
        }
        if (isBattleArmor) {
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
        }
        return false;
      })
    )
  }

  setupBioLab() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.bioLabTrigger,
        player,
        EVENT_PLAYER_UNIT_PICKUP_ITEM,
      );
    }

    TriggerAddCondition(
      this.bioLabTrigger,
      Condition(() => {
        const unit = GetTriggerUnit();
        const bioLab = GetManipulatedItem();
        if (
          GetItemTypeId(bioLab) == SagaItemConstants.SagaDrops.BIO_LAB_RESEARCH &&
          IsUnitType(unit, UNIT_TYPE_HERO)
        ) {
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
                if (damage > 0) {
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
                }
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

  setupSagaItemAbilityTrigger() {
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerUnitEventSimple(
        this.sagaItemAbilityTrigger, 
        player, 
        EVENT_PLAYER_UNIT_SPELL_EFFECT
      );
    }

    TriggerAddAction(
      this.sagaItemAbilityTrigger,
      () => {
        const sagaItemAbility = sagaItemAbilityConfig.get(GetSpellAbilityId());
        if (sagaItemAbility) {
          sagaItemAbility.performTriggerAction();
        }
      }
    )

  }
}