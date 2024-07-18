import { DragonBallsConstants } from "./DragonBallsConstants";
import { Vector2D } from "Common/Vector2D";
import { PathingCheck } from "Common/PathingCheck";
import { ItemStackingManager } from "Core/ItemStackingSystem/ItemStackingManager";
import { Constants, Globals, Id } from "Common/Constants";
import { Colorizer } from "Common/Colorizer";
import { UnitHelper } from "Common/UnitHelper";
import { SoundHelper } from "Common/SoundHelper";
import { TimerManager } from "Core/Utility/TimerManager";

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
  protected numWishesGranted: number;
  protected summonFlag: boolean;
  protected minimapShenron: minimapicon;

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
    this.numWishesGranted = 1;
    this.summonFlag = false;
    this.minimapShenron = CreateMinimapIconOnUnit(
      this.shenron,
      255, 255, 255, 
      "MM_dballs.mdl", 
      FOG_OF_WAR_VISIBLE
    );
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

    EnableTrigger(this.wishTrigger);
    const selectShenron = CreateTrigger();
    for (let i = 0; i < Constants.maxActivePlayers; ++i) {
      TriggerRegisterPlayerChatEvent(selectShenron, Player(i), "-shenron", true);
    };
    TriggerAddCondition(selectShenron, Condition(() => {
      if (this.summonFlag && IsTriggerEnabled(this.wishTrigger)) {
        SelectUnitForPlayerSingle(this.shenron, GetTriggerPlayer());
      }
      return false;
    }));

    return this;
  }

  forceEnableWishTrigger() {
    ShowUnitShow(this.shenron);
    EnableTrigger(this.wishTrigger);
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
          if (
            GetItemCharges(item) >= DragonBallsConstants.numDragonBalls
            && !this.isSummoned()
          ) {
            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS,
              15,
              Colorizer.getColoredPlayerName(player) + " has collected all 7 Dragon Balls."
            );
            RemoveItem(item);

            const unit = GetTriggerUnit();
            const unitX = GetUnitX(unit);
            const unitY = GetUnitY(unit);

            if (GetUnitTypeId(unit) == Id.dende || GetUnitAbilityLevel(unit, Id.dendeOrange) > 0) {
              DisplayTimedTextToForce(
                bj_FORCE_ALL_PLAYERS,
                15,
                Colorizer.getColoredPlayerName(player) + " has empowered Shenron to grant one more wish."
              );
              this.numWishesGranted = 2;
            } else {
              this.numWishesGranted = 1;
            }

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
        const unitId = GetHandleId(wishingUnit);
        const wishingUnitTypeId = GetUnitTypeId(wishingUnit);
        const wishItemTypeId = GetItemTypeId(wishItem);
        const player = GetOwningPlayer(wishingUnit);

        if (!UnitHelper.isUnitRealHero(wishingUnit)) return;

        PlaySoundBJ(gg_snd_ClanInvitation);

        if (wishItemTypeId == DragonBallsConstants.wishPowerItem) {
          this.doPowerWish(wishingUnit);
        } else if (wishItemTypeId == DragonBallsConstants.wishImmortalityItem) {
          this.doImmortalityWish(wishingUnit);
        } else if (wishItemTypeId == DragonBallsConstants.wishResurrectionItem) {
          this.doResurrectionWish(wishingUnit);
        } else if (wishItemTypeId == DragonBallsConstants.wishCapsuleItem) {
          this.doCapsuleWish(wishingUnit);
        }
        // power wish done by gui

        if (this.summonFlag) {
          if (this.numWishesGranted > 1) {
            if (this.summonFlag) {
              DisplayTimedTextToForce(
                bj_FORCE_ALL_PLAYERS,
                15,
                "|cffffcc00Shenron|r: Wish granted... And what is your second wish?"
              );
            }
            --this.numWishesGranted;
          } else {
            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS,
              15,
              "|cffffcc00Shenron|r: So be it. Your wish has been granted."
            );
            this.finalizeWish();
            TimerStart(CreateTimer(), 7, false, () => {
              this.unsummonShenron(this.summonedAtDayTime);
              DestroyTimer(GetExpiredTimer());
            });
          }
        }

        if (wishingUnitTypeId == Id.piccolo) {
          SoundHelper.playSoundOnUnit(wishingUnit, "Audio/Voice/Piccolo/Wish.mp3", 1248);

          const orangeKey = StringHash("piccolo|orange|unlock");
          if (!LoadBoolean(udg_SummonsHashtable, unitId, orangeKey)) {
            SaveBoolean(udg_SummonsHashtable, unitId, orangeKey, true);
            DisplayTimedTextToPlayer(player, 0, 0, 5, 
              "[|cffffcc00Secret|r] |cffff8822All that you have... Plus a bit extra|r|nAfter wishing to unlock his latent potential, Piccolo has discovered a |cffff8822powerful new form|r."
            );
          }
        } else if (
          wishingUnitTypeId == Id.dende 
          && GetUnitAbilityLevel(wishingUnit, Id.dendeOrange) == 0
        ) {
          UnitAddAbility(wishingUnit, Id.dendeOrange);
          UnitMakeAbilityPermanent(wishingUnit, true, Id.dendeOrange);
          DisplayTimedTextToPlayer(player, 0, 0, 5, 
            "[|cffffcc00Secret|r] |cffff8822All that you have... Plus a bit extra|r|nAfter wishing to unlock his latent potential, Dende has discovered a |cffff8822powerful new form|r."
          );
        } else if (
          wishingUnitTypeId == Id.omegaShenron 
          || wishingUnitTypeId == Id.eisShenron
        ) {
          const dballKey = StringHash("shadow_dragon|db|wish");
          SaveInteger(udg_SummonsHashtable, unitId, dballKey, 
            LoadInteger(udg_SummonsHashtable, unitId, dballKey) + 1
          );
          udg_StatMultUnit = wishingUnit;
          TriggerExecute(gg_trg_Temp_Skin_Revert);
        } else if (wishingUnitTypeId == Id.zamasu) {
          UnitAddAbility(wishingUnit, Id.zamasuImmortalityBook);
          UnitMakeAbilityPermanent(wishingUnit, true, Id.zamasuImmortalityBook);
          SetPlayerAbilityAvailable(player, Id.zamasuImmortality, true);
        } else if (
          wishingUnitTypeId == Id.granolah
          && GetUnitAbilityLevel(wishingUnit, Id.granolahEvolvedEyes) == 0
        ) {
          UnitAddAbility(wishingUnit, Id.granolahEvolvedEyes);
          UnitMakeAbilityPermanent(wishingUnit, true, Id.granolahEvolvedEyes);
          DisplayTimedTextToPlayer(player, 0, 0, 5, 
            "[|cffffcc00Secret|r] |cff44ff88I want to be the strongest!|r|nAfter sacrificing his lifespan to become the strongest Granolah has unlocked a |cff44ff88powerful new form|r."
          );
        }

        return false;
      })
    );

    return this;
  }

  removeExistingDragonBalls() {
    for (const db of this.dragonBallsItems) {
      if (db) {
        RemoveItem(db);
      }
    }
    this.dragonBallsItems.splice(0, this.dragonBallsItems.length);
  }
  
  distributeDragonBalls(): this {
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
    this.summonFlag = true;

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

    const sfxTimer = TimerManager.getInstance().get();
    TimerStart(sfxTimer, DragonBallsConstants.shenronSfxInterval, true, () => {
      this.playShenronSFX(this.dummyShenron);
    })

    const animTimer = TimerManager.getInstance().get();
    TimerStart(animTimer, 4, false, () => {
      SetUnitAnimation(
        this.dummyShenron,
        "stand"
      );
      TimerManager.getInstance().recycle(animTimer);
    });

    PingMinimapForForceEx(
      bj_FORCE_ALL_PLAYERS,
      x, y,
      4, 
      bj_MINIMAPPINGSTYLE_FLASHY,
      10, 100, 10,
    )
    
    const delayTimer = TimerManager.getInstance().get();
    TimerStart(delayTimer, DragonBallsConstants.shenronDelay, false, () => {
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

      TimerManager.getInstance().recycle(sfxTimer);
      TimerManager.getInstance().recycle(delayTimer);
    })

    this.removeExistingDragonBalls();
    
    return this;
  }

  playShenronSFX(shenron: unit = this.shenron): this {
    const x = GetUnitX(shenron);
    const y = GetUnitY(shenron);
    // DestroyEffect(
    //   AddSpecialEffect(
    //     "Abilities/Spells/Human/Thunderclap/ThunderClapCaster.mdl",
    //     x, y,
    //   )
    // );
    
    DestroyEffect(
      AddSpecialEffect(
        "Abilities/Spells/Human/Resurrect/ResurrectTarget.mdl",
        x, y,
      )
    );
    
    // DestroyEffect(
    //   AddSpecialEffect(
    //     "PhotonFlash2.mdl",
    //     x, y,
    //   )
    // );

    DestroyEffect(
      AddSpecialEffect(
        "DivineRing.mdl",
        x, y,
      )
    );
    return this;
  }

  finalizeWish(): this {
    SetUnitX(this.dummyShenron, GetUnitX(this.shenron));
    SetUnitY(this.dummyShenron, GetUnitY(this.shenron));

    SetUnitX(this.shenron, DragonBallsConstants.shenronWaitingRoom.x);
    SetUnitY(this.shenron, DragonBallsConstants.shenronWaitingRoom.y);

    this.playShenronSFX(this.dummyShenron);
    SetUnitAnimation(this.dummyShenron, "death");

    if (!Globals.isFBSimTest) DisableTrigger(this.wishTrigger);
    ShowUnitHide(this.shenron);

    if (Constants.IS_APRIL_FOOLS_DAY) {
      BlzSetUnitSkin(this.dummyShenron, DragonBallsConstants.shenronUnitDummy);
      SetUnitScale(this.dummyShenron, 4.0, 4.0, 4.0);
    }

    return this;
  }

  unsummonShenron(resetToDay: boolean): this {
    this.summonFlag = false;
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

  isSummoned(): boolean {
    return this.summonFlag;
  }

  doPowerWish(unit: unit) {
    let stats = 100;
    if (
      udg_ScoreboardTimeHours > 0
      || udg_ScoreboardTimeMinutes > 30
    ) {
      stats = 300;
    } else if (udg_ScoreboardTimeMinutes > 20) {
      stats = 200;
    }
    udg_StatMultUnit = unit;

    TriggerExecute(gg_trg_Add_To_Base_Stats);
    TriggerExecute(gg_trg_Add_To_Power_Wish_Stats_Data);
    TriggerExecute(gg_trg_Update_Current_Stats);

    const heroLvl = GetHeroLevel(unit);
    let lvlXp = 25 * (heroLvl * 5 + 15);
    if (
      udg_ScoreboardTimeHours > 0
      || udg_ScoreboardTimeMinutes > 30
    ) {
      lvlXp = 25 * (heroLvl * 15 + 120);
    } else if (udg_ScoreboardTimeMinutes > 20) {
      lvlXp = 25 * (heroLvl * 10 + 55);
    }
    AddHeroXP(unit, lvlXp, true);
  }

  doImmortalityWish(unit: unit) {
    const addedReincarnation = UnitAddAbility(
      unit, 
      DragonBallsConstants.wishImmortalityAbility
    );

    if (
      udg_LastImmortalityUser != null
      && udg_LastImmortalityUser != unit
      && GetUnitAbilityLevel(unit, DragonBallsConstants.wishImmortalityAbility) > 0
    ) {
      // remove
      UnitRemoveAbility(udg_LastImmortalityUser, DragonBallsConstants.wishImmortalityAbility);
      DisplayTimedTextToPlayer(GetOwningPlayer(udg_LastImmortalityUser), 0, 0, 5, "Your immortality has been stolen by another wish.");
    }
    udg_LastImmortalityUser = unit;
    
    if (addedReincarnation) {
      UnitMakeAbilityPermanent(unit, true, DragonBallsConstants.wishImmortalityAbility);

      // remove reinc when detected
      const reincTimer = TimerManager.getInstance().get();
      TimerStart(reincTimer, 0.5, true, () => {
        if (UnitHelper.isUnitDead(unit)) {
          const removeReincTimer = TimerManager.getInstance().get();
          TimerStart(removeReincTimer, DragonBallsConstants.immortalDelay, false, () => {
            if (GetUnitAbilityLevel(unit, DragonBallsConstants.wishImmortalityAbility) > 0) {
              UnitRemoveAbility(unit, DragonBallsConstants.wishImmortalityAbility);
              SetUnitManaPercentBJ(unit, 100);
              // SetUnitLifePercentBJ(wishingUnit, 100);
              // reset stamina
              const playerId = GetPlayerId(GetOwningPlayer(unit));
              const customHero = Globals.customPlayers[playerId].getCustomHero(unit);
              if (customHero) customHero.setCurrentSP(customHero.getMaxSP());
              TimerManager.getInstance().recycle(removeReincTimer);
            }
          });
          TimerManager.getInstance().recycle(reincTimer);
        }
      })
    }
  }

  doResurrectionWish(unit: unit) {
    const player = GetOwningPlayer(unit);
    
    let isT1 = false;
    for (const p of Constants.defaultTeam1) {
      if (p == player) {
        isT1 = true;
        break;
      }
    }
    
    this.forceResTeam(isT1 ? Constants.defaultTeam1 : Constants.defaultTeam2);
  }

  forceResTeam(players: player[]) {
    for (const p of players) {
      const pid = GetPlayerId(p);
      const size = BlzGroupGetSize(udg_StatMultPlayerUnits[pid]);
      for (let i = 0; i < size; ++i) {
        const unit = BlzGroupUnitAt(udg_StatMultPlayerUnits[pid], i);
        const unitId = GetHandleId(unit);
        SaveReal(udg_HeroRespawnHashtable, unitId, 0, 0);
        if (LoadInteger(udg_HeroRespawnHashtable, unitId, 3) == 1) {
          udg_HeroRespawnUnit = unit;
          TriggerExecute(gg_trg_Hero_Respawn_To_Earth);
        }
        SaveReal(udg_HeroRespawnHashtable, unitId, 0, 0);
      }
    }
  }

  doCapsuleWish(unit: unit) {
    UnitAddItemById(unit, DragonBallsConstants.itemCapsuleBox);
  }
}