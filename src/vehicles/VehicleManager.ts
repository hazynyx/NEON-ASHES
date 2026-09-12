import * as THREE from 'three';
import { Vehicle, VehicleConfig } from './Vehicle.ts';
import { Player } from '../player/Player.ts';
import { InputManager } from '../core/InputManager.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { EventBus } from '../core/EventBus.ts';

export class VehicleManager {
  public vehicles: Vehicle[] = [];
  public activeVehicle: Vehicle | null = null;
  public nearbyVehicle: Vehicle | null = null;

  private scene: THREE.Scene;
  private audio: AudioManager;
  private eventBus: EventBus;

  constructor(scene: THREE.Scene, audio: AudioManager) {
    this.scene = scene;
    this.audio = audio;
    this.eventBus = EventBus.getInstance();
    this.spawnInitialVehicles();
  }

  private spawnInitialVehicles(): void {
    // 1. Kaleb's Car: Vesper Sedan (Dark Burgundy/Charcoal)
    const kalebCarConfig: VehicleConfig = {
      id: 'kaleb_car',
      name: 'VESPER SEDAN',
      maxSpeed: 28, // ~62 mph
      acceleration: 14.5,
      reverseSpeed: 8,
      braking: 22,
      turnSpeed: 1.8,
      color: 0x4a151b // Burgundy
    };

    // Spawn Kaleb's car on the avenue approach heading towards Eastline
    const kalebCar = new Vehicle(
      this.scene,
      kalebCarConfig,
      new THREE.Vector3(0, 0, 110),
      this.audio
    );
    kalebCar.heading = Math.PI; // Facing forward towards 0, 0
    this.vehicles.push(kalebCar);

    // 2. Additional parked and street vehicles in Eastline
    const extraCarConfigs: Array<{ cfg: VehicleConfig; pos: THREE.Vector3; heading: number }> = [
      {
        cfg: {
          id: 'sedan_blue',
          name: 'CENTRAL COUPE',
          maxSpeed: 30,
          acceleration: 16,
          reverseSpeed: 9,
          braking: 24,
          turnSpeed: 2.0,
          color: 0x1e3a8a // Navy Blue
        },
        pos: new THREE.Vector3(32, 0, -35),
        heading: 0
      },
      {
        cfg: {
          id: 'cruiser_police',
          name: 'VCPD CRUISER',
          maxSpeed: 32,
          acceleration: 17,
          reverseSpeed: 10,
          braking: 26,
          turnSpeed: 2.1,
          color: 0x0f172a // Police Black & White
        },
        pos: new THREE.Vector3(-55, 0, 45),
        heading: Math.PI
      }
    ];

    extraCarConfigs.forEach(({ cfg, pos, heading }) => {
      const v = new Vehicle(this.scene, cfg, pos, this.audio);
      v.heading = heading;
      this.vehicles.push(v);
    });
  }

  public update(
    deltaTime: number,
    player: Player,
    input: InputManager,
    worldColliders: THREE.Box3[]
  ): void {
    // Check closest vehicle to player when on foot
    if (!this.activeVehicle) {
      this.nearbyVehicle = null;
      let closestDist = 3.5; // Interaction distance (3.5m)

      for (const v of this.vehicles) {
        const dist = player.position.distanceTo(v.position);
        if (dist < closestDist) {
          closestDist = dist;
          this.nearbyVehicle = v;
        }
      }

      // Enter vehicle interaction prompt [E]
      if (this.nearbyVehicle && input.isKeyPressed('KeyE')) {
        this.enterVehicle(player, this.nearbyVehicle);
      }
    } else {
      // Player is currently driving active vehicle
      // Exit vehicle interaction [E]
      if (input.isKeyPressed('KeyE')) {
        this.exitVehicle(player, this.activeVehicle);
      }
    }

    // Update all vehicle physics
    this.vehicles.forEach(v => {
      v.update(deltaTime, v === this.activeVehicle ? input : undefined, worldColliders);
    });

    // If player is driving, keep player position locked to vehicle
    if (this.activeVehicle) {
      player.position.copy(this.activeVehicle.position);
    }
  }

  public enterVehicle(player: Player, vehicle: Vehicle): void {
    this.activeVehicle = vehicle;
    vehicle.isOccupied = true;
    player.isInVehicle = true;

    this.audio.playDoorSlam();
    this.audio.startEngine();

    this.eventBus.emit('player:enterVehicle', { vehicle });
  }

  public exitVehicle(player: Player, vehicle: Vehicle): void {
    // Exit safely to the driver side
    const exitPos = vehicle.getExitPosition();
    player.position.copy(exitPos);
    player.position.y = 0;
    player.isInVehicle = false;
    vehicle.isOccupied = false;
    this.activeVehicle = null;

    this.audio.stopEngine();
    this.audio.playDoorSlam();

    this.eventBus.emit('player:exitVehicle', { vehicle });
  }
}
