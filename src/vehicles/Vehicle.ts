import * as THREE from 'three';
import { InputManager } from '../core/InputManager.ts';
import { AudioManager } from '../audio/AudioManager.ts';

export interface VehicleConfig {
  id: string;
  name: string;
  maxSpeed: number; // m/s (e.g. 32 m/s = ~72 mph)
  acceleration: number;
  reverseSpeed: number;
  braking: number;
  turnSpeed: number;
  color: number;
}

export class Vehicle {
  public mesh: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public heading: number = 0; // Yaw in radians
  public speed: number = 0; // Forward speed in m/s
  public steerAngle: number = 0;

  public config: VehicleConfig;
  public isOccupied: boolean = false;

  // Visual sub-meshes
  private bodyMesh!: THREE.Mesh;
  private wheels: THREE.Mesh[] = [];
  private frontWheelPivots: THREE.Group[] = [];
  private headlights: THREE.SpotLight[] = [];
  private taillights: THREE.PointLight[] = [];

  // Wheel animation
  private wheelRotation: number = 0;

  // Collision box
  public collider: THREE.Box3;
  private halfWidth: number = 1.05;
  private halfLength: number = 2.4;

  private audio: AudioManager;

  constructor(scene: THREE.Scene, config: VehicleConfig, spawnPos: THREE.Vector3, audio: AudioManager) {
    this.config = config;
    this.audio = audio;
    this.position.copy(spawnPos);
    this.collider = new THREE.Box3();

    this.mesh = new THREE.Group();
    this.buildVehicleMesh();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    this.updateCollider();
  }

