import * as THREE from 'three';
import { Player } from '../player/Player.ts';
import { Vehicle } from '../vehicles/Vehicle.ts';
import { MissionManager } from '../missions/MissionManager.ts';
import { World } from '../world/World.ts';
import { CityLighting } from '../rendering/Lighting.ts';

export class HUD {
  // DOM Elements
  private missionTrackerEl: HTMLElement;
  private missionBadgeEl: HTMLElement;
  private missionTitleEl: HTMLElement;
  private missionObjTextEl: HTMLElement;
  private missionDistanceEl: HTMLElement;
  private missionSubObjEl: HTMLElement;

  private healthBarFill: HTMLElement;
  private healthNum: HTMLElement;
  private staminaBarFill: HTMLElement;
  private staminaNum: HTMLElement;

  private playerCashEl: HTMLElement;
  private gameClockEl: HTMLElement;
  private wantedStars: HTMLElement[];

  private weaponDisplayEl: HTMLElement;
  private weaponNameEl: HTMLElement;
  private ammoClipEl: HTMLElement;
  private ammoReserveEl: HTMLElement;

  private vehicleSpeedoEl: HTMLElement;
  private vehicleModelEl: HTMLElement;
  private speedNumberEl: HTMLElement;
  private gearValEl: HTMLElement;

  private interactionPromptEl: HTMLElement;
  private promptKeyEl: HTMLElement;
  private promptLabelEl: HTMLElement;

  private crosshairEl: HTMLElement;

  // Dialogue Box Elements
  private dialogueBoxEl: HTMLElement;
  private dialogueSpeakerEl: HTMLElement;
  private dialogueContentEl: HTMLElement;
  private dialogueOptionsEl: HTMLElement;

  // Evidence Modal
  private evidenceModalEl: HTMLElement;
  private photoCanvas: HTMLCanvasElement;
  private continueMissionBtn: HTMLElement;
  private closeEvidenceBtn: HTMLElement;

  // Mission Passed Banner
  private missionResultBannerEl: HTMLElement;
  private resultContinueBtn: HTMLElement;

  // Controls Modal
  private controlsHelpEl: HTMLElement;
  private closeControlsBtn: HTMLElement;

  // Minimap Canvas
  private minimapCanvas: HTMLCanvasElement;
  private minimapCtx: CanvasRenderingContext2D;

  constructor() {
    this.missionTrackerEl = document.getElementById('mission-tracker')!;
    this.missionBadgeEl = document.getElementById('mission-badge')!;
    this.missionTitleEl = document.getElementById('mission-title')!;
    this.missionObjTextEl = document.getElementById('mission-objective-text')!;
    this.missionDistanceEl = document.getElementById('mission-distance')!;
    this.missionSubObjEl = document.getElementById('mission-sub-objective')!;

    this.healthBarFill = document.getElementById('health-bar-fill')!;
    this.healthNum = document.getElementById('health-num')!;
    this.staminaBarFill = document.getElementById('stamina-bar-fill')!;
    this.staminaNum = document.getElementById('stamina-num')!;

    this.playerCashEl = document.getElementById('player-cash')!;
    this.gameClockEl = document.getElementById('game-clock')!;
    this.wantedStars = Array.from(document.querySelectorAll('#wanted-stars .star'));

    this.weaponDisplayEl = document.getElementById('weapon-display')!;
    this.weaponNameEl = document.getElementById('weapon-name')!;
    this.ammoClipEl = document.getElementById('ammo-clip')!;
    this.ammoReserveEl = document.getElementById('ammo-reserve')!;

    this.vehicleSpeedoEl = document.getElementById('vehicle-speedo')!;
    this.vehicleModelEl = document.getElementById('vehicle-model')!;
    this.speedNumberEl = document.getElementById('speed-number')!;
    this.gearValEl = document.getElementById('gear-val')!;

    this.interactionPromptEl = document.getElementById('interaction-prompt')!;
    this.promptKeyEl = document.getElementById('prompt-key')!;
    this.promptLabelEl = document.getElementById('prompt-label')!;

    this.crosshairEl = document.getElementById('crosshair')!;

    this.dialogueBoxEl = document.getElementById('dialogue-box')!;
    this.dialogueSpeakerEl = document.getElementById('dialogue-speaker')!;
    this.dialogueContentEl = document.getElementById('dialogue-content')!;
    this.dialogueOptionsEl = document.getElementById('dialogue-options')!;

    this.evidenceModalEl = document.getElementById('evidence-modal')!;
    this.photoCanvas = document.getElementById('photo-canvas') as HTMLCanvasElement;
    this.continueMissionBtn = document.getElementById('continue-mission-btn')!;
    this.closeEvidenceBtn = document.getElementById('close-evidence-btn')!;

    this.missionResultBannerEl = document.getElementById('mission-result-banner')!;
    this.resultContinueBtn = document.getElementById('result-continue-btn')!;

    this.controlsHelpEl = document.getElementById('controls-help')!;
    this.closeControlsBtn = document.getElementById('close-controls-btn')!;

    this.minimapCanvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    this.minimapCtx = this.minimapCanvas.getContext('2d')!;

    this.setupListeners();
    this.renderHarborPhoto();
  }

