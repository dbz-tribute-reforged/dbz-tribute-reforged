import { AdvancedSaga } from "./AdvancedSaga";
import { Saga } from "./BaseSaga";
import { SagaHelper } from "../SagaHelper";
import { Constants } from "Common/Constants";
import { CreepManager } from "Core/CreepSystem/CreepManager";
import { SagaUpgradeNames } from "Core/CreepSystem/CreepUpgradeConfig";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class AndroidsSaga1 extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Androids Saga I: 19/20';

  protected android19: unit | undefined;
  protected android20: unit | undefined;
  protected isRunningAway: boolean;

  constructor() {
    super();
    this.delay = 45;
    this.stats = 100;
    this.isRunningAway = false;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Android 19 and Android 20 have begun terrorizing Satan City!"
      ],
      [
        "|cffffcc00Android 19|r: You're an Android! How did you even DO that?",
        "|cffffcc00Dr. Gero|r: I took my brain out and put it in this body.",
        "|cffffcc00Android 19|r: Uh how?",
        "|cffffcc00Dr. Gero|r: I-- ...huh.",
        "|cffffcc00Dr. Gero|r: How DID I do that?",
      ],
    );

    this.addHeroListToSaga(["Android 19", "Android 20"], true);
    this.android19 = this.bosses.get("Android 19");
    this.android20 = this.bosses.get("Android 20");

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3000);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.android19 && this.android20 && !this.isRunningAway && 
      UnitHelper.isUnitDead(this.android19) && 
      SagaHelper.checkUnitHp(this.android20, 0.8, true, false, true)
    ) {
      this.isRunningAway = true;
      SagaHelper.showMessagesChanceOfJoke(
        [
          "|cffffcc00Gero|r: No. 17 and No. 18 will be coming to kill you all!"
        ],
      );
      const sagaAI = this.bossesAI.get(this.android20);
      if (sagaAI) {
        sagaAI.isEnabled = false;
      }
      const targetCoord = new Vector2D(14000, 7500);
      IssuePointOrder(this.android20, "move", targetCoord.x, targetCoord.y);
      SetUnitMoveSpeed(this.android20, 500);

      TimerStart(CreateTimer(), 5, true, () => {
        if (this.android20) {
          const sagaCoord = new Vector2D(GetUnitX(this.android20), GetUnitY(this.android20));
          const distance = CoordMath.distance(sagaCoord, targetCoord);

          if (distance < 500 || UnitHelper.isUnitDead(this.android20)) {
            if (sagaAI) {
              sagaAI.isEnabled = true;
            }
            DestroyTimer(GetExpiredTimer());
          }
        }
      })
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
    CreepManager.getInstance().upgradeCreeps(SagaUpgradeNames.BIG_DINOS);
  }

}

export class AndroidsSaga2 extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Androids Saga II: 16/17/18';

  constructor() {
    super();
    this.delay = 20;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();

    const rng = Math.random();
    if (rng < 0.2) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "Android 16, 17, and 18 have been released from Dr. Gero's lab!"
        ],
        [
          "|cffffcc00Android 17|r: I get this strange feeling that after we kill them, you're just gonna turn us off again. And I don't even know how.",
          "|cffffcc00Dr. Gero|r: Why... with this remote, of course!",
          "|cffffcc00Android 17|r: Oh...! You mean *this* remote?",
          "|cffffcc00Dr. Gero|r: Gha! But... y-you see, that's just the decoy remote!",
          "|cffffcc00Dr. Gero|r: I wouldn't show you the real thing, hah!",
          "|cffffcc00Dr. Gero|r: But, uh... I do need that remote back. It was my mother's.",
        ],
      );
    } else if (rng < 0.4) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "Android 16, 17, and 18 have been released from Dr. Gero's lab!"
        ],
        [
          "|cffffcc00Android 18|r: Wait a second... did you build a ginger Android?",
          "|cffffcc00Android 18|r: Man. There's a soul-less machine joke there.",
          "|cffffcc00Android 18|r: But, that's beneath me.",
        ],
      );
    } else if (rng < 0.6) {
      SagaHelper.showMessagesChanceOfJoke(
        [
          "Android 16, 17, and 18 have been released from Dr. Gero's lab!"
        ],
        [
          "|cffffcc00Dr. Gero|r: Do not activate Android 16! He's not properly programmed.",
          "|cffffcc00Android 17|r: Oh, and how many of us are?",
          "|cffffcc00Android 17|r: \"Howdy folks, I'm Android 13! Look at ma trucker hat!\"",
          "|cffffcc00Dr. Gero|r: I was going through a phase!",
        ],
      );
    }

    this.addHeroListToSaga(["Android 16", "Android 17", "Android 18"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 5000);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }

}

