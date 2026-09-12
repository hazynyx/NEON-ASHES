import * as THREE from 'three';
import { InputManager } from '../core/InputManager.ts';
import { ThirdPersonCamera } from '../rendering/Camera.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { EventBus } from '../core/EventBus.ts';

export type WeaponType = 'pistol' | 'shotgun' | 'unarmed';

export class Player {
  public mesh: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public heading: number = 0; // rotation around Y axis

  // Visual Meshes
  private torsoMesh!: THREE.Mesh;
  private headMesh!: THREE.Mesh;
  private leftArm!: THREE.Group;
  private rightArm!: THREE.Group;
  private leftLeg!: THREE.Group;
  private rightLeg!: THREE.Group;
  private pistolMesh!: THREE.Group;
  private muzzleFlashLight!: THREE.PointLight;
  private shotgunMesh!: THREE.Group;
  private shotgunMuzzleFlash!: THREE.PointLight;

  // Animation timers
  private walkCycleTime: number = 0;
  private isAiming: boolean = false;
  private isCrouching: boolean = false;
  public isInVehicle: boolean = false;

  // Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public stamina: number = 100;
  public maxStamina: number = 100;
  public cash: number = 240;

  // Weapon & Combat
  public currentWeapon: WeaponType = 'pistol';
  public hasPistol: boolean = true;
  public hasShotgun: boolean = true;

  // Pistol ammo
  public ammoClip: number = 12;
  public maxClip: number = 12;
  public ammoReserve: number = 48;

  // Shotgun ammo
  public shotgunClip: number = 6;
  public maxShotgunClip: number = 6;
  public shotgunReserve: number = 24;

  public isReloading: boolean = false;
  private reloadTimer: number = 0;
  private shootCooldown: number = 0;

  public get currentWeaponName(): string {
    if (this.currentWeapon === 'pistol') return 'SERVICE PISTOL';
    if (this.currentWeapon === 'shotgun') return '12G TACTICAL SHOTGUN';
    return 'UNARMED';
  }

  public get activeClip(): number {
    if (this.currentWeapon === 'pistol') return this.ammoClip;
    if (this.currentWeapon === 'shotgun') return this.shotgunClip;
    return 0;
  }

  public get activeReserve(): number {
    if (this.currentWeapon === 'pistol') return this.ammoReserve;
    if (this.currentWeapon === 'shotgun') return this.shotgunReserve;
    return 0;
  }

  // Physics tuning
  private walkSpeed: number = 3.8;
  private jogSpeed: number = 6.8;
  private sprintSpeed: number = 10.2;
  private crouchSpeed: number = 2.4;
  private jumpForce: number = 7.2;
  private gravity: number = 20.0;
  private isGrounded: boolean = true;

  // Audio & events
  private audio: AudioManager;
  private eventBus: EventBus;
  private footstepTimer: number = 0;

  constructor(scene: THREE.Scene, audio: AudioManager) {
    this.audio = audio;
    this.eventBus = EventBus.getInstance();
    this.mesh = new THREE.Group();
    this.buildCharacterMesh();
    scene.add(this.mesh);

    // Initial spawn coordinates (Eastline roadside near Lena's apartment)
    this.position.set(30, 0, -20);
    this.mesh.position.copy(this.position);
  }

