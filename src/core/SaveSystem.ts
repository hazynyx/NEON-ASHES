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
    heading?: number;
    health: number;
    cash: number;
    ammoClip: number;
    ammoReserve: number;
    hasShotgun?: boolean;
    shotgunClip?: number;
    shotgunReserve?: number;
    currentWeapon?: string;
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
      const activeMission =
        missionMgr.isMissionActive && missionMgr.currentMission ? missionMgr.currentMission : null;
      const activeMissionTitle = activeMission ? activeMission.title : 'Free Roam';
      const data: SaveSlotData = {
        version: 2,
        timestamp: Date.now(),
        slotId,
        slotName,
        missionName: activeMissionTitle,
        player: {
          x: Math.round(player.position.x * 10) / 10,
          y: Math.round(player.position.y * 10) / 10,
          z: Math.round(player.position.z * 10) / 10,
          heading: player.heading,
          health: player.health,
          cash: player.cash,
          ammoClip: player.ammoClip,
          ammoReserve: player.ammoReserve,
          hasShotgun: player.hasShotgun,
          shotgunClip: player.shotgunClip,
          shotgunReserve: player.shotgunReserve,
          currentWeapon: player.currentWeapon
        },
        missions: {
          completed: Array.from(missionMgr.completedMissions),
          // A completed/failed mission is no longer active and must not be
          // resurrected as an in-progress mission when this slot is loaded.
          currentMissionId: activeMission ? activeMission.id : null,
          currentObjectiveIndex: activeMission ? missionMgr.currentObjectiveIndex : 0
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
      player.health = Math.max(1, Math.min(player.maxHealth, data.player.health));
      player.cash = data.player.cash;
      player.ammoClip = data.player.ammoClip;
      player.ammoReserve = data.player.ammoReserve;

      if (data.player.hasShotgun !== undefined) {
        player.hasShotgun = data.player.hasShotgun;
      }
      if (data.player.shotgunClip !== undefined) {
        player.shotgunClip = data.player.shotgunClip;
      }
      if (data.player.shotgunReserve !== undefined) {
        player.shotgunReserve = data.player.shotgunReserve;
      }
      if (
        data.player.currentWeapon === 'pistol' ||
        data.player.currentWeapon === 'shotgun' ||
        data.player.currentWeapon === 'unarmed'
      ) {
        player.currentWeapon = data.player.currentWeapon;
      }
      if (player.currentWeapon === 'shotgun' && !player.hasShotgun) {
        player.currentWeapon = 'pistol';
      }
      if (typeof data.player.heading === 'number') {
        player.heading = data.player.heading;
        player.mesh.rotation.set(0, player.heading, 0);
      }

      // Loading from the pause menu while dead or seated must always return a
      // controllable on-foot character.
      player.isDead = false;
      player.isInVehicle = false;
      player.velocity.set(0, 0, 0);
      player.mesh.visible = true;
      player.resetCombatState();

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
