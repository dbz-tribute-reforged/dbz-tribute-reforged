export class DamageData implements Serializable<DamageData> {
  constructor(
    public multiplier: number = 1.0,
    public attribute: number = bj_HEROSTAT_INT,
    public attackType: attacktype = ATTACK_TYPE_HERO,
    public damageType: damagetype = DAMAGE_TYPE_NORMAL,
    public weaponType: weapontype = WEAPON_TYPE_WHOKNOWS,
  ) {
    
  }

  deserialize(
    input: {
      multiplier: number; 
      attribute: number; 
      attackType: number; 
      damageType: number; 
      weaponType: number; 
    }
  ) {
    this.multiplier = input.multiplier;
    this.attribute = input.attribute;
    this.attackType = ConvertAttackType(input.attackType);
    this.damageType = ConvertDamageType(input.damageType);
    this.weaponType = ConvertWeaponType(input.weaponType);
    return this;
  }
}