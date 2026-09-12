import * as THREE from 'three';
import { Player } from '../player/Player.ts';
import { MissionManager } from '../missions/MissionManager.ts';
import { CityLighting } from '../rendering/Lighting.ts';

export interface SaveData {
  version: number;
  timestamp: number;
  player: {
    x: number;
    y: number;
    z: number;
    health: number;
    cash: number;
    ammoClip: number;
    ammoReserve: number;
  };
  missions: {
    completed: string[];
    currentMissionId: string | null;
    currentObjectiveIndex: number;
  };
  world: {
    timeOfDay: number;
  };
}

export interface SaveSlotData extends SaveData {
  slotId: string;
  slotName: string;
  missionName: string;
}

export class SaveSystem {
  private static STORAGE_PREFIX = 'NEON_ASHES_SAVE_';

  public static saveGame(
    player: Player,
    missionMgr: MissionManager,
    lighting: CityLighting,
    slotId: string = 'autosave',
    slotName: string = 'Autosave'
  ): boolean {
    try {
      const activeMissionTitle = missionMgr.currentMission ? missionMgr.currentMission.title : 'Free Roam';
      const data: SaveSlotData = {
        version: 1,
        timestamp: Date.now(),
        slotId,
        slotName,
        missionName: activeMissionTitle,
        player: {
          x: Math.round(player.position.x * 10) / 10,
          y: Math.round(player.position.y * 10) / 10,
          z: Math.round(player.position.z * 10) / 10,
          health: player.health,
          cash: player.cash,
          ammoClip: player.ammoClip,
          ammoReserve: player.ammoReserve
        },
        missions: {
          completed: Array.from(missionMgr.completedMissions),
          currentMissionId: missionMgr.currentMission ? missionMgr.currentMission.id : null,
          currentObjectiveIndex: missionMgr.currentObjectiveIndex
        },
        world: {
          timeOfDay: lighting.timeOfDay
        }
      };

      localStorage.setItem(this.STORAGE_PREFIX + slotId, JSON.stringify(data));
      this.showSaveToast(slotName);
      return true;
    } catch (e) {
      console.error('Failed to save game data:', e);
      return false;
    }
  }

  public static loadGame(
    player: Player,
    missionMgr: MissionManager,
    lighting: CityLighting,
    slotId: string = 'autosave'
  ): boolean {
    try {
      const raw = localStorage.getItem(this.STORAGE_PREFIX + slotId);
      if (!raw) return false;

      const data: SaveSlotData = JSON.parse(raw);
      if (!data || !data.player) return false;

      player.position.set(data.player.x, data.player.y, data.player.z);
      player.mesh.position.copy(player.position);
      player.health = data.player.health;
      player.cash = data.player.cash;
      player.ammoClip = data.player.ammoClip;
      player.ammoReserve = data.player.ammoReserve;

      if (data.missions && data.missions.completed) {
        missionMgr.completedMissions = new Set(data.missions.completed);
        missionMgr.currentObjectiveIndex = data.missions.currentObjectiveIndex || 0;
      }

      if (data.world && typeof data.world.timeOfDay === 'number') {
        lighting.timeOfDay = data.world.timeOfDay;
      }

      this.showNotification('GAME LOADED', `${data.slotName} restored successfully`);
      return true;
    } catch (e) {
      console.error('Failed to load game data:', e);
      return false;
    }
  }

  public static getSlotData(slotId: string): SaveSlotData | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_PREFIX + slotId);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static hasSave(slotId: string = 'autosave'): boolean {
    return !!localStorage.getItem(this.STORAGE_PREFIX + slotId);
  }

  public static getAllSlots(): Record<string, SaveSlotData | null> {
    return {
      autosave: this.getSlotData('autosave'),
      slot1: this.getSlotData('slot1'),
      slot2: this.getSlotData('slot2'),
      slot3: this.getSlotData('slot3')
    };
  }

  private static showSaveToast(slotName: string): void {
    this.showNotification('GAME SAVED', `${slotName} checkpoint stored`);
  }

  private static showNotification(title: string, body: string): void {
    const toast = document.getElementById('notification-banner');
    const titleEl = document.getElementById('notif-title');
    const bodyEl = document.getElementById('notif-body');
    if (toast && titleEl && bodyEl) {
      titleEl.innerText = title;
      bodyEl.innerText = body;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2500);
    }
  }
}
