import * as THREE from 'three';
import { Player } from '../player/Player.ts';
import { MissionManager } from '../missions/MissionManager.ts';
import { EngineRenderer } from '../rendering/Renderer.ts';
import { ThirdPersonCamera } from '../rendering/Camera.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { NarrationManager } from '../audio/NarrationManager.ts';
import { SaveSystem } from '../core/SaveSystem.ts';
import { CityLighting } from '../rendering/Lighting.ts';
import { Vehicle } from '../vehicles/Vehicle.ts';

export class PauseMenu {
  private overlayEl: HTMLElement;
  private activeTab: string = 'map';
  private isOpenState: boolean = false;

  // Dependencies
  private player: Player;
  private missionMgr: MissionManager;
  private renderer: EngineRenderer;
  private camera: ThirdPersonCamera;
  private audio: AudioManager;
  private narration: NarrationManager;
  private lighting: CityLighting;
  private getVehicle: () => Vehicle | null;
  private getFog: () => THREE.FogExp2 | null;
  private onResumeCallback: () => void;

  // DOM tab buttons and containers
  private tabButtons: NodeListOf<HTMLButtonElement>;
  private tabContents: NodeListOf<HTMLElement>;
  private mapCanvas: HTMLCanvasElement;
  private mapCtx: CanvasRenderingContext2D;

  // Settings state
  public exposureVal: number = 1.45;
  public shadowsEnabled: boolean = true;
  public resolutionScale: number = 1.0;
  public fogDensityVal: number = 0.0022;
  public masterVolumeVal: number = 0.6;
  public voiceEnabledVal: boolean = true;
  public mouseSensVal: number = 1.0;
  public invertYVal: boolean = false;

  constructor(
    player: Player,
    missionMgr: MissionManager,
    renderer: EngineRenderer,
    camera: ThirdPersonCamera,
    audio: AudioManager,
    narration: NarrationManager,
    lighting: CityLighting,
    getVehicle: () => Vehicle | null,
    getFog: () => THREE.FogExp2 | null,
    onResume: () => void
  ) {
    this.player = player;
    this.missionMgr = missionMgr;
    this.renderer = renderer;
    this.camera = camera;
    this.audio = audio;
    this.narration = narration;
    this.lighting = lighting;
    this.getVehicle = getVehicle;
    this.getFog = getFog;
    this.onResumeCallback = onResume;

    this.overlayEl = document.getElementById('pause-menu')!;
    this.tabButtons = document.querySelectorAll('.pause-tab');
    this.tabContents = document.querySelectorAll('.pause-tab-content');
    this.mapCanvas = document.getElementById('world-map-canvas') as HTMLCanvasElement;
    this.mapCtx = this.mapCanvas.getContext('2d')!;

    this.initEventListeners();
  }

  private initEventListeners(): void {
    // Tab switching
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    // Resume button
    const resumeBtn = document.getElementById('pause-resume-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    // Top status menu button
    const menuBtn = document.getElementById('pause-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.open('map');
      });
    }

    // --- Graphics Settings Controls ---
    const exposureSlider = document.getElementById('setting-exposure') as HTMLInputElement;
    const exposureLabel = document.getElementById('exposure-val-label');
    if (exposureSlider && exposureLabel) {
      exposureSlider.addEventListener('input', () => {
        this.exposureVal = parseFloat(exposureSlider.value);
        exposureLabel.innerText = this.exposureVal.toFixed(2) + 'x';
        this.renderer.setExposure(this.exposureVal);
      });
    }

    const shadowsToggle = document.getElementById('setting-shadows') as HTMLInputElement;
    if (shadowsToggle) {
      shadowsToggle.addEventListener('change', () => {
        this.shadowsEnabled = shadowsToggle.checked;
        this.renderer.setShadows(this.shadowsEnabled);
      });
    }

    const resSelect = document.getElementById('setting-resolution') as HTMLSelectElement;
    if (resSelect) {
      resSelect.addEventListener('change', () => {
        this.resolutionScale = parseFloat(resSelect.value);
        this.renderer.setResolutionScale(this.resolutionScale);
      });
    }