export class Super13Saga extends AdvancedSaga implements Saga {
  name: string = '[Movie] Super Android 13!';

  protected android13: unit | undefined;
  protected android14: unit | undefined;
  protected android15: unit | undefined;
  protected super13: unit | undefined;

  constructor() {
    super();
    this.delay = 45;
    this.stats = 100;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    SagaHelper.showMessagesChanceOfJoke(
      [
        "Android 13, 14, and 15 have begun terrorizing West City!"
      ],
      [
        "|cffffcc00Android 13|r: \"Howdy folks, I'm Android 13! Look at ma trucker hat!\"",
      ]
    );

    this.addHeroListToSaga(["Android 13", "Android 14", "Android 15", "Super Android 13"], true);

    this.android13 = this.bosses.get("Android 13");
    this.android14 = this.bosses.get("Android 14");
    this.android15 = this.bosses.get("Android 15");
    this.super13 = this.bosses.get("Super Android 13");

    SagaHelper.sagaHideUnit(this.super13);
    
    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3500);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
    if (
      this.android13 && this.android14 && this.android15 && this.super13 && 
      SagaHelper.isUnitSagaHidden(this.super13) &&
      (
        SagaHelper.checkUnitHp(this.android13, 0.25, false, false, true) ||
        (UnitHelper.isUnitDead(this.android14) && UnitHelper.isUnitDead(this.android15))
      )
    ) {
      const rng = Math.random();
      if (rng < 0.5) {
        SagaHelper.showMessagesChanceOfJoke(
          [
            "Super Android 13 has arrived!"
          ],
          [
            "|cffffcc00Piccolo|r: I feel like we should be stopping this.",
            "|cffffcc00Goku|r: Nah, I want a good fight.",
            "|cffffcc00Krillin|r: He's 'roiding out!",
            "|cffffcc00Goku|r: Vegeta, he stole your 'do!",
          ]
        );
      } else if (rng < 0.75) {
        SagaHelper.showMessagesChanceOfJoke(
          [
            "Super Android 13 has arrived!"
          ],
          [
            "|cffffcc00Gohan|r: Why don't you pick on someone your own size.",
            "|cffffcc00Gohan|r: Well, clearly not me.",
            "|cffffcc00Goku|r: Welp, if you can't beat 'em. Bomb 'em.",
          ]
        );
      } else {
        SagaHelper.showMessagesChanceOfJoke(
          [
            "Super Android 13 has arrived!"
          ],
          [
            "|cffffcc00Android 13|r: Did ya'll just kill Androids 14 and 15?",
            "|cffffcc00Android 13|r: Gooooood.",
          ]
        );
      }

      KillUnit(this.android14);
      KillUnit(this.android15);
      SagaHelper.genericTransformAndPing(this.super13, this.android13, this);
    }
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }
}

export class FutureAndroidsSaga extends AdvancedSaga implements Saga {
  name: string = '[DBZ] Future Androids Saga';

  constructor() {
    super();
    this.delay = 40;
  }

  spawnSagaUnits(): void {
    super.spawnSagaUnits();
    DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15, "Future Androids 17 and 18 have begun terrorizing the future.");

    this.addHeroListToSaga(["Future Android 17", "Future Android 18"], true);

    for (const [name, boss] of this.bosses) {
      SetUnitAcquireRange(boss, 3500);
    }

    this.ping();
    this.setupBossDeathActions(this);
  }

  update(t: number): void {
    super.update(t);
  }

  canStart(): boolean {
    return true;
  }

  canComplete(): boolean {
    if (this.bosses.size > 0) {
      return SagaHelper.areAllBossesDead(this.bosses);
    }
    return false;
  }

  start(): void {
    super.start();
    this.spawnWhenDelayFinished();
  }

  spawnWhenDelayFinished(): void {
    if (this.delay <= 0) {
      this.spawnSagaUnits();
    } else {
      TimerStart(this.delayTimer, this.delay, false, ()=> {
        this.spawnSagaUnits();
        DestroyTimer(GetExpiredTimer());
      });
    }
  }

  complete(): void {
    super.complete();
  }

}