  private buildVehicleMesh(): void {
    const carMat = new THREE.MeshStandardMaterial({
      color: this.config.color,
      roughness: 0.3,
      metalness: 0.7
    });

    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.1,
      metalness: 0.9
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8
    });

    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.2
    });

    // 1. Lower Body / Chassis
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.65, 4.8);
    this.bodyMesh = new THREE.Mesh(bodyGeo, carMat);
    this.bodyMesh.position.y = 0.55;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.mesh.add(this.bodyMesh);

    // 2. Cabin / Roof
    const cabinGeo = new THREE.BoxGeometry(1.8, 0.6, 2.4);
    const cabinMesh = new THREE.Mesh(cabinGeo, windowMat);
    cabinMesh.position.set(0, 1.15, -0.3);
    cabinMesh.castShadow = true;
    this.mesh.add(cabinMesh);

    // Roof cap
    const roofGeo = new THREE.BoxGeometry(1.75, 0.08, 2.2);
    const roofMesh = new THREE.Mesh(roofGeo, carMat);
    roofMesh.position.set(0, 1.48, -0.3);
    this.mesh.add(roofMesh);

    // 3. Bumpers & Grille
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.3), trimMat);
    frontBumper.position.set(0, 0.45, 2.45);
    this.mesh.add(frontBumper);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.3), trimMat);
    rearBumper.position.set(0, 0.45, -2.45);
    this.mesh.add(rearBumper);

    // 4. Wheels & Suspension
    const wheelRadius = 0.38;
    const wheelWidth = 0.28;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelPositions = [
      { x: -1.05, y: 0.38, z: 1.45, isFront: true },  // Front Left
      { x: 1.05, y: 0.38, z: 1.45, isFront: true },   // Front Right
      { x: -1.05, y: 0.38, z: -1.45, isFront: false }, // Rear Left
      { x: 1.05, y: 0.38, z: -1.45, isFront: false }  // Rear Right
    ];

    wheelPositions.forEach((wp) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wp.x, wp.y, wp.z);

      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Rim accent
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.29, 12),
        rimMat
      );
      rim.rotateZ(Math.PI / 2);
      wheelGroup.add(rim);

      this.mesh.add(wheelGroup);
      this.wheels.push(tire);

      if (wp.isFront) {
        this.frontWheelPivots.push(wheelGroup);
      }
    });

    // 5. Headlights
    [-0.75, 0.75].forEach(x => {
      const lightMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.2, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      lightMesh.position.set(x, 0.6, 2.42);
      this.mesh.add(lightMesh);

      const spot = new THREE.SpotLight(0xfff4d0, 1.8, 45, Math.PI / 5, 0.3, 1);
      spot.position.set(x, 0.6, 2.5);
      spot.target.position.set(x, 0, 20);
      this.mesh.add(spot);
      this.mesh.add(spot.target);
      this.headlights.push(spot);
    });

    // 6. Taillights
    [-0.75, 0.75].forEach(x => {
      const tailMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.18, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      tailMesh.position.set(x, 0.6, -2.42);
      this.mesh.add(tailMesh);
    });
  }

  public update(deltaTime: number, input?: InputManager, worldColliders?: THREE.Box3[]): void {
    if (this.isOccupied && input) {
      this.handleDriverInput(deltaTime, input);
    } else {
      // Natural deceleration / friction when unoccupied
      this.speed *= Math.max(0, 1.0 - deltaTime * 3.5);
      this.steerAngle *= Math.max(0, 1.0 - deltaTime * 5.0);
    }

    // Move forward based on current heading and speed
    const forwardX = Math.sin(this.heading);
    const forwardZ = Math.cos(this.heading);

    const prevPos = this.position.clone();
    this.position.x += forwardX * this.speed * deltaTime;
    this.position.z += forwardZ * this.speed * deltaTime;

    // Check collision against city buildings
    this.updateCollider();
    if (worldColliders && worldColliders.length > 0) {
      let collided = false;
      for (const box of worldColliders) {
        if (this.collider.intersectsBox(box)) {
          collided = true;
          break;
        }
      }

      if (collided) {
        // Revert position and bounce back
        this.position.copy(prevPos);
        if (Math.abs(this.speed) > 4.0) {
          this.audio.playCollision(Math.abs(this.speed) / 10);
        }
        this.speed = -this.speed * 0.35;
        this.updateCollider();
      }
    }

    // Update mesh position and rotation
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.heading;

    // Rotate wheels
    this.wheelRotation += (this.speed / 0.38) * deltaTime;
    this.wheels.forEach(w => {
      w.rotation.x = this.wheelRotation;
    });

    // Steer front wheels
    this.frontWheelPivots.forEach(p => {
      p.rotation.y = this.steerAngle;
    });

    // Update engine audio pitch if player is driving
    if (this.isOccupied) {
      const speedNorm = Math.abs(this.speed) / this.config.maxSpeed;
      const throttle = input && input.isKeyDown('KeyW') ? 1 : 0;
      this.audio.updateEngine(speedNorm, throttle);
    }
  }

  private handleDriverInput(deltaTime: number, input: InputManager): void {
    const isAccelerating = input.isKeyDown('KeyW');
    const isBraking = input.isKeyDown('KeyS');
    const isSteeringLeft = input.isKeyDown('KeyA');
    const isSteeringRight = input.isKeyDown('KeyD');
    const isHandbrake = input.isKeyDown('Space');

    // 1. Acceleration / Reverse
    if (isAccelerating) {
      if (this.speed < 0) {
        // Braking while in reverse
        this.speed += this.config.braking * deltaTime;
      } else {
        this.speed += this.config.acceleration * deltaTime;
        if (this.speed > this.config.maxSpeed) {
          this.speed = this.config.maxSpeed;
        }
      }
    } else if (isBraking) {
      if (this.speed > 0.5) {
        // Normal foot brake
        this.speed -= this.config.braking * deltaTime;
      } else {
        // Reverse
        this.speed -= this.config.reverseSpeed * deltaTime;
        if (this.speed < -this.config.reverseSpeed * 2.5) {
          this.speed = -this.config.reverseSpeed * 2.5;
        }
      }
    } else {
      // Natural engine drag
      this.speed *= Math.max(0, 1.0 - deltaTime * 1.2);
    }

    // Handbrake
    if (isHandbrake) {
      this.speed *= Math.max(0, 1.0 - deltaTime * 5.0);
      if (Math.abs(this.speed) > 6 && (isSteeringLeft || isSteeringRight)) {
        this.audio.playTireScreech();
      }
    }

    // 2. Steering
    const maxSteer = Math.PI / 6.0; // 30 degrees max steer
    let targetSteer = 0;
    if (isSteeringLeft) targetSteer += maxSteer;
    if (isSteeringRight) targetSteer -= maxSteer;

    // Turn faster at low-medium speed, wider radius at high speed
    const speedRatio = Math.min(1.0, Math.abs(this.speed) / 10.0);
    const steerSpeed = 6.0;
    this.steerAngle += (targetSteer - this.steerAngle) * deltaTime * steerSpeed;

    // Apply heading turn proportional to speed and steer
    if (Math.abs(this.speed) > 0.2) {
      const turnDirection = this.speed >= 0 ? 1 : -1;
      const turnRate = (this.steerAngle * this.config.turnSpeed * speedRatio) * turnDirection;
      this.heading += turnRate * deltaTime;
    }
  }

  public getSpeedMPH(): number {
    return Math.round(Math.abs(this.speed) * 2.237); // m/s to mph
  }

  public getExitPosition(): THREE.Vector3 {
    // Driver side (left door) exit offset in world coordinates
    const leftX = Math.cos(this.heading) * -2.2;
    const leftZ = -Math.sin(this.heading) * -2.2;
    return new THREE.Vector3(this.position.x + leftX, 0, this.position.z + leftZ);
  }

  private updateCollider(): void {
    this.collider.min.set(
      this.position.x - this.halfWidth,
      0,
      this.position.z - this.halfLength
    );
    this.collider.max.set(
      this.position.x + this.halfWidth,
      1.8,
      this.position.z + this.halfLength
    );
  }
}
