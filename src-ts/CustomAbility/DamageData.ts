export class DamageData {
  constructor(
    public multiplier: number = 1.0,
    public attribute: number = bj_HEROSTAT_INT,
    public attackType: attacktype = ATTACK_TYPE_HERO,
    public damageType: damagetype = DAMAGE_TYPE_NORMAL,
    public weaponType: weapontype = WEAPON_TYPE_WHOKNOWS,
  ) {
    
  }
}