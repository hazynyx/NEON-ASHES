import * as THREE from 'three';
import { Game } from '../core/Game.ts';
import { GameMode } from '../core/GameState.ts';
import { createMission01Data } from '../missions/data/M01_HomeAgain.ts';
import { createMission02Data } from '../missions/data/M02_OldDebts.ts';
import { createMission03Data } from '../missions/data/M03_TheHarbor.ts';
import { createMission04Data } from '../missions/data/M04_ColdStorage.ts';
import { createMission05Data } from '../missions/data/M05_TheJournalist.ts';

interface MissionDef {
  id: string;
  name: string;
  createData: (game: Game) => any;
  stages: Array<{
    id: string;
    label: string;
    warpPos: THREE.Vector3;
    heading: number;
    setup?: (game: Game) => void;
  }>;
}

interface TeleportLoc {
  name: string;
  category: string;
  pos: THREE.Vector3;
  heading: number;
  setup?: (game: Game) => void;
}

export class DebugMenu {
  private game: Game;
  private isMenuOpen: boolean = false;

  // DOM Elements
  private menuEl!: HTMLElement;
  private missionSelectEl!: HTMLSelectElement;
  private objectiveSelectEl!: HTMLSelectElement;
  private missionInfoEl!: HTMLElement;
  private coordsDisplayEl!: HTMLElement;
  private godModeBtn!: HTMLButtonElement;
  private teleportGridEl!: HTMLElement;

  private missions: Record<string, MissionDef> = {};
  private teleportLocations: TeleportLoc[] = [];

  constructor(game: Game) {
    this.game = game;
    this.initMissionsData();
    this.initTeleportData();
    this.bindDOM();
  }

  public isOpen(): boolean {
    return this.isMenuOpen;
  }

