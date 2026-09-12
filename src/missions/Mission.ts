import * as THREE from 'three';

export enum ObjectiveType {
  GO_TO = 'GO_TO',
  DRIVE_TO = 'DRIVE_TO',
  TALK_TO = 'TALK_TO',
  ENTER = 'ENTER',
  INVESTIGATE = 'INVESTIGATE',
  COLLECT = 'COLLECT',
  ELIMINATE = 'ELIMINATE',
  ESCAPE = 'ESCAPE'
}

export interface MissionObjective {
  id: string;
  type: ObjectiveType;
  description: string;
  targetPosition?: THREE.Vector3;
  targetDistance?: number;
  targetEntityId?: string;
  isCompleted: boolean;
  onComplete?: () => void;
}

export interface MissionData {
  id: string;
  title: string;
  category: string;
  objectives: MissionObjective[];
  rewards: {
    cash: number;
    description: string;
  };
}
