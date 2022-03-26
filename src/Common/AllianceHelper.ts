export module AllianceHelper {
  export function setAllianceTwoWay(
    source: player,
    target: player,
    allianceTypeBJ: number,
  ) {
    SetPlayerAllianceStateBJ(
      source, 
      target, 
      allianceTypeBJ,
    );
    SetPlayerAllianceStateBJ(
      target, 
      source, 
      allianceTypeBJ,
    );
  }
}