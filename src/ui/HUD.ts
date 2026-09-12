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
  private evidenceTitleEl: HTMLElement;
  private evidenceCaptionEl: HTMLElement;
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

  // Narration & Voice
  private narrationBarEl: HTMLElement;
  private narrationSpeakerEl: HTMLElement;
  private narrationTextEl: HTMLElement;
  private voiceToggleBtn: HTMLElement;
  public onVoiceToggle: ((enabled: boolean) => void) | null = null;

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
    this.evidenceTitleEl = document.querySelector('.evidence-title')!;
    this.evidenceCaptionEl = document.querySelector('.evidence-caption')!;
    this.photoCanvas = document.getElementById('photo-canvas') as HTMLCanvasElement;
    this.continueMissionBtn = document.getElementById('continue-mission-btn')!;
    this.closeEvidenceBtn = document.getElementById('close-evidence-btn')!;

    this.missionResultBannerEl = document.getElementById('mission-result-banner')!;
    this.resultContinueBtn = document.getElementById('result-continue-btn')!;

    this.controlsHelpEl = document.getElementById('controls-help')!;
    this.closeControlsBtn = document.getElementById('close-controls-btn')!;

    this.minimapCanvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    this.minimapCtx = this.minimapCanvas.getContext('2d')!;

    this.narrationBarEl = document.getElementById('narration-bar')!;
    this.narrationSpeakerEl = document.getElementById('narration-speaker')!;
    this.narrationTextEl = document.getElementById('narration-text')!;
    this.voiceToggleBtn = document.getElementById('voice-toggle-btn')!;

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

    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.addEventListener('click', () => {
        const isMuted = this.voiceToggleBtn.classList.toggle('muted');
        const enabled = !isMuted;
        this.voiceToggleBtn.innerText = enabled ? 'VOICE: ON' : 'VOICE: OFF';
        if (this.onVoiceToggle) {
          this.onVoiceToggle(enabled);
        }
      });
    }
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

      this.weaponNameEl.innerText = player.currentWeaponName;
      if (player.currentWeapon === 'unarmed') {
        this.ammoClipEl.innerText = '--';
        this.ammoReserveEl.innerText = '--';
      } else {
        this.ammoClipEl.innerText = `${player.activeClip}`;
        this.ammoReserveEl.innerText = `${player.activeReserve}`;
      }

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

  // Narration Methods
  public showNarration(speaker: string, text: string): void {
    if (!this.narrationBarEl) return;
    this.narrationBarEl.classList.remove('hidden');
    this.narrationSpeakerEl.innerText = speaker;
    this.narrationTextEl.innerText = `"${text}"`;
  }

  public hideNarration(): void {
    if (!this.narrationBarEl) return;
    this.narrationBarEl.classList.add('hidden');
  }

  // Evidence Modal
  public showEvidence(
    typeOrCb?: 'photo' | 'manifest' | (() => void),
    onContinue?: () => void
  ): void {
    let type: 'photo' | 'manifest' = 'photo';
    let cb = onContinue;
    if (typeof typeOrCb === 'function') {
      cb = typeOrCb;
      type = 'photo';
    } else if (typeOrCb) {
      type = typeOrCb;
    }

    if (type === 'manifest') {
      this.evidenceTitleEl.innerText = 'EVIDENCE COLLECTED: MERIDIAN SHIPPING MANIFEST';
      this.evidenceCaptionEl.innerHTML = `
        <strong>Document:</strong> Meridian Logistics Pier 19 Bill of Lading &bull; <strong>Consignee:</strong> Marrow Syndicate<br>
        <em>Encrypted shipment manifest confirms multiple consignments of tactical hardware and encrypted server storage racks authorized directly by Councilman Vance Albright. Storage Locker 4B contains the primary encryption key drive.</em>
      `;
      this.renderManifestDocument();
      this.continueMissionBtn.innerText = 'SECURE MANIFEST & PROCEED';
    } else {
      this.evidenceTitleEl.innerText = 'EVIDENCE COLLECTED: HARBOR PHOTOGRAPH';
      this.evidenceCaptionEl.innerHTML = `
        <strong>Location:</strong> Pier 19, Old Harbor &bull; <strong>Date:</strong> 3 Nights Ago<br>
        <em>The photograph shows Lena Voss speaking to an unidentified man in a dark trench coat next to a black freighter container. On the back, handwritten in Lena's script: "Jonah warned me. Check Adrian's safe."</em>
      `;
      this.renderHarborPhoto();
      this.continueMissionBtn.innerText = 'TAKE PHOTOGRAPH & CONTINUE';
    }

    this.evidenceModalEl.classList.remove('hidden');
    const handler = () => {
      this.hideEvidence();
      this.continueMissionBtn.removeEventListener('click', handler);
      if (cb) cb();
    };
    this.continueMissionBtn.addEventListener('click', handler);
  }

  private renderManifestDocument(): void {
    const ctx = this.photoCanvas.getContext('2d');
    if (!ctx) return;

    // Dark slate corporate paper background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 260);

    // Border and header banner
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 384, 244);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(8, 8, 384, 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('MERIDIAN LOGISTICS // PORT OF VESPERA', 16, 27);

    // Document Details
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9.5px monospace';
    ctx.fillText('BILL OF LADING: #ML-7729-CS    DATE: 2026-09-08', 16, 54);
    ctx.fillText('FACILITY: PIER 19 COLD STORAGE (BAY 4)', 16, 68);
    ctx.fillText('SHIPPER: MERIDIAN DEVELOPMENT CORP [OFFSHORE]', 16, 82);
    ctx.fillText('CONSIGNEE: MARROW SYNDICATE SPECIAL ACCOUNTS', 16, 96);

    // Table Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 108, 368, 18);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('ITEM / CODE              QTY   STATUS', 20, 121);

    // Items
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('REFRIG. MIL-SPEC DRIVES   04   SECURED (LOCKER 4B)', 20, 139);
    ctx.fillStyle = '#f87171';
    ctx.fillText('TACTICAL HARDWARE KITS    12   TRANSFERRED', 20, 153);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('MERIDIAN LEASE LEDGER     01   ENCRYPTED', 20, 167);

    // Councilman Signature Stamp
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9.5px monospace';
    ctx.fillText('AUTHORIZATION: V. ALBRIGHT (COUNCIL DISTRICT 4)', 16, 196);

    // Confidential Red Stamp
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(210, 204, 172, 28);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('RESTRICTED // MARROW SYNDICATE', 216, 222);
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
