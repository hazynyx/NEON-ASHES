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
  public isEvidenceOpen: boolean = false;
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

  // Wasted Screen
  private wastedScreenEl: HTMLElement;
  private wastedFeeEl: HTMLElement;
  private wastedProgressBarEl: HTMLElement;
  private wastedTimeout: any = null;

  // Minimap Canvas
  private minimapCanvas: HTMLCanvasElement;
  private minimapCtx: CanvasRenderingContext2D;
  private districtLabelEl: HTMLElement | null = null;

  // Narration & Voice
  private narrationBarEl: HTMLElement;
  private narrationSpeakerEl: HTMLElement;
  private narrationTextEl: HTMLElement;
  private voiceToggleBtn: HTMLElement;
  public onVoiceToggle: ((enabled: boolean) => void) | null = null;

  // Camera View Badge (GTA 5 Style [V])
  private cameraViewBadgeEl: HTMLElement;
  private viewBadgeTimeout: any = null;

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
    this.districtLabelEl = document.getElementById('minimap-district-label');

    this.crosshairEl = document.getElementById('crosshair')!;
    this.cameraViewBadgeEl = document.getElementById('camera-view-badge')!;

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

    this.wastedScreenEl = document.getElementById('wasted-screen')!;
    this.wastedFeeEl = document.getElementById('wasted-fee-amount')!;
    this.wastedProgressBarEl = document.getElementById('wasted-progress-bar')!;

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
      this.promptLabelEl.innerHTML = `<span id="prompt-desc">${interactionText}</span>`;
    } else {
      this.interactionPromptEl.classList.add('hidden');
    }

    // Update Minimap District Label
    if (this.districtLabelEl) {
      if (player.position.x > 250 && player.position.z < -250) {
        this.districtLabelEl.innerText = '128 EASTLINE // UNIT 102';
      } else if (player.position.z < -80) {
        this.districtLabelEl.innerText = 'OLD HARBOR';
      } else if (player.position.z > 30) {
        this.districtLabelEl.innerText = 'SOUTHSIDE';
      } else {
        this.districtLabelEl.innerText = 'EASTLINE';
      }
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

    // Clear with dark surface background
    ctx.fillStyle = '#101419';
    ctx.fillRect(0, 0, w, h);

    const playerPos = player.position;
    const heading = activeVehicle ? activeVehicle.heading : player.heading;

    ctx.save();
    // Translate to center and rotate opposite to player heading so radar is heading-up
    ctx.translate(center, center);
    ctx.rotate(heading);

    // If inside Lena's Apartment interior
    if (playerPos.x > 250 && playerPos.z < -250) {
      const aptZoom = 5.5; // High-detail room zoom
      const rx = (300 - 5 - playerPos.x) * aptZoom;
      const rz = (-300 - 4 - playerPos.z) * aptZoom;

      // Floor
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(rx, rz, 10 * aptZoom, 8 * aptZoom);

      // Walls
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.0;
      ctx.strokeRect(rx, rz, 10 * aptZoom, 8 * aptZoom);

      // Living Room Persian Rug
      const rugX = (300 - 2.1 - playerPos.x) * aptZoom;
      const rugZ = (-300 - 1.6 - playerPos.z) * aptZoom;
      ctx.fillStyle = '#831843';
      ctx.fillRect(rugX, rugZ, 4.2 * aptZoom, 3.2 * aptZoom);

      // Investigation Desk
      const dx = (297.2 - playerPos.x) * aptZoom;
      const dz = (-302.2 - playerPos.z) * aptZoom;
      ctx.fillStyle = '#451a03';
      ctx.fillRect(dx - 1.2 * aptZoom, dz - 0.65 * aptZoom, 2.4 * aptZoom, 1.3 * aptZoom);

      // Bed
      const bx = (303.4 - playerPos.x) * aptZoom;
      const bz = (-301.8 - playerPos.z) * aptZoom;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bx - 1.1 * aptZoom, bz - 0.8 * aptZoom, 2.2 * aptZoom, 1.6 * aptZoom);

      // Entrance Door
      const doorX = (300 - playerPos.x) * aptZoom;
      const doorZ = (-296 - playerPos.z) * aptZoom;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(doorX - 0.7 * aptZoom, doorZ);
      ctx.lineTo(doorX + 0.7 * aptZoom, doorZ);
      ctx.stroke();

      // GPS Guidance Line to Objective inside room
      const currentObj = missionMgr.getCurrentObjective();
      if (currentObj && currentObj.targetPosition) {
        const ox = (currentObj.targetPosition.x - playerPos.x) * aptZoom;
        const oz = (currentObj.targetPosition.z - playerPos.z) * aptZoom;

        ctx.strokeStyle = '#e58e26';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ox, oz);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e58e26';
        ctx.beginPath();
        ctx.arc(ox, oz, 5.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else {
      const zoom = 0.85; // Pixels per world meter

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

      // Draw Mission Objective Waypoint & GPS Route
      const currentObj = missionMgr.getCurrentObjective();
      if (currentObj && currentObj.targetPosition) {
        const ox = (currentObj.targetPosition.x - playerPos.x) * zoom;
        const oz = (currentObj.targetPosition.z - playerPos.z) * zoom;

        // Draw dashed GPS guidance line from player to waypoint
        ctx.strokeStyle = '#e58e26';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ox, oz);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw diamond waypoint
        ctx.fillStyle = '#e58e26'; // Amber mission icon
        ctx.beginPath();
        ctx.arc(ox, oz, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
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

  public showNotification(text: string): void {
    this.showNarration('DEV CONSOLE', text);
  }

  public hideNarration(): void {
    if (!this.narrationBarEl) return;
    this.narrationBarEl.classList.add('hidden');
  }

  public showViewModeBadge(text: string): void {
    if (!this.cameraViewBadgeEl) return;
    this.cameraViewBadgeEl.innerText = text;
    this.cameraViewBadgeEl.classList.remove('hidden');
    if (this.viewBadgeTimeout) {
      clearTimeout(this.viewBadgeTimeout);
    }
    this.viewBadgeTimeout = setTimeout(() => {
      this.cameraViewBadgeEl.classList.add('hidden');
    }, 1600);
  }

  // Evidence Modal
  public showEvidence(
    typeOrCb?: 'photo' | 'manifest' | 'meridian_zoning' | 'contractor_payoff' | 'black_ledger_wire' | string | (() => void),
    onContinue?: () => void
  ): void {
    let type: string = 'photo';
    let cb = onContinue;
    if (typeof typeOrCb === 'function') {
      cb = typeOrCb;
      type = 'photo';
    } else if (typeOrCb) {
      type = typeOrCb;
    }

    if (type === 'black_ledger_wire') {
      this.evidenceTitleEl.innerText = 'EVIDENCE COLLECTED: BLACK LEDGER WIRE TRANSFERS';
      this.evidenceCaptionEl.innerHTML = `
        <strong>Target:</strong> Vespera Municipal Trust Executive Terminal &bull; <strong>Total Traced:</strong> $4,200,000<br>
        <em>Encrypted wire transfer ledger tying municipal development accounts directly to offshore shell companies controlled by Councilman Vance Albright, Meridian Properties, and Vincent Drake's Marrow Syndicate.</em>
      `;
      this.renderBlackLedgerWireModal();
      this.continueMissionBtn.innerText = 'SECURE LEDGER & EVACUATE OFFICE';
    } else if (type === 'contractor_payoff') {
      this.evidenceTitleEl.innerText = 'EVIDENCE COLLECTED: REDEVELOPMENT BRIBE HANDOFF';
      this.evidenceCaptionEl.innerHTML = `
        <strong>Target:</strong> Dominic Alvarez &amp; Marrow Syndicate Operative &bull; <strong>Location:</strong> Eastline Construction Alley<br>
        <em>Dominic Alvarez receiving a heavy manila envelope from a Marrow Syndicate enforcer in front of a black utility truck. The document stamped on the envelope reads: 'APEX LAND HOLDINGS // EXPEDITE REMOVAL'.</em>
      `;
      this.renderContractorPayoffEvidence();
      this.continueMissionBtn.innerText = 'TAKE SURVEILLANCE PHOTO & CONTINUE';
    } else if (type === 'meridian_zoning') {
      this.evidenceTitleEl.innerText = 'EVIDENCE COLLECTED: MERIDIAN ZONING BUYOUT AGREEMENT';
      this.evidenceCaptionEl.innerHTML = `
        <strong>Document:</strong> Meridian Properties Redevelopment Acquisition Contract &bull; <strong>Signatory:</strong> Councilman Vance Albright<br>
        <em>Confidential municipal development agreement approving expedited eminent domain condemnation of Eastline residential blocks. Confirms direct transfer of condemned properties to Marrow Syndicate shell corporations with Albright's official seal.</em>
      `;
      this.renderMeridianZoningDocument();
      this.continueMissionBtn.innerText = 'SECURE PHOTOGRAPHS & DELIVER TO MARA';
    } else if (type === 'manifest') {
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

    this.isEvidenceOpen = true;
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

  private renderMeridianZoningDocument(): void {
    const ctx = this.photoCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;

    // Manila/Dark parchment archival document background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 8, w - 16, h - 16);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    // Official Municipal City Council Header
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px "Chakra Petch", monospace';
    ctx.fillText('VESPERA METROPOLITAN REDEVELOPMENT BOARD', 16, 30);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('FILE REF: VMB-1994-082 // CLASSIFICATION: CONFIDENTIAL', 16, 46);
    ctx.fillText('SUBJECT: EXPEDITED ACQUISITION & EMINENT DOMAIN ORDER', 16, 60);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 68);
    ctx.lineTo(384, 68);
    ctx.stroke();

    // Table header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 76, 368, 18);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('PARCEL ID       PREVIOUS OWNER         ACQUISITION TARGET', 20, 89);

    // Rows
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9.5px monospace';
    ctx.fillText('PARCEL 128-E    VOSS ESTATE (RESIDENTIAL)   MERIDIAN URBAN LLC', 20, 107);
    ctx.fillText('PARCEL 130-E    ADRIAN REPAIR SERVICES      MERIDIAN COMMERCIAL', 20, 122);
    ctx.fillText('PARCEL 134-E    HARBOR BASIN FREIGHT        MARROW LOGISTICS GRP', 20, 137);

    // Direct kickback line
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9.5px monospace';
    ctx.fillText('DISBURSAL: $450,000 ESCROW -> C/O COUNCILMAN V. ALBRIGHT', 16, 168);

    // Big red Condemned & Marrow Syndicate Stamp
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(180, 188, 205, 34);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('ORDER: CONDEMNED & EVICTED', 190, 204);
    ctx.font = 'bold 9px monospace';
    ctx.fillText('ENFORCER: MARROW SYNDICATE HQ', 190, 216);

    // Holographic municipal seal
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(42, 205, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 7.5px monospace';
    ctx.fillText('SEAL OF', 28, 202);
    ctx.fillText('VESPERA', 27, 212);
  }

  private renderContractorPayoffEvidence(): void {
    const ctx = this.photoCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;

    // Dark night sky & ambient industrial noir alley
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, w, h);

    // Weathered brick warehouse silhouettes in background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 30, 110, 150);
    ctx.fillRect(130, 15, 140, 165);
    ctx.fillRect(280, 45, 110, 135);

    // Construction scaffolding lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, 40); ctx.lineTo(115, 170);
    ctx.moveTo(115, 40); ctx.lineTo(15, 170);
    ctx.moveTo(15, 100); ctx.lineTo(115, 100);
    ctx.stroke();

    // Alley ground / asphalt
    ctx.fillStyle = '#181e26';
    ctx.fillRect(0, h * 0.68, w, h * 0.32);

    // Black utility truck silhouette in alley background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, 110, 120, 50);
    ctx.fillRect(100, 85, 55, 30);
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(65, 162, 14, 0, Math.PI * 2);
    ctx.arc(135, 162, 14, 0, Math.PI * 2);
    ctx.fill();

    // Alvarez (left silhouette) with construction hardhat & work vest
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(190, 115, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(180, 115, 20, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(190, 120, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(182, 128, 16, 32);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(182, 138, 16, 4);
    ctx.fillRect(182, 148, 16, 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(183, 160, 6, 28);
    ctx.fillRect(191, 160, 6, 28);

    // Syndicate Operative (right silhouette) with dark overcoat & sunglasses
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(245, 114, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(237, 122, 18, 42);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(239, 164, 6, 24);
    ctx.fillRect(247, 164, 6, 24);

    // Manila envelope handoff between the two figures
    ctx.fillStyle = '#d97706';
    ctx.fillRect(206, 134, 24, 15);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.strokeRect(206, 134, 24, 15);

    // Red Confidential Stamp overlay on envelope in closeup corner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(14, 175, 250, 75);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 175, 250, 75);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('APEX LAND HOLDINGS // EXPEDITE REMOVAL', 22, 194);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '9px monospace';
    ctx.fillText('PROJECT: EASTLINE REDEVELOPMENT PHASE II', 22, 210);
    ctx.fillText('RECIPIENT: D. ALVAREZ (HAZARD CONTRACTING)', 22, 224);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('DISBURSEMENT: $50,000 [CASH SETTLEMENT]', 22, 238);

    // Camera viewfinder telephoto reticle overlay
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    const bLen = 18;
    ctx.beginPath(); ctx.moveTo(25, 25 + bLen); ctx.lineTo(25, 25); ctx.lineTo(25 + bLen, 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 25 - bLen, 25); ctx.lineTo(w - 25, 25); ctx.lineTo(w - 25, 25 + bLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(25, h - 25 - bLen); ctx.lineTo(25, h - 25); ctx.lineTo(25 + bLen, h - 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - 25 - bLen, h - 25); ctx.lineTo(w - 25, h - 25); ctx.lineTo(w - 25, h - 25 - bLen); ctx.stroke();

    // Center crosshairs
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 12, h / 2); ctx.lineTo(w / 2 + 12, h / 2);
    ctx.moveTo(w / 2, h / 2 - 12); ctx.lineTo(w / 2, h / 2 + 12);
    ctx.stroke();

    // Camera Telephoto HUD info
    ctx.fillStyle = '#22c55e';
    ctx.font = '10px monospace';
    ctx.fillText('● REC [SURV-CAM 400mm]', 32, 40);
    ctx.fillText('ISO 3200  f/2.8  1/125s', w - 165, 40);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('GPS: 45.2°N, 100.8°W // 01:18 AM', w - 215, h - 14);
  }

  private renderBlackLedgerWireModal(): void {
    const ctx = this.photoCanvas.getContext('2d');
    if (!ctx) return;
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;

    // Dark charcoal obsidian background
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    // Subtle CRT scanlines
    ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Outer double emerald security border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Top Header Bar
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(14, 14, w - 28, 28);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('VESPERA MUNICIPAL TRUST // EXECUTIVE ARCHIVE', 22, 32);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '8.5px monospace';
    ctx.fillText('TERM: VMT-EXEC-014 | ROUTE: SWIFT-OFFSHORE (CAYMAN / LIECHTENSTEIN)', 22, 54);

    // Wire Transfer Table Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(18, 64, w - 36, 18);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 8.5px monospace';
    ctx.fillText('DATE', 24, 76);
    ctx.fillText('BENEFICIARY', 90, 76);
    ctx.fillText('ACCT NUMBER', 240, 76);
    ctx.fillText('AMOUNT (USD)', 320, 76);

    // Dividing rule
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(18, 83);
    ctx.lineTo(w - 18, 83);
    ctx.stroke();

    // Data Rows
    const rows = [
      { date: '2026-08-14', entity: 'APEX LAND HOLDINGS LLC', acct: '#883-9102-CY', amount: '$1,250,000', color: '#38bdf8' },
      { date: '2026-08-28', entity: 'MERIDIAN PROPERTIES CORP', acct: '#402-1823-SW', amount: '$1,500,000', color: '#cbd5e1' },
      { date: '2026-09-02', entity: 'V. ALBRIGHT BLIND TRUST', acct: '#091-7741-LI', amount: '$850,000', color: '#f59e0b' },
      { date: '2026-09-10', entity: 'MARROW SYNDICATE SPEC', acct: '#662-3904-PA', amount: '$600,000', color: '#f87171' }
    ];

    rows.forEach((r, idx) => {
      const y = 98 + idx * 20;
      if (idx % 2 === 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(18, y - 11, w - 36, 18);
      }
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8.5px monospace';
      ctx.fillText(r.date, 24, y);

      ctx.fillStyle = r.color;
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText(r.entity, 90, y);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '8.5px monospace';
      ctx.fillText(r.acct, 240, y);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(r.amount, 320, y);
    });

    // Summary Box
    ctx.fillStyle = 'rgba(6, 78, 59, 0.5)';
    ctx.fillRect(18, 180, w - 36, 32);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 180, w - 36, 32);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('TOTAL DISBURSED: $4,200,000 [FLAGGED: ILLICIT EMBEZZLEMENT]', 26, 195);
    ctx.fillStyle = '#34d399';
    ctx.font = '8px monospace';
    ctx.fillText('DIRECT TRANSFERS AUTHORIZED VIA MUNICIPAL INFRASTRUCTURE BOND FUND', 26, 206);

    // Subpoena Evidence / Confidential Stamped Badge
    ctx.save();
    ctx.translate(285, 222);
    ctx.rotate(-0.06);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -10, 100, 20);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('CONFIDENTIAL // SUBPOENA', -2, 3);
    ctx.restore();

    // Export complete status
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 8.5px monospace';
    ctx.fillText('[EXPORT COMPLETE // 256-BIT AES ENCRYPTED]', 24, 234);
  }

  public hideEvidence(): void {
    this.isEvidenceOpen = false;
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

  // Wasted Screen
  public showWasted(medicalFee: number, onRespawn: () => void): void {
    if (!this.wastedScreenEl) return;
    if (this.wastedFeeEl) {
      this.wastedFeeEl.innerText = `-$${medicalFee}`;
    }
    if (this.wastedProgressBarEl) {
      this.wastedProgressBarEl.style.width = '0%';
    }
    this.wastedScreenEl.classList.remove('hidden');

    // Trigger progress animation
    requestAnimationFrame(() => {
      if (this.wastedProgressBarEl) {
        this.wastedProgressBarEl.style.width = '100%';
      }
    });

    if (this.wastedTimeout) {
      clearTimeout(this.wastedTimeout);
    }

    this.wastedTimeout = setTimeout(() => {
      this.hideWasted();
      onRespawn();
    }, 3200);
  }

  public setWantedStars(count: number): void {
    this.wantedStars.forEach((star, idx) => {
      if (idx < count) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  public hideWasted(): void {
    if (!this.wastedScreenEl) return;
    this.wastedScreenEl.classList.add('hidden');
    if (this.wastedProgressBarEl) {
      this.wastedProgressBarEl.style.width = '0%';
    }
  }
}

function cameraIsAiming(player: Player): boolean {
  return (player as any).isAiming;
}
