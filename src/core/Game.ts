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

  // Interior apartment state for M01
  private isInApartmentInterior: boolean = false;
  private apartmentDoorPos: THREE.Vector3 = new THREE.Vector3(30, 0, -29);
  private apartmentDeskPos: THREE.Vector3 = new THREE.Vector3(30, 0, -38);

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
    this.world.updateStreetlights(this.lighting.timeOfDay);

    // 3. Update Vehicle Manager
    this.vehicleMgr.update(deltaTime, this.player, this.input, this.world.colliders);

    // 4. Update Player
    this.player.update(deltaTime, this.input, this.camera, this.world.colliders, this.scene);

    // 5. Update NPCs
    this.npcMgr.update(deltaTime, this.player, this.input);

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
    }

    return null;
  }

  private updateMissionAndInteractions(): void {
    this.missionMgr.update(this.player);

    const currentObj = this.missionMgr.getCurrentObjective();
    if (!currentObj) return;

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
        // Move player inside apartment suite
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
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera.camera);
  }
}
