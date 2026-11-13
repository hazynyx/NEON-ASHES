import * as THREE from 'three';
import { EngineRenderer } from '../rendering/Renderer.ts';
import { ThirdPersonCamera } from '../rendering/Camera.ts';
import { CityLighting } from '../rendering/Lighting.ts';
import { World } from '../world/World.ts';
import { Player } from '../player/Player.ts';
import { VehicleManager } from '../vehicles/VehicleManager.ts';
import { NPCManager } from '../ai/NPCManager.ts';
import { MissionManager } from '../missions/MissionManager.ts';
import { DialogueManager } from '../dialogue/DialogueManager.ts';
import { HUD } from '../ui/HUD.ts';
import { InputManager } from './InputManager.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { GameStateManager, GameMode } from './GameState.ts';
import { SaveSystem } from './SaveSystem.ts';
import { EventBus } from './EventBus.ts';
import { EnemyManager } from '../ai/EnemyAI.ts';
import { createMission02Data } from '../missions/data/M02_OldDebts.ts';
import { createMission03Data } from '../missions/data/M03_TheHarbor.ts';
import { createMission04Data } from '../missions/data/M04_ColdStorage.ts';
import { createMission05Data } from '../missions/data/M05_TheJournalist.ts';
import { createMission06Data } from '../missions/data/M06_BadBusiness.ts';
import { createMission07Data } from '../missions/data/M07_OldFriends.ts';
import { createMission08Data } from '../missions/data/M08_PaperTrail.ts';
import { DestinationMarker } from '../world/DestinationMarker.ts';
import { NarrationManager } from '../audio/NarrationManager.ts';
import { PauseMenu } from '../ui/PauseMenu.ts';
import { DebugMenu } from '../ui/DebugMenu.ts';

export class Game {
  public scene: THREE.Scene;
  public renderer: EngineRenderer;
  public camera: ThirdPersonCamera;
  public lighting: CityLighting;
  public world: World;
  public player: Player;
  public vehicleMgr: VehicleManager;
  public npcMgr: NPCManager;
  public missionMgr: MissionManager;
  public dialogueMgr: DialogueManager;
  public narrationMgr: NarrationManager;
  public pauseMenu: PauseMenu;
  public debugMenu: DebugMenu;
  public hud: HUD;
  public input: InputManager;
  public audio: AudioManager;
  public state: GameStateManager;
  public eventBus: EventBus;
  public enemyMgr: EnemyManager;
  public destinationMarker: DestinationMarker;

  // Interior apartment state for M01
  public isInApartmentInterior: boolean = false;
  private apartmentDoorPos: THREE.Vector3 = new THREE.Vector3(30, 0, -28);
  private apartmentDeskPos: THREE.Vector3 = new THREE.Vector3(297.2, 0, -302.2);
  private apartmentExitDoorPos: THREE.Vector3 = new THREE.Vector3(300, 0, -296.8);

  // Garage safe state for M02
  private garageShutterPos: THREE.Vector3 = new THREE.Vector3(-60, 0, 64);
  private garageSafePos: THREE.Vector3 = new THREE.Vector3(-64, 0, 39);

  // Mission M06: BAD BUSINESS World-State Flags
  public shellCompanyExposed: boolean = false;
  public alvarezIdentified: boolean = false;