  private setupListeners(): void {
    this.closeControlsBtn.addEventListener('click', () => {
      this.hideControls();
    });

    this.closeEvidenceBtn.addEventListener('click', () => {
      this.hideEvidence();
    });
  }

  public update(
    player: Player,
    activeVehicle: Vehicle | null,
    missionMgr: MissionManager,
    world: World,
    lighting: CityLighting,
    interactionText: string | null = null,
    interactionKey: string = 'E'
  ): void {
    // 1. Health & Stamina
    const hpPercent = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));
    this.healthBarFill.style.width = `${hpPercent}%`;
    this.healthNum.innerText = `${Math.round(player.health)}`;
    if (hpPercent < 25) {
      this.healthBarFill.classList.add('danger');
    } else {
      this.healthBarFill.classList.remove('danger');
    }

    const stamPercent = Math.max(0, Math.min(100, (player.stamina / player.maxStamina) * 100));
    this.staminaBarFill.style.width = `${stamPercent}%`;
    this.staminaNum.innerText = `${Math.round(player.stamina)}`;

    // 2. Cash & Clock
    this.playerCashEl.innerText = `${player.cash}`;
    this.gameClockEl.innerText = lighting.getTimeString();

    // 3. Weapon / Vehicle HUD
    if (activeVehicle) {
      this.vehicleSpeedoEl.classList.remove('hidden');
      this.weaponDisplayEl.classList.add('hidden');
      this.crosshairEl.classList.add('hidden');

      const mph = activeVehicle.getSpeedMPH();
      this.speedNumberEl.innerText = `${mph}`;
      this.vehicleModelEl.innerText = activeVehicle.config.name;

      let gear = 1;
      if (mph > 45) gear = 4;
      else if (mph > 28) gear = 3;
      else if (mph > 12) gear = 2;
      this.gearValEl.innerText = `${gear}`;
    } else {
      this.vehicleSpeedoEl.classList.add('hidden');
      this.weaponDisplayEl.classList.remove('hidden');

      this.ammoClipEl.innerText = `${player.ammoClip}`;
      this.ammoReserveEl.innerText = `${player.ammoReserve}`;

      // Crosshair when aiming
      if (cameraIsAiming(player)) {
        this.crosshairEl.classList.remove('hidden');
      } else {
        this.crosshairEl.classList.add('hidden');
      }
    }

    // 4. Mission Tracker
    if (missionMgr.isMissionActive && missionMgr.currentMission) {
      this.missionTrackerEl.classList.remove('hidden');
      this.missionBadgeEl.innerText = missionMgr.currentMission.category;
      this.missionTitleEl.innerText = missionMgr.currentMission.title;

      const obj = missionMgr.getCurrentObjective();
      if (obj) {
        this.missionObjTextEl.innerText = obj.description;
        const dist = missionMgr.getDistanceToObjective(player.position);
        if (dist !== null) {
          this.missionSubObjEl.classList.remove('hidden');
          this.missionDistanceEl.innerText = `${dist}m`;
        } else {
          this.missionSubObjEl.classList.add('hidden');
        }
      }
    } else {
      this.missionTrackerEl.classList.add('hidden');
    }

    // 5. Interaction Prompt
    if (interactionText) {
      this.interactionPromptEl.classList.remove('hidden');
      this.promptKeyEl.innerText = interactionKey;
      this.promptLabelEl.innerText = interactionText;
    } else {
      this.interactionPromptEl.classList.add('hidden');
    }

    // 6. Draw Minimap Radar
    this.renderMinimap(player, activeVehicle, missionMgr, world);
  }

  private renderMinimap(
    player: Player,
    activeVehicle: Vehicle | null,
    missionMgr: MissionManager,
    world: World
  ): void {
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const center = w / 2;
    const zoom = 0.85; // Pixels per world meter

    // Clear with dark surface background
    ctx.fillStyle = '#101419';
    ctx.fillRect(0, 0, w, h);

    const playerPos = player.position;
    const heading = activeVehicle ? activeVehicle.heading : player.heading;

    ctx.save();
    // Translate to center and rotate opposite to player heading so radar is heading-up
    ctx.translate(center, center);
    ctx.rotate(heading);

    // Draw Roads
    ctx.strokeStyle = '#2d3748';
    world.roads.forEach(road => {
      const x1 = (road.x1 - playerPos.x) * zoom;
      const z1 = (road.z1 - playerPos.z) * zoom;
      const x2 = (road.x2 - playerPos.x) * zoom;
      const z2 = (road.z2 - playerPos.z) * zoom;

      ctx.lineWidth = road.width * zoom;
      ctx.beginPath();
      ctx.moveTo(x1, z1);
      ctx.lineTo(x2, z2);
      ctx.stroke();
    });

    // Draw Buildings
    ctx.fillStyle = '#1c2430';
    world.buildingRects.forEach(b => {
      const bx = (b.x - b.w / 2 - playerPos.x) * zoom;
      const bz = (b.z - b.d / 2 - playerPos.z) * zoom;
      ctx.fillRect(bx, bz, b.w * zoom, b.d * zoom);
    });

    // Draw Mission Objective Waypoint
    const currentObj = missionMgr.getCurrentObjective();
    if (currentObj && currentObj.targetPosition) {
      const ox = (currentObj.targetPosition.x - playerPos.x) * zoom;
      const oz = (currentObj.targetPosition.z - playerPos.z) * zoom;

      // Draw diamond waypoint
      ctx.fillStyle = '#e58e26'; // Amber mission icon
      ctx.beginPath();
      ctx.arc(ox, oz, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();

    // Draw Center Player Blip (Arrow)
    ctx.fillStyle = '#38bdf8'; // Cyan player arrow
    ctx.beginPath();
    ctx.moveTo(center, center - 7);
    ctx.lineTo(center - 5, center + 6);
    ctx.lineTo(center, center + 3);
    ctx.lineTo(center + 5, center + 6);
    ctx.closePath();
    ctx.fill();

    // Border ring
    ctx.strokeStyle = '#30353a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, w, h);
  }

  // Draw harbor noir photo on canvas
  private renderHarborPhoto(): void {
    const ctx = this.photoCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;

    // Monochrome night scene
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Water & dock reflection
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, h * 0.65, w, h * 0.35);

    // Pier crane & containers
    ctx.fillStyle = '#334155';
    ctx.fillRect(30, 80, 70, 90);
    ctx.fillRect(120, 100, 80, 70);

    // Harbor crane truss
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(280, 170);
    ctx.lineTo(340, 40);
    ctx.lineTo(380, 170);
    ctx.stroke();

    // Silhouette of Lena Voss
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(170, 120, 6, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.fillRect(166, 126, 8, 26); // body

    // Silhouette of Contact in trench coat
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(205, 118, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(199, 125, 12, 30);

    // Photographic timestamp in corner
    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px monospace';
    ctx.fillText('09-09 23:41 PIER 19 [CAM-B]', 16, 26);
  }

  // Dialogue Methods
  public showDialogue(speaker: string, text: string): void {
    this.dialogueBoxEl.classList.remove('hidden');
    this.dialogueSpeakerEl.innerText = speaker;
    this.dialogueContentEl.innerText = text;
  }

  public hideDialogue(): void {
    this.dialogueBoxEl.classList.add('hidden');
  }

  // Evidence Modal
  public showEvidence(onContinue: () => void): void {
    this.evidenceModalEl.classList.remove('hidden');
    const handler = () => {
      this.hideEvidence();
      this.continueMissionBtn.removeEventListener('click', handler);
      onContinue();
    };
    this.continueMissionBtn.addEventListener('click', handler);
  }

  public hideEvidence(): void {
    this.evidenceModalEl.classList.add('hidden');
  }

  // Mission Passed Banner
  public showMissionPassed(missionTitle: string, rewardText: string, onContinue: () => void): void {
    const resultSub = document.getElementById('result-sub')!;
    const resultReward = document.getElementById('result-reward')!;
    resultSub.innerText = missionTitle;
    resultReward.innerText = rewardText;

    this.missionResultBannerEl.classList.remove('hidden');

    const handler = () => {
      this.missionResultBannerEl.classList.add('hidden');
      this.resultContinueBtn.removeEventListener('click', handler);
      onContinue();
    };
    this.resultContinueBtn.addEventListener('click', handler);
  }

  // Controls Modal
  public showControls(): void {
    this.controlsHelpEl.classList.remove('hidden');
  }

  public hideControls(): void {
    this.controlsHelpEl.classList.add('hidden');
  }

  public toggleControls(): void {
    this.controlsHelpEl.classList.toggle('hidden');
  }
}

function cameraIsAiming(player: Player): boolean {
  return (player as any).isAiming;
}
