import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission03Data(pier19Pos: THREE.Vector3): MissionData {
  return {
    id: 'M03',
    title: 'THE HARBOR',
    category: 'ACT I // M03',
    rewards: {
      cash: 1200,
      description: '+$1200 • Cold Storage Locker Key • Pier 19 Warehouse Access'
    },
    objectives: [
      {
        id: 'drive_to_harbor',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Pier 19 in Old Harbor",
        targetPosition: new THREE.Vector3(pier19Pos.x, 0, pier19Pos.z + 20),
        targetDistance: 16.0,
        isCompleted: false
      },
      {
        id: 'vantage_point',
        type: ObjectiveType.INVESTIGATE,
        description: "Climb the container stack to stake out the dock crane",
        targetPosition: new THREE.Vector3(pier19Pos.x - 15, 0, pier19Pos.z + 15),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'observe_handoff',
        type: ObjectiveType.COLLECT,
        description: "Observe the covert handoff between the courier and the syndicate contact",
        targetPosition: new THREE.Vector3(pier19Pos.x - 15, 0, pier19Pos.z + 15),
        targetDistance: 5.0,
        isCompleted: false
      },
      {
        id: 'chase_courier',
        type: ObjectiveType.DRIVE_TO,
        description: "Pursue the courier vehicle speeding along the waterfront!",
        targetPosition: new THREE.Vector3(20, 0, -110),
        targetDistance: 15.0,
        isCompleted: false
      },
      {
        id: 'retrieve_key',
        type: ObjectiveType.INVESTIGATE,
        description: "Inspect the intercepted courier vehicle and retrieve the storage key",
        targetPosition: new THREE.Vector3(20, 0, -110),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'escape_harbor',
        type: ObjectiveType.ESCAPE,
        description: "Escape the harbor security perimeter",
        targetPosition: new THREE.Vector3(0, 0, 0),
        targetDistance: 20.0,
        isCompleted: false
      }
    ]
  };
}
