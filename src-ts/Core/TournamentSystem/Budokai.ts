import { AdvancedTournament } from "./AdvancedTournament";
import { Tournament, TournamentState } from "./Tournament";
import { SuffixNumber } from "Common/NumberSuffixer";
import { Colorizer } from "Common/Colorizer";
import { TournamentContestant } from "./TournamentContestant";
import { ArrayHelper } from "Common/ArrayHelper";
import { Vector2D } from "Common/Vector2D";
import { TournamentData } from "./TournamentData";
import { Logger } from "Libs/TreeLib/Logger";
import { AllianceHelper } from "Common/AllianceHelper";
import { UnitHelper } from "Common/UnitHelper";
import { TextTagHelper } from "Common/TextTagHelper";
import { Globals } from "Common/Constants";

export class Budokai extends AdvancedTournament implements Tournament {
  protected registerTrigger: trigger;
  protected contestants: Map<number, TournamentContestant>;
  protected currentBracket: TournamentContestant[];
  protected bracketIndex: number;
  protected isMatchOver: boolean;
  protected runTournamentTimer: timer;
  protected showBracketTrigger: trigger;

  constructor(
    public name: string = TournamentData.budokaiName,
    public state: TournamentState = TournamentState.NotStarted,
    public toStartDelay: number = TournamentData.budokaiDelay,
    public tournamentCounter: number = TournamentData.budokaiCounter,
  ) {
    super(name, state, toStartDelay);
    this.registerTrigger = CreateTrigger();
    this.contestants = new Map();
    this.currentBracket = [];
    this.bracketIndex = 0;
    this.isMatchOver = false;
    this.runTournamentTimer = CreateTimer();
    this.showBracketTrigger = CreateTrigger();
    this.initialize();
  }

  start(): void {
    super.start();
    this.prepareTournament();
  }

  complete(): void {
    super.complete();

    for (const contestant of this.contestants.values()) {
      contestant.completeTournament();
    }

    this.contestants.clear();
    this.currentBracket.splice(0, this.currentBracket.length);
    ++this.tournamentCounter;
    PauseTimer(this.runTournamentTimer);
  }

  initialize() {
    // setup register trigger
    for (let i = 0; i < bj_MAX_PLAYERS; ++i) {
      const player = Player(i);
      TriggerRegisterPlayerChatEvent(
        this.registerTrigger, 
        player, 
        TournamentData.budokaiEnterCommand,
        true
      );
      TriggerRegisterPlayerChatEvent(
        this.registerTrigger, 
        player, 
        TournamentData.budokaiEnterCommandShortcut,
        true
      );
      TriggerRegisterPlayerChatEvent(
        this.showBracketTrigger,
        player,
        TournamentData.budokaiShowBracketCommand,
        true
      )
    }

    TriggerAddAction(this.registerTrigger, () => {
      const player = GetTriggerPlayer();
      this.addPlayerContestant(player);
    });

    TriggerAddCondition(this.showBracketTrigger, Condition(() => {
      const displayForce = CreateForce();
      ForceAddPlayer(displayForce, GetTriggerPlayer());
      this.showBracket(displayForce);
      DestroyForce(displayForce);
      return false;
    }));

    // remove later
    // debug trigger
    const debugEnter = CreateTrigger();
    TriggerRegisterPlayerChatEvent(debugEnter, Player(0), "-forceenter", false);
    TriggerAddAction(debugEnter, () => {
      if (Globals.isFBSimTest && Globals.isFreemode) {
        const playerId = S2I(SubString(GetEventPlayerChatString(), 12, 13));
        const player = Player(playerId);
        Logger.LogDebug("Forcing " + playerId + " to join the tournament.");
        this.addPlayerContestant(player);
      }
    });

    DisableTrigger(this.registerTrigger);

    // possible leave command
    // this.contestants.delete(playerId);

  }

