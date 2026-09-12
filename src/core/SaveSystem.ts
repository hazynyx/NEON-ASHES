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

export class SaveSystem {
  private static STORAGE_KEY = 'NEON_ASHES_SAVE_DATA';

  public static saveGame(player: Player, missionMgr: MissionManager, lighting: CityLighting): boolean {
    try {
      const data: SaveData = {
        version: 1,
        timestamp: Date.now(),
        player: {
          x: player.position.x,
          y: player.position.y,
          z: player.position.z,
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

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.showSaveToast();
      return true;
    } catch (e) {
      console.error('Failed to save game data:', e);
      return false;
    }
  }

  public static loadGame(player: Player, missionMgr: MissionManager, lighting: CityLighting): boolean {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return false;

      const data: SaveData = JSON.parse(raw);
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

      return true;
    } catch (e) {
      console.error('Failed to load game data:', e);
      return false;
    }
  }

  public static hasSave(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  private static showSaveToast(): void {
    const toast = document.getElementById('notification-banner');
    if (toast) {
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 2500);
    }
  }
}
