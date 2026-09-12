import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission05Data(
  southsideDinerPos: THREE.Vector3,
  meridianOfficePos: THREE.Vector3,
  meridianDeskPos: THREE.Vector3
): MissionData {
  return {
    id: 'M05',
    title: 'THE JOURNALIST',
    category: 'ACT II // M05',
    rewards: {
      cash: 1800,
      description: '+$1800 • Mara Vale Contact • Lena Audio Journal Decrypted • Shotgun Ammo'
    },
    objectives: [
      {
        id: 'goto_diner',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Southside Diner to meet investigative journalist Mara Vale",
        targetPosition: southsideDinerPos.clone(),
        targetDistance: 5.5,
        isCompleted: false
      },
      {
        id: 'talk_mara',
        type: ObjectiveType.TALK_TO,
        description: "Speak with Mara Vale on the diner patio",
        targetPosition: southsideDinerPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'goto_meridian',
        type: ObjectiveType.DRIVE_TO,
        description: "Travel to the Meridian Properties redevelopment office in Central Vesper",
        targetPosition: meridianOfficePos.clone(),
        targetDistance: 7.0,
        isCompleted: false
      },
      {
        id: 'infiltrate_office',
        type: ObjectiveType.INVESTIGATE,
        description: "Infiltrate the ground floor office and access the archive desk",
        targetPosition: meridianDeskPos.clone(),
        targetDistance: 4.2,
        isCompleted: false
      },
      {
        id: 'photograph_evidence',
        type: ObjectiveType.COLLECT,
        description: "Photograph confidential buyout agreements linking Albright to Syndicate evictions",
        targetPosition: meridianDeskPos.clone(),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'return_to_mara',
        type: ObjectiveType.DRIVE_TO,
        description: "Return to Southside Diner and deliver the photographs to Mara Vale",
        targetPosition: southsideDinerPos.clone(),
        targetDistance: 6.0,
        isCompleted: false
      },
      {
        id: 'debrief_mara',
        type: ObjectiveType.TALK_TO,
        description: "Debrief with Mara Vale to decode Lena's encrypted audio journal",
        targetPosition: southsideDinerPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      }
    ]
  };
}
