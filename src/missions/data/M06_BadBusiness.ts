import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission06Data(
  redevPos: THREE.Vector3,
  meetingPos: THREE.Vector3,
  shellPos: THREE.Vector3
): MissionData {
  return {
    id: 'M06',
    title: 'BAD BUSINESS',
    category: 'ACT I // M06',
    rewards: {
      cash: 2000,
      description: '+$2000 • Surveillance Photos • Shell Company Identified • Pistol Ammo Reserve +30'
    },
    objectives: [
      {
        id: 'observe_redevelopment',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to the Eastline Redevelopment Zone overlook",
        targetPosition: redevPos.clone(),
        targetDistance: 8.0,
        isCompleted: false
      },
      {
        id: 'follow_contractor',
        type: ObjectiveType.INVESTIGATE,
        description: "Trail contractor Dominic Alvarez on foot through the construction yard",
        targetPosition: meetingPos.clone(),
        targetDistance: 5.0,
        isCompleted: false
      },
      {
        id: 'photograph_meeting',
        type: ObjectiveType.COLLECT,
        description: "Photograph the clandestine payoff between Alvarez and the Marrow Syndicate operative",
        targetPosition: meetingPos.clone(),
        targetDistance: 4.5,
        isCompleted: false
      },
      {
        id: 'follow_vehicle',
        type: ObjectiveType.DRIVE_TO,
        description: "Enter a vehicle and tail Alvarez's utility truck across town to the shell office",
        targetPosition: shellPos.clone(),
        targetDistance: 14.0,
        isCompleted: false
      },
      {
        id: 'identify_shell_company',
        type: ObjectiveType.INVESTIGATE,
        description: "Inspect the corporate suite directory to identify the shell company",
        targetPosition: shellPos.clone(),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'escape_surveillance',
        type: ObjectiveType.ESCAPE,
        description: "Leave the commercial block and evade Syndicate surveillance",
        targetPosition: shellPos.clone(),
        targetDistance: 70.0,
        isCompleted: false
      }
    ]
  };
}