  private initMissionsData(): void {
    this.missions = {
      M01: {
        id: 'M01',
        name: 'HOME AGAIN (Prologue // Eastline)',
        createData: (g) => createMission01Data(g.world.lenaApartmentPos),
        stages: [
          {
            id: 'drive_to_apartment',
            label: "1. Drive to Lena's Apartment",
            warpPos: new THREE.Vector3(0, 0, 95),
            heading: 0
          },
          {
            id: 'talk_to_neighbor',
            label: '2. Speak with Mrs. Gable outside',
            warpPos: new THREE.Vector3(26, 0, -26),
            heading: Math.PI
          },
          {
            id: 'enter_apartment',
            label: "3. Enter Lena's Apartment (Unit 102)",
            warpPos: new THREE.Vector3(30, 0, -27),
            heading: 0
          },
          {
            id: 'search_room',
            label: '4. Search Room & Loose Floorboard',
            warpPos: new THREE.Vector3(298, 0, -301),
            heading: -Math.PI / 2,
            setup: (g) => {
              g.isInApartmentInterior = true;
              g.camera.isInteriorMode = true;
            }
          },
          {
            id: 'inspect_photo',
            label: '5. Examine Harbor Photograph',
            warpPos: new THREE.Vector3(297.5, 0, -301.8),
            heading: -Math.PI / 2,
            setup: (g) => {
              g.isInApartmentInterior = true;
              g.camera.isInteriorMode = true;
            }
          },
          {
            id: 'exit_apartment',
            label: '6. Exit Apartment with Evidence',
            warpPos: new THREE.Vector3(300, 0, -297.5),
            heading: 0,
            setup: (g) => {
              g.isInApartmentInterior = true;
              g.camera.isInteriorMode = true;
            }
          }
        ]
      },
      M02: {
        id: 'M02',
        name: "OLD DEBTS (Act I // Adrian's Garage)",
        createData: (g) => createMission02Data(g.world.adrianGaragePos),
        stages: [
          {
            id: 'drive_to_garage',
            label: "1. Drive to Adrian's Auto Repair",
            warpPos: new THREE.Vector3(-60, 0, 90),
            heading: 0
          },
          {
            id: 'talk_to_jonah',
            label: '2. Talk to Jonah Reyes outside',
            warpPos: new THREE.Vector3(-56, 0, 69.2),
            heading: 0
          },
          {
            id: 'enter_garage',
            label: "3. Open Workshop Shutter",
            warpPos: new THREE.Vector3(-60, 0, 66),
            heading: 0
          },
          {
            id: 'crack_safe',
            label: "4. Search Workbench & Adrian's Safe",
            warpPos: new THREE.Vector3(-64, 0, 40.2),
            heading: 0,
            setup: (g) => {
              g.world.openGarageShutter();
            }
          },
          {
            id: 'eliminate_syndicate',
            label: '5. Neutralize Syndicate Ambushers',
            warpPos: new THREE.Vector3(-64, 0, 40.2),
            heading: 0,
            setup: (g) => {
              g.world.openGarageShutter();
              if (g.world.garageBeaconGroup) g.world.garageBeaconGroup.visible = false;
              g.player.hasShotgun = true;
              g.enemyMgr.spawnSyndicateAmbush(
                new THREE.Vector3(-58, 0, 61),
                new THREE.Vector3(-62, 0, 61)
              );
            }
          },
          {
            id: 'escape_area',
            label: '6. Escape Industrial Block in Car',
            warpPos: new THREE.Vector3(-60, 0, 72),
            heading: Math.PI,
            setup: (g) => {
              g.world.openGarageShutter();
            }
          }
        ]
      },
      M03: {
        id: 'M03',
        name: 'THE HARBOR (Act I // Pier 19 Stakeout)',
        createData: (g) => createMission03Data(g.world.pier19Pos),
        stages: [
          {
            id: 'drive_to_harbor',
            label: '1. Drive to Pier 19 Old Harbor',
            warpPos: new THREE.Vector3(65, 0, -120),
            heading: 0
          },
          {
            id: 'vantage_point',
            label: '2. Container Stack Vantage Point',
            warpPos: new THREE.Vector3(50, 0, -165),
            heading: -Math.PI / 4
          },
          {
            id: 'pursue_courier',
            label: '3. Intercept Syndicate Courier',
            warpPos: new THREE.Vector3(65, 0, -170),
            heading: 0
          },
          {
            id: 'escape_harbor',
            label: '4. Escape Harbor Perimeter',
            warpPos: new THREE.Vector3(65, 0, -150),
            heading: Math.PI
          }
        ]
      },
      M04: {
        id: 'M04',
        name: 'COLD STORAGE (Act I Finale // Warehouse 19)',
        createData: (g) =>
          createMission04Data(
            g.world.warehouseEntrancePos,
            g.world.warehouseDeskPos,
            g.world.warehouseLockerPos
          ),
        stages: [
          {
            id: 'goto_warehouse',
            label: '1. Pier 19 Warehouse 19 Security Gate',
            warpPos: new THREE.Vector3(85, 0, -153),
            heading: 0
          },
          {
            id: 'search_terminal',
            label: '2. Search Manifest Terminal Desk',
            warpPos: new THREE.Vector3(92, 0, -176),
            heading: 0,
            setup: (g) => {
              g.world.openWarehouseShutter();
            }
          },
          {
            id: 'recover_drive',
            label: '3. Retrieve Encrypted Drive (Locker 4B)',
            warpPos: new THREE.Vector3(78, 0, -178),
            heading: 0,
            setup: (g) => {
              g.world.openWarehouseShutter();
            }
          },
          {
            id: 'eliminate_guards',
            label: '4. Eliminate Arriving Syndicate Heavies',
            warpPos: new THREE.Vector3(85, 0, -165),
            heading: Math.PI,
            setup: (g) => {
              g.world.openWarehouseShutter();
              g.enemyMgr.spawnEnemies([
                new THREE.Vector3(85, 0, -156),
                new THREE.Vector3(88, 0, -156)
              ]);
            }
          },
          {
            id: 'escape_pier',
            label: '5. Escape Pier 19 Perimeter',
            warpPos: new THREE.Vector3(85, 0, -145),
            heading: Math.PI,
            setup: (g) => {
              g.world.openWarehouseShutter();
            }
          }
        ]
      },
      M05: {
        id: 'M05',
        name: 'THE JOURNALIST (Act II // Mara Vale & Meridian HQ)',
        createData: (g) =>
          createMission05Data(
            g.world.southsideDinerPos,
            g.world.meridianOfficePos,
            g.world.meridianDeskPos
          ),
        stages: [
          {
            id: 'goto_diner',
            label: '1. Drive to Southside Diner',
            warpPos: new THREE.Vector3(50, 0, 65),
            heading: 0
          },
          {
            id: 'talk_to_mara',
            label: '2. Meet Mara Vale on Diner Patio',
            warpPos: new THREE.Vector3(48, 0, 48),
            heading: 0
          },
          {
            id: 'infiltrate_meridian',
            label: '3. Infiltrate Meridian Properties Tower',
            warpPos: new THREE.Vector3(0, 0, -154),
            heading: 0
          },
          {
            id: 'photograph_ledger',
            label: '4. Photograph Buyout Agreement at Desk',
            warpPos: new THREE.Vector3(0, 0, -163),
            heading: 0
          },
          {
            id: 'escape_central',
            label: '5. Escape Central Vesper Corridor',
            warpPos: new THREE.Vector3(0, 0, -135),
            heading: Math.PI
          }
        ]
      }
    };
  }

