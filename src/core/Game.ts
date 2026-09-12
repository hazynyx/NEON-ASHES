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
  public hud: HUD;
  public input: InputManager;
  public audio: AudioManager;
  public state: GameStateManager;
  public eventBus: EventBus;
  public enemyMgr: EnemyManager;

  // Interior apartment state for M01
  private isInApartmentInterior: boolean = false;
  private apartmentDoorPos: THREE.Vector3 = new THREE.Vector3(30, 0, -29);
  private apartmentDeskPos: THREE.Vector3 = new THREE.Vector3(30, 0, -38);

  // Garage safe state for M02
  private garageShutterPos: THREE.Vector3 = new THREE.Vector3(-60, 0, 64);
  private garageSafePos: THREE.Vector3 = new THREE.Vector3(-64, 0, 54);

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0d0f);
    this.scene.fog = new THREE.FogExp2(0x0b0d0f, 0.007);

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
    this.dialogueMgr = new DialogueManager(this.hud, this.audio);

    this.missionMgr = new MissionManager(this.audio, this.world.lenaApartmentPos);

    this.setupEventListeners();
    this.setupStartScreen();
  }

  private setupEventListeners(): void {
    // Pointer lock toggle
    this.input.setPointerLockCallback((isLocked) => {
      // In pointer lock
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
      });
    }

    if (instructionsBtn) {
      instructionsBtn.addEventListener('click', () => {
        this.hud.showControls();
      });
    }
  }

  public update(deltaTime: number): void {
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
    const targetPos = isDriving ? this.vehicleMgr.activeVehicle!.position : this.player.position;
    const targetHeading = isDriving ? this.vehicleMgr.activeVehicle!.heading : this.player.heading;

    this.camera.update(targetPos, targetHeading, deltaTime, this.world.colliders);

    // 7. Update Mission Logic & Interactions
    this.updateMissionAndInteractions();

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

    // NPC conversation
    if (this.npcMgr.nearbyNPC && this.npcMgr.nearbyNPC.data.isStoryNPC) {
      return { text: `Talk to ${this.npcMgr.nearbyNPC.data.name}`, key: 'F' };
    }

    // Mission M01 specific interaction prompts
    const currentObj = this.missionMgr.getCurrentObjective();
    if (currentObj) {
      if (currentObj.id === 'enter_apartment') {
        const dist = this.player.position.distanceTo(this.apartmentDoorPos);
        if (dist < 4.0) {
          return { text: "Enter Lena's Apartment", key: 'E' };
        }
      } else if (currentObj.id === 'search_room') {
        const dist = this.player.position.distanceTo(this.apartmentDeskPos);
        if (dist < 4.0) {
          return { text: 'Search Desk & Bookcase', key: 'E' };
        }
      }

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

    // Objective: enter_apartment
    if (currentObj.id === 'enter_apartment') {
      const dist = this.player.position.distanceTo(this.apartmentDoorPos);
      if (dist < 3.5 && this.input.isKeyPressed('KeyE')) {
        this.player.position.set(30, 0, -36);
        this.isInApartmentInterior = true;
        this.audio.playDoorSlam();
        this.missionMgr.advanceObjective();
      }
    }

    // Objective: search_room
    if (currentObj.id === 'search_room') {
      const dist = this.player.position.distanceTo(this.apartmentDeskPos);
      if (dist < 3.5 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.missionMgr.advanceObjective();

        // Show harbor evidence photograph modal
        this.input.exitPointerLock();
        this.hud.showEvidence(() => {
          this.input.requestPointerLock();
          this.missionMgr.advanceObjective(); // Completes inspect_photo & finishes M01!
        });
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
      if (dist < 4.0 && this.input.isKeyPressed('KeyE')) {
        // Step into garage workshop
        this.player.position.set(-62, 0, 56);
        this.audio.playDoorSlam();
        this.missionMgr.advanceObjective();
      }
    }

    // Objective: crack_safe
    if (currentObj.id === 'crack_safe') {
      const dist = this.player.position.distanceTo(this.garageSafePos);
      if (dist < 4.0 && this.input.isKeyPressed('KeyE')) {
        this.audio.playUIClick();
        this.audio.playReload();

        // Trigger Syndicate Ambush
        this.enemyMgr.spawnSyndicateAmbush(
          new THREE.Vector3(-58, 0, 62),
          new THREE.Vector3(-64, 0, 62)
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

    // Objective: escape_perimeter
    if (currentObj.id === 'escape_perimeter') {
      const distFromPier = this.player.position.distanceTo(this.world.pier19Pos);
      if (this.player.isInVehicle && distFromPier > 95.0) {
        this.missionMgr.advanceObjective(); // Completes M04!
      }
    }
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera.camera);
  }
}
