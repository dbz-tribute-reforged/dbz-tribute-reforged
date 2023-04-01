import { DragonBallsConstants } from "./DragonBallsConstants";
import { Vector2D } from "Common/Vector2D";
import { PathingCheck } from "Common/PathingCheck";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { Constants } from "Common/Constants";
import { Colorizer } from "Common/Colorizer";
import { UnitHelper } from "Common/UnitHelper";
import { SoundHelper } from "Common/SoundHelper";

export class DragonBallsManager {
  static instance: DragonBallsManager;

  protected dragonBallsItems: item[];
  protected dragonBallsActivationTrigger: trigger;
  protected wishTrigger: trigger;
  protected shenron: unit;
  protected dummyShenron: unit;
  protected summonedAtDayTime: boolean;
  protected shenronFogModifiers: fogmodifier[];
  protected radarTrigger: trigger;

  constructor (
  ) {
    this.dragonBallsItems = [];
    this.dragonBallsActivationTrigger = CreateTrigger();
    this.wishTrigger = CreateTrigger();
    this.shenron = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE),
      DragonBallsConstants.shenronUnit,
      DragonBallsConstants.shenronWaitingRoom.x,
      DragonBallsConstants.shenronWaitingRoom.y,
      270
    );
    this.dummyShenron = CreateUnit(
      Player(PLAYER_NEUTRAL_PASSIVE),
      DragonBallsConstants.shenronUnitDummy,
      DragonBallsConstants.shenronWaitingRoom.x,
      DragonBallsConstants.shenronWaitingRoom.y,
      270
    );
    this.summonedAtDayTime = false;
    this.shenronFogModifiers = [];
    this.radarTrigger = CreateTrigger();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new DragonBallsManager();
    }
    return this.instance;
  }

  initialize(): this {
    this.setupShenron();
    this.setupWishes();
    this.setupDragonBallsActivation();

    this.distributeDragonBalls();
    ItemStackingManager.getInstance().addStackableItemType(
      DragonBallsConstants.dragonBallItem, 7
    );
    this.setupRadar();
    
    SetUnitInvulnerable(this.shenron, true);
    UnitAddAbility(this.dummyShenron, Constants.locustAbility);

    DisableTrigger(this.wishTrigger);
    const selectShenron = CreateTrigger();
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerChatEvent(selectShenron, Player(i), "-shenron", true);
    };
    TriggerAddCondition(selectShenron, Condition(() => {
      if (IsTriggerEnabled(this.wishTrigger)) {
        SelectUnitForPlayerSingle(this.shenron, GetTriggerPlayer());
      }
      return false;
    }));

    return this;
  }

  setupDragonBallsActivation() {
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
          const player = GetTriggerPlayer();
          SetItemCharges(item, GetItemCharges(item) + 1);
          if (GetItemCharges(item) >= DragonBallsConstants.numDragonBalls) {
            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS,
              15,
              Colorizer.getColoredPlayerName(player) + " has collected all 7 Dragon Balls."
            );
            RemoveItem(item);

            const unit = GetTriggerUnit();
            const unitX = GetUnitX(unit);
            const unitY = GetUnitY(unit);
            this.summonShenron(unitX, unitY);
            TimerStart(CreateTimer(), DragonBallsConstants.shenronDelay + 1, false, () => {
              SelectUnitForPlayerSingle(this.shenron, GetTriggerPlayer());
              DestroyTimer(GetExpiredTimer())
            })

            SoundHelper.playSoundOnUnit(unit, "Audio/Voice/Piccolo/SummonShenron.mp3", 2040);
          } else {
            // need to collect all 7
          }
        }
        return false;
      })
    );
  }
  
  radarPingDragonball(db: item, player: player, x: number, y: number): number {
    let numPing = GetItemCharges(db);
    const repeatPingForce = CreateForce();
    ForceAddPlayer(repeatPingForce, player);
    TimerStart(CreateTimer(), 0.2, true, () => {
      if (numPing == 0) {
        DestroyForce(repeatPingForce);
        DestroyTimer(GetExpiredTimer());
      } else {
        --numPing;
        PingMinimapForForceEx(
          repeatPingForce,
          x, y,
          3,
          bj_MINIMAPPINGSTYLE_SIMPLE,
          35, 100, 35
        );
      }
    });
    return numPing;
  }

  setupRadar(): this {
    TriggerRegisterAnyUnitEventBJ(
      this.radarTrigger,
      EVENT_PLAYER_UNIT_USE_ITEM
    );

    TriggerAddCondition(
      this.radarTrigger,
      Condition(() => {
        const item = GetManipulatedItem();
        if (GetItemTypeId(item) == DragonBallsConstants.radarItem) {
          const player = GetTriggerPlayer();

          // const pingForce = CreateForce();
          // ForceAddPlayer(pingForce, player);
          // for (const db of this.dragonBallsItems) {
          //   if (db) {
          //     this.radarPingDragonball(pingForce, GetItemX(db), GetItemY(db));
          //   }
          // }
          // DestroyForce(pingForce);
          let numDragonBalls = 0;

          EnumItemsInRect(
            GetPlayableMapRect(),
            null,
            () => {
              if (GetItemTypeId(GetEnumItem()) == DragonBallsConstants.dragonBallItem) {
                const testItem = GetEnumItem();
                numDragonBalls += this.radarPingDragonball(
                  testItem, 
                  player,
                  GetItemX(testItem),
                  GetItemY(testItem)
                )
              }
            }
          );
          
          // get all heroes
          // check if they hold dball?
          const carryingDb = CreateGroup();
          GroupEnumUnitsInRect(
            carryingDb,
            GetPlayableMapRect(),
            null
          );

          ForGroup(carryingDb, () => {
            const dbUnit = GetEnumUnit();
            if (IsUnitType(dbUnit, UNIT_TYPE_HERO)) {
              const index = UnitHelper.getInventoryIndexOfItemType(dbUnit, DragonBallsConstants.dragonBallItem)
              if (index >= 0) {
                numDragonBalls += this.radarPingDragonball(
                  UnitItemInSlot(dbUnit, index), 
                  player, 
                  GetUnitX(dbUnit),
                  GetUnitY(dbUnit)
                );
              }
            }
          });
          DestroyGroup(carryingDb);

          if (numDragonBalls == 0) {
            const printForce = CreateForce();
            ForceAddPlayer(printForce, player);
            DisplayTimedTextToForce(
              printForce,
              15,
              "The Dragon Balls have not been restored yet."
            );
            DestroyForce(printForce);
          }
        }
        return false;
      })
    );



    return this;
  }

  setupShenron(): this {
    UnitRemoveAbility(this.shenron, FourCC("Amov"));
    UnitRemoveAbility(this.shenron, FourCC("Aatk"));
    SetUnitInvulnerable(this.shenron, true);
    ShowUnitHide(this.shenron);
    return this;
  }

  setupWishes(): this {
    TriggerRegisterUnitEvent(
      this.wishTrigger,
      this.shenron,
      EVENT_UNIT_SELL_ITEM
    );

    TriggerAddCondition(
      this.wishTrigger,
      Condition(() => {
        const wishItem = GetSoldItem();
        const wishingUnit = GetBuyingUnit();

        if (GetItemTypeId(wishItem) == DragonBallsConstants.wishImmortalityItem) {
          const addedReincarnation = UnitAddAbility(
            wishingUnit, 
            DragonBallsConstants.wishImmortalityAbility
          )
          
          if (addedReincarnation) {
            UnitMakeAbilityPermanent(wishingUnit, true, DragonBallsConstants.wishImmortalityAbility);

            // remove reinc when detected
            const reincTimer = CreateTimer();
            TimerStart(reincTimer, 0.5, true, () => {
              if (IsUnitType(wishingUnit, UNIT_TYPE_DEAD)) {
                const removeReincTimer = CreateTimer();
                TimerStart(removeReincTimer, DragonBallsConstants.immortalDelay, false, () => {
                  UnitRemoveAbility(wishingUnit, DragonBallsConstants.wishImmortalityAbility);
                  UnitMakeAbilityPermanent(wishingUnit, false, DragonBallsConstants.wishImmortalityAbility);
                  SetUnitManaPercentBJ(wishingUnit, 100);
                  // SetUnitLifePercentBJ(wishingUnit, 100);
                  DestroyTimer(removeReincTimer);
                });
                DestroyTimer(reincTimer);
              }
            })
          }
        }
        // power wish done by gui
        
        this.grantWish();
        TimerStart(CreateTimer(), 7, false, () => {
          this.unsummonShenron(this.summonedAtDayTime);
          DestroyTimer(GetExpiredTimer());
        });

        return false;
      })
    );

    return this;
  }
  
  distributeDragonBalls(): this {
    for (const db of this.dragonBallsItems) {
      if (db) {
        RemoveItem(db);
      }
    }
    this.dragonBallsItems.splice(0, this.dragonBallsItems.length);

    // const startingAngle = Math.random() * 360;
    const index = Math.floor(Math.random() * (DragonBallsConstants.dbSpawns.length - 1));
    let nextIndex = index;
    for (let i = 0; i < DragonBallsConstants.numDragonBalls; ++i) {
      nextIndex = (nextIndex + 1 + Math.floor(Math.random() * 2)) % DragonBallsConstants.dbSpawns.length;
      const dbPos = DragonBallsConstants.dbSpawns[nextIndex];

      let numChecks = 0;
      while (
        !PathingCheck.isGroundWalkable(dbPos) &&
        numChecks < 100
      ) {
        if (Math.random() < 0.5) {
          dbPos.x += 128 - 256 * Math.random();
        } else {
          dbPos.y += 128 - 256 * Math.random();
        }
        ++numChecks;
      }
      if (numChecks >= 100) {
        dbPos.x = 0;
        dbPos.y = 0;
      }

      const db = CreateItem(DragonBallsConstants.dragonBallItem, dbPos.x, dbPos.y);
      SetItemInvulnerable(db, true);
      this.dragonBallsItems.push(db);
    }
    
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS,
      15,
      "The Dragon Balls have been restored."
    );

    return this;
  }

  summonShenron(x: number, y: number): this {
    PlaySoundBJ(gg_snd_ShenronSummon);

    this.summonedAtDayTime = GetTimeOfDay() < 18;
    if (this.summonedAtDayTime) {
      SetTimeOfDay(24);
      SuspendTimeOfDay(true);
    }

    SetUnitX(this.dummyShenron, x);
    SetUnitY(this.dummyShenron, y);
    SetUnitAnimation(
      this.dummyShenron,
      "birth"
    );

    const sfxTimer = CreateTimer();
    TimerStart(sfxTimer, DragonBallsConstants.shenronSfxInterval, true, () => {
      this.playShenronSFX(this.dummyShenron);
    })

    TimerStart(CreateTimer(), 4, false, () => {
      SetUnitAnimation(
        this.dummyShenron,
        "stand"
      );
      DestroyTimer(GetExpiredTimer());
    });

    PingMinimapForForceEx(
      bj_FORCE_ALL_PLAYERS,
      x, y,
      4, 
      bj_MINIMAPPINGSTYLE_FLASHY,
      10, 100, 10,
    )
    
    TimerStart(CreateTimer(), DragonBallsConstants.shenronDelay, false, () => {
      // SetUnitX(this.dummyShenron, DragonBallsConstants.shenronWaitingRoom.x);
      // SetUnitY(this.dummyShenron, DragonBallsConstants.shenronWaitingRoom.y);
      
      SetUnitX(this.shenron, x);
      SetUnitY(this.shenron, y);

      if (Constants.IS_APRIL_FOOLS_DAY) {
        BlzSetUnitSkin(this.dummyShenron, FourCC('nech'));
        SetUnitScale(this.dummyShenron, 5.0, 5.0, 5.0);
      }

      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS,
        15,
        "|cffffcc00Shenron|r: Speak your wish and I shall grant it.|r" 
      );
      // DisplayTimedTextToForce(
      //   bj_FORCE_ALL_PLAYERS,
      //   15,
      //   "|cffb0b0b0(KNOWN BUG: Type -shenron to select shenron if you can't click him.|r"
      // );
      // enable wish stuff
      EnableTrigger(this.wishTrigger);
      ShowUnitShow(this.shenron);
      SetUnitAnimation(
        this.shenron,
        "stand"
      );

      for (let i = 0; i < Constants.maxActivePlayers; ++i) {
        const shenronVision = CreateFogModifierRadius(
          Player(i),
          FOG_OF_WAR_VISIBLE, 
          x, y,
          DragonBallsConstants.shenronVisionRadius,
          true, false
        );
        FogModifierStart(shenronVision);
        this.shenronFogModifiers.push(shenronVision);
      }

      DestroyTimer(GetExpiredTimer());
      DestroyTimer(sfxTimer);
    })

    return this;
  }

  playShenronSFX(shenron: unit = this.shenron): this {
    const x = GetUnitX(shenron);
    const y = GetUnitY(shenron);
    // DestroyEffect(
    //   AddSpecialEffect(
    //     "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
    //     x, y,
    //   )
    // );
    
    DestroyEffect(
      AddSpecialEffect(
        "Abilities\\Spells\\Human\\Resurrect\\ResurrectTarget.mdl",
        x, y,
      )
    );
    
    DestroyEffect(
      AddSpecialEffect(
        "PhotonFlash2.mdl",
        x, y,
      )
    );

    DestroyEffect(
      AddSpecialEffect(
        "DivineRing.mdl",
        x, y,
      )
    );
    return this;
  }

  grantWish(): this {
    SetUnitX(this.dummyShenron, GetUnitX(this.shenron));
    SetUnitY(this.dummyShenron, GetUnitY(this.shenron));

    SetUnitX(this.shenron, DragonBallsConstants.shenronWaitingRoom.x);
    SetUnitY(this.shenron, DragonBallsConstants.shenronWaitingRoom.y);

    this.playShenronSFX(this.dummyShenron);
    SetUnitAnimation(this.dummyShenron, "death");
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS,
      15,
      "|cffffcc00Shenron|r: So be it. Your wish has been granted."
    );
    DisableTrigger(this.wishTrigger);
    ShowUnitHide(this.shenron);

    if (Constants.IS_APRIL_FOOLS_DAY) {
      BlzSetUnitSkin(this.dummyShenron, DragonBallsConstants.shenronUnitDummy);
      SetUnitScale(this.dummyShenron, 4.0, 4.0, 4.0);
    }

    return this;
  }

  unsummonShenron(resetToDay: boolean): this {
    SetUnitX(this.dummyShenron, DragonBallsConstants.shenronWaitingRoom.x);
    SetUnitY(this.dummyShenron, DragonBallsConstants.shenronWaitingRoom.y);
    if (resetToDay) {
      SetTimeOfDay(12);
      SuspendTimeOfDay(true);
    }

    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      const shenronVision = this.shenronFogModifiers.pop();
      if (shenronVision) {
        FogModifierStop(shenronVision);
        DestroyFogModifier(shenronVision);
      } else {
        break;
      }
    }

    const restoreDragonBallTimer = CreateTimer();
    TimerStart(
      restoreDragonBallTimer, 
      DragonBallsConstants.restoreDragonBallsTime,
      false, () => {
        this.distributeDragonBalls();
        DestroyTimer(restoreDragonBallTimer);
      }
    );

    return this;
  }
}