  private initTeleportData(): void {
    this.teleportLocations = [
      {
        name: "Lena's Apartment (Outside)",
        category: 'Eastline',
        pos: new THREE.Vector3(30, 0, -22),
        heading: 0
      },
      {
        name: "Lena's Apartment (Inside Unit 102)",
        category: 'Interior',
        pos: new THREE.Vector3(300, 0, -298.5),
        heading: Math.PI,
        setup: (g) => {
          g.isInApartmentInterior = true;
          g.camera.isInteriorMode = true;
        }
      },
      {
        name: "Adrian's Auto Repair (Forecourt)",
        category: 'Southside',
        pos: new THREE.Vector3(-56, 0, 69),
        heading: 0
      },
      {
        name: "Adrian's Auto Repair (Workshop)",
        category: 'Southside',
        pos: new THREE.Vector3(-64, 0, 40.2),
        heading: 0,
        setup: (g) => {
          g.world.openGarageShutter();
        }
      },
      {
        name: 'Southside Diner (Patio)',
        category: 'Southside',
        pos: new THREE.Vector3(48, 0, 48),
        heading: 0
      },
      {
        name: 'Old Harbor Pier 19 (Entrance)',
        category: 'Harbor',
        pos: new THREE.Vector3(65, 0, -160),
        heading: 0
      },
      {
        name: 'Pier 19 Container Stack (Vantage)',
        category: 'Harbor',
        pos: new THREE.Vector3(50, 0, -165),
        heading: -Math.PI / 4
      },
      {
        name: 'Warehouse 19 (Security Entrance)',
        category: 'Harbor',
        pos: new THREE.Vector3(85, 0, -153),
        heading: 0
      },
      {
        name: 'Warehouse 19 (Terminal Desk)',
        category: 'Harbor',
        pos: new THREE.Vector3(92, 0, -176),
        heading: 0,
        setup: (g) => {
          g.world.openWarehouseShutter();
        }
      },
      {
        name: 'Meridian Properties Tower',
        category: 'Central',
        pos: new THREE.Vector3(0, 0, -154),
        heading: 0
      },
      {
        name: 'Central Metro Clinic (Respawn Point)',
        category: 'Central',
        pos: new THREE.Vector3(30, 0, -22),
        heading: 0
      },
      {
        name: 'Downtown Main Intersection',
        category: 'Central',
        pos: new THREE.Vector3(0, 0, 0),
        heading: 0
      }
    ];
  }

  private bindDOM(): void {
    this.menuEl = document.getElementById('debug-menu')!;
    if (!this.menuEl) return;

    this.missionSelectEl = document.getElementById('debug-mission-select') as HTMLSelectElement;
    this.objectiveSelectEl = document.getElementById('debug-objective-select') as HTMLSelectElement;
    this.missionInfoEl = document.getElementById('debug-mission-info')!;
    this.coordsDisplayEl = document.getElementById('debug-coords-display')!;
    this.godModeBtn = document.getElementById('debug-godmode-btn') as HTMLButtonElement;
    this.teleportGridEl = document.getElementById('debug-teleport-grid')!;

    // Close button
    const closeBtn = document.getElementById('debug-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Top HUD toggle button
    const toggleBtn = document.getElementById('debug-menu-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Tab buttons
    const tabButtons = this.menuEl.querySelectorAll('.debug-tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabKey = (btn as HTMLElement).dataset.tab;
        this.menuEl.querySelectorAll('.debug-tab-content').forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(`debug-tab-${tabKey}`);
        if (targetContent) targetContent.classList.add('active');
      });
    });

