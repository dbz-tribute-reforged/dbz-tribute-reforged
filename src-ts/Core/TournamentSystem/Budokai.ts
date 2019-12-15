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

export class Budokai extends AdvancedTournament implements Tournament {
  protected registerTrigger: trigger;
  protected contestants: Map<number, TournamentContestant>;
  protected currentBracket: TournamentContestant[];
  protected bracketIndex: number;
  protected isMatchOver: boolean;
  protected runTournamentTimer: timer;

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
      TriggerRegisterPlayerChatEvent(
        this.registerTrigger, 
        Player(i), 
        TournamentData.budokaiEnterCommand,
        true
      );
    }
    // TODO: dont let heaven/hell people register
    TriggerAddAction(this.registerTrigger, () => {
      const player = GetTriggerPlayer();
      this.addPlayerContestant(player);
    });

    // remove later
    // debug trigger
    const debugEnter = CreateTrigger();
    TriggerRegisterPlayerChatEvent(debugEnter, Player(0), "-forceenter", false);
    TriggerAddAction(debugEnter, () => {
      const playerId = S2I(SubString(GetEventPlayerChatString(), 12, 13));
      const player = Player(playerId);
      Logger.LogDebug("Forcing " + playerId + " to join the tournament.");
      this.addPlayerContestant(player);
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
      "Strongest Under the Heavens Martial Arts Tournament"
    );
  }

  prepareTournament() {
    DisplayTimedTextToForce(
      bj_FORCE_ALL_PLAYERS, 15, 
      this.getTournamentName() + " will be held in " + 
      this.toStartDelay + " seconds! " + 
      "Type " + TournamentData.budokaiEnterCommand + " to register."
    );
    
    // enable register trigger
    EnableTrigger(this.registerTrigger);

    // wait delay out then setup the tournament
    TimerStart(this.toStartTimer, this.toStartDelay, false, () => {
      this.setupTournament();
    })

  }

  setupTournament() {
    DisableTrigger(this.registerTrigger);

    Logger.LogDebug("Num Contestants: " + this.contestants.size);

    const numContestants = this.contestants.size;
    if (numContestants < 2) {
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15, 
        this.getTournamentName() + 
        " has been cancelled due to lack of attendance."
      );
      this.complete();
    } else {
      Logger.LogDebug("> 2 contestants detected");
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

  showBracket() {
    // adapt for any bracket?
    // 0 v 1, 2 v 3, 4 v 5, etc, odd player gets a bye till next round
    let i: number;
    for (i = 0; i < this.currentBracket.length - 1; i += 2) {
      const contestant1 = this.currentBracket[i];
      const contestant2 = this.currentBracket[i+1];
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15,
        Colorizer.getColoredPlayerName(Player(contestant1.id)) +  
        " vs " + 
        Colorizer.getColoredPlayerName(Player(contestant2.id))
      );
    }
    if (i < this.currentBracket.length) {
      
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15,
        Colorizer.getColoredPlayerName(Player(this.currentBracket[i].id)) +  
        " receives a bye."
      );
    }
  }

  runTournament() {
    // timer check, if next match then go, else do nothing
    TimerStart(this.runTournamentTimer, 0.03, true, () => {
      if (this.isMatchOver) {
        Logger.LogDebug("match is over");
        // move everyone in arena back to their old position
        // unpause and un-invul them as well
        for (const contestant of this.contestants.values()) {
          if (contestant.isInArena) {
            contestant.returnAllUnits();
          }
        }

        // run matches if there are any available
        if (this.bracketIndex < this.currentBracket.length - 1) {
          Logger.LogDebug("running match");
          this.runMatch();
        } else if (this.currentBracket.length == 1) {
          // if only 1 person left in tournament
          // i.e. the winner of the tournament
          const winner = this.currentBracket[0];
          if (winner.isInArena) {
            winner.returnAllUnits();
          }
          
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15,
            Colorizer.getColoredPlayerName(Player(winner.id)) +  
            " is the winner of " + 
            this.getTournamentName()
          );
          // complete and finish up
          this.complete();
        } else if (this.currentBracket.length == 0) {
          Logger.LogDebug("no more possible matches, tournament complete");
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
          Logger.LogDebug("Moving on to next bracket.");
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

      let spawnPos: Vector2D = TournamentData.tournamentSpawn1;
      if (j % 2 != 0) {
        spawnPos = TournamentData.tournamentSpawn2;
      }
      Logger.LogDebug("Contestant: " + contestant.id + " units: " + contestant.units.size);
      for (const unit of contestant.getUnits()) {
        DestroyEffect(
          AddSpecialEffect(
            TournamentData.budokaiTpSfx, 
            GetUnitX(unit), GetUnitY(unit)
          )
        );
        SetUnitX(unit, spawnPos.x);
        SetUnitY(unit, spawnPos.y);
        TriggerRegisterUnitEvent(matchHandlerTrigger, unit, EVENT_UNIT_DEATH);
      }

      activeContestants.set(contestant.id, contestant);
    }

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

    // handle the match for dying units of said player
    TriggerAddAction(matchHandlerTrigger, () => {
      const dyingUnit = GetTriggerUnit();
      const player = GetOwningPlayer(dyingUnit);
      const playerId = GetPlayerId(player);

      const contestant = activeContestants.get(playerId);
      if (contestant) {
        --contestant.unitsAlive;
        if (contestant.unitsAlive == 0) {

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
    });
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
        bj_FORCE_ALL_PLAYERS, 10,
        Colorizer.getColoredPlayerName(Player(winner.id)) +  
        " has won their match."
      );
    }
    for (const loser of losers) {
      loser.isCompeting = false;
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 10,
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