  // Mission M07: OLD FRIENDS World-State Flags
  public jonahTrustsKaleb: boolean = false;
  public marrowHostile: boolean = false;
  public creditorKilled: boolean = false;
  public drakeAlliance: boolean = false;
  public m07Choice: 'A' | 'B' | 'C' | null = null;
  public m07DebtAmount: number = 2000;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x131a26);
    this.scene.fog = new THREE.FogExp2(0x131a26, 0.0022); // Atmospheric visibility up to 450m

    this.input = new InputManager();
    this.input.attachCanvas(canvas);

    this.audio = new AudioManager();
    this.state = new GameStateManager();
    this.eventBus = EventBus.getInstance();

    this.renderer = new EngineRenderer(canvas);
    this.camera = new ThirdPersonCamera();
    this.lighting = new CityLighting(this.scene);
    this.world = new World(this.scene);

    this.player = new Player(this.scene, this.audio);
    this.vehicleMgr = new VehicleManager(this.scene, this.audio);
    this.npcMgr = new NPCManager(this.scene);
    this.enemyMgr = new EnemyManager(this.scene, this.audio);
    this.hud = new HUD();
    this.narrationMgr = new NarrationManager(this.audio, this.hud);
    this.dialogueMgr = new DialogueManager(this.hud, this.audio, this.narrationMgr);

    this.hud.onVoiceToggle = (enabled: boolean) => {
      this.narrationMgr.isVoiceEnabled = enabled;
    };

    this.missionMgr = new MissionManager(this.audio, this.world.lenaApartmentPos);
    this.destinationMarker = new DestinationMarker(this.scene);

    this.pauseMenu = new PauseMenu(
      this.player,
      this.missionMgr,
      this.renderer,
      this.camera,
      this.audio,
      this.narrationMgr,
      this.lighting,
      () => this.vehicleMgr.activeVehicle,
      () => this.scene.fog as THREE.FogExp2,
      () => {
        this.state.setState(GameMode.FREE_ROAM);
        this.input.requestPointerLock();
      }
    );

    this.debugMenu = new DebugMenu(this);

    this.setupEventListeners();
    this.setupStartScreen();
    (window as any).createMission02Data = createMission02Data;
    (window as any).createMission07Data = createMission07Data;
    (window as any).createMission08Data = createMission08Data;
    (window as any).startMission07 = () => this.startMission07();
    (window as any).debugMenu = this.debugMenu;
  }

  private setupEventListeners(): void {
    // Pointer lock toggle: unlock triggers pause menu
    this.input.setPointerLockCallback((isLocked) => {
      if (!isLocked && !this.player.isDead && (this.state.getState() === GameMode.FREE_ROAM || this.state.getState() === GameMode.MISSION_ACTIVE || this.state.getState() === GameMode.IN_VEHICLE)) {
        if (!this.dialogueMgr.isActive && !this.pauseMenu.isOpen() && !this.hud.isEvidenceOpen && !this.debugMenu.isOpen()) {
          this.state.setState(GameMode.PAUSED);
          this.pauseMenu.open('map');
        }
      }
    });

    // Handle Player Death (WASTED)
    this.eventBus.on('player:death', () => {
      // 1. Play WASTED flatline/impact audio
      this.audio.playWastedSound();

      // 2. If inside vehicle, exit vehicle
      if (this.player.isInVehicle && this.vehicleMgr.activeVehicle) {
        this.vehicleMgr.exitVehicle(this.player);
      }

      // 3. Close pause menu if open
      if (this.pauseMenu.isOpen()) {
        this.pauseMenu.close();
      }

      // 4. Deduct medical fee ($100 or current cash)
      const medicalFee = Math.min(this.player.cash, 100);
      this.player.cash = Math.max(0, this.player.cash - medicalFee);

      // 5. Show WASTED overlay with medical invoice and respawn countdown
      this.hud.showWasted(medicalFee, () => {
        // Respawn outside Lena's Apartment Safehouse / Central Metro Clinic
        const respawnPos = new THREE.Vector3(30, 0, -22);
        this.player.respawn(respawnPos, 0);
        this.camera.snap(this.player.position, 0, 0.1);
        this.hud.showNarration('METRO CLINIC', `Patient Kaleb discharged. Medical expenses: -$${medicalFee}`);
      });
    });

    // Handle Mission Complete Event
    this.eventBus.on('mission:complete', ({ mission }) => {
      this.state.setState(GameMode.MISSION_RESULT);
      this.input.exitPointerLock();

      // Award player rewards
      this.player.cash += mission.rewards.cash;
      this.player.ammoReserve += 24;

      // Save game
      SaveSystem.saveGame(this.player, this.missionMgr, this.lighting);

      this.hud.showMissionPassed(mission.title, mission.rewards.description, () => {
        this.state.setState(GameMode.FREE_ROAM);
        this.input.requestPointerLock();

        // Chain next canonical mission
        if (mission.id === 'M01') {
          setTimeout(() => {
            this.missionMgr.startMission(createMission02Data(this.world.adrianGaragePos));
          }, 800);
        } else if (mission.id === 'M02') {
          setTimeout(() => {
            this.missionMgr.startMission(createMission03Data(this.world.pier19Pos));
          }, 800);
        } else if (mission.id === 'M03') {
          setTimeout(() => {
            this.missionMgr.startMission(
              createMission04Data(
                this.world.warehouseEntrancePos,
                this.world.warehouseDeskPos,
                this.world.warehouseLockerPos
              )
            );
          }, 800);
        } else if (mission.id === 'M04') {
          setTimeout(() => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "The encrypted drive has financial ledgers tied to an investigative journalist named Mara Vale.",
                delayAfter: 600
              },
              {
                speaker: 'KALEB (INTERNAL)',
                text: "She's meeting contacts at Southside Diner on Central & 4th. Time to see what she knows.",
                delayAfter: 500
              }
            ]);
            this.missionMgr.startMission(
              createMission05Data(
                this.world.southsideDinerPos,
                this.world.meridianOfficePos,
                this.world.meridianDeskPos
              )
            );
          }, 800);
        } else if (mission.id === 'M05') {
          setTimeout(() => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Albright and Meridian are running an eviction racket in Eastline.",
                delayAfter: 600
              },
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Dominic Alvarez is managing the demolition crews on the ground. Time to pay the redevelopment zone a visit.",
                delayAfter: 500
              }
            ]);
            this.missionMgr.startMission(
              createMission06Data(
                this.world.redevelopmentSitePos,
                this.world.contractorMeetingPos,
                this.world.shellOfficePos
              )
            );
          }, 800);
        } else if (mission.id === 'M06') {
          setTimeout(() => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Apex Land Holdings is the corporate shell behind the Eastline demolition.",
                delayAfter: 600
              },
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Incoming distress call from Jonah... Syndicate enforcers are tearing through Adrian's garage.",
                delayAfter: 500
              }
            ]);
            this.startMission07();
          }, 800);
        } else if (mission.id === 'M07') {
          setTimeout(() => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Jonah's debt is handled. Mara called in new intel on Apex Land Holdings' bank routing.",
                delayAfter: 600
              },
              {
                speaker: 'KALEB (INTERNAL)',
                text: "She's waiting at the Southside Diner patio with the financial filings. Time to trace the money.",
                delayAfter: 500
              }
            ]);
            this.missionMgr.startMission(
              createMission08Data(
                this.world.southsideDinerPos,
                this.world.financeOfficePos,
                this.world.financeArchivePos,
                this.world.financeTerminalPos
              )
            );
          }, 800);
        } else if (mission.id === 'M08') {
          setTimeout(() => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Four point two million dollars... Albright and Drake bought half the city with stolen tax funds.",
                delayAfter: 700
              },
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Lena didn't run away. She was digging straight into the heart of this syndicate. Now I have the leverage to bring them all down.",
                delayAfter: 600
              },
              {
                speaker: 'MARA VALE (RADIO)',
                text: "Kaleb! You got the ledger! This breaks Albright's syndicate wide open. Act II complete!",
                delayAfter: 600
              }
            ]);
            this.hud.showNotification('CAMPAIGN ACT II COMPLETE — FREE ROAM UNLOCKED');
          }, 800);
        }
      });
    });

    // Toggle controls help with F1
    window.addEventListener('keydown', (e) => {
      if (e.code === 'F1') {
        this.hud.toggleControls();
      }
    });
  }

  private setupStartScreen(): void {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-game-btn');
    const instructionsBtn = document.getElementById('instructions-btn');

    if (startBtn && startScreen) {
      startBtn.addEventListener('click', () => {
        this.audio.init();
        startScreen.classList.add('hidden');
        this.state.setState(GameMode.MISSION_ACTIVE);

        // Seat Kaleb in his Vesper Sedan for the prologue arrival drive
        if (this.vehicleMgr.vehicles.length > 0) {
          this.vehicleMgr.enterVehicle(this.player, this.vehicleMgr.vehicles[0]);
          this.camera.isVehicleMode = true;
          this.camera.yaw = this.vehicleMgr.vehicles[0].heading;
        }

        this.input.requestPointerLock();

        // Trigger Kaleb's Prologue Monologue Narration
        setTimeout(() => {
          this.narrationMgr.queueNarrations([
            {
              speaker: 'KALEB (INTERNAL)',
              text: "Six years away from Vespera. The air still smells like salt, sulfur, and burnt gasoline.",
              delayAfter: 600
            },
            {
              speaker: 'KALEB (INTERNAL)',
              text: "Lena's letters stopped two weeks ago. She told me to stay away... but she's the only family I have left.",
              delayAfter: 600
            },
            {
              speaker: 'KALEB (INTERNAL)',
              text: "I need to take Eastline Avenue up to 128 Eastline. Check her apartment.",
              delayAfter: 400
            }
          ]);
        }, 1200);
      });
    }

    if (instructionsBtn) {
      instructionsBtn.addEventListener('click', () => {
        this.hud.showControls();
      });
    }
  }

  public startMission07(): void {
    const jonahPos = new THREE.Vector3(-56, 0, 67);
    this.missionMgr.startMission(
      createMission07Data(
        this.world.adrianGaragePos,
        jonahPos,
        this.world.harborDepotPos
      )
    );
  }

  public update(deltaTime: number): void {
    // 0. Check Developer Debug Menu hotkeys (F2 / Backquote)
    if (this.input.isKeyPressed('F2') || this.input.isKeyPressed('Backquote')) {
      this.debugMenu.toggle();
      return;
    }

    if (this.debugMenu.isOpen()) {
      if (this.input.isKeyPressed('Escape')) {
        this.debugMenu.close();
        return;
      }
      this.debugMenu.updateLiveCoords(this.player.position, this.player.heading);
      this.input.update();
      return;
    }

    // 1. Check Pause / Map / Controls hotkeys
    if (this.input.isKeyPressed('Escape') || this.input.isKeyPressed('KeyP')) {
      if (this.hud.isEvidenceOpen) {
        this.hud.hideEvidence();
        this.input.requestPointerLock();
      } else if (this.pauseMenu.isOpen()) {
        this.pauseMenu.close();
      } else if (this.state.getState() !== GameMode.MAIN_MENU) {
        this.state.setState(GameMode.PAUSED);
        this.input.exitPointerLock();
        this.pauseMenu.open('map');
      }
    } else if (this.input.isKeyPressed('KeyM')) {
      if (this.pauseMenu.isOpen()) {
        this.pauseMenu.close();
      } else if (this.state.getState() !== GameMode.MAIN_MENU) {
        this.state.setState(GameMode.PAUSED);
        this.input.exitPointerLock();
        this.pauseMenu.open('map');
      }
    } else if (this.input.isKeyPressed('F1')) {
      if (this.pauseMenu.isOpen()) {
        this.pauseMenu.close();
      } else if (this.state.getState() !== GameMode.MAIN_MENU) {
        this.state.setState(GameMode.PAUSED);
        this.input.exitPointerLock();
        this.pauseMenu.open('controls');
      }
    }

    // Camera View Mode cycling (GTA 5 style 'V' key)
    if (this.input.isKeyPressed('KeyV')) {
      const modeText = this.camera.cycleViewMode();
      this.audio.playUIClick();
      this.hud.showViewModeBadge(modeText);
    }

    if (this.state.getState() === GameMode.PAUSED) {
      this.input.update();
      return;
    }

    // 1. Process Input updates
    const mouseDelta = this.input.consumeMouseDelta();

    // If dialogue is active, route input to dialogue
    if (this.dialogueMgr.isActive) {
      this.dialogueMgr.update(this.input);
      this.input.update();
      return;
    }

    // Camera look
    if (this.input.isPointerLocked) {
      this.camera.handleMouseLook(mouseDelta.x, mouseDelta.y);
    }

    // 2. Update Environment & Lighting
    this.lighting.update(deltaTime, this.player.position);
    this.world.update(deltaTime);
    this.world.updateStreetlights(this.lighting.timeOfDay);

    // 3. Update Vehicle Manager
    this.vehicleMgr.update(deltaTime, this.player, this.input, this.world.colliders);

    // 4. Update Player
    this.player.update(deltaTime, this.input, this.camera, this.world.colliders, this.scene);

    // 5. Update NPCs & Enemies
    this.npcMgr.update(deltaTime, this.player, this.input);
    this.enemyMgr.update(deltaTime, this.player);

    // 6. Update Camera
    const isDriving = !!this.vehicleMgr.activeVehicle;
    this.camera.isVehicleMode = isDriving;
    this.camera.isInteriorMode = this.isInApartmentInterior;
    const targetPos = isDriving ? this.vehicleMgr.activeVehicle!.position : this.player.position;
    const targetHeading = isDriving ? this.vehicleMgr.activeVehicle!.heading : this.player.heading;

    this.camera.update(targetPos, targetHeading, deltaTime, this.world.colliders);

    // 7. Update Mission Logic & Interactions
    this.updateMissionAndInteractions();

    // Destination Beacon Update
    const currentObj = this.missionMgr.getCurrentObjective();
    this.destinationMarker.setPosition(currentObj?.targetPosition || null);
    this.destinationMarker.update(deltaTime);

    // 8. Update HUD
    const interaction = this.determineInteraction();
    this.hud.update(
      this.player,
      this.vehicleMgr.activeVehicle,
      this.missionMgr,
      this.world,
      this.lighting,
      interaction ? interaction.text : null,
      interaction ? interaction.key : 'E'
    );

    // 9. Clear edge-triggered input
    this.input.update();
  }

  private determineInteraction(): { text: string; key: string } | null {
    if (this.player.isInVehicle) {
      return { text: 'Exit Vehicle', key: 'E' };
    }

    // Vehicle entrance
    if (this.vehicleMgr.nearbyVehicle) {
      return { text: `Enter ${this.vehicleMgr.nearbyVehicle.config.name}`, key: 'E' };
    }

    const currentObj = this.missionMgr.getCurrentObjective();

    // Mission M08 meet_mara prompt
    if (currentObj && currentObj.id === 'meet_mara') {
      const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
      if (dist < 5.0) {
        return { text: "Speak with Mara Vale", key: 'F' };
      }
    }

    // NPC conversation
    if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.isStoryNPC) {
      return { text: `Talk to ${this.npcMgr.nearbyNPC.data.name}`, key: 'F' };
    }

    // Inside Lena's Apartment (Unit 102)
    if (this.isInApartmentInterior) {
      const distToDesk = this.player.position.distanceTo(this.apartmentDeskPos);
      if (distToDesk < 3.8 && currentObj && currentObj.id === 'search_room') {
        return { text: 'Search Desk & Loose Floorboard', key: 'E' };
      }

      const distToExit = this.player.position.distanceTo(this.apartmentExitDoorPos);
      if (distToExit < 3.2) {
        return { text: 'Leave Unit 102', key: 'E' };
      }
    }

    // Outside Apartment Door
    if (!this.isInApartmentInterior) {
      const distToDoor = this.player.position.distanceTo(this.apartmentDoorPos);
      if (distToDoor < 4.0) {
        if (currentObj && (currentObj.id === 'enter_apartment' || currentObj.id === 'search_room' || currentObj.id === 'inspect_photo')) {
          return { text: "Enter Lena's Apartment (Unit 102)", key: 'E' };
        } else if (this.missionMgr.completedMissions.has('M01')) {
          return { text: "Enter Safehouse (Unit 102)", key: 'E' };
        }
      }
    }

    // Mission M01 specific interaction prompts
    if (currentObj) {

      // Mission M02 specific interaction prompts
      if (currentObj.id === 'enter_garage') {
        const dist = this.player.position.distanceTo(this.garageShutterPos);
        if (dist < 4.5) {
          return { text: "Open Garage Shutter", key: 'E' };
        }
      } else if (currentObj.id === 'crack_safe') {
        const dist = this.player.position.distanceTo(this.garageSafePos);
        if (dist < 4.5) {
          return { text: "Search Workbench & Safe", key: 'E' };
        }
      }

      // Mission M03 specific interaction prompts
      if (currentObj.id === 'observe_handoff') {
        const vantagePos = new THREE.Vector3(this.world.pier19Pos.x - 15, 0, this.world.pier19Pos.z + 15);
        const dist = this.player.position.distanceTo(vantagePos);
        if (dist < 6.0) {
          return { text: "Stake Out Crane with Binoculars", key: 'E' };
        }
      } else if (currentObj.id === 'retrieve_key') {
        const targetPos = new THREE.Vector3(20, 0, -110);
        const dist = this.player.position.distanceTo(targetPos);
        if (dist < 5.0) {
          return { text: "Search Courier Car & Take Storage Key", key: 'E' };
        }
      }

      // Mission M04 specific interaction prompts
      if (currentObj.id === 'unlock_gate') {
        const dist = this.player.position.distanceTo(this.world.warehouseEntrancePos);
        if (dist < 5.0) {
          return { text: "Unlock Roll-Up Shutter [Pier 19 Key]", key: 'E' };
        }
      } else if (currentObj.id === 'search_manifest') {
        const dist = this.player.position.distanceTo(this.world.warehouseDeskPos);
        if (dist < 4.2) {
          return { text: "Inspect Meridian Shipping Manifest", key: 'E' };
        }
      } else if (currentObj.id === 'retrieve_drive') {
        const dist = this.player.position.distanceTo(this.world.warehouseLockerPos);
        if (dist < 4.2) {
          return { text: "Extract Military Encrypted Drive", key: 'E' };
        }
      }

      // Mission M05 specific interaction prompts
      if (currentObj.id === 'talk_mara' || currentObj.id === 'debrief_mara') {
        const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
        if (dist < 5.0) {
          return { text: "Talk to Mara Vale", key: 'F' };
        }
      } else if (currentObj.id === 'infiltrate_office' && this.missionMgr.currentMission?.id === 'M05') {
        const dist = this.player.position.distanceTo(this.world.meridianDeskPos);
        if (dist < 4.5) {
          return { text: "Search Archive Terminal", key: 'E' };
        }
      } else if (currentObj.id === 'photograph_evidence') {
        const dist = this.player.position.distanceTo(this.world.meridianDeskPos);
        if (dist < 4.5) {
          return { text: "Photograph Zoning Buyout Accord", key: 'E' };
        }
      }

      // Mission M06 specific interaction prompts
      if (currentObj.id === 'photograph_meeting') {
        const dist = this.player.position.distanceTo(this.world.contractorMeetingPos);
        if (dist < 4.5) {
          return { text: 'Photograph Payoff', key: 'E' };
        }
      } else if (currentObj.id === 'identify_shell_company') {
        const dist = this.player.position.distanceTo(this.world.shellOfficePos);
        if (dist < 3.5) {
          return { text: 'Inspect Directory Plaque', key: 'E' };
        }
      }

      // Mission M07 specific interaction prompts
      if (currentObj.id === 'talk_to_jonah' && this.missionMgr.currentMission?.id === 'M07') {
        const jonahPos = currentObj.targetPosition || new THREE.Vector3(-56, 0, 67);
        if (this.player.position.distanceTo(jonahPos) < 5.0) {
          return { text: 'Talk to Jonah Reyes', key: 'E' };
        }
      } else if (currentObj.id === 'resolve_debt_choice') {
        const jonahPos = currentObj.targetPosition || new THREE.Vector3(-56, 0, 67);
        if (this.player.position.distanceTo(jonahPos) < 6.0) {
          return { text: '[1] Pay Debt  [2] Threaten  [3] Drake Job', key: '1-3' };
        }
      } else if (currentObj.id === 'retrieve_drake_package') {
        const depotPos = currentObj.targetPosition || this.world.harborDepotPos;
        if (this.player.position.distanceTo(depotPos) < 5.0) {
          return { text: 'Collect Contraband Package', key: 'E' };
        }
      } else if (currentObj.id === 'debrief_jonah') {
        const debriefPos = currentObj.targetPosition || new THREE.Vector3(-56, 0, 67);
        const workshopInsidePos = new THREE.Vector3(-58, 0, 52);
        const dist = Math.min(
          this.player.position.distanceTo(debriefPos),
          this.player.position.distanceTo(workshopInsidePos)
        );
        if (dist < 6.0) {
          return { text: 'Speak with Jonah', key: 'E' };
        }
      }

      // Mission M08 specific interaction prompts
      if (currentObj.id === 'meet_mara') {
        const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
        if (dist < 5.0) {
          return { text: "Speak with Mara Vale", key: 'F' };
        }
      } else if (currentObj.id === 'infiltrate_office' && this.missionMgr.currentMission?.id === 'M08') {
        const dist = this.player.position.distanceTo(this.world.financeOfficePos);
        if (dist < 5.0) {
          return { text: "Infiltrate Office Suite", key: 'E' };
        }
      } else if (currentObj.id === 'inspect_documents') {
        const dist = this.player.position.distanceTo(this.world.financeArchivePos);
        if (dist < 4.5) {
          return { text: "Search Filing Cabinets", key: 'E' };
        }
      } else if (currentObj.id === 'obtain_records') {
        const dist = this.player.position.distanceTo(this.world.financeTerminalPos);
        if (dist < 4.5) {
          return { text: "Download Wire Transfer Ledger", key: 'E' };
        }
      }
    }

    return null;
  }

  private updateMissionAndInteractions(): void {
    this.missionMgr.update(this.player);

    const currentObj = this.missionMgr.getCurrentObjective();
    if (!currentObj) return;

    // --- M01 Handlers ---
    // Objective: talk_to_neighbor
    if (currentObj.id === 'talk_to_neighbor') {
      if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.id === 'mrs_gable') {
        if (this.input.isKeyPressed('KeyF')) {
          this.dialogueMgr.startDialogue(this.npcMgr.nearbyNPC.data.dialogue || [], () => {
            this.missionMgr.advanceObjective();
          });
        }
      }
    }

    // Objective: enter_apartment (or re-entry during M01 investigation)
    if (currentObj.id === 'enter_apartment' || (!this.isInApartmentInterior && (currentObj.id === 'search_room' || currentObj.id === 'inspect_photo'))) {
      const dist = this.player.position.distanceTo(this.apartmentDoorPos);
      if (dist < 4.0 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        if (this.player.isInVehicle) {
          this.vehicleMgr.exitVehicle(this.player);
        }
        this.audio.playDoorSlam();
        this.isInApartmentInterior = true;
        this.camera.isInteriorMode = true;
        this.player.teleport(this.world.apartmentInterior.spawnPos, Math.PI); // Face North (Math.PI) into the room
        this.camera.snap(this.player.position, 0, 0.10, this.world.colliders); // Camera behind Kaleb looking North

        if (currentObj.id === 'enter_apartment') {
          this.missionMgr.advanceObjective(); // Advances to search_room
        }

        // Kaleb's interior monologue
        setTimeout(() => {
          this.narrationMgr.queueNarrations([
            {
              speaker: 'KALEB (INTERNAL)',
              text: "Place is completely torn apart... Lena wouldn't leave her notes scattered like this unless she was forced out in a hurry.",
              delayAfter: 600
            },
            {
              speaker: 'KALEB (INTERNAL)',
              text: "She always had a backup stash. Check behind the desk.",
              delayAfter: 500
            }
          ]);
        }, 500);

        return; // Prevent evaluating exit in the same frame!
      }
    }

    // Free-roam entry into Safehouse after M01
    if (!this.isInApartmentInterior && this.missionMgr.completedMissions.has('M01')) {
      const dist = this.player.position.distanceTo(this.apartmentDoorPos);
      if (dist < 3.8 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        if (this.player.isInVehicle) {
          this.vehicleMgr.exitVehicle(this.player);
        }
        this.audio.playDoorSlam();
        this.isInApartmentInterior = true;
        this.camera.isInteriorMode = true;
        this.player.teleport(this.world.apartmentInterior.spawnPos, Math.PI);
        this.camera.snap(this.player.position, 0, 0.10, this.world.colliders);
        return;
      }
    }

    // Objective: search_room
    if (currentObj.id === 'search_room') {
      const dist = this.player.position.distanceTo(this.apartmentDeskPos);
      if (dist < 3.8 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.world.apartmentInterior.setFloorboardBeaconVisible(false);
        this.missionMgr.advanceObjective(); // Advances to inspect_photo

        // Show harbor evidence photograph modal
        this.input.exitPointerLock();
        this.hud.showEvidence(() => {
          this.input.requestPointerLock();
          this.missionMgr.advanceObjective(); // Advances to exit_apartment!

          this.narrationMgr.queueNarrations([
            {
              speaker: 'KALEB (INTERNAL)',
              text: "Pier 19... And Adrian's old safehouse. I need to get out to Adrian's garage in Southside.",
              delayAfter: 500
            }
          ]);
        });
        return;
      }
    }

    // Objective: exit_apartment (or general exit when in interior)
    if (this.isInApartmentInterior) {
      const dist = this.player.position.distanceTo(this.apartmentExitDoorPos);
      if (dist < 2.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playDoorSlam();
        this.isInApartmentInterior = false;
        this.camera.isInteriorMode = false;
        const porchPos = new THREE.Vector3(30, 0, -23.5);
        this.player.teleport(porchPos, 0); // Face street (South)
        this.camera.snap(porchPos, Math.PI, 0.15, this.world.colliders); // Camera behind Kaleb looking South

        if (currentObj.id === 'exit_apartment') {
          this.missionMgr.advanceObjective(); // Completes M01!
        }
        return;
      }
    }

    // --- M02 Handlers ---
    // Objective: talk_to_jonah
    if (currentObj.id === 'talk_to_jonah') {
      if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.id === 'jonah_reyes') {
        if (this.input.isKeyPressed('KeyF')) {
          this.dialogueMgr.startDialogue(this.npcMgr.nearbyNPC.data.dialogue || [], () => {
            this.missionMgr.advanceObjective();
          });
        }
      }
    }

    // Objective: enter_garage
    if (currentObj.id === 'enter_garage') {
      const dist = this.player.position.distanceTo(this.garageShutterPos);
      if (dist < 4.5 && this.input.isKeyPressed('KeyE')) {
        this.world.openGarageShutter();
        this.audio.playDoorSlam();
        this.hud.showNarration('WORKSHOP', "Workshop shutter raised. Adrian's workbench and safe are in the back bay.");
        this.missionMgr.advanceObjective();
      }
    }

    // Objective: crack_safe
    if (currentObj.id === 'crack_safe') {
      const dist = this.player.position.distanceTo(this.garageSafePos);
      if (dist < 4.0 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.audio.playReload();

        // Hide investigation beacon
        if (this.world.garageBeaconGroup) {
          this.world.garageBeaconGroup.visible = false;
        }

        // Unlock shotgun and ammo
        this.player.hasShotgun = true;
        this.player.shotgunReserve += 18;

        this.hud.showNarration('KALEB', "Adrian's wall safe... Lena's journal is here, along with shipping manifests from Old Harbor Pier 19. Also found a 12G tactical shotgun!");

        // Trigger Syndicate Ambush
        this.enemyMgr.spawnSyndicateAmbush(
          new THREE.Vector3(-58, 0, 61),
          new THREE.Vector3(-62, 0, 61)
        );

        this.missionMgr.advanceObjective();
      }
    }

    // Objective: eliminate_syndicate
    if (currentObj.id === 'eliminate_syndicate') {
      if (this.enemyMgr.areAllDead()) {
        this.missionMgr.advanceObjective();
      }
    }

    // Objective: escape_area
    if (currentObj.id === 'escape_area') {
      const distFromGarage = this.player.position.distanceTo(this.world.adrianGaragePos);
      if (this.player.isInVehicle && distFromGarage > 65.0) {
        this.missionMgr.advanceObjective(); // Completes M02!
      }
    }

    // --- M03 Handlers ---
    // Objective: vantage_point
    if (currentObj.id === 'vantage_point') {
      const vantagePos = new THREE.Vector3(this.world.pier19Pos.x - 15, 0, this.world.pier19Pos.z + 15);
      if (this.player.position.distanceTo(vantagePos) < 4.5) {
        this.missionMgr.advanceObjective();
      }
    }

    // Objective: observe_handoff
    if (currentObj.id === 'observe_handoff') {
      const vantagePos = new THREE.Vector3(this.world.pier19Pos.x - 15, 0, this.world.pier19Pos.z + 15);
      if (this.player.position.distanceTo(vantagePos) < 6.0 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.dialogueMgr.startDialogue([
          {
            speaker: 'KALEB',
            text: "There he is... The man from Lena's photograph in the dark trench coat."
          },
          {
            speaker: 'KALEB',
            text: "He just handed a heavy steel case and keycard to the courier in the black coupe! They're taking off!"
          }
        ], () => {
          this.missionMgr.advanceObjective(); // Proceeds to chase_courier!
        });
      }
    }

    // Objective: chase_courier
    if (currentObj.id === 'chase_courier') {
      const targetPos = new THREE.Vector3(20, 0, -110);
      if (this.player.position.distanceTo(targetPos) < 16.0) {
        this.audio.playCollision(1.0);
        this.audio.playTireScreech();
        this.missionMgr.advanceObjective(); // Courier disabled, proceed to retrieve_key!
      }
    }

    // Objective: retrieve_key
    if (currentObj.id === 'retrieve_key') {
      const targetPos = new THREE.Vector3(20, 0, -110);
      if (this.player.position.distanceTo(targetPos) < 5.0 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.missionMgr.advanceObjective(); // Key secured, proceed to escape_harbor!
      }
    }

    // Objective: escape_harbor
    if (currentObj.id === 'escape_harbor') {
      const distFromPier = this.player.position.distanceTo(this.world.pier19Pos);
      if (this.player.isInVehicle && distFromPier > 85.0) {
        this.missionMgr.advanceObjective(); // Completes M03!
      }
    }

    // --- M04 Handlers ---
    // Objective: goto_warehouse
    if (currentObj.id === 'goto_warehouse') {
      const dist = this.player.position.distanceTo(this.world.warehouseEntrancePos);
      if (dist < 5.5) {
        this.missionMgr.advanceObjective(); // Proceed to unlock_gate
      }
    }

    // Objective: unlock_gate
    if (currentObj.id === 'unlock_gate') {
      const dist = this.player.position.distanceTo(this.world.warehouseEntrancePos);
      if (dist < 5.0 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.audio.playDoorSlam();
        this.world.openWarehouseShutter();
        this.missionMgr.advanceObjective(); // Gate opened, proceed to search_manifest!
      }
    }

    // Objective: search_manifest
    if (currentObj.id === 'search_manifest') {
      const dist = this.player.position.distanceTo(this.world.warehouseDeskPos);
      if (dist < 4.2 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.input.exitPointerLock();
        this.hud.showEvidence('manifest', () => {
          this.input.requestPointerLock();
          this.missionMgr.advanceObjective(); // Manifest photographed, proceed to retrieve_drive!
        });
      }
    }

    // Objective: retrieve_drive
    if (currentObj.id === 'retrieve_drive') {
      const dist = this.player.position.distanceTo(this.world.warehouseLockerPos);
      if (dist < 4.2 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.audio.playReload();

        // Syndicate Heavy Guards pull up outside and ambush!
        this.enemyMgr.clear();
        this.enemyMgr.spawnEnemies([
          new THREE.Vector3(85, 0, -150),
          new THREE.Vector3(78, 0, -147),
          new THREE.Vector3(92, 0, -147)
        ]);

        // Dialogue callout
        this.dialogueMgr.startDialogue([
          {
            speaker: 'SYNDICATE HITMAN',
            text: "Someone breached Warehouse 19! Lock down the dock and eliminate the intruder!"
          },
          {
            speaker: 'KALEB',
            text: "Syndicate clean-up crew. Time to break out this 12-gauge."
          }
        ], () => {
          this.missionMgr.advanceObjective(); // Ambush active, eliminate guards!
        });
      }
    }

    // Objective: eliminate_guards
    if (currentObj.id === 'eliminate_guards') {
      if (this.enemyMgr.areAllDead()) {
        this.missionMgr.advanceObjective(); // Proceed to escape_perimeter!
      }
    }

    // Objective: escape_perimeter (M04)
    if (currentObj.id === 'escape_perimeter' && this.missionMgr.currentMission?.id === 'M04') {
      const distFromPier = this.player.position.distanceTo(this.world.pier19Pos);
      if (this.player.isInVehicle && distFromPier > 95.0) {
        this.missionMgr.advanceObjective(); // Completes M04!
      }
    }

    // --- M05 Handlers ---
    // Objective: goto_diner
    if (currentObj.id === 'goto_diner') {
      const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
      if (dist < 7.5) {
        this.missionMgr.advanceObjective(); // Proceed to talk_mara
      }
    }

    // Objective: talk_mara
    if (currentObj.id === 'talk_mara') {
      if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.id === 'mara_vale') {
        if (this.input.isKeyPressed('KeyF')) {
          this.dialogueMgr.startDialogue(this.npcMgr.nearbyNPC.data.dialogue || [], () => {
            this.missionMgr.advanceObjective(); // Proceed to goto_meridian
          });
        }
      }
    }

    // Objective: goto_meridian
    if (currentObj.id === 'goto_meridian') {
      const dist = this.player.position.distanceTo(this.world.meridianOfficePos);
      if (dist < 9.5) {
        this.missionMgr.advanceObjective(); // Proceed to infiltrate_office
      }
    }

    // Objective: infiltrate_office (M05)
    if (currentObj.id === 'infiltrate_office' && this.missionMgr.currentMission?.id === 'M05') {
      const dist = this.player.position.distanceTo(this.world.meridianDeskPos);
      if (dist < 4.2 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.missionMgr.advanceObjective(); // Proceed to photograph_evidence
      }
    }

    // Objective: photograph_evidence
    if (currentObj.id === 'photograph_evidence') {
      const dist = this.player.position.distanceTo(this.world.meridianDeskPos);
      if (dist < 4.2 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.input.exitPointerLock();
        this.hud.showEvidence('meridian_zoning', () => {
          this.input.requestPointerLock();
          this.missionMgr.advanceObjective(); // Proceed to return_to_mara
        });
      }
    }

    // Objective: return_to_mara
    if (currentObj.id === 'return_to_mara') {
      const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
      if (dist < 7.5) {
        this.missionMgr.advanceObjective(); // Proceed to debrief_mara
      }
    }

    // Objective: debrief_mara
    if (currentObj.id === 'debrief_mara') {
      if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.id === 'mara_vale') {
        if (this.input.isKeyPressed('KeyF')) {
          this.dialogueMgr.startDialogue([
            {
              speaker: 'MARA VALE',
              text: "Councilman Albright signed off on the eviction sweeps himself?! And the Marrow Syndicate gets 30% kickbacks?!"
            },
            {
              speaker: 'KALEB',
              text: "Black on white. Lena had the same shipping manifests Albright rubber-stamped. They wanted her silenced."
            },
            {
              speaker: 'MARA VALE',
              text: "This blows City Hall wide open. Kaleb, here is your fee, and Lena's personal audio tape from her safehouse lockbox. You earned this."
            }
          ], () => {
            this.missionMgr.advanceObjective(); // Completes M05!
          });
        }
      }
    }

    // --- M06 Handlers (BAD BUSINESS) ---
    // Objective 1: observe_redevelopment
    if (currentObj.id === 'observe_redevelopment') {
      const dist = this.player.position.distanceTo(this.world.redevelopmentSitePos);
      if (dist < 8.0) {
        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Mara wasn't exaggerating. Half the block is boarded up, and Alvarez's crews are tearing down the rest.",
            delayAfter: 500
          }
        ]);
        this.missionMgr.advanceObjective(); // Proceed to follow_contractor
      }
    }

    // Objective 2: follow_contractor
    if (currentObj.id === 'follow_contractor') {
      const dist = this.player.position.distanceTo(this.world.contractorMeetingPos);
      if (dist < 5.0) {
        this.missionMgr.advanceObjective(); // Proceed to photograph_meeting
      }
    }

    // Objective 3: photograph_meeting
    if (currentObj.id === 'photograph_meeting') {
      const dist = this.player.position.distanceTo(this.world.contractorMeetingPos);
      if (dist < 4.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.input.exitPointerLock();
        this.hud.showEvidence('contractor_payoff', () => {
          this.input.requestPointerLock();
          this.dialogueMgr.startDialogue([
            {
              speaker: 'DOMINIC ALVAREZ',
              text: "The tenants in 402 and 404 refused the buyout. We had to cut their water lines."
            },
            {
              speaker: 'SYNDICATE OPERATIVE',
              text: "Councilman Albright wants that building cleared by Friday. Here's your bonus. Report back to the Apex office."
            }
          ], () => {
            this.narrationMgr.queueNarrations([
              {
                speaker: 'KALEB (INTERNAL)',
                text: "Apex office... Alvarez is heading to his truck. Don't lose him.",
                delayAfter: 500
              }
            ]);
            this.missionMgr.advanceObjective(); // Proceed to follow_vehicle
          });
        });
      }
    }

    // Objective 4: follow_vehicle
    if (currentObj.id === 'follow_vehicle') {
      const dist = this.player.position.distanceTo(this.world.shellOfficePos);
      if (dist < 14.0) {
        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Alvarez pulled up outside this corporate front. Let's see what company name is on the directory plaque.",
            delayAfter: 500
          }
        ]);
        this.missionMgr.advanceObjective(); // Proceed to identify_shell_company
      }
    }

    // Objective 5: identify_shell_company
    if (currentObj.id === 'identify_shell_company') {
      const dist = this.player.position.distanceTo(this.world.shellOfficePos);
      if (dist < 3.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.dialogueMgr.startDialogue([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "'Apex Land Holdings LLC'. Registered three months ago. Same corporate address as Meridian Properties."
          },
          {
            speaker: 'MARA VALE (RADIO)',
            text: "Kaleb! Syndicate lookouts just spotted your vehicle! Clear the area immediately!"
          }
        ], () => {
          this.missionMgr.advanceObjective(); // Proceed to escape_surveillance
        });
      }
    }

    // Objective 6: escape_surveillance
    if (currentObj.id === 'escape_surveillance') {
      const distFromOffice = this.player.position.distanceTo(this.world.shellOfficePos);
      if (distFromOffice > 70.0) {
        this.shellCompanyExposed = true;
        this.alvarezIdentified = true;
        this.missionMgr.advanceObjective(); // Completes M06!
      }
    }

    // --- M07 Handlers (OLD FRIENDS) ---
    // Objective 1: talk_to_jonah
    if (currentObj.id === 'talk_to_jonah' && this.missionMgr.currentMission?.id === 'M07') {
      const jonahPos = currentObj.targetPosition || new THREE.Vector3(-56, 0, 67);
      const dist = this.player.position.distanceTo(jonahPos);
      if (dist < 5.0 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.dialogueMgr.startDialogue([
          {
            speaker: 'JONAH REYES',
            text: "Kaleb! Thank god you made it. Sal and his Marrow Syndicate enforcers are here to shake down the garage."
          },
          {
            speaker: 'JONAH REYES',
            text: `They claim I owe $${this.m07DebtAmount} for black-market parts from Pier 19. If I don't pay up today, they're burning Adrian's shop to the ground.`
          },
          {
            speaker: 'KALEB VOSS',
            text: "We have options, Jonah. I can pay Sal off, settle this in lead, or Vincent Drake offered a contraband job at Harbor Depot that clears your debt."
          }
        ], () => {
          this.missionMgr.advanceObjective(); // Advance to resolve_debt_choice
        });
      }
    }

    // Objective 2: resolve_debt_choice
    if (currentObj.id === 'resolve_debt_choice') {
      const isChoiceA = this.input.isKeyPressed('Digit1') || this.input.isKeyPressed('Key1') || this.input.isKeyPressed('Numpad1');
      const isChoiceB = this.input.isKeyPressed('Digit2') || this.input.isKeyPressed('Key2') || this.input.isKeyPressed('Numpad2');
      const isChoiceC = this.input.isKeyPressed('Digit3') || this.input.isKeyPressed('Key3') || this.input.isKeyPressed('Numpad3');

      if (isChoiceA) {
        this.input.consumeKey('Digit1');
        this.input.consumeKey('Key1');
        this.input.consumeKey('Numpad1');
        this.audio.playUIClick();

        if (this.player.cash >= this.m07DebtAmount) {
          this.player.cash -= this.m07DebtAmount;
          this.jonahTrustsKaleb = true;
          this.m07Choice = 'A';
          this.hud.showNotification(`Paid Jonah's Debt: -$${this.m07DebtAmount}`);
          this.dialogueMgr.startDialogue([
            {
              speaker: 'KALEB VOSS',
              text: `Here's your money, Sal. All $${this.m07DebtAmount}. Take it and walk away from Adrian's shop.`
            },
            {
              speaker: 'SAL (MARROW ENFORCER)',
              text: "Smart move, Voss. The debt is settled. Jonah, you're off the hook... for now."
            },
            {
              speaker: 'JONAH REYES',
              text: "Kaleb... you didn't have to spend your own money on my mistake. Come inside the workshop, let's talk."
            }
          ], () => {
            this.world.openGarageShutter();
            this.missionMgr.jumpToObjective(6); // Jump to debrief_jonah
          });
        } else {
          this.hud.showNotification(`INSUFFICIENT FUNDS: $${this.m07DebtAmount} required!`);
          this.narrationMgr.queueNarrations([
            {
              speaker: 'KALEB (INTERNAL)',
              text: `I don't have enough cash. I need $${this.m07DebtAmount} to pay off Sal. Threaten him or take Drake's job instead.`,
              delayAfter: 500
            }
          ]);
        }
      } else if (isChoiceB) {
        this.input.consumeKey('Digit2');
        this.input.consumeKey('Key2');
        this.input.consumeKey('Numpad2');
        this.audio.playUIClick();

        this.m07Choice = 'B';
        this.enemyMgr.spawnEnemies([
          new THREE.Vector3(-54, 0, 72),
          new THREE.Vector3(-58, 0, 74),
          new THREE.Vector3(-62, 0, 71)
        ]);
        this.dialogueMgr.startDialogue([
          {
            speaker: 'KALEB VOSS',
            text: "You take one more step toward this garage, Sal, and you leave in a body bag."
          },
          {
            speaker: 'SAL (MARROW ENFORCER)',
            text: "Tough guy, huh? Gun them both down and trash the place!"
          }
        ], () => {
          this.missionMgr.jumpToObjective(3); // Jump to eliminate_enforcers
        });
      } else if (isChoiceC) {
        this.input.consumeKey('Digit3');
        this.input.consumeKey('Key3');
        this.input.consumeKey('Numpad3');
        this.audio.playUIClick();

        this.m07Choice = 'C';
        this.dialogueMgr.startDialogue([
          {
            speaker: 'KALEB VOSS',
            text: "Hold on, Sal. Vincent Drake has a locked contraband cache at the Harbor Depot. I retrieve it for Drake, Drake settles Jonah's tab."
          },
          {
            speaker: 'SAL (MARROW ENFORCER)',
            text: "Drake's word is good with the boss. Retrieve the package from the Harbor Depot fenced cache and bring it back here. We'll be waiting."
          }
        ], () => {
          this.missionMgr.jumpToObjective(4); // Jump to retrieve_drake_package
        });
      }
    }

    // Objective 3: eliminate_enforcers (Branch B)
    if (currentObj.id === 'eliminate_enforcers') {
      if (this.enemyMgr.areAllDead()) {
        this.marrowHostile = true;
        this.creditorKilled = true;
        this.world.openGarageShutter();
        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Sal and his enforcers are neutralized. Marrow will want revenge, but the garage is safe. Time to check on Jonah inside.",
            delayAfter: 500
          }
        ]);
        this.missionMgr.jumpToObjective(6); // Jump to debrief_jonah
      }
    }

    // Objective 4: retrieve_drake_package (Branch C)
    if (currentObj.id === 'retrieve_drake_package') {
      const dist = this.player.position.distanceTo(this.world.harborDepotPos);
      if (dist < 4.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.hud.showNotification("Contraband Package Collected!");
        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Got Drake's contraband locker. Heavy crate with Marrow shipping stamps. Back to Adrian's garage.",
            delayAfter: 500
          }
        ]);
        this.missionMgr.advanceObjective(); // Advance to return_to_garage (Objective 5)
      }
    }

    // Objective 5: return_to_garage (Branch C)
    if (currentObj.id === 'return_to_garage') {
      const dist = this.player.position.distanceTo(this.world.adrianGaragePos);
      if (dist < 15.0) {
        this.drakeAlliance = true;
        this.world.openGarageShutter();
        this.missionMgr.advanceObjective(); // Advance to debrief_jonah (Objective 6)
      }
    }

    // Objective 6: debrief_jonah
    if (currentObj.id === 'debrief_jonah') {
      const debriefPos = currentObj.targetPosition || new THREE.Vector3(-56, 0, 67);
      const workshopInsidePos = new THREE.Vector3(-58, 0, 52);
      const dist = Math.min(
        this.player.position.distanceTo(debriefPos),
        this.player.position.distanceTo(workshopInsidePos)
      );

      if (dist < 6.0 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.world.openGarageShutter();

        let debriefText = "Thanks for having my back, Kaleb. Adrian would be proud of you. Here's your share of workshop reserves.";
        if (this.jonahTrustsKaleb) {
          debriefText = "You paid off my debt out of your own pocket... I won't forget that, Kaleb. Take Adrian's custom shotgun ammo from the workbench.";
        } else if (this.marrowHostile) {
          debriefText = "Sal and his goons are dead. Marrow will be out for blood, but the garage is safe. Take whatever ammunition we have in the back.";
        } else if (this.drakeAlliance) {
          debriefText = "Drake's package cleared the debt completely. Vincent Drake says you've got standing respect at his docks. Take the gear in the back.";
        }

        this.dialogueMgr.startDialogue([
          {
            speaker: 'JONAH REYES',
            text: debriefText
          },
          {
            speaker: 'KALEB VOSS',
            text: "Take care of the shop, Jonah. We're going to finish what Adrian started."
          }
        ], () => {
          this.missionMgr.completeMission();
        });
      }
    }

    // --- M08 Handlers (PAPER TRAIL) ---
    // Objective 1: meet_mara
    if (currentObj.id === 'meet_mara') {
      const dist = this.player.position.distanceTo(this.world.southsideDinerPos);
      if (dist < 5.0 && this.input.isKeyPressed('KeyF')) {
        this.input.consumeKey('KeyF');
        this.dialogueMgr.startDialogue([
          {
            speaker: 'MARA VALE',
            text: "I cross-referenced the corporate registration for Apex Land Holdings. It leads directly to Vespera Municipal Trust on 5th Avenue."
          },
          {
            speaker: 'KALEB',
            text: "A trust fund holding real estate?"
          },
          {
            speaker: 'MARA VALE',
            text: "It's an offshore clearinghouse. Councilman Albright and Marrow Syndicate front corporations wire millions through their executive terminal every month. If you can get into that office and copy their transaction ledger, we can prove the whole conspiracy."
          },
          {
            speaker: 'KALEB',
            text: "I'll infiltrate their archive and download the wire transfers. Stay on the radio."
          }
        ], () => {
          this.missionMgr.advanceObjective(); // Proceeds to drive_to_finance_office
        });
      }
    }

    // Objective 2: drive_to_finance_office
    if (currentObj.id === 'drive_to_finance_office') {
      const dist = this.player.position.distanceTo(this.world.financeOfficePos);
      if (dist <= 8.0) {
        this.missionMgr.advanceObjective(); // Proceeds to infiltrate_office
      }
    }

    // Objective 3: infiltrate_office
    if (currentObj.id === 'infiltrate_office' && this.missionMgr.currentMission?.id === 'M08') {
      const dist = this.player.position.distanceTo(this.world.financeOfficePos);
      if (dist < 5.0 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playDoorSlam();

        // Shift lighting to security night mode
        this.lighting.timeOfDay = 23.5;

        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Inside. The office is locked down in night security mode. Filing archives are down the corridor.",
            delayAfter: 500
          }
        ]);

        this.missionMgr.advanceObjective(); // Proceeds to inspect_documents
      }
    }

    // Objective 4: inspect_documents
    if (currentObj.id === 'inspect_documents') {
      const dist = this.player.position.distanceTo(this.world.financeArchivePos);
      if (dist < 4.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();

        this.narrationMgr.queueNarrations([
          {
            speaker: 'KALEB (INTERNAL)',
            text: "Apex Land Holdings, Redwater Development Corp, Harbor Wharfage Ltd... All registered to the same offshore trust account: 'Black Ledger Fund #4'.",
            delayAfter: 500
          },
          {
            speaker: 'KALEB (INTERNAL)',
            text: "The executive terminal on the desk has the complete routing logs. That's our target.",
            delayAfter: 500
          }
        ]);

        this.missionMgr.advanceObjective(); // Proceeds to obtain_records
      }
    }

    // Objective 5: obtain_records
    if (currentObj.id === 'obtain_records') {
      const dist = this.player.position.distanceTo(this.world.financeTerminalPos);
      if (dist < 4.5 && this.input.isKeyPressed('KeyE')) {
        this.input.consumeKey('KeyE');
        this.audio.playUIClick();
        this.audio.playRadioClick();

        // Spawn arriving Vespera Security Patrol
        this.enemyMgr.clear();
        this.enemyMgr.spawnEnemies([
          new THREE.Vector3(-30, 0, -125),
          new THREE.Vector3(-40, 0, -125)
        ]);

        // Show Evidence Modal
        this.input.exitPointerLock();
        this.hud.showEvidence('black_ledger_wire', () => {
          this.input.requestPointerLock();
          this.missionMgr.advanceObjective(); // Proceeds to escape_perimeter

          this.dialogueMgr.startDialogue([
            {
              speaker: 'VESPERA SECURITY',
              text: "Terminal breach detected in executive archives! Lockdown the block and search all exits!"
            },
            {
              speaker: 'KALEB',
              text: "The data download triggered their alarms. Time to clear the district."
            }
          ]);
        });
      }
    }

    // Objective 6: escape_perimeter
    if (currentObj.id === 'escape_perimeter' && this.missionMgr.currentMission?.id === 'M08') {
      const distFromOffice = this.player.position.distanceTo(this.world.financeOfficePos);
      if (distFromOffice > 75.0) {
        this.missionMgr.advanceObjective(); // Completes M08!
      }
    }
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera.camera);
  }
}