    const fogSlider = document.getElementById('setting-fog') as HTMLInputElement;
    const fogLabel = document.getElementById('fog-val-label');
    if (fogSlider && fogLabel) {
      fogSlider.addEventListener('input', () => {
        this.fogDensityVal = parseFloat(fogSlider.value);
        fogLabel.innerText = this.fogDensityVal.toFixed(4);
        const fog = this.getFog();
        if (fog) fog.density = this.fogDensityVal;
      });
    }

    // --- Game & Audio Settings Controls ---
    const volumeSlider = document.getElementById('setting-volume') as HTMLInputElement;
    const volumeLabel = document.getElementById('volume-val-label');
    if (volumeSlider && volumeLabel) {
      volumeSlider.addEventListener('input', () => {
        this.masterVolumeVal = parseFloat(volumeSlider.value);
        volumeLabel.innerText = Math.round(this.masterVolumeVal * 100) + '%';
        this.audio.setMasterVolume(this.masterVolumeVal);
      });
    }

    const voiceToggle = document.getElementById('setting-voice') as HTMLInputElement;
    if (voiceToggle) {
      voiceToggle.addEventListener('change', () => {
        this.voiceEnabledVal = voiceToggle.checked;
        this.narration.setEnabled(this.voiceEnabledVal);
        const voiceBtn = document.getElementById('voice-toggle-btn');
        if (voiceBtn) {
          voiceBtn.innerText = this.voiceEnabledVal ? 'VOICE: ON' : 'VOICE: OFF';
        }
      });
    }

    const sensSlider = document.getElementById('setting-mouse-sens') as HTMLInputElement;
    const sensLabel = document.getElementById('sens-val-label');
    if (sensSlider && sensLabel) {
      sensSlider.addEventListener('input', () => {
        this.mouseSensVal = parseFloat(sensSlider.value);
        sensLabel.innerText = this.mouseSensVal.toFixed(1) + 'x';
        this.camera.sensitivityMultiplier = this.mouseSensVal;
      });
    }

    const invertYToggle = document.getElementById('setting-invert-y') as HTMLInputElement;
    if (invertYToggle) {
      invertYToggle.addEventListener('change', () => {
        this.invertYVal = invertYToggle.checked;
        this.camera.invertY = this.invertYVal;
      });
    }

