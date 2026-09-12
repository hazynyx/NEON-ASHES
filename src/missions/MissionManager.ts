import * as THREE from 'three';
import { MissionData, MissionObjective } from './Mission.ts';
import { createMission01Data } from './data/M01_HomeAgain.ts';
import { Player } from '../player/Player.ts';
import { EventBus } from '../core/EventBus.ts';
import { AudioManager } from '../audio/AudioManager.ts';

export class MissionManager {
  public currentMission: MissionData | null = null;
  public currentObjectiveIndex: number = 0;
  public isMissionActive: boolean = false;
  public completedMissions: Set<string> = new Set();

  private eventBus: EventBus;
  private audio: AudioManager;

  constructor(audio: AudioManager, lenaApartmentPos: THREE.Vector3) {
    this.audio = audio;
    this.eventBus = EventBus.getInstance();

    // Start with Prologue Mission M01
    this.startMission(createMission01Data(lenaApartmentPos));
  }

  public startMission(mission: MissionData): void {
    this.currentMission = mission;
    this.currentObjectiveIndex = 0;
    this.isMissionActive = true;
    this.eventBus.emit('mission:start', { mission });
  }

  public getCurrentObjective(): MissionObjective | null {
    if (!this.currentMission || !this.isMissionActive) return null;
    return this.currentMission.objectives[this.currentObjectiveIndex] || null;
  }

  public advanceObjective(): void {
    if (!this.currentMission) return;
    const current = this.getCurrentObjective();
    if (current) {
      current.isCompleted = true;
      if (current.onComplete) current.onComplete();
    }

    this.currentObjectiveIndex++;
    if (this.currentObjectiveIndex >= this.currentMission.objectives.length) {
      this.completeMission();
    } else {
      const nextObj = this.getCurrentObjective();
      this.eventBus.emit('mission:objectiveUpdated', { objective: nextObj });
    }
  }

  public completeMission(): void {
    if (!this.currentMission) return;
    const mission = this.currentMission;
    this.isMissionActive = false;
    this.completedMissions.add(mission.id);

    this.audio.playMissionPassed();
    this.eventBus.emit('mission:complete', { mission });
  }

  public update(player: Player): void {
    if (!this.isMissionActive || !this.currentMission) return;
    const obj = this.getCurrentObjective();
    if (!obj) return;

    // Check automatic position proximity trigger
    if (obj.targetPosition && obj.targetDistance) {
      const dist = player.position.distanceTo(obj.targetPosition);
      if (dist <= obj.targetDistance) {
        // Automatically completes GO_TO or DRIVE_TO
        if (obj.type === 'GO_TO' || obj.type === 'DRIVE_TO') {
          this.advanceObjective();
        }
      }
    }
  }

  public getDistanceToObjective(playerPos: THREE.Vector3): number | null {
    const obj = this.getCurrentObjective();
    if (!obj || !obj.targetPosition) return null;
    return Math.round(playerPos.distanceTo(obj.targetPosition));
  }
}
