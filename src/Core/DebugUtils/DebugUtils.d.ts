/** @noSelf **/
declare interface DebugUtilsInterface {
  beginFile(fileName: string, depth?: number, lastLine?: number): void;
  endFile(depth?: number): void;
}
declare const DebugUtils: DebugUtilsInterface;