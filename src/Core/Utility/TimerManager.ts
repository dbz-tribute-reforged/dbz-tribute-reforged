
export class TimerManager {
  private static instance: TimerManager; 
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new TimerManager();
    }
    return this.instance;
  }

  public map: Map<number, timer> = new Map();

  get(): timer {
    if (this.map.size == 0) {
      return CreateTimer();
    }
    const key = this.map.size-1;
    const result = this.map.get(key);
    this.map.delete(key);
    return result;
  }

  recycle(timer: timer) {
    PauseTimer(timer);
    this.map.set(this.map.size, timer);
  }
}