/** @noSelf **/
declare interface HeroSelectorInterface {
    BanButtonText: string;

    unitCreated(player: player, unitCode: number, isRandom: boolean): void;
    buttonSelected(player: player, unitCode: number): void;
    unitBaned(player: player, unitCode: number): void;
    repick(unit: unit, player?: player): void;
    autoDetectCategory(unitCode: number): void;
    initHeroes(): void;

    addUnit(unitCode?: any, onlyRandom?: boolean, requirement?: any): void;
    setUnitReq(unitCode: any, who: any): void;
    setUnitCategory(unitCode: any, category: number): void;
    addUnitCategory(unitCode: any, category: number): void;
    addCategory(icon: string, text: string): void;

    clearUnitData(): void;
    
    show(flag: boolean, who?: any): void;

    setFrameText(frame: framehandle, text: string, who?: any): void;
    setTitleText(text: string, who?: any): void;
    setBanButtonText(text: string, who?: any): void;
    setAcceptButtonText(text: string, who?: any): void;

    enablePick(flag: boolean, who?: any): void;
    enableBan(flag: boolean, who?: any): void;

    forceRandom(who?: any): void;
    forcePick(who?: any): void;

    buttonRequirementDone(unitCode: any, player: player): boolean;

    deselectButtons(buttonIndex?: any): void;
    update(): void;
    destroy(): void;

    getDisabledIcon(icon: string): string;

    showFrame(frame: framehandle, flag: boolean, who?: any): void;

    includesPlayer(who: any, player: player): void;

    counterChangeUnitCode(unitCode: any, add: number, player: player): void;
    counterSetUnitCode(unitCode: any, set: number, player: player): void;

    
}
declare const HeroSelector: HeroSelectorInterface;