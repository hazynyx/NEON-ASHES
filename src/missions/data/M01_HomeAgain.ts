import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission01Data(lenaApartmentPos: THREE.Vector3): MissionData {
  return {
    id: 'M01',
    title: 'HOME AGAIN',
    category: 'PROLOGUE // M01',
    rewards: {
      cash: 500,
      description: '+$500 • Safehouse Unlocked • Pistol Ammo'
    },
    objectives: [
      {
        id: 'drive_to_apartment',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Lena's apartment in Eastline",
        targetPosition: new THREE.Vector3(lenaApartmentPos.x, 0, lenaApartmentPos.z + 18),
        targetDistance: 12.0,
        isCompleted: false
      },
      {
        id: 'talk_to_neighbor',
        type: ObjectiveType.TALK_TO,
        description: "Speak with Mrs. Gable outside the building",
        targetEntityId: 'mrs_gable',
        targetPosition: new THREE.Vector3(26, 0, -28),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'enter_apartment',
        type: ObjectiveType.ENTER,
        description: "Enter Lena's apartment (Unit 102)",
        targetPosition: new THREE.Vector3(lenaApartmentPos.x, 0, lenaApartmentPos.z + 16),
        targetDistance: 3.0,
        isCompleted: false
      },
      {
        id: 'search_room',
        type: ObjectiveType.INVESTIGATE,
        description: "Search the ransacked apartment for clues",
        targetPosition: new THREE.Vector3(lenaApartmentPos.x, 0, lenaApartmentPos.z + 14),
        targetDistance: 2.5,
        isCompleted: false
      },
      {
        id: 'inspect_photo',
        type: ObjectiveType.COLLECT,
        description: "Examine the hidden photograph",
        isCompleted: false
      }
    ]
  };
}
