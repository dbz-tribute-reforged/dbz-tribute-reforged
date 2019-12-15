import { AdvancedTournament } from "./AdvancedTournament";
import { Tournament, TournamentState } from "./Tournament";
import { SuffixNumber } from "Common/NumberSuffixer";
import { Colorizer } from "Common/Colorizer";
import { TournamentContestant } from "./TournamentContestant";
import { ArrayHelper } from "Common/ArrayHelper";
import { Vector2D } from "Common/Vector2D";
import { TournamentData } from "./TournamentData";
import { Logger } from "Libs/TreeLib/Logger";

export class Budokai extends AdvancedTournament implements Tournament {
  protected registerTrigger: trigger;
  protected contestants: Map<number, TournamentContestant>;
  protected currentBracket: TournamentContestant[];
  protected currentIndex: number;
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
    this.currentIndex = 0;
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
      this.getTournamentName + " will be held in " + 
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
        this.getTournamentName + 
        " has been cancelled due to lack of attendance."
      );
      this.complete();
    } else {
      // seed all registered players into randomised brackets
      // then run the tournament until there is a winner
      this.currentBracket = Array.from(this.contestants.values());
      this.setupCurrentBracket(TournamentData.seedingRandom);
      Logger.LogDebug("Bracket setup? " + this.currentBracket.length);
      for (const e of this.currentBracket) {
        Logger.LogDebug("e: " + e.id);
      }
      this.showBracket();
      this.runTournament();
    }
  }

  setupCurrentBracket(seeding: number) {
    this.currentIndex = 0;
    const allContestants = this.currentBracket;

    for (const contestant of allContestants) {
      if (contestant.isCompeting) {
        // if competing then this contestant is staying on for next bracket
        this.currentBracket.push(contestant);
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
    // 0 v 1, 2 v 3, 4 v 5, etc, odd player gets a bye till next round
    let i: number;
    for (i = 0; i < this.currentBracket.length - 1; i += 2) {
      const contestant1 = this.currentBracket[i];
      const contestant2 = this.currentBracket[i+1];
      DisplayTimedTextToForce(
        bj_FORCE_ALL_PLAYERS, 15,
        Colorizer.getColoredPlayerName(Player(contestant1.id)) +  
        " vs" + 
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
    this.isMatchOver = true;

    // timer check, if next match then go, else do nothing
    TimerStart(this.runTournamentTimer, 1, true, () => {
      if (this.isMatchOver) {
        // move everyone in arena back to their old position
        // unpause and un-invul them as well
        for (const contestant of this.contestants.values()) {
          if (contestant.isCompeting && contestant.isInArena) {
            contestant.returnAllUnits();
            contestant.isInArena = false;
          }
        }

        // run matches if there are any available
        if (this.currentIndex < this.currentBracket.length - 1) {
          this.runMatch();
        } else if (this.currentBracket.length == 1) {
          // if only 1 person left in tournament
          // i.e. the winner of the tournament
          const winner = this.currentBracket[0];
          winner.returnAllUnits();
          winner.isInArena = false;
          
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 15,
            Colorizer.getColoredPlayerName(Player(winner.id)) +  
            " is the winner of " + 
            this.getTournamentName()
          );
          // complete and finish up
          this.complete();
        } else {
          // no matches possible in this bracket
          if (this.currentIndex < this.currentBracket.length) {
            // if > 1 contestants but < max bracket length
            // there are an odd num of contesants
            // give the currentIndex player a bye
            const byePlayer = Player(this.currentBracket[this.currentIndex].id);

            DisplayTimedTextToForce(
              bj_FORCE_ALL_PLAYERS, 15,
              Colorizer.getColoredPlayerName(byePlayer) +  
              " has received a bye."
            );
          }
          // create new bracket with winners of previous bracket
          Logger.LogDebug("Moving on to next bracket.");
          this.setupCurrentBracket(TournamentData.seedingNone);
        }
      }
    })
  }

  runMatch() {
    this.isMatchOver = false;
    const activeContestants: Map<number, TournamentContestant> = new Map();
    const matchHandlerTrigger = CreateTrigger();

    for (let j = 0; j < TournamentData.budokaiMaxContestantsPerMatch; ++j) {
      const contestant = this.currentBracket[this.currentIndex];
      ++this.currentIndex;
      // adds units of player to the contestant
      // records old position of each unit
      contestant.setupUnitsOfPlayer(contestant.id);
      contestant.resetUnitsAlive();
      contestant.isInArena = true;

      // TODO: if any unit of contestant is in heaven/hell
      // they are disqualiifed
      // if both disqualified that match is just cancelled

      let spawnPos: Vector2D = TournamentData.tournamentSpawn1;
      if (j % 2 != 0) {
        spawnPos = TournamentData.tournamentSpawn2;
      }
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

    TriggerAddAction(matchHandlerTrigger, () => {
      const dyingUnit = GetTriggerUnit();
      const player = GetOwningPlayer(dyingUnit);
      const playerId = GetPlayerId(player);

      const contestant = activeContestants.get(playerId);
      if (contestant) {
        --contestant.unitsAlive;
        if (contestant.unitsAlive == 0) {
          contestant.isCompeting = false;

          for (const winner of activeContestants.values()) {
            if (winner.isCompeting) {
              DisplayTimedTextToForce(
                bj_FORCE_ALL_PLAYERS, 10,
                Colorizer.getColoredPlayerName(Player(winner.id)) +  
                " has won their match."
              );
            }
          }
          DisplayTimedTextToForce(
            bj_FORCE_ALL_PLAYERS, 10,
            Colorizer.getColoredPlayerName(Player(contestant.id)) +  
            " has lost their match."
          );

          const matchEndTimer = CreateTimer();
          const matchEndTimerDialog = CreateTimerDialog(matchEndTimer);
          TimerDialogSetTitle(matchEndTimerDialog, "Next Match");
          TimerDialogDisplay(matchEndTimerDialog, true);

          TimerStart(matchEndTimer, TournamentData.budokaiMatchDelay, false, () => {
            this.isMatchOver = true;

            activeContestants.clear();

            DestroyTimerDialog(matchEndTimerDialog);
            DestroyTimer(matchEndTimer);
            DestroyTrigger(matchHandlerTrigger);
          });
        }
      }
    })
  }
}