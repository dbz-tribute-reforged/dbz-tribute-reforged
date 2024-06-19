export class DDSData {
  public source: unit;
  public sourcePlayer: player;
  public sourceTypeId: number;
  public sourceHandleId: number;
  public target: unit;
  public targetPlayer: player;
  public targetTypeId: number;
  public targetHandleId: number;
  public startDmg: number;
  public dmg: number;
  public isAttack: boolean;
  public attackType: attacktype;
  public damageType: damagetype;
  public weaponType: weapontype;

  constructor() {
    this.source = null;
    this.sourcePlayer = null;
    this.sourceTypeId = 0;
    this.sourceHandleId = 0;
    this.target = null;
    this.targetPlayer = null;
    this.targetTypeId = 0;
    this.targetHandleId = 0;
    this.startDmg = -1;
    this.dmg = -1;
    this.isAttack = null;
    this.attackType = ATTACK_TYPE_NORMAL;
    this.damageType = DAMAGE_TYPE_NORMAL;
    this.weaponType = WEAPON_TYPE_WHOKNOWS;
  }

  public get() {
    this.source = GetEventDamageSource();
    this.sourcePlayer = GetOwningPlayer(this.source);
    this.sourceTypeId = GetUnitTypeId(this.source);
    this.sourceHandleId = GetHandleId(this.source);
    this.target = BlzGetEventDamageTarget();
    this.targetPlayer = GetOwningPlayer(this.target);
    this.targetTypeId = GetUnitTypeId(this.target);
    this.targetHandleId = GetHandleId(this.target);
    this.startDmg = GetEventDamage();
    this.dmg = this.startDmg;
    this.isAttack = BlzGetEventIsAttack();
    this.attackType = BlzGetEventAttackType();
    this.damageType = BlzGetEventDamageType();
    this.weaponType = BlzGetEventWeaponType();
  }

  public setDamage(dmg: number) {
    this.dmg = dmg;
  }

  public applyDamage() {
    if (this.dmg == this.startDmg) return;
    BlzSetEventDamage(Math.max(0, this.dmg));
  }
}