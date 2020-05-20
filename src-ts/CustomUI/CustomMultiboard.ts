import { Hooks } from "Libs/TreeLib/Hooks";

export interface CustomMultiboard {
  multiboard: multiboard;
  framehandle: framehandle;
  listContainer: framehandle;

  update(): void;
  setPos(framepoint: framepointtype, x: number, y: number): void;
  setVisible(value: boolean): void;

  getMultiboard(): multiboard;
  getFramehandle(): framehandle;
  getListContainer(): framehandle;
  getTitle(): string;
  getRows(): number;
  getColumns(): number;

  setItemStyle(column: number, row: number, showValue: boolean, showIcon: boolean): void;
  setItemValue(column: number, row: number, value: string): void;
  setItemValueColor(column: number, row: number, r: number, g: number, b: number, a: number): void;
  setItemWidth(column: number, row: number, width: number): void;
  setItemIcon(column: number, row: number, iconPath: string): void;
}

export class SagaMultiboardRow {
  public static readonly FINISHED_SAGA_DELAY: number = -1;
  public static readonly FINISHED_SAGA_DELAY_TEXT: string = "Done";
  public static readonly START_COLUMN: number = 1;
  public static readonly END_COLUMN: number = 2;

  constructor(
    public name: string = "SagaName",
    public delay: number = 30,
  ) {

  }

  updateDelay(): void {
    if (this.delay > 0) --this.delay;
  }

  setDelay(delay: number) {
    this.delay = delay;
  }

  getDelay(): number {
    return this.delay;
  }

  getField(column: number): string {
    switch(column) {
      case 1:
        return this.name;
      case 2:
        if (this.delay == SagaMultiboardRow.FINISHED_SAGA_DELAY) {
          return SagaMultiboardRow.FINISHED_SAGA_DELAY_TEXT;
        }
        return this.delay.toString();
      default:
        return this.name;
    }
  }
}

export class SagaMultiboard implements CustomMultiboard {
  static readonly X_OFFSET = 0.26;
  static readonly Y_OFFSET = -0.04;

  public multiboard: multiboard;
  public framehandle: framehandle;
  public listContainer: framehandle;
  public sagaRows: SagaMultiboardRow[];

  constructor(
    public title: string = "Sagas",
    public columns: number = 1,
    public rows: number = 1,
  ) {
    this.multiboard = CreateMultiboardBJ(columns, rows, title);
    this.framehandle = BlzGetFrameByName("Multiboard", 0);
    this.listContainer = BlzGetFrameByName("MultiboardListContainer", 0);
    this.sagaRows = [];
    this.initialize();
  }

  initialize(): void {
    BlzFrameClearAllPoints(this.framehandle);
    // BlzFrameSetAbsPoint(this.framehandle, FRAMEPOINT_TOP, 0.4, 0.55);
    BlzFrameSetPoint(
      this.framehandle, FRAMEPOINT_TOPLEFT, 
      BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOPLEFT,
      SagaMultiboard.X_OFFSET, SagaMultiboard.Y_OFFSET
    );
    BlzFrameSetVisible(this.framehandle, true);
    // set all to show values
    this.setItemStyle(0, 0, true, false);
    this.setItemWidth(1, 0, 26);
    
    TimerStart(CreateTimer(), 0.1, true, () => {
      BlzFrameClearAllPoints(this.framehandle);
      BlzFrameSetPoint(
        this.framehandle, FRAMEPOINT_TOPLEFT, 
        BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOPLEFT,
        SagaMultiboard.X_OFFSET, SagaMultiboard.Y_OFFSET
      );
    });
    // ff cc 00 0% transparency
    this.setItemValueColor(1, 0, 100, 80, 0, 0);
    // for (let i = 0; i < this.rows; ++i) {
    //   this.sagaRows.set(i+1, new SagaMultiboardRow("None", 0));
    // }
  }

  // update every second
  update(): void {
    for (const sagaRow of this.sagaRows) {
      const delay = sagaRow.getDelay();
      if (delay > 0) {
        sagaRow.setDelay(delay - 1);
      }
    }
    this.applySagaMultiboardRow();
  }

  setPos(framepoint: framepointtype, x: number, y: number): void {
    BlzFrameSetAbsPoint(this.framehandle, framepoint, x, y);
  }

  setVisible(value: boolean) {
    BlzFrameSetVisible(this.framehandle, value);
  }

  getSagaRow(row: number): SagaMultiboardRow | undefined {
    if (row <= this.sagaRows.length) {
      return this.sagaRows[row-1];
    }
    return undefined;
  }

  getMultiboard(): multiboard {
    return this.multiboard;
  }
  getFramehandle(): framehandle {
    return this.framehandle;
  }
  getListContainer(): framehandle {
    return this.listContainer;
  }
  getTitle(): string {
    return this.title;
  }
  getRows(): number {
    return this.rows;
  }
  getColumns(): number {
    return this.columns;
  }

