
export class GetiManager {
  private static instance: GetiManager; 
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new GetiManager();
    }
    return this.instance;
  }

  

}