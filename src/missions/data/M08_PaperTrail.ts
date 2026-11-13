import * as THREE from 'three';
import { MissionData, ObjectiveType } from '../Mission.ts';

export function createMission08Data(
  dinerPos: THREE.Vector3,
  officePos: THREE.Vector3,
  archivePos: THREE.Vector3,
  terminalPos: THREE.Vector3
): MissionData {
  return {
    id: 'M08',
    title: 'PAPER TRAIL',
    category: 'ACT II // M08',
    rewards: {
      cash: 3000,
      description: '+$3000 • Financial Ledger Decrypted • Black Ledger Network Revealed • Assault Rifle Reserve Ammo +60'
    },
    objectives: [
      {
        id: 'meet_mara',
        type: ObjectiveType.TALK_TO,
        description: "Meet Mara Vale at Southside Diner patio to review financial filings",
        targetPosition: dinerPos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'drive_to_finance_office',
        type: ObjectiveType.DRIVE_TO,
        description: "Drive to Vespera Municipal Trust office in Central Vesper",
        targetPosition: officePos.clone(),
        targetDistance: 8.0,
        isCompleted: false
      },
      {
        id: 'infiltrate_office',
        type: ObjectiveType.ENTER,
        description: "Infiltrate the executive office suite through the side service entrance",
        targetPosition: officePos.clone(),
        targetDistance: 4.0,
        isCompleted: false
      },
      {
        id: 'inspect_documents',
        type: ObjectiveType.INVESTIGATE,
        description: "Search the archive filing cabinets and cross-reference shell companies",
        targetPosition: archivePos.clone(),
        targetDistance: 3.5,
        isCompleted: false
      },
      {
        id: 'obtain_records',
        type: ObjectiveType.COLLECT,
        description: "Download the full wire transfer ledger from the executive terminal",
        targetPosition: terminalPos.clone(),
        targetDistance: 3.2,
        isCompleted: false
      },
      {
        id: 'escape_perimeter',
        type: ObjectiveType.ESCAPE,
        description: "Evade arriving Vespera Security patrols and escape the financial district",
        targetPosition: officePos.clone(),
        targetDistance: 75.0,
        isCompleted: false
      }
    ]
  };
}
