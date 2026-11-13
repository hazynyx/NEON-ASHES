import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission07Data(
  adrianGaragePos: THREE.Vector3,
  jonahPos: THREE.Vector3,
  harborDepotPos: THREE.Vector3
): MissionData {
  return {
    id: 'M07',
    title: 'OLD FRIENDS',
    category: 'ACT I // M07',
    rewards: {
      cash: 2500,
      description: '+$2,500 Cash, Shotgun Ammo, Drake/Syndicate World State'
    },
    objectives: [
      {
        id: 'drive_to_garage',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Adrian's Auto Repair garage in Southside",
        targetPosition: adrianGaragePos.clone(),
        targetDistance: 15.0,
        isCompleted: false
      },
      {
        id: 'talk_to_jonah',
        type: ObjectiveType.TALK_TO,
        description: "Talk to Jonah Reyes outside the workshop",
        targetEntityId: 'jonah_reyes',
        targetPosition: jonahPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'resolve_debt_choice',
        type: ObjectiveType.INTERACT,
        description: "Resolve Jonah's debt with the Marrow Syndicate creditor",
        targetEntityId: 'jonah_reyes',
        targetPosition: jonahPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'eliminate_enforcers',
        type: ObjectiveType.ELIMINATE,
        description: "Neutralize Sal and the Marrow Syndicate enforcers",
        targetPosition: adrianGaragePos.clone(),
        targetDistance: 25.0,
        isCompleted: false
      },
      {
        id: 'retrieve_drake_package',
        type: ObjectiveType.COLLECT,
        description: "Retrieve Vincent Drake's contraband package from Harbor Depot cache",
        targetPosition: harborDepotPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'return_to_garage',
        type: ObjectiveType.DRIVE_TO,
        description: "Deliver the contraband package to Adrian's garage",
        targetPosition: adrianGaragePos.clone(),
        targetDistance: 15.0,
        isCompleted: false
      },
      {
        id: 'debrief_jonah',
        type: ObjectiveType.TALK_TO,
        description: "Debrief with Jonah inside the workshop",
        targetEntityId: 'jonah_reyes',
        targetPosition: jonahPos.clone(),
        targetDistance: 5.0,
        isCompleted: false
      }
    ]
  };
}