  setItemStyle(column: number, row: number, showValue: boolean, showIcon: boolean): void {
    MultiboardSetItemStyleBJ(this.getMultiboard(), column, row, showValue, showIcon);
  }
  setItemValue(column: number, row: number, value: string): void {
    MultiboardSetItemValueBJ(this.getMultiboard(), column, row, value);
  }
  setItemValueColor(column: number, row: number, r: number, g: number, b: number, a: number): void {
    MultiboardSetItemColorBJ(this.getMultiboard(), column, row, r, g, b, a);
  }
  setItemWidth(column: number, row: number, width: number): void {
    MultiboardSetItemWidthBJ(this.getMultiboard(), column, row, width);
  }
  setItemIcon(column: number, row: number, iconPath: string): void {
    MultiboardSetItemIconBJ(this.getMultiboard(), column, row, iconPath);
  }

  applySagaMultiboardRow(row: number = 0): this {
    // const sagaRow = this.sagaRows.get(row);
    // if (sagaRow) {
    //   for (let i = SagaMultiboardRow.START_COLUMN; i < SagaMultiboardRow.END_COLUMN; ++i) {
    //     this.setItemValue(i, row, sagaRow.getField(i));
    //   }
    // }
    // multiboard rows are 1-indexed
    for (let i = 1; i <= this.rows; ++i) {
      for (let j = SagaMultiboardRow.START_COLUMN; j <= SagaMultiboardRow.END_COLUMN; ++j) {
        const sagaRow = this.getSagaRow(i);
        if (sagaRow) {
          this.setItemValue(j, i, sagaRow.getField(j));
        } else {
          this.setItemValue(j, i, "");
        }
      }
    }
    return this;
  }

  addSaga(name: string, delay: number): this {
    this.sagaRows.push(new SagaMultiboardRow(name, delay));
    this.applySagaMultiboardRow();
    // if (this.sagaRows.length <= this.rows) {
    //   this.applySagaMultiboardRow(this.sagaRows.length);
    // }
    // go through all sagas
    // find a slot with finished delay
    // replace that finished saga with new data
    // for (const [row, sagaRow] of this.sagaRows) {
    //   if (sagaRow.getDelay() == SagaMultiboardRow.FINISHED_SAGA_DELAY) {
    //     sagaRow.name = name;
    //     sagaRow.setDelay(delay);
    //     this.applySagaMultiboardRow(row);
    //     break;
    //   }
    // }
    return this;
  }

  finishSaga(name: string): this {
    // let index = 0;
    // for (const row of this.sagaRows) {
    //   if (row.name == name) {
    //     break;
    //   } else {
    //     ++index;
    //   }
    // }
    // this.sagaRows.splice(index, 1);
    const findIndex = this.sagaRows.findIndex((row: SagaMultiboardRow) => {
      return row.name == name;
    });
    if (findIndex > -1) {
      this.sagaRows.splice(findIndex, 1);
    }
    this.applySagaMultiboardRow();
    // find saga with matching name and set delay to be finished
    // for (const [row, sagaRow] of this.sagaRows) {
    //   if (sagaRow.name == name) {
    //     sagaRow.setDelay(SagaMultiboardRow.FINISHED_SAGA_DELAY);
    //     this.applySagaMultiboardRow(row);
    //     break;
    //   }
    // }
    return this;
  }
}

export class CustomMultiboardManager {
  private static instance: CustomMultiboardManager;
  
  protected initialMultiboard: framehandle;
  protected initialMultiboardContainer: framehandle;
  protected multiboards: Map<string, CustomMultiboard>;
  protected sagaMultiboard: SagaMultiboard;
  protected sagaTimer: timer;
  protected updateTimer: timer;

  constructor(
    
  ) {
    this.initialMultiboard = BlzGetFrameByName("Multiboard", 0);
    this.initialMultiboardContainer = BlzGetFrameByName("MultiboardListContainer", 0);
    this.multiboards = new Map();
    this.sagaMultiboard = new SagaMultiboard("Sagas", 2, 4);
    this.sagaTimer = CreateTimer();
    this.updateTimer = CreateTimer();
    this.initialize();
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new CustomMultiboardManager();
      Hooks.set("CustomMultiboardManager", this.instance);
    }
    return this.instance;
  }

  private initialize() {
    this.addSagaMultiboard();
    TimerStart(this.updateTimer, 0.2, true, () => {
      BlzFrameSetVisible(this.initialMultiboard, true);
      for (const multiboard of this.multiboards.values()) {
        BlzFrameSetVisible(multiboard.getFramehandle(), true);
      }
    })
  }

  public addSagaMultiboard() {
    this.add(this.sagaMultiboard);
    const mb = this.multiboards.get("Sagas");
    if (mb) {
      BlzFrameSetVisible(mb.getFramehandle(), true);
    }
    TimerStart(this.sagaTimer, 1, true, () => {
      this.sagaMultiboard.update();
    });
    MultiboardDisplay(this.sagaMultiboard.getMultiboard(), false);
    MultiboardDisplay(this.sagaMultiboard.getMultiboard(), true);
  }

  public add(multiboard: CustomMultiboard): this {
    this.multiboards.set(multiboard.getTitle(), multiboard);
    return this;
  }

  public addSaga(name: string, delay: number) {
    this.sagaMultiboard.addSaga(name, delay);    
  }

  public finishSaga(name: string) {
    this.sagaMultiboard.finishSaga(name);
  }
}