  addPlayerContestant(player: player): void {
    const playerId = GetPlayerId(player);
    if (!this.contestants.get(playerId)) {
      this.contestants.set(playerId, 
        new TournamentContestant(playerId)
      );
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        Colorizer.getColoredPlayerName(player) + 
        " has joined " + this.getTournamentName()
      );
    } else {
      // already registered
    }
  }

  getTournamentName(): string {
    return (
      "The " + 
      this.tournamentCounter + SuffixNumber(this.tournamentCounter) + " " +
      "Budokai Tenkaichi"
    );
  }

  prepareTournament() {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 20, 
      "|cffffff00" + this.getTournamentName() + " will be held in " + 
      this.toStartDelay + " seconds!|r"
    );
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 20, 
      "|cffffcc00Type|r |cffff2020" + TournamentData.budokaiEnterCommand + 
      "|r |cffffcc00to register.|r"
    );
    TimerStart(CreateTimer(), 3, false, () => {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 17, 
        "|cff80ff80All tournament contestants will receive bonus stats for participating!|r"
      );
      DestroyTimer(GetExpiredTimer());
    });
    
    // enable register trigger
    EnableTrigger(this.registerTrigger);

    // wait delay out then setup the tournament
    TimerStart(this.toStartTimer, this.toStartDelay, false, () => {
      this.setupTournament();
    })

  }

  setupTournament() {
    DisableTrigger(this.registerTrigger);

    /*
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      "Contestants: " + this.contestants.size
    );
    */
    
    const numContestants = this.contestants.size;
    if (numContestants < 2) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 10, 
        this.getTournamentName() + 
        " has been cancelled due to lack of attendance."
      );
      this.complete();
    } else {
      TimerDialogDisplay(this.toStartTimerDialog, false);

      this.isMatchOver = true;

      for (const contestant of this.contestants.values()) {
        contestant.startVision();
      }
      // seed all registered players into randomised brackets
      // then run the tournament until there is a winner
      this.setupCurrentBracket(TournamentData.seedingRandom);
      this.showBracket();
      this.runTournament();
    }
  }

  setupCurrentBracket(seeding: number) {
    this.bracketIndex = 0;
    if (this.currentBracket.length > 0) {
      for (let i = 0; i < this.currentBracket.length; ++i) {
        if (!this.currentBracket[i].isCompeting) {
          this.currentBracket.splice(i, 1);
          --i;
        }
      }
      if (this.currentBracket.length % 2 != 0) {
        // someone received a bye last round
        // move them to the front
        const lastContestant = this.currentBracket.pop();
        if (lastContestant) {
          this.currentBracket.unshift(lastContestant);
        }
      }
    } else {
      for (const contestant of this.contestants.values()) {
        if (contestant.isCompeting) {
          this.currentBracket.push(contestant);
        }
      }  
    }

    switch (seeding) {
      case TournamentData.seedingRandom:
        ArrayHelper.shuffleArray(this.currentBracket);
        break;
      case TournamentData.seedingNone:
        // dont seed the bracket
      default:
        break;
    }
  }

  showBracket(force: force = bj_FORCE_ALL_PLAYERS) {
    // adapt for any bracket?
    // 0 v 1, 2 v 3, 4 v 5, etc, odd player gets a bye till next round
    let i: number;
    for (i = 0; i < this.currentBracket.length - 1; i += 2) {
      const contestant1 = this.currentBracket[i];
      const contestant2 = this.currentBracket[i+1];
      DisplayTimedTextToForce(
        force, 15,
        Colorizer.getColoredPlayerName(Player(contestant1.id)) +  
        " vs " + 
        Colorizer.getColoredPlayerName(Player(contestant2.id))
      );
    }
    if (this.currentBracket.length > 1 && i < this.currentBracket.length) {
      
      DisplayTimedTextToForce(
        force, 5,
        Colorizer.getColoredPlayerName(Player(this.currentBracket[i].id)) +  
        " receives a bye."
      );
    }
  }

  giveTrophy(unit: unit) {
    UnitAddItemById(unit, TournamentData.trophyItem);
  }

  runTournament() {
    // timer check, if next match then go, else do nothing
    TimerStart(this.runTournamentTimer, 0.03, true, () => {
      if (this.isMatchOver) {
        // move everyone in arena back to their old position
        // unpause and un-invul them as well
        for (const contestant of this.contestants.values()) {
          if (contestant.isInArena) {
            contestant.returnAllUnits();
            for (const rewardedUnit of contestant.getUnits()) {
              if (
                UnitHelper.isUnitTournamentViable(rewardedUnit) &&
                !UnitHelper.isUnitDead(rewardedUnit)
              ) {
                SetUnitLifePercentBJ(rewardedUnit, 100);
                SetUnitManaPercentBJ(rewardedUnit, 100);
                this.giveTrophy(rewardedUnit);
              }
            }
            // check if contestant has any other units in arena
            // if so chuck em to the pos of first unit contestant
            for (const unitContestant of contestant.units.values()) {
              const extraUnitsGroup = CreateGroup();
              GroupEnumUnitsOfPlayer(extraUnitsGroup, Player(contestant.id), null);

              ForGroup(extraUnitsGroup, () => {
                const unit = GetEnumUnit();
                const y = GetUnitY(unit)
                const x = GetUnitX(unit);
                if (
                  UnitHelper.isUnitAlive(unit) && 
                  x > TournamentData.budokaiArenaBottomLeft.x &&
                  y > TournamentData.budokaiArenaBottomLeft.y && 
                  x < TournamentData.budokaiArenaTopRight.x &&
                  y < TournamentData.budokaiArenaTopRight.y
                ) {
                  SetUnitX(unit, unitContestant.oldPosition.x);
                  SetUnitY(unit, unitContestant.oldPosition.y);
                  PauseUnit(unit, false);
                  SetUnitInvulnerable(unit, false);
                }       
              });
              DestroyGroup(extraUnitsGroup);

              PanCameraToTimedForPlayer(
                Player(contestant.id), 
                unitContestant.oldPosition.x, 
                unitContestant.oldPosition.y, 
                0
              );
              break;
            }
          }
        }

        // run matches if there are any available
        if (this.bracketIndex < this.currentBracket.length - 1) {
          this.runMatch();
        } else if (this.currentBracket.length == 1) {
          // if only 1 person left in tournament
          // i.e. the winner of the tournament
          const winner = this.currentBracket[0];
          if (winner.isInArena) {
            winner.returnAllUnits();
          }
          
          for (const unit of winner.getUnits()) {
            if (UnitHelper.isUnitTournamentViable(unit)) {
              SetUnitLifePercentBJ(unit, 100);
              SetUnitManaPercentBJ(unit, 100);
              this.giveTrophy(unit);
              // const numTournaments = this.tournamentCounter - TournamentData.budokaiCounter + 1;
              // TextTagHelper.showPlayerColorTextOnUnit(
              //   "+" + (numTournaments * 50) + " tournament stats",
              //   winner.id,
              //   unit
              // );

            }
          }
          
          for (const unitContestant of winner.units.values()) {
            if (UnitHelper.isUnitAlive(unitContestant.unit)) {
              const itemRect = Rect(
                TournamentData.budokaiArenaBottomLeft.x,
                TournamentData.budokaiArenaBottomLeft.y,
                TournamentData.budokaiArenaTopRight.x,
                TournamentData.budokaiArenaTopRight.y
              )
    
              EnumItemsInRectBJ(itemRect, () => {
                SetItemPosition(GetFilterItem(), unitContestant.oldPosition.x, unitContestant.oldPosition.y)
              });
    
              RemoveRect(itemRect);
              break;
            }
          }
          
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15,
            Colorizer.getColoredPlayerName(Player(winner.id)) +  
            " is the winner of " + 
            this.getTournamentName()
          );
          PlaySoundBJ(this.completeSound);
          // complete and finish up
          this.complete();
        } else if (this.currentBracket.length == 0) {
          this.complete();
        } else {
          // no matches possible in this bracket
          // if (this.bracketIndex < this.currentBracket.length) {
          //   // if > 1 contestants but < max bracket length
          //   // there are an odd num of contesants
          //   // give the bracketIndex player a bye
          //   const byePlayer = Player(this.currentBracket[this.bracketIndex].id);

          //   DisplayTimedTextToForce(
          //     bj_FORCE_ALL_PLAYERS, 15,
          //     Colorizer.getColoredPlayerName(byePlayer) +  
          //     " has received a bye."
          //   );
          // }
          // create new bracket with winners of previous bracket
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 10,
            this.getColoredName()
          );
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 10,
            "Moving on to the next round of matches."
          );
          this.setupCurrentBracket(TournamentData.seedingNone);
          this.showBracket();
        }
      }
    })
  }

  // TODO: refactor and clean up this stuff
  runMatch() {
    this.isMatchOver = false;
    const matchHandlerTrigger = CreateTrigger();
    const activeContestants: Map<number, TournamentContestant> = new Map();

    for (let j = 0; j < TournamentData.budokaiMaxContestantsPerMatch; ++j) {
      const contestant = this.currentBracket[this.bracketIndex];
      ++this.bracketIndex;
      // adds units of player to the contestant
      // records old position of each unit
      contestant.startMatch();

      // TODO: if any unit of contestant is in heaven/hell
      // they are disqualiifed
      // if both disqualified that match is just cancelled

      let spawnPos: Vector2D = TournamentData.budokaiSpawn1;
      if (j % 2 != 0) {
        spawnPos = TournamentData.budokaiSpawn2;
      }
      PanCameraToTimedForPlayer(Player(contestant.id), spawnPos.x, spawnPos.y, 0);
      // Logger.LogDebug("Contestant: " + contestant.id + " units: " + contestant.units.size);
      for (const unit of contestant.getUnits()) {
        DestroyEffect(
          AddSpecialEffect(
            TournamentData.budokaiTpSfx, 
            GetUnitX(unit), GetUnitY(unit)
          )
        );
        SetUnitX(unit, spawnPos.x);
        SetUnitY(unit, spawnPos.y);
        SetUnitLifePercentBJ(unit, 100);
        SetUnitManaPercentBJ(unit, 100);
        TriggerRegisterUnitEvent(matchHandlerTrigger, unit, EVENT_UNIT_DEATH);
      }

      activeContestants.set(contestant.id, contestant);
    }

    TriggerAddCondition(
      matchHandlerTrigger, 
      Condition(() => {
        return !UnitHelper.isImmortal(GetTriggerUnit())
      }
    ));

    let wasAllied: boolean;
    let isDoneLoop: boolean = false;
    // modify alliance settings
    for (const source of activeContestants.values()) {
      for (const target of activeContestants.values()) {
        if (source.id != target.id) {
          const sourcePlayer = Player(source.id);
          const targetPlayer = Player(target.id);
          wasAllied = GetPlayerAlliance(
            sourcePlayer, 
            targetPlayer, 
            ConvertAllianceType(bj_ALLIANCE_ALLIED_VISION)
          );
          
          AllianceHelper.setAllianceTwoWay(sourcePlayer, targetPlayer, bj_ALLIANCE_UNALLIED);
          
          isDoneLoop = true;
          break;
        }
      }
      if (isDoneLoop) {
        break;
      }
    }

    // have a timer to enforce max duration of fights (so they dont go on forever stalling)
    const matchLimitTimer = CreateTimer();
    const matchLimitTimerDialog = CreateTimerDialog(matchLimitTimer);
    TimerDialogSetTitle(matchLimitTimerDialog, TournamentData.budokaiMatchTimeLimitName);
    TimerDialogDisplay(matchLimitTimerDialog, true);

    TimerStart(matchLimitTimer, TournamentData.budokaiMatchTimeLimit, false, () => {
      // everyone loses
      let losers: TournamentContestant[] = [];
      for (const contestant of activeContestants.values()) {
        losers.push(contestant);
      }

      this.endMatch(
        losers,
        [],
        wasAllied,
        matchLimitTimer,
        matchLimitTimerDialog,
        matchHandlerTrigger,
      );
      activeContestants.clear();
    });

    // force check if lose
    TimerStart(CreateTimer(), 3, true, () => {
      if (IsTriggerEnabled(matchHandlerTrigger)) {
        // if somehow no contestants, end
        if (activeContestants.size == 0) {
          this.endMatch(
            [], 
            [],
            false, 
            matchLimitTimer,
            matchLimitTimerDialog,
            matchHandlerTrigger,
          );
          activeContestants.clear();
          DestroyTimer(GetExpiredTimer());
        }
        
        // if all units for contestant are dead, end
        for (const [playerId, contestant] of activeContestants) {
          let allUnitsDead = true;
          for (const [unit, unitContestant] of contestant.units) {
            if (UnitHelper.isUnitAlive(unit) || UnitHelper.isImmortal(unit)) {
              allUnitsDead = false;
            }
          }
          if (allUnitsDead) {
            contestant.unitsAlive = 0;
            this.checkIfContestantUnitsAreDead(
              contestant,
              activeContestants,
              wasAllied,
              matchLimitTimer,
              matchLimitTimerDialog,
              matchHandlerTrigger,
            );
            DestroyTimer(GetExpiredTimer());
          }
        }
      } else {
        DestroyTimer(GetExpiredTimer());
      }
    });

    // handle the match for dying units of said player
    TriggerAddAction(matchHandlerTrigger, () => {
      const dyingUnit = GetTriggerUnit();
      const player = GetOwningPlayer(dyingUnit);
      const playerId = GetPlayerId(player);

      const contestant = activeContestants.get(playerId);
      if (contestant) {
        --contestant.unitsAlive;
        this.checkIfContestantUnitsAreDead(
          contestant,
          activeContestants,
          wasAllied,
          matchLimitTimer,
          matchLimitTimerDialog,
          matchHandlerTrigger,
        );
      }
    });
  }

  checkIfContestantUnitsAreDead(
    contestant: TournamentContestant, 
    activeContestants: Map<number, TournamentContestant>,
    wasAllied: boolean,
    matchLimitTimer: timer,
    matchLimitTimerDialog: timerdialog,
    matchHandlerTrigger: trigger,
  ) {
    if (contestant.unitsAlive <= 0) {

      let winner: TournamentContestant = contestant;
      for (const possibleWinner of activeContestants.values()) {
        if (possibleWinner.id != contestant.id) {
          winner = possibleWinner;
        }
      }
      
      this.endMatch(
        [contestant], 
        [winner], 
        wasAllied, 
        matchLimitTimer,
        matchLimitTimerDialog,
        matchHandlerTrigger
      );
      activeContestants.clear();
    }
  }

  endMatch(
    losers: TournamentContestant[], 
    winners: TournamentContestant[],
    wasAllied: boolean,
    matchLimitTimer: timer,
    matchLimitTimerDialog: timerdialog,
    matchHandlerTrigger: trigger,
  ) {
    DisableTrigger(matchHandlerTrigger);

    for (const winner of winners) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 5,
        Colorizer.getColoredPlayerName(Player(winner.id)) +  
        " has won their match."
      );
    }
    for (const loser of losers) {
      loser.isCompeting = false;
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 5,
        Colorizer.getColoredPlayerName(Player(loser.id)) +  
        " has lost their match."
      );
    }

    // reset alliance
    if (wasAllied) {
      if (losers.length > 1) {
        AllianceHelper.setAllianceTwoWay(
          Player(losers[0].id),
          Player(losers[1].id), 
          bj_ALLIANCE_ALLIED_VISION,
        )
      } else {
        for (const winner of winners) {
          for (const loser of losers) {
            if (wasAllied && winner.id != loser.id) {
              AllianceHelper.setAllianceTwoWay(
                Player(winner.id), 
                Player(loser.id), 
                bj_ALLIANCE_ALLIED_VISION,
              );
            }
          }
        }
      }
    }

    DestroyTimerDialog(matchLimitTimerDialog);
    DestroyTimer(matchLimitTimer);

    const matchEndTimer = CreateTimer();
    const matchEndTimerDialog = CreateTimerDialog(matchEndTimer);
    TimerDialogSetTitle(matchEndTimerDialog, "Next Match");
    TimerDialogDisplay(matchEndTimerDialog, true);

    TimerStart(matchEndTimer, TournamentData.budokaiMatchDelay, false, () => {
      this.isMatchOver = true;

      DestroyTimerDialog(matchEndTimerDialog);
      DestroyTimer(matchEndTimer);
      DestroyTrigger(matchHandlerTrigger);
    });
  }
}