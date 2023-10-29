export module ItemShopCategory {
  export let isSetup = false;

  // {1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824}
  export let c_index = 1;

  export let ACTIVE = c_index; c_index *= 2;
  export let PASSIVE = c_index; c_index *= 2;

  export let STR = c_index; c_index *= 2;
  export let AGI = c_index; c_index *= 2;
  export let INT = c_index; c_index *= 2;

  export let ATTACK = c_index; c_index *= 2;
  export let ARMOR = c_index; c_index *= 2;

  export let OFFENSIVE = c_index; c_index *= 2;
  export let DEFENSIVE = c_index; c_index *= 2;

  export let CROWD_CONTROL = c_index; c_index *= 2;
  export let UTILITY = c_index; c_index *= 2;
  export let MOVE_SPEED = c_index; c_index *= 2;

  export let HP_REGEN = c_index; c_index *= 2;
  export let MANA_REGEN = c_index; c_index *= 2;
}
