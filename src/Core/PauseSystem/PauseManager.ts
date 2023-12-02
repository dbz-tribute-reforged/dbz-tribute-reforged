export class PauseManager {
  private static instance: PauseManager; 
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new PauseManager();
    }
    return this.instance;
  }

  public map: Map<number, number> = new Map();

  pause(unit: unit, doInvul: boolean = false) {
    if (IsUnitType(unit, UNIT_TYPE_HERO)) { 
      const key = GetHandleId(unit);
      const count = this.map.get(key);
      if (count && count > 0) {
        this.map.set(key, this.map.get(key) + 1);
        return;
      }
      this.map.set(key, 1);
    }
    PauseUnit(unit, true);
    if (doInvul) {
      SetUnitInvulnerable(unit, true);
    }
  }

  unpause(unit: unit, doVul: boolean = false) {
    if (IsUnitType(unit, UNIT_TYPE_HERO)) { 
      const key = GetHandleId(unit);
      const count = this.map.get(key);
      if (count && count > 0) {
        this.map.set(key, count-1);
        if (count > 1) return;
      }
    }
    PauseUnit(unit, false);
    if (doVul) {
      SetUnitInvulnerable(unit, false);
    }
  }

}