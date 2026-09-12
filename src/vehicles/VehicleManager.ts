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
    // 1. Kaleb's Car: Vesper Sedan (Rich Crimson Burgundy)
    const kalebCarConfig: VehicleConfig = {
      id: 'kaleb_car',
      name: 'VESPER SEDAN',
      maxSpeed: 28, // ~62 mph
      acceleration: 14.5,
      reverseSpeed: 8,
      braking: 22,
      turnSpeed: 1.8,
      color: 0x6b1a26 // Rich Burgundy
    };

    // Spawn Kaleb's car on the avenue approach heading towards Eastline
    const kalebCar = new Vehicle(
      this.scene,
      kalebCarConfig,
      new THREE.Vector3(0, 0, 110),
      this.audio
    );
    kalebCar.heading = 0; // Facing forward towards -Z (Eastline Avenue)
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

    // 3. Dynamic Ambient Traffic Vehicles
    this.spawnTrafficVehicles();
  }

  private trafficCars: Array<{
    vehicle: Vehicle;
    lane: 'north_eastline' | 'south_eastline' | 'east_cross' | 'west_cross';
    cruiseSpeed: number;
  }> = [];

  private spawnTrafficVehicles(): void {
    const trafficConfigs = [
      {
        cfg: {
          id: 'traffic_sedan_1',
          name: 'VESPER CAB',
          maxSpeed: 24,
          acceleration: 12,
          reverseSpeed: 7,
          braking: 20,
          turnSpeed: 1.8,
          color: 0xd97706 // Amber Yellow Cab
        },
        pos: new THREE.Vector3(3.5, 0, 80),
        heading: 0, // Northbound
        lane: 'north_eastline' as const,
        cruiseSpeed: 11
      },
      {
        cfg: {
          id: 'traffic_coupe_2',
          name: 'METRO COUPE',
          maxSpeed: 26,
          acceleration: 14,
          reverseSpeed: 8,
          braking: 22,
          turnSpeed: 1.9,
          color: 0x334155 // Slate Gray
        },
        pos: new THREE.Vector3(-3.5, 0, -100),
        heading: Math.PI, // Southbound
        lane: 'south_eastline' as const,
        cruiseSpeed: 12
      },
      {
        cfg: {
          id: 'traffic_taxi_3',
          name: 'HARBOR SEDAN',
          maxSpeed: 25,
          acceleration: 13,
          reverseSpeed: 7,
          braking: 20,
          turnSpeed: 1.8,
          color: 0x047857 // Forest Green
        },
        pos: new THREE.Vector3(-60, 0, 30),
        heading: -Math.PI / 2, // Eastbound
        lane: 'east_cross' as const,
        cruiseSpeed: 11
      },
      {
        cfg: {
          id: 'traffic_wagon_4',
          name: 'CARGO COUPE',
          maxSpeed: 24,
          acceleration: 12,
          reverseSpeed: 7,
          braking: 20,
          turnSpeed: 1.8,
          color: 0x475569 // Dark Silver
        },
        pos: new THREE.Vector3(60, 0, -45),
        heading: Math.PI / 2, // Westbound
        lane: 'west_cross' as const,
        cruiseSpeed: 10
      }
    ];

    trafficConfigs.forEach(tc => {
      const v = new Vehicle(this.scene, tc.cfg, tc.pos, this.audio);
      v.heading = tc.heading;
      v.isAIControlled = true;
      v.targetSpeed = tc.cruiseSpeed;
      this.vehicles.push(v);
      this.trafficCars.push({
        vehicle: v,
        lane: tc.lane,
        cruiseSpeed: tc.cruiseSpeed
      });
    });
  }

  public update(
    deltaTime: number,
    player: Player,
    input: InputManager,
    worldColliders: THREE.Box3[]
  ): void {
    // 1. Update Traffic AI for ambient vehicles
    this.updateTrafficAI(deltaTime, player);

    // 2. Check closest vehicle to player when on foot
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

  private updateTrafficAI(deltaTime: number, player: Player): void {
    this.trafficCars.forEach(tc => {
      const v = tc.vehicle;
      if (v === this.activeVehicle) return; // Player is driving this car

      // Check distance to player or player's active car
      const playerPos = player.position;
      const distToPlayer = v.position.distanceTo(playerPos);

      // Check if player or obstacle is directly in path
      let shouldStop = false;
      if (distToPlayer < 12) {
        // Dot product to check if player is ahead
        const forwardX = -Math.sin(v.heading);
        const forwardZ = -Math.cos(v.heading);
        const toPlayerX = playerPos.x - v.position.x;
        const toPlayerZ = playerPos.z - v.position.z;
        const dot = forwardX * toPlayerX + forwardZ * toPlayerZ;
        if (dot > 0) {
          shouldStop = true; // Player is in front of the vehicle
        }
      }

      // Proximity to other cars
      this.vehicles.forEach(other => {
        if (other !== v) {
          const d = v.position.distanceTo(other.position);
          if (d < 10) {
            const forwardX = -Math.sin(v.heading);
            const forwardZ = -Math.cos(v.heading);
            const toOtherX = other.position.x - v.position.x;
            const toOtherZ = other.position.z - v.position.z;
            const dot = forwardX * toOtherX + forwardZ * toOtherZ;
            if (dot > 0) shouldStop = true;
          }
        }
      });

      v.targetSpeed = shouldStop ? 0 : tc.cruiseSpeed;

      // Loop boundaries when reaching road ends
      if (tc.lane === 'north_eastline' && v.position.z < -160) {
        v.position.z = 135;
      } else if (tc.lane === 'south_eastline' && v.position.z > 135) {
        v.position.z = -160;
      } else if (tc.lane === 'east_cross' && v.position.x > 95) {
        v.position.x = -75;
      } else if (tc.lane === 'west_cross' && v.position.x < -75) {
        v.position.x = 95;
      }
    });
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