  private buildCharacterMesh(): void {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.7 }); // Kaleb's brown mechanic jacket
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 }); // Dark cargo pants
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
    this.torsoMesh = new THREE.Mesh(torsoGeo, jacketMat);
    this.torsoMesh.position.y = 1.15;
    this.torsoMesh.castShadow = true;
    this.mesh.add(this.torsoMesh);

    // 2. Head & Hair
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.7;

    const headGeo = new THREE.BoxGeometry(0.3, 0.32, 0.3);
    this.headMesh = new THREE.Mesh(headGeo, skinMat);
    this.headMesh.castShadow = true;
    headGroup.add(this.headMesh);

    const hairGeo = new THREE.BoxGeometry(0.32, 0.12, 0.32);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 0.14;
    headGroup.add(hairMesh);

    this.mesh.add(headGroup);

    // 3. Arms
    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.38, 1.45, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, jacketMat);
    leftArmMesh.position.y = -0.3;
    leftArmMesh.castShadow = true;
    this.leftArm.add(leftArmMesh);
    this.mesh.add(this.leftArm);

    // Right Arm (Weapon Arm)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.38, 1.45, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, jacketMat);
    rightArmMesh.position.y = -0.3;
    rightArmMesh.castShadow = true;
    this.rightArm.add(rightArmMesh);

    // Service Pistol attached to right hand
    this.pistolMesh = new THREE.Group();
    this.pistolMesh.position.set(0, -0.6, 0.15);

    const gunBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const gunSlide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.32), gunBodyMat);
    const gunGrip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.1), gunBodyMat);
    gunGrip.position.set(0, -0.1, -0.06);
    this.pistolMesh.add(gunSlide);
    this.pistolMesh.add(gunGrip);

    // Muzzle flash point light
    this.muzzleFlashLight = new THREE.PointLight(0xffaa33, 0, 8);
    this.muzzleFlashLight.position.set(0, 0, 0.25);
    this.pistolMesh.add(this.muzzleFlashLight);

    this.rightArm.add(this.pistolMesh);

    // 12G Tactical Shotgun attached to right hand
    this.shotgunMesh = new THREE.Group();
    this.shotgunMesh.position.set(0, -0.55, 0.25);

    const shotgunMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85, roughness: 0.25 });
    const stockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.68), shotgunMat);
    barrel.position.set(0, 0, 0.1);
    this.shotgunMesh.add(barrel);

    const magTube = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.62), shotgunMat);
    magTube.position.set(0, -0.07, 0.12);
    this.shotgunMesh.add(magTube);

    const forend = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.22), stockMat);
    forend.position.set(0, -0.06, 0.18);
    this.shotgunMesh.add(forend);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.12), stockMat);
    grip.position.set(0, -0.14, -0.16);
    this.shotgunMesh.add(grip);

    this.shotgunMuzzleFlash = new THREE.PointLight(0xff7700, 0, 12);
    this.shotgunMuzzleFlash.position.set(0, 0, 0.48);
    this.shotgunMesh.add(this.shotgunMuzzleFlash);

    this.shotgunMesh.visible = false;
    this.rightArm.add(this.shotgunMesh);

    this.mesh.add(this.rightArm);

    // 4. Legs
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.22);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.18, 0.75, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.35;
    leftLegMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh);

    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.32), bootsMat);
    leftBoot.position.set(0, -0.7, 0.04);
    leftBoot.castShadow = true;
    this.leftLeg.add(leftBoot);
    this.mesh.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.18, 0.75, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.35;
    rightLegMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.32), bootsMat);
    rightBoot.position.set(0, -0.7, 0.04);
    rightBoot.castShadow = true;
    this.rightLeg.add(rightBoot);
    this.mesh.add(this.rightLeg);
  }

  public update(
    deltaTime: number,
    input: InputManager,
    camera: ThirdPersonCamera,
    worldColliders: THREE.Box3[],
    scene: THREE.Scene
  ): void {
    if (this.isInVehicle) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;

    // 0. Weapon selection (Keys 1, 2, 3)
    if (input.isKeyPressed('Digit1')) {
      if (this.currentWeapon !== 'pistol') {
        this.currentWeapon = 'pistol';
        this.isReloading = false;
        this.audio.playReload();
      }
    } else if (input.isKeyPressed('Digit2') && this.hasShotgun) {
      if (this.currentWeapon !== 'shotgun') {
        this.currentWeapon = 'shotgun';
        this.isReloading = false;
        this.audio.playReload();
      }
    } else if (input.isKeyPressed('Digit3')) {
      if (this.currentWeapon !== 'unarmed') {
        this.currentWeapon = 'unarmed';
        this.isReloading = false;
        this.audio.playUIClick();
      }
    }

    // 1. Check Aiming (Right Mouse Button)
    this.isAiming = input.isMouseButtonDown(2) && this.currentWeapon !== 'unarmed';
    camera.isAiming = this.isAiming;

    // 2. Check Crouch (C key)
    if (input.isKeyPressed('KeyC')) {
      this.isCrouching = !this.isCrouching;
    }

    // 3. Movement Direction from Input (WASD relative to camera yaw)
    let moveX = 0;
    let moveZ = 0;

    if (input.isKeyDown('KeyW')) moveZ += 1;
    if (input.isKeyDown('KeyS')) moveZ -= 1;
    if (input.isKeyDown('KeyA')) moveX -= 1;
    if (input.isKeyDown('KeyD')) moveX += 1;

    const isMoving = (moveX !== 0 || moveZ !== 0);

    // Sprint & Stamina
    const wantsSprint = input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight');
    const isSprinting = isMoving && wantsSprint && !this.isCrouching && !this.isAiming && this.stamina > 5;

    let currentSpeed = this.jogSpeed;
    if (this.isCrouching) {
      currentSpeed = this.crouchSpeed;
    } else if (isSprinting) {
      currentSpeed = this.sprintSpeed;
      this.stamina = Math.max(0, this.stamina - deltaTime * 18);
    } else if (this.isAiming) {
      currentSpeed = this.walkSpeed * 0.8;
    } else {
      // Normal jog/walk, regenerate stamina
      this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 14);
    }

    if (!isMoving && !isSprinting) {
      this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 22);
    }

    // Calculate movement vector in world space based on camera heading
    const camFwd = camera.getForward();
    const camRight = camera.getRight();

    const desiredMove = new THREE.Vector3();
    if (isMoving) {
      desiredMove.addScaledVector(camFwd, moveZ);
      desiredMove.addScaledVector(camRight, moveX);
      desiredMove.normalize().multiplyScalar(currentSpeed);

      // Rotate character towards movement direction or towards camera if aiming
      if (this.isAiming) {
        this.heading = camera.yaw;
      } else {
        this.heading = Math.atan2(desiredMove.x, desiredMove.z);
      }
    } else if (this.isAiming) {
      this.heading = camera.yaw;
    }

    // Smooth horizontal velocity
    this.velocity.x = desiredMove.x;
    this.velocity.z = desiredMove.z;

    // Jump (Space key)
    if (input.isKeyPressed('Space') && this.isGrounded && !this.isCrouching) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      this.audio.playFootstep();
    }

    // Gravity
    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * deltaTime;
    }

    // Apply movement with collision resolution
    this.applyMovementWithCollision(deltaTime, worldColliders);

    // Update mesh position and rotation
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.heading;

    // Procedural Animation of Limbs
    this.animateLimbs(deltaTime, isMoving, isSprinting, currentSpeed);

    // Weapon Combat & Shooting
    this.handleCombat(deltaTime, input, camera, scene);
  }

  private applyMovementWithCollision(deltaTime: number, worldColliders: THREE.Box3[]): void {
    // Propose new position
    const nextPos = this.position.clone().addScaledVector(this.velocity, deltaTime);

    // Ground collision
    if (nextPos.y <= 0) {
      nextPos.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Player bounding box for world collision
    const playerRadius = 0.35;
    const playerHeight = this.isCrouching ? 1.2 : 1.85;

    // Check X axis movement
    const testBoxX = new THREE.Box3(
      new THREE.Vector3(nextPos.x - playerRadius, this.position.y + 0.1, this.position.z - playerRadius),
      new THREE.Vector3(nextPos.x + playerRadius, this.position.y + playerHeight, this.position.z + playerRadius)
    );

    let collideX = false;
    for (const box of worldColliders) {
      if (testBoxX.intersectsBox(box)) {
        collideX = true;
        break;
      }
    }
    if (!collideX) {
      this.position.x = nextPos.x;
    } else {
      this.velocity.x = 0;
    }

    // Check Z axis movement
    const testBoxZ = new THREE.Box3(
      new THREE.Vector3(this.position.x - playerRadius, this.position.y + 0.1, nextPos.z - playerRadius),
      new THREE.Vector3(this.position.x + playerRadius, this.position.y + playerHeight, nextPos.z + playerRadius)
    );

    let collideZ = false;
    for (const box of worldColliders) {
      if (testBoxZ.intersectsBox(box)) {
        collideZ = true;
        break;
      }
    }
    if (!collideZ) {
      this.position.z = nextPos.z;
    } else {
      this.velocity.z = 0;
    }

    this.position.y = nextPos.y;
  }

  private animateLimbs(deltaTime: number, isMoving: boolean, isSprinting: boolean, currentSpeed: number): void {
    // Crouch vertical adjustment
    const targetTorsoY = this.isCrouching ? 0.75 : 1.15;
    this.torsoMesh.position.y += (targetTorsoY - this.torsoMesh.position.y) * deltaTime * 12;

    if (isMoving && this.isGrounded) {
      const stepFreq = isSprinting ? 14 : 9;
      this.walkCycleTime += deltaTime * stepFreq;

      const legAngle = Math.sin(this.walkCycleTime) * 0.6;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      if (!this.isAiming) {
        this.leftArm.rotation.x = -legAngle * 0.7;
        this.rightArm.rotation.x = legAngle * 0.7;
      }

      // Footstep sound interval
      this.footstepTimer += deltaTime;
      if (this.footstepTimer > (isSprinting ? 0.28 : 0.42)) {
        this.audio.playFootstep();
        this.footstepTimer = 0;
      }
    } else {
      // Idle pose
      this.leftLeg.rotation.x *= 0.8;
      this.rightLeg.rotation.x *= 0.8;
      if (!this.isAiming) {
        this.leftArm.rotation.x *= 0.8;
        this.rightArm.rotation.x *= 0.8;
      }
      this.footstepTimer = 0;
    }

    // Aiming Pose: Right arm raised pointing forward with weapon
    if (this.isAiming) {
      this.rightArm.rotation.x = -Math.PI / 2;
      this.rightArm.rotation.y = -0.15;
      this.leftArm.rotation.x = -Math.PI / 2.3;
      this.leftArm.rotation.y = 0.35; // Two-handed grip
    } else {
      this.rightArm.rotation.y = 0;
      this.leftArm.rotation.y = 0;
    }

    this.pistolMesh.visible = (this.currentWeapon === 'pistol');
    this.shotgunMesh.visible = (this.currentWeapon === 'shotgun');
  }

  private handleCombat(deltaTime: number, input: InputManager, camera: ThirdPersonCamera, scene: THREE.Scene): void {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }

    // Turn off muzzle flashes
    if (this.muzzleFlashLight.intensity > 0) {
      this.muzzleFlashLight.intensity -= deltaTime * 35;
      if (this.muzzleFlashLight.intensity < 0) this.muzzleFlashLight.intensity = 0;
    }
    if (this.shotgunMuzzleFlash.intensity > 0) {
      this.shotgunMuzzleFlash.intensity -= deltaTime * 30;
      if (this.shotgunMuzzleFlash.intensity < 0) this.shotgunMuzzleFlash.intensity = 0;
    }

    // Reload (R key)
    if (input.isKeyPressed('KeyR') && !this.isReloading && this.currentWeapon !== 'unarmed') {
      if (this.currentWeapon === 'pistol' && this.ammoClip < this.maxClip && this.ammoReserve > 0) {
        this.isReloading = true;
        this.reloadTimer = 1.2;
        this.audio.playReload();
      } else if (this.currentWeapon === 'shotgun' && this.shotgunClip < this.maxShotgunClip && this.shotgunReserve > 0) {
        this.isReloading = true;
        this.reloadTimer = 1.6;
        this.audio.playReload();
      }
    }

    if (this.isReloading) {
      this.reloadTimer -= deltaTime;
      if (this.reloadTimer <= 0) {
        if (this.currentWeapon === 'pistol') {
          const needed = this.maxClip - this.ammoClip;
          const take = Math.min(needed, this.ammoReserve);
          this.ammoClip += take;
          this.ammoReserve -= take;
        } else if (this.currentWeapon === 'shotgun') {
          const needed = this.maxShotgunClip - this.shotgunClip;
          const take = Math.min(needed, this.shotgunReserve);
          this.shotgunClip += take;
          this.shotgunReserve -= take;
        }
        this.isReloading = false;
      }
    }

    // Shoot (Left Click)
    if (input.isMouseButtonPressed(0) && this.shootCooldown <= 0 && !this.isReloading && this.currentWeapon !== 'unarmed') {
      if (this.currentWeapon === 'pistol') {
        if (this.ammoClip > 0) {
          this.ammoClip--;
          this.shootCooldown = 0.22; // Semi-auto fire rate
          this.muzzleFlashLight.intensity = 4.0;
          this.audio.playGunshot();

          this.performRaycastShot(camera, scene, 0, 0, 35);
          this.eventBus.emit('player:weaponFire', { weapon: 'pistol' });
        } else if (this.ammoReserve > 0) {
          this.isReloading = true;
          this.reloadTimer = 1.2;
          this.audio.playReload();
        }
      } else if (this.currentWeapon === 'shotgun') {
        if (this.shotgunClip > 0) {
          this.shotgunClip--;
          this.shootCooldown = 0.85; // Pump action delay
          this.shotgunMuzzleFlash.intensity = 6.0;
          this.audio.playShotgunFire();

          // 6 spread pellets with angular deviation
          for (let i = 0; i < 6; i++) {
            const spreadX = (Math.random() - 0.5) * 0.08;
            const spreadY = (Math.random() - 0.5) * 0.08;
            this.performRaycastShot(camera, scene, spreadX, spreadY, 25);
          }
          this.eventBus.emit('player:weaponFire', { weapon: 'shotgun' });
        } else if (this.shotgunReserve > 0) {
          this.isReloading = true;
          this.reloadTimer = 1.6;
          this.audio.playReload();
        }
      }
    }
  }

  private performRaycastShot(
    camera: ThirdPersonCamera,
    scene: THREE.Scene,
    spreadX: number = 0,
    spreadY: number = 0,
    damage: number = 35
  ): void {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), camera.camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    for (const hit of intersects) {
      // Don't hit player himself
      if (hit.object.parent === this.mesh || hit.object === this.mesh || hit.object.parent === this.rightArm) {
        continue;
      }

      // Create impact spark / flash
      const spark = new THREE.PointLight(0xffcc66, 2, 4);
      spark.position.copy(hit.point);
      scene.add(spark);
      setTimeout(() => {
        scene.remove(spark);
      }, 80);

      // Trigger event if hit an NPC or Enemy
      let targetObj: any = hit.object;
      while (targetObj && !targetObj.isNPC && !targetObj.isEnemy && targetObj.parent) {
        targetObj = targetObj.parent;
      }
      if (targetObj && targetObj.isNPC) {
        this.eventBus.emit('npc:hit', { npc: targetObj.npcEntity, point: hit.point, damage });
      } else if (targetObj && targetObj.isEnemy) {
        targetObj.enemyEntity.takeDamage(damage);
        this.eventBus.emit('enemy:hit', { enemy: targetObj.enemyEntity, point: hit.point, damage });
      }
      break;
    }
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.eventBus.emit('player:damage', { health: this.health, amount });
    if (this.health <= 0) {
      this.eventBus.emit('player:death');
    }
  }
}
