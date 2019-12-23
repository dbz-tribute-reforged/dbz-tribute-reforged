import { Hooks } from "Libs/TreeLib/Hooks";
import { DragonBallsConstants } from "./DragonBallsConstants";
import { Vector2D } from "Common/Vector2D";
import { PathingCheck } from "Common/PathingCheck";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";

export class DragonBallsManager {
  static instance: DragonBallsManager;

  protected dragonBallsActivationTrigger: trigger;
  protected shenron: unit;

  constructor (
  ) {
    this.dragonBallsActivationTrigger = CreateTrigger();
    this.shenron = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE),
      DragonBallsConstants.shenronUnit,
      0,
      22000,
      270
    );
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DragonBallsManager();
      Hooks.set("DragonBallsManager", this.instance);
    }
    return this.instance;
  }

  initialize(): this {

    TriggerRegisterAnyUnitEventBJ(
      this.dragonBallsActivationTrigger, 
      EVENT_PLAYER_UNIT_USE_ITEM
    );

    TriggerAddCondition(
      this.dragonBallsActivationTrigger,
      Condition(() => {
        const item = GetManipulatedItem();
        const itemId = GetItemTypeId(item);
        if (itemId == DragonBallsConstants.dragonBallItem) {
          SetItemCharges(item, GetItemCharges(item) + 1);
          if (GetItemCharges(item) >= DragonBallsConstants.numDragonBalls) {
            BJDebugMsg("You have collected all 7 dragon balls");
            RemoveItem(item);

            const unit = GetTriggerUnit();
            const unitX = GetUnitX(unit);
            const unitY = GetUnitY(unit);
            this.summonShenron(unitX, unitY);
          } else {
            BJDebugMsg("You need to collect all 7 dragon balls before making a wish");
          }
        }
        return false;
      })
    );

    this.distributeDragonBalls();
    ItemStackingManager.getInstance().addStackableItemType(
      DragonBallsConstants.dragonBallItem,
    );
    

    return this;
  }
  
  distributeDragonBalls(): this {
    for (let i = 0; i < DragonBallsConstants.numDragonBalls; ++i) {
      const x = Math.random() * 1000;
      const y = Math.random() * 1000;
      const dbPos = new Vector2D(x, y);

      let numChecks = 0;
      while (
        !PathingCheck.isGroundWalkable(dbPos) &&
        numChecks < 100
      ) {
        if (Math.random() < 0.5) {
          dbPos.x += 128;
        } else {
          dbPos.y += 128;
        }
        ++numChecks;
      }

      const db = CreateItem(DragonBallsConstants.dragonBallItem, dbPos.x, dbPos.y);
      SetItemInvulnerable(db, true);
    }
    return this;
  }

  summonShenron(x: number, y: number): this {
    SetUnitX(this.shenron, x);
    SetUnitY(this.shenron, y);
    SetUnitAnimation(
      this.shenron,
      "birth"
    );
    
    const summonAtDayTime = GetTimeOfDay() < 18;
    if (summonAtDayTime) {
      SetTimeOfDay(24);
    }
    this.playShenronSFX();
    
    TimerStart(CreateTimer(), 5, false, () => {
      BJDebugMsg("You have summoned the eternal dragon, Shenron. What is your wish?");
      // enable wish stuff
      DestroyTimer(GetExpiredTimer());
    })

    // replace these with funcs to accept input etc
    // enable wish trig
    TimerStart(CreateTimer(), 15, false, () => {
      this.grantWish();
      DestroyTimer(GetExpiredTimer());
    });

    TimerStart(CreateTimer(), 18, false, () => {
      this.unsummonShenron(summonAtDayTime);
      DestroyTimer(GetExpiredTimer());
    });
    return this;
  }

  playShenronSFX(shenron: unit = this.shenron): this {
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
        shenron, 
        "origin", 
      )
    );
    
    DestroyEffect(
      AddSpecialEffectTarget(
        "Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl",
        shenron, 
        "origin", 
      )
    );
    
    DestroyEffect(
      AddSpecialEffectTarget(
        "PhotonFlash2.mdl",
        shenron, 
        "origin", 
      )
    );
    return this;
  }

  grantWish(): this {
    this.playShenronSFX();
    SetUnitAnimation(this.shenron, "death");
    BJDebugMsg("So be it. Your wish has been granted.");
    return this;
  }

  unsummonShenron(resetToDay: boolean): this {
    SetUnitX(this.shenron, 0);
    SetUnitY(this.shenron, 22000);
    if (resetToDay) {
      SetTimeOfDay(12);
    }
    this.distributeDragonBalls();
    return this;
  }
}