    // --- Save / Load Controls ---
    ['autosave', 'slot1', 'slot2', 'slot3'].forEach(slotId => {
      const saveBtn = document.getElementById(`save-btn-${slotId}`);
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const slotName = slotId === 'autosave' ? 'Autosave' : `Manual Slot ${slotId.slice(-1)}`;
          SaveSystem.saveGame(this.player, this.missionMgr, this.lighting, slotId, slotName);
          this.refreshSaveSlotsUI();
        });
      }

      const loadBtn = document.getElementById(`load-btn-${slotId}`);
      if (loadBtn) {
        loadBtn.addEventListener('click', () => {
          if (SaveSystem.loadGame(this.player, this.missionMgr, this.lighting, slotId)) {
            this.close();
          }
        });
      }
    });

    // Quick save button
    const quickSaveBtn = document.getElementById('pause-quicksave-btn');
    if (quickSaveBtn) {
      quickSaveBtn.addEventListener('click', () => {
        SaveSystem.saveGame(this.player, this.missionMgr, this.lighting, 'slot1', 'Manual Slot 1');
        this.refreshSaveSlotsUI();
      });
    }
  }

  public open(tab: string = 'map'): void {
    this.isOpenState = true;
    this.overlayEl.classList.remove('hidden');
    this.switchTab(tab);
    this.refreshSaveSlotsUI();
    this.refreshMissionLogUI();
  }

  public close(): void {
    this.isOpenState = false;
    this.overlayEl.classList.add('hidden');
    this.onResumeCallback();
  }

  public isOpen(): boolean {
    return this.isOpenState;
  }

  public switchTab(tab: string): void {
    this.activeTab = tab;
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    this.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tab}`);
    });

    if (tab === 'map') {
      this.renderWorldMap();
    } else if (tab === 'save-load') {
      this.refreshSaveSlotsUI();
    } else if (tab === 'missions') {
      this.refreshMissionLogUI();
    }
  }

  public renderWorldMap(): void {
    if (!this.mapCtx) return;
    const ctx = this.mapCtx;
    const w = this.mapCanvas.width;
    const h = this.mapCanvas.height;

    // Background: Dark tactical blueprint
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, w, h);

    // Coordinate grid
    ctx.strokeStyle = '#15202e';
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x < w; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // World coordinate to Map coordinate conversion
    // World space: X from -200 to +150, Z from -200 to +200
    // Center at (400, 270), scale = 1.35 px per meter
    const originX = w * 0.52;
    const originY = h * 0.50;
    const scale = 1.35;

    const toMap = (wx: number, wz: number) => ({
      x: originX + wx * scale,
      y: originY + wz * scale
    });

    // Ocean / Harbor waterline (left side X < -70)
    ctx.fillStyle = '#0d1824';
    const waterBound = toMap(-75, 0).x;
    ctx.fillRect(0, 0, waterBound, h);

    ctx.strokeStyle = '#224466';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(waterBound, 0);
    ctx.lineTo(waterBound, h);
    ctx.stroke();

    ctx.fillStyle = '#2b4d70';
    ctx.font = '600 12px "Chakra Petch", sans-serif';
    ctx.fillText('VESPERA SOUND // HARBOR WATERWAY', 25, 30);

    // Docks & Piers at Old Harbor
    const pier19 = toMap(-130, -75);
    ctx.fillStyle = '#1e2d3d';
    ctx.fillRect(pier19.x - 30, pier19.y - 25, 90, 50);
    ctx.strokeStyle = '#385575';
    ctx.strokeRect(pier19.x - 30, pier19.y - 25, 90, 50);

    // City Streets / Road Corridors
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#1e2633';

    // North-South Avenues
    [-70, 0, 70].forEach(wx => {
      const top = toMap(wx, -180);
      const btm = toMap(wx, 180);
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(btm.x, btm.y);
      ctx.stroke();
    });

    // East-West Boulevards
    [-120, -45, 30, 105].forEach(wz => {
      const left = toMap(-75, wz);
      const right = toMap(130, wz);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
    });

    // Yellow highway centerlines
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c98a28';
    ctx.setLineDash([8, 6]);
    const cTop = toMap(0, -180);
    const cBtm = toMap(0, 180);
    ctx.beginPath();
    ctx.moveTo(cTop.x, cTop.y);
    ctx.lineTo(cBtm.x, cBtm.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // District Labels
    ctx.font = '700 13px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#4a5b70';
    const dist1 = toMap(-30, 20);
    ctx.fillText('EASTLINE DISTRICT', dist1.x, dist1.y);

    const dist2 = toMap(25, -70);
    ctx.fillText('SOUTHSIDE INDUSTRIAL', dist2.x, dist2.y);

    const dist3 = toMap(-65, -120);
    ctx.fillText('OLD HARBOR // PIER 19', dist3.x, dist3.y);

    const dist4 = toMap(0, -165);
    ctx.fillText('CENTRAL VESPER CORRIDOR', dist4.x, dist4.y);

    // Key Landmarks / POIs
    const landmarks = [
      { name: "Lena's Apartment (128 Eastline)", x: -25, z: 15, color: '#38bdf8', icon: '🏠' },
      { name: "Adrian's Auto Repair", x: 35, z: -45, color: '#fb923c', icon: '🔧' },
      { name: "Pier 19 Warehouse 19", x: -130, z: -75, color: '#a855f7', icon: '⚓' },
      { name: "Southside Diner (Mara Vale)", x: 50, z: 60, color: '#eab308', icon: '☕' },
      { name: "Meridian Properties HQ", x: 0, z: -160, color: '#06b6d4', icon: '🏢' }
    ];

    landmarks.forEach(lm => {
      const p = toMap(lm.x, lm.z);
      // Outer ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#151c24';
      ctx.fill();
      ctx.strokeStyle = lm.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lm.color;
      ctx.fill();

      // Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.fillText(lm.name, p.x + 12, p.y + 4);
    });

    // Parked Vehicle (if any)
    const veh = this.getVehicle();
    if (veh) {
      const vp = toMap(veh.position.x, veh.position.z);
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(vp.x, vp.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#93c5fd';
      ctx.font = '500 10px "Inter", sans-serif';
      ctx.fillText(`VEHICLE (${veh.config.name})`, vp.x + 9, vp.y + 3);
    }

    // Active Objective Waypoint & GPS Route
    const playerPos = this.player.position;
    const pp = toMap(playerPos.x, playerPos.z);
    const obj = this.missionMgr.getCurrentObjective();
    if (obj && obj.targetPosition) {
      const op = toMap(obj.targetPosition.x, obj.targetPosition.z);

      // GPS Navigation Route Line
      ctx.strokeStyle = '#e58e26';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(pp.x, pp.y);
      // Route via highway intersection for aesthetic city street nav
      ctx.lineTo(op.x, pp.y);
      ctx.lineTo(op.x, op.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pulsing gold circle
      ctx.beginPath();
      ctx.arc(op.x, op.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#e58e26';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(op.x, op.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 11px "Chakra Petch", sans-serif';
      ctx.fillText(`GPS DESTINATION: ${obj.description}`, op.x + 16, op.y + 4);
    }

    // Player GPS Location Arrow
    const heading = this.player.heading;

    ctx.save();
    ctx.translate(pp.x, pp.y);
    ctx.rotate(heading);

    // Cyan GPS arrow
    ctx.beginPath();
    ctx.moveTo(0, -12); // Tip
    ctx.lineTo(8, 10);
    ctx.lineTo(0, 5);
    ctx.lineTo(-8, 10);
    ctx.closePath();
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Player coordinates info bar
    const infoEl = document.getElementById('map-coordinates-hud');
    if (infoEl) {
      const headingDeg = Math.round(((-heading * 180 / Math.PI) + 360) % 360);
      infoEl.innerText = `GPS [X: ${Math.round(playerPos.x)}, Z: ${Math.round(playerPos.z)}] | HEADING: ${headingDeg}° | DISTRICT: EASTLINE`;
    }
  }

  private refreshSaveSlotsUI(): void {
    const slots = SaveSystem.getAllSlots();

    ['autosave', 'slot1', 'slot2', 'slot3'].forEach(id => {
      const data = slots[id];
      const nameEl = document.getElementById(`slot-name-${id}`);
      const infoEl = document.getElementById(`slot-info-${id}`);
      const loadBtn = document.getElementById(`load-btn-${id}`) as HTMLButtonElement;

      if (data) {
        const d = new Date(data.timestamp);
        const timeStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        if (nameEl) nameEl.innerText = data.slotName;
        if (infoEl) {
          infoEl.innerHTML = `<strong>${data.missionName}</strong> &bull; $${data.player.cash} &bull; HP: ${data.player.health}%<br><span class="slot-time">${timeStr}</span>`;
        }
        if (loadBtn) loadBtn.disabled = false;
      } else {
        if (nameEl) nameEl.innerText = id === 'autosave' ? 'Autosave (Empty)' : `Manual Slot ${id.slice(-1)} (Empty)`;
        if (infoEl) infoEl.innerHTML = `<span class="slot-empty">No saved game data</span>`;
        if (loadBtn) loadBtn.disabled = true;
      }
    });
  }

  private refreshMissionLogUI(): void {
    const mission = this.missionMgr.currentMission;
    const titleEl = document.getElementById('log-mission-title');
    const descEl = document.getElementById('log-mission-desc');
    const objListEl = document.getElementById('log-objective-list');
    const completedListEl = document.getElementById('log-completed-list');

    if (mission && titleEl && descEl && objListEl) {
      titleEl.innerText = `${mission.category.toUpperCase()} // ${mission.title}`;
      descEl.innerText = mission.rewards ? mission.rewards.description : 'Active Vespera City Syndicate Operation';

      objListEl.innerHTML = '';
      mission.objectives.forEach((obj, idx) => {
        const li = document.createElement('li');
        const isCurrent = idx === this.missionMgr.currentObjectiveIndex;
        const isDone = idx < this.missionMgr.currentObjectiveIndex;
        li.className = isCurrent ? 'log-obj-active' : isDone ? 'log-obj-done' : 'log-obj-pending';
        li.innerHTML = `${isDone ? '✓' : isCurrent ? '▸' : '○'} ${obj.description}`;
        objListEl.appendChild(li);
      });
    }

    if (completedListEl) {
      completedListEl.innerHTML = '';
      this.missionMgr.completedMissions.forEach(id => {
        const li = document.createElement('li');
        li.innerText = `✓ Mission ${id.toUpperCase()} — Completed`;
        completedListEl.appendChild(li);
      });
      if (this.missionMgr.completedMissions.size === 0) {
        completedListEl.innerHTML = '<li>No missions completed yet</li>';
      }
    }
  }
}
