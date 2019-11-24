import { CustomAbilityManager } from "CustomAbility/CustomAbilityManager";
import { ZanzoDash } from "CustomAbility/ZanzoDash";
import { BlueHurricane } from "CustomAbility/BlueHurricane";
import { CustomAbility, CostType } from "CustomAbility/CustomAbility";
import { ShiningSwordAttack } from "CustomAbility/ShiningSwordAttack";
import { Beam } from "CustomAbility/Beam";
import { BeamPurple } from "CustomAbility/BeamPurple";
import { BeamRed } from "CustomAbility/BeamRed";
import { CustomAbilityInput } from "CustomAbility/CustomAbilityInput";
import { UnitHelper } from "Common/UnitHelper";
import { Vector2D } from "Common/Vector2D";
import { CoordMath } from "Common/CoordMath";

export class CustomHero {
  public abilities: CustomAbilityManager;

  public isCasting: boolean;

  constructor(
    public readonly unit: unit,
  ) {
    // remove these defaults for actual heroes, i think
    this.abilities = new CustomAbilityManager(
      [
        new ZanzoDash(),
        new BlueHurricane(),
        new ShiningSwordAttack(),
        new Beam(),
        new BeamPurple(),
        new BeamRed(),
      ]
    );
    this.isCasting = false;
  }

  private addCastTargetingEvent(readyTrigger: trigger, input: CustomAbilityInput) {
    TriggerRegisterPlayerUnitEvent(
      readyTrigger, 
      input.casterPlayer, 
      EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, 
      Condition(() => {
        return GetFilterUnit() == input.caster.unit && !UnitHelper.isUnitStunned(input.caster.unit);
      })
    );
  }

  public waitCastTimeThenActivate(customAbility: CustomAbility, input: CustomAbilityInput) {
    // before we can activate
    // check if we're casting
    const readyTrigger = CreateTrigger();
    this.addCastTargetingEvent(readyTrigger, input);

    let castTimeCounter = 0;
    const castTimeTimer = CreateTimer();
    TriggerAddAction(readyTrigger, () => {
      // wait 
      PauseTimer(castTimeTimer);
      SetUnitAnimation(input.caster.unit, customAbility.animation);
      const casterCoord = new Vector2D(GetUnitX(input.caster.unit), GetUnitY(input.caster.unit));
      const angle = CoordMath.angleBetweenCoords(casterCoord, input.targetPoint);

      TimerStart(castTimeTimer, customAbility.updateRate, true, () => {
        if (castTimeCounter == 0) {
          IssueImmediateOrder(input.caster.unit, "stop");
          SetUnitFacingTimed(input.caster.unit, angle, customAbility.updateRate);
        }
        castTimeCounter += customAbility.updateRate;
        if (castTimeCounter > customAbility.castTime) {
          // then if ready
          // actually activate the ability
          customAbility.activate(input);
          this.isCasting = false;
          DestroyTimer(castTimeTimer);
          DestroyTrigger(readyTrigger);
        }
      });
    })
  }

  public useAbility(name: string, input: CustomAbilityInput) {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility && customAbility.canCastAbility(input)) {
      if (!this.isCasting || customAbility.canMultiCast) {
          this.isCasting = true;
          this.waitCastTimeThenActivate(customAbility, input);
      }
    }
  }

  public canCastAbility(name: string, input: CustomAbilityInput): boolean {
    let customAbility = this.abilities.getCustomAbilityByName(name);
    if (customAbility) {
      return customAbility.canCastAbility(input);
    }
    return false;
  }

  public getAbilityByIndex(index: number): CustomAbility | undefined {
    return this.abilities.getCustomAbilityByIndex(index);
  }
}