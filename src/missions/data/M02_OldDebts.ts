import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission02Data(adrianGaragePos: THREE.Vector3): MissionData {
  return {
    id: 'M02',
    title: 'OLD DEBTS',
    category: 'ACT I // M02',
    rewards: {
      cash: 800,
      description: '+$800 • Shotgun Unlocked • Ammo Reserve +50 • Harbor Lead Unlocked'
    },
    objectives: [
      {
        id: 'drive_to_garage',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Adrian's Auto Repair garage in Southside",
        targetPosition: new THREE.Vector3(adrianGaragePos.x, 0, adrianGaragePos.z + 16),
        targetDistance: 14.0,
        isCompleted: false
      },
      {
        id: 'talk_to_jonah',
        type: ObjectiveType.TALK_TO,
        description: "Talk to Jonah Reyes outside the garage",
        targetEntityId: 'jonah_reyes',
        targetPosition: new THREE.Vector3(adrianGaragePos.x + 2, 0, adrianGaragePos.z + 15),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'enter_garage',
        type: ObjectiveType.ENTER,
        description: "Open Adrian's workshop shutter and enter",
        targetPosition: new THREE.Vector3(adrianGaragePos.x, 0, adrianGaragePos.z + 14),
        targetDistance: 3.0,
        isCompleted: false
      },
      {
        id: 'crack_safe',
        type: ObjectiveType.INVESTIGATE,
        description: "Search the workbench and inspect Adrian's wall safe",
        targetPosition: new THREE.Vector3(adrianGaragePos.x - 4, 0, adrianGaragePos.z + 4),
        targetDistance: 2.5,
        isCompleted: false
      },
      {
        id: 'eliminate_syndicate',
        type: ObjectiveType.COLLECT, // Used as combat combat objective
        description: "Neutralize the Marrow Syndicate enforcers!",
        isCompleted: false
      },
      {
        id: 'escape_area',
        type: ObjectiveType.ESCAPE,
        description: "Escape the industrial block in your vehicle",
        targetPosition: new THREE.Vector3(0, 0, 0),
        targetDistance: 18.0,
        isCompleted: false
      }
    ]
  };
}