    // Populate objectives on mission selection change
    if (this.missionSelectEl) {
      this.missionSelectEl.addEventListener('change', () => {
        this.updateObjectiveOptions(this.missionSelectEl.value);
      });
      this.updateObjectiveOptions(this.missionSelectEl.value);
    }

    // Warp & Start Mission Button
    const warpStartBtn = document.getElementById('debug-warp-start-btn');
    if (warpStartBtn) {
      warpStartBtn.addEventListener('click', () => {
        const mKey = this.missionSelectEl.value;
        this.warpToMission(mKey, 0);
      });
    }

    // Jump to Selected Objective Button
    const jumpObjBtn = document.getElementById('debug-jump-obj-btn');
    if (jumpObjBtn) {
      jumpObjBtn.addEventListener('click', () => {
        const mKey = this.missionSelectEl.value;
        const objIdx = parseInt(this.objectiveSelectEl.value, 10) || 0;
        this.warpToMission(mKey, objIdx);
      });
    }

    // Advance Objective Button
    const advanceBtn = document.getElementById('debug-advance-obj-btn');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        this.game.missionMgr.advanceObjective();
        this.updateLiveInfo();
        this.game.hud.showNotification('Debug: Objective advanced +1');
      });
    }

    // Complete Mission Button
    const completeBtn = document.getElementById('debug-complete-mission-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        this.game.missionMgr.completeMission();
        this.close();
      });
    }

    // Populate Fast Travel Buttons
    if (this.teleportGridEl) {
      this.teleportGridEl.innerHTML = '';
      this.teleportLocations.forEach(loc => {
        const b = document.createElement('button');
        b.className = 'debug-btn';
        b.innerHTML = `<strong>${loc.name}</strong><br><small style="color: #94a3b8;">${loc.category} &bull; (${loc.pos.x}, ${loc.pos.z})</small>`;
        b.addEventListener('click', () => {
          this.teleportPlayerTo(loc.name, loc.pos, loc.heading, loc.setup);
        });
        this.teleportGridEl.appendChild(b);
      });
    }

    // Player Cheats
    if (this.godModeBtn) {
      this.godModeBtn.addEventListener('click', () => {
        this.game.player.isGodMode = !this.game.player.isGodMode;
        this.godModeBtn.innerText = `GOD MODE: ${this.game.player.isGodMode ? 'ON (ACTIVE)' : 'OFF'}`;
        this.godModeBtn.classList.toggle('active', this.game.player.isGodMode);
        this.game.hud.showNotification(`God Mode: ${this.game.player.isGodMode ? 'ENABLED' : 'DISABLED'}`);
      });
    }

    const healBtn = document.getElementById('debug-heal-btn');
    if (healBtn) {
      healBtn.addEventListener('click', () => {
        this.game.player.health = this.game.player.maxHealth;
        this.game.player.stamina = this.game.player.maxStamina;
        this.game.hud.showNotification('Vitals Restored: 100% Health & Stamina');
      });
    }

    const cash1kBtn = document.getElementById('debug-cash-1k-btn');
    if (cash1kBtn) {
      cash1kBtn.addEventListener('click', () => {
        this.game.player.cash += 1000;
        this.game.hud.showNotification('Added +$1,000 Cash');
      });
    }

    const cash10kBtn = document.getElementById('debug-cash-10k-btn');
    if (cash10kBtn) {
      cash10kBtn.addEventListener('click', () => {
        this.game.player.cash += 10000;
        this.game.hud.showNotification('Added +$10,000 Cash');
      });
    }

    const weaponsBtn = document.getElementById('debug-weapons-btn');
    if (weaponsBtn) {
      weaponsBtn.addEventListener('click', () => {
        this.game.player.hasPistol = true;
        this.game.player.hasShotgun = true;
        this.game.player.ammoClip = this.game.player.maxClip;
        this.game.player.ammoReserve = 120;
        this.game.player.shotgunClip = this.game.player.maxShotgunClip;
        this.game.player.shotgunReserve = 60;
        this.game.hud.showNotification('Weapons & Maximum Ammo Granted');
      });
    }

    const killBtn = document.getElementById('debug-kill-btn');
    if (killBtn) {
      killBtn.addEventListener('click', () => {
        this.close();
        this.game.player.isGodMode = false;
        this.game.player.takeDamage(100);
      });
    }

    // Wanted Level Buttons
    const wantedButtons = this.menuEl.querySelectorAll('[data-wanted]');
    wantedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const stars = parseInt((btn as HTMLElement).dataset.wanted || '0', 10);
        this.game.hud.setWantedStars(stars);
        this.game.hud.showNotification(`Wanted Level set to ${stars} Star(s)`);
      });
    });

    // Spawner Buttons
    const spawnVesperBtn = document.getElementById('debug-spawn-vesper-btn');
    if (spawnVesperBtn) {
      spawnVesperBtn.addEventListener('click', () => {
        this.spawnCarInFront('vesper_sedan');
      });
    }

    const spawnPoliceBtn = document.getElementById('debug-spawn-police-btn');
    if (spawnPoliceBtn) {
      spawnPoliceBtn.addEventListener('click', () => {
        this.spawnCarInFront('police_cruiser');
      });
    }

    const spawnCoupeBtn = document.getElementById('debug-spawn-coupe-btn');
    if (spawnCoupeBtn) {
      spawnCoupeBtn.addEventListener('click', () => {
        this.spawnCarInFront('metro_coupe');
      });
    }

    // Time of Day Buttons
    const timeButtons = this.menuEl.querySelectorAll('[data-time]');
    timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const hour = parseFloat((btn as HTMLElement).dataset.time || '12.0');
        this.game.lighting.timeOfDay = hour;
        this.game.lighting.update(0, this.game.player.position);
        this.game.world.updateStreetlights(hour);
        this.game.hud.showNotification(`Time set to ${this.game.lighting.getTimeString()}`);
      });
    });

    // World Shutter Toggles
    const toggleGarageShutterBtn = document.getElementById('debug-toggle-garage-shutter-btn');
    if (toggleGarageShutterBtn) {
      toggleGarageShutterBtn.addEventListener('click', () => {
        this.game.world.openGarageShutter();
        this.game.hud.showNotification("Adrian's Garage Shutter Opened");
      });
    }

    const toggleWhShutterBtn = document.getElementById('debug-toggle-wh-shutter-btn');
    if (toggleWhShutterBtn) {
      toggleWhShutterBtn.addEventListener('click', () => {
        this.game.world.openWarehouseShutter();
        this.game.hud.showNotification('Warehouse 19 Shutter Opened');
      });
    }
  }

  private updateObjectiveOptions(missionKey: string): void {
    if (!this.objectiveSelectEl) return;
    this.objectiveSelectEl.innerHTML = '';
    const def = this.missions[missionKey];
    if (!def) return;

    def.stages.forEach((stage, idx) => {
      const opt = document.createElement('option');
      opt.value = `${idx}`;
      opt.innerText = stage.label;
      this.objectiveSelectEl.appendChild(opt);
    });
  }

  public open(): void {
    if (this.isMenuOpen) return;
    this.isMenuOpen = true;
    this.menuEl.classList.remove('hidden');
    this.game.input.exitPointerLock();

    // Sync mission selector with current mission
    if (this.game.missionMgr.currentMission) {
      this.missionSelectEl.value = this.game.missionMgr.currentMission.id;
      this.updateObjectiveOptions(this.game.missionMgr.currentMission.id);
      this.objectiveSelectEl.value = `${this.game.missionMgr.currentObjectiveIndex}`;
    }

    this.updateLiveInfo();
  }

  public close(): void {
    if (!this.isMenuOpen) return;
    this.isMenuOpen = false;
    this.menuEl.classList.add('hidden');
    this.game.input.requestPointerLock();
  }

  public toggle(): void {
    if (this.isMenuOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public updateLiveCoords(pos: THREE.Vector3, heading: number): void {
    if (!this.isMenuOpen || !this.coordsDisplayEl) return;
    const deg = Math.round((heading * 180) / Math.PI) % 360;
    this.coordsDisplayEl.innerText = `POS: X: ${pos.x.toFixed(1)}, Y: ${pos.y.toFixed(1)}, Z: ${pos.z.toFixed(1)} | HEADING: ${deg}°`;
  }

  private updateLiveInfo(): void {
    if (!this.missionInfoEl) return;
    const m = this.game.missionMgr;
    const current = m.currentMission;
    const obj = m.getCurrentObjective();

    if (current && m.isMissionActive) {
      this.missionInfoEl.innerHTML = `
        <div style="color: #e58e26; font-weight: 700; margin-bottom: 4px;">ACTIVE OPERATION: ${current.id} // ${current.title}</div>
        <div style="color: #cbd5e1; font-size: 13px;">OBJECTIVE [${m.currentObjectiveIndex + 1}/${current.objectives.length}]: ${obj ? obj.description : 'None'}</div>
        <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">STATUS: IN PROGRESS &bull; CASH: $${this.game.player.cash} &bull; HP: ${Math.round(this.game.player.health)}%</div>
      `;
    } else {
      this.missionInfoEl.innerHTML = `
        <div style="color: #94a3b8; font-weight: 600;">NO MISSION ACTIVE (FREE ROAM)</div>
        <div style="color: #64748b; font-size: 12px; margin-top: 2px;">Select a mission above and click WARP TO MISSION & START.</div>
      `;
    }
  }

  public warpToMission(missionKey: string, stageIndex: number = 0): void {
    const def = this.missions[missionKey];
    if (!def) return;

    // 1. Exit vehicle if player is driving
    if (this.game.player.isInVehicle && this.game.vehicleMgr.activeVehicle) {
      this.game.vehicleMgr.exitVehicle(this.game.player);
    }

    // 2. Clear lingering enemies
    this.game.enemyMgr.clear();

    // 3. Reset apartment interior mode unless entering apartment
    this.game.isInApartmentInterior = false;
    this.game.camera.isInteriorMode = false;

    // 4. Create and start mission data
    const missionData = def.createData(this.game);
    this.game.missionMgr.startMission(missionData);

    // 5. Jump to desired objective
    if (stageIndex > 0) {
      this.game.missionMgr.jumpToObjective(stageIndex);
    }

    // 6. Get stage definition
    const stage = def.stages[stageIndex] || def.stages[0];

    // 7. Run stage setup hooks (e.g. open shutters, spawn ambushers)
    if (stage.setup) {
      stage.setup(this.game);
    }

    // 8. Teleport player and align camera
    this.game.player.teleport(stage.warpPos, stage.heading);
    this.game.camera.snap(this.game.player.position, stage.heading, 0.12);

    // 9. Close debug menu and notify
    this.close();
    this.game.hud.showNotification(`Warped to ${def.id}: ${stage.label}`);
  }

  public teleportPlayerTo(name: string, pos: THREE.Vector3, heading: number = 0, setup?: (game: Game) => void): void {
    if (this.game.player.isInVehicle && this.game.vehicleMgr.activeVehicle) {
      this.game.vehicleMgr.exitVehicle(this.game.player);
    }

    this.game.isInApartmentInterior = false;
    this.game.camera.isInteriorMode = false;

    if (setup) {
      setup(this.game);
    }

    this.game.player.teleport(pos, heading);
    this.game.camera.snap(this.game.player.position, heading, 0.12);
    this.close();
    this.game.hud.showNotification(`Teleported to ${name}`);
  }

  private spawnCarInFront(type: 'vesper_sedan' | 'police_cruiser' | 'metro_coupe'): void {
    const fwd = new THREE.Vector3(
      Math.sin(this.game.player.heading),
      0,
      Math.cos(this.game.player.heading)
    );
    const spawnPos = this.game.player.position.clone().addScaledVector(fwd, 4.5);
    spawnPos.y = 0;

    const car = this.game.vehicleMgr.spawnVehicleAt(type, spawnPos, this.game.player.heading);
    this.close();
    this.game.hud.showNotification(`Spawned ${car.config.name} in front of player`);
  }
}
