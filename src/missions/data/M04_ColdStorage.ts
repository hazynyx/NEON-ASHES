import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission04Data(
  warehouseEntrancePos: THREE.Vector3,
  warehouseDeskPos: THREE.Vector3,
  warehouseLockerPos: THREE.Vector3
): MissionData {
  return {
    id: 'M04',
    title: 'COLD STORAGE',
    category: 'ACT I // M04',
    rewards: {
      cash: 1500,
      description: '+$1500 • Encrypted Military Drive • Shotgun Shells • Act I Finale Complete'
    },
    objectives: [
      {
        id: 'goto_warehouse',
        type: ObjectiveType.DRIVE_TO,
        description: "Go to the Pier 19 Warehouse 19 security entrance",
        targetPosition: warehouseEntrancePos.clone(),
        targetDistance: 5.5,
        isCompleted: false
      },
      {
        id: 'unlock_gate',
        type: ObjectiveType.INVESTIGATE,
        description: "Unlock the cold storage roll-up gate using the Pier 19 keycard",
        targetPosition: warehouseEntrancePos.clone(),
        targetDistance: 4.5,
        isCompleted: false
      },
      {
        id: 'search_manifest',
        type: ObjectiveType.COLLECT,
        description: "Search the office terminal for Meridian shipping manifests",
        targetPosition: warehouseDeskPos.clone(),
        targetDistance: 3.8,
        isCompleted: false
      },
      {
        id: 'retrieve_drive',
        type: ObjectiveType.COLLECT,
        description: "Extract the encrypted military drive from Cold Storage Locker 4B",
        targetPosition: warehouseLockerPos.clone(),
        targetDistance: 3.8,
        isCompleted: false
      },
      {
        id: 'eliminate_guards',
        type: ObjectiveType.ELIMINATE,
        description: "Syndicate hit squad arrived! Eliminate the armed warehouse guards!",
        targetPosition: new THREE.Vector3(85, 0, -162),
        targetDistance: 25.0,
        isCompleted: false
      },
      {
        id: 'escape_perimeter',
        type: ObjectiveType.ESCAPE,
        description: "Escape the Pier 19 harbor perimeter with the evidence",
        targetPosition: new THREE.Vector3(50, 0, -80),
        targetDistance: 25.0,
        isCompleted: false
      }
    ]
  };
}
