import { Vector2D } from "Common/Vector2D";
import { UnitHelper } from "Common/UnitHelper";
import { CoordMath } from "Common/CoordMath";
import { Constants } from "Common/Constants";
import { PathingCheck } from "Common/PathingCheck";


export function SetupBraveSwordAttack() {
  const braveSwordAttackId = FourCC("A0IA");
  const herosSongDebuff = FourCC("B01H");
  const dummyStunSpell = FourCC('A0IY');
  const dummyStunOrder = 852095;
  const jumpDuration = 50;
  const jumpHeight = 900;
  const jumpMoveDistance = 23;
  const braveSwordDamageMult = 0.5;
  const braveSwordManaBurnMult = 0.01;

  const trigger = CreateTrigger();

  TriggerRegisterAnyUnitEventBJ(trigger, EVENT_PLAYER_UNIT_SPELL_EFFECT);
  TriggerAddCondition(trigger, Condition(() => {
    const spellId = GetSpellAbilityId();
    if (spellId == braveSwordAttackId) {
      const caster = GetTriggerUnit();
      const abilityLevel = GetUnitAbilityLevel(caster, spellId);
      const targetPos = new Vector2D(GetSpellTargetX(), GetSpellTargetY());
      const player = GetTriggerPlayer();

      const targetGroup = UnitHelper.getNearbyValidUnits(
        targetPos, 375, 
        () => {
          return (
            UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player) && 
            GetUnitAbilityLevel(GetFilterUnit(), herosSongDebuff) > 0
          );
        }
      )
      
      if (CountUnitsInGroup(targetGroup) > 0) {
        let casterPos = new Vector2D(GetUnitX(caster), GetUnitY(caster));
        let time = 0;
        // PauseUnit(caster, true);
        // SetUnitInvulnerable(caster, true);
        UnitHelper.giveUnitFlying(caster);

        TimerStart(CreateTimer(), 0.02, true, () => {
          casterPos.x = GetUnitX(caster);
          casterPos.y = GetUnitY(caster);
          const distanceToTarget = CoordMath.distance(casterPos, targetPos);
          if (
            distanceToTarget > 1000 ||
            time > jumpDuration ||
            BlzIsUnitInvulnerable(caster)
          ) {
            
            const castDummy = CreateUnit(
              player, 
              Constants.dummyCasterId, 
              casterPos.x, casterPos.y, 
              0
            );
            UnitAddAbility(castDummy, dummyStunSpell);

            // PauseUnit(caster, false);
            // SetUnitInvulnerable(caster, false);
            const damageGroup = UnitHelper.getNearbyValidUnits(
              targetPos, 400, 
              () => {
                return (
                  UnitHelper.isUnitTargetableForPlayer(GetFilterUnit(), player)
                );
              }
            );

            const damage = GetHeroAgi(caster, true) * abilityLevel * braveSwordDamageMult;
            const manaBurn = damage * braveSwordManaBurnMult * abilityLevel;

            ForGroup(damageGroup, () => {
              const damagedUnit = GetEnumUnit();
              SetUnitState(
                damagedUnit, 
                UNIT_STATE_MANA, 
                Math.max(
                  0, 
                  GetUnitState(damagedUnit, UNIT_STATE_MANA) - manaBurn
                )
              );

              UnitDamageTarget(
                caster, 
                damagedUnit, 
                damage, 
                true, 
                false, 
                ATTACK_TYPE_HERO, 
                DAMAGE_TYPE_UNKNOWN, 
                WEAPON_TYPE_WHOKNOWS
              );

              if (IsUnitType(damagedUnit, UNIT_TYPE_HERO)) {
                IssueTargetOrderById(castDummy, dummyStunOrder, damagedUnit);
              }
            });

            DestroyGroup(damageGroup);

            const clapSfx = AddSpecialEffect(
              "Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl",
              casterPos.x, casterPos.y
            );
            BlzSetSpecialEffectScale(clapSfx, 2.0);
            DestroyEffect(clapSfx);

            const novaSfx = AddSpecialEffect(
              "IceNova.mdl",
              casterPos.x, casterPos.y
            );
            BlzSetSpecialEffectScale(novaSfx, 1.0);
            BlzSetSpecialEffectTimeScale(novaSfx, 1.25);
            DestroyEffect(novaSfx);

            const feedbackSfx = AddSpecialEffect(
              "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl",
              casterPos.x, casterPos.y
            );
            BlzSetSpecialEffectScale(feedbackSfx, 3.0);
            DestroyEffect(feedbackSfx);

            SetUnitFlyHeight(caster, 0, 0);
            DestroyTimer(GetExpiredTimer());
          } else {
            const timeJumpRatio = -1 + 2 * time / jumpDuration;
            const height = jumpHeight * (
              1 - timeJumpRatio * timeJumpRatio
            );
            SetUnitFlyHeight(caster, height, 0);

            const moveAngle = CoordMath.angleBetweenCoords(casterPos, targetPos);
            let movePos;
            if (distanceToTarget < jumpMoveDistance) {
              movePos = CoordMath.polarProjectCoords(casterPos, moveAngle, distanceToTarget);
            } else {
              movePos = CoordMath.polarProjectCoords(casterPos, moveAngle, jumpMoveDistance);
            }

            PathingCheck.moveGroundUnitToCoord(caster, movePos);
          }
          ++time;
        });

      } else {
        const playerForce = CreateForce();
        ForceAddPlayer(playerForce, player);
        DisplayTimedTextToForce(
          playerForce, 
          5, 
          "|cffff2020Error|r: No unit with |cffffff00Hero's Song|r in target area."
        );
        DestroyForce(playerForce);

        UnitRemoveAbility(caster, spellId);
        UnitAddAbility(caster, spellId);
        SetUnitAbilityLevel(caster, spellId, abilityLevel);
        UnitMakeAbilityPermanent(caster, true, spellId);
      }
      
      DestroyGroup(targetGroup);
    }
    return false;
  }));
}