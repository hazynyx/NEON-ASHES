import * as THREE from 'three';

export class ThirdPersonCamera {
  public camera: THREE.PerspectiveCamera;
  
  // Orbit angles
  public yaw: number = 0;
  public pitch: number = 0.2; // slight downward angle

  // Camera distances
  private normalDistance: number = 4.2;
  private aimDistance: number = 2.2;
  private vehicleDistance: number = 6.8;
  private currentDistance: number = 4.2;

  // Offsets
  private playerOffset: THREE.Vector3 = new THREE.Vector3(0, 1.6, 0); // Eye height
  private aimOffset: THREE.Vector3 = new THREE.Vector3(0.55, 1.5, 0); // Shoulder offset

  // Smoothing
  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private smoothedTarget: THREE.Vector3 = new THREE.Vector3();
  private cameraLookAt: THREE.Vector3 = new THREE.Vector3();

  // Mode flags
  public isAiming: boolean = false;
  public isVehicleMode: boolean = false;

  // Settings
  public sensitivityMultiplier: number = 1.0;
  public invertY: boolean = false;

  constructor(fov: number = 65, aspect: number = window.innerWidth / window.innerHeight) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0, 3, 5);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public handleMouseLook(deltaX: number, deltaY: number, baseSensitivity: number = 0.0022): void {
    const sens = baseSensitivity * this.sensitivityMultiplier;
    this.yaw -= deltaX * sens;
    const ySign = this.invertY ? -1 : 1;
    this.pitch += deltaY * sens * ySign;

    // Clamp pitch
    const maxPitch = Math.PI / 2.3; // ~78 deg
    const minPitch = -Math.PI / 3.0; // ~-60 deg
    this.pitch = Math.max(minPitch, Math.min(maxPitch, this.pitch));
  }

  public update(
    targetPos: THREE.Vector3,
    targetHeading: number,
    deltaTime: number,
    worldColliders?: THREE.Box3[]
  ): void {
    // Determine desired distance & offsets
    let desiredDist = this.normalDistance;
    let offset = this.playerOffset;

    if (this.isAiming) {
      desiredDist = this.aimDistance;
      offset = this.aimOffset;
    } else if (this.isVehicleMode) {
      desiredDist = this.vehicleDistance;
      // In vehicle mode, gently align camera yaw with vehicle heading if not moving mouse
      const headingDiff = targetHeading - this.yaw;
      // Normalize angle difference to [-PI, PI]
      const normDiff = Math.atan2(Math.sin(headingDiff), Math.cos(headingDiff));
      this.yaw += normDiff * Math.min(1.0, deltaTime * 2.5);
    }

    // Smoothly transition distance
    this.currentDistance += (desiredDist - this.currentDistance) * Math.min(1.0, deltaTime * 8.0);

    // Smooth target tracking
    this.targetPosition.copy(targetPos).add(offset);
    this.smoothedTarget.lerp(this.targetPosition, Math.min(1.0, deltaTime * 12.0));

    // Calculate ideal camera position based on yaw & pitch
    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const cosYaw = Math.cos(this.yaw);
    const sinYaw = Math.sin(this.yaw);

    const camOffset = new THREE.Vector3(
      sinYaw * cosPitch * this.currentDistance,
      sinPitch * this.currentDistance,
      cosYaw * cosPitch * this.currentDistance
    );

    const desiredCamPos = this.smoothedTarget.clone().add(camOffset);

    // Camera raycast collision avoidance against world colliders
    if (worldColliders && worldColliders.length > 0) {
      const ray = new THREE.Ray(this.smoothedTarget, camOffset.clone().normalize());
      let closestDistance = this.currentDistance;

      for (const box of worldColliders) {
        const intersection = new THREE.Vector3();
        if (ray.intersectBox(box, intersection)) {
          const dist = this.smoothedTarget.distanceTo(intersection);
          if (dist < closestDistance && dist > 0.6) {
            closestDistance = Math.max(0.7, dist - 0.25);
          }
        }
      }

      desiredCamPos.copy(this.smoothedTarget).add(
        camOffset.clone().normalize().multiplyScalar(closestDistance)
      );
    }

    this.camera.position.copy(desiredCamPos);

    // Look at smoothed target point
    this.cameraLookAt.copy(this.smoothedTarget);
    this.camera.lookAt(this.cameraLookAt);
  }

  public getForward(): THREE.Vector3 {
    const fwd = new THREE.Vector3();
    this.camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    return fwd;
  }

  public getRight(): THREE.Vector3 {
    const fwd = this.getForward();
    return new THREE.Vector3(-fwd.z, 0, fwd.x);
  }
}
