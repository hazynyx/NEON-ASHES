import * as THREE from 'three';
import { Player } from '../player/Player.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { EventBus } from '../core/EventBus.ts';

export enum EnemyState {
  IDLE = 'IDLE',
  ALERT = 'ALERT',
  ATTACKING = 'ATTACKING',
  DEAD = 'DEAD'
}

export class Enemy {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public heading: number = 0;
  public health: number = 60;
  public maxHealth: number = 60;
  public state: EnemyState = EnemyState.IDLE;
  public isDead: boolean = false;

  private scene: THREE.Scene;
  private audio: AudioManager;
  private eventBus: EventBus;

  // Limbs
  private torsoMesh!: THREE.Mesh;
  private headMesh!: THREE.Mesh;
  private rightArm!: THREE.Group;
  private leftArm!: THREE.Group;
  private muzzleFlash!: THREE.PointLight;

  // AI timing
  private shootCooldown: number = 1.0;
  private shootTimer: number = 0;
  private walkAnimTimer: number = 0;

  constructor(scene: THREE.Scene, spawnPos: THREE.Vector3, audio: AudioManager) {
    this.scene = scene;
    this.audio = audio;
    this.eventBus = EventBus.getInstance();
    this.position = spawnPos.clone();

    this.mesh = new THREE.Group();
    this.buildEnemyMesh();
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // Tag for bullet hit detection
    (this.mesh as any).isEnemy = true;
    (this.mesh as any).enemyEntity = this;
  }

  private buildEnemyMesh(): void {
    // Marrow Syndicate Colors: Tactical Charcoal, Crimson Vest/Tie
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xcaa078 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 }); // Black tactical vest
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.7 }); // Dark Crimson shirt
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x27272a });
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8 });

    // 1. Torso
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
    this.torsoMesh = new THREE.Mesh(torsoGeo, vestMat);
    this.torsoMesh.position.y = 1.15;
    this.torsoMesh.castShadow = true;
    this.mesh.add(this.torsoMesh);

    // Collar
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.33), shirtMat);
    collar.position.set(0, 1.35, 0);
    this.mesh.add(collar);

    // 2. Head
    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.28), skinMat);
    this.headMesh.position.y = 1.7;
    this.headMesh.castShadow = true;
    this.mesh.add(this.headMesh);

    // Sunglasses / Mask
    const shades = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.1), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    shades.position.set(0, 1.72, 0.14);
    this.mesh.add(shades);

    // 3. Arms & Weapon
    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.38, 1.45, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, vestMat);
    rightArmMesh.position.y = -0.3;
    this.rightArm.add(rightArmMesh);

    // Syndicate Pistol
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.35), gunMat);
    gun.position.set(0, -0.6, 0.2);
    this.rightArm.add(gun);

    this.muzzleFlash = new THREE.PointLight(0xffaa22, 0, 6);
    this.muzzleFlash.position.set(0, -0.6, 0.4);
    this.rightArm.add(this.muzzleFlash);

    this.mesh.add(this.rightArm);

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.38, 1.45, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, vestMat);
    leftArmMesh.position.y = -0.3;
    this.leftArm.add(leftArmMesh);
    this.mesh.add(this.leftArm);

    // 4. Legs
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.22);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.16, 0.4, 0);
    this.mesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.16, 0.4, 0);
    this.mesh.add(rightLeg);
  }

  public update(deltaTime: number, player: Player): void {
    if (this.isDead) return;

    // Decay muzzle flash
    if (this.muzzleFlash.intensity > 0) {
      this.muzzleFlash.intensity -= deltaTime * 30;
      if (this.muzzleFlash.intensity < 0) this.muzzleFlash.intensity = 0;
    }

    const distToPlayer = this.position.distanceTo(player.position);

    // If player is within 35 meters, enemy becomes alert and engages
    if (distToPlayer < 35) {
      this.state = EnemyState.ATTACKING;
    }

    if (this.state === EnemyState.ATTACKING) {
      // Face towards player
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;
      this.heading = Math.atan2(dx, dz);
      this.mesh.rotation.y = this.heading;

      // Raise weapon arm
      this.rightArm.rotation.x = -Math.PI / 2;

      // Maintain tactical firing distance (close in if further than 8m, stop if closer)
      if (distToPlayer > 8.0) {
        const speed = 2.8;
        this.position.x += Math.sin(this.heading) * speed * deltaTime;
        this.position.z += Math.cos(this.heading) * speed * deltaTime;
        this.mesh.position.copy(this.position);

        this.walkAnimTimer += deltaTime * 8;
        this.leftArm.rotation.x = Math.sin(this.walkAnimTimer) * 0.5;
      } else {
        this.leftArm.rotation.x = -Math.PI / 2.5; // Two handed aim
      }

      // Shoot at player
      this.shootTimer += deltaTime;
      if (this.shootTimer >= this.shootCooldown) {
        this.shootTimer = 0;
        this.fireAtPlayer(player);
      }
    }
  }

  private fireAtPlayer(player: Player): void {
    this.muzzleFlash.intensity = 3.5;
    this.audio.playGunshot();

    // Damage player if not behind solid cover (simple distance-weighted accuracy)
    const dist = this.position.distanceTo(player.position);
    const hitChance = Math.max(0.25, 0.7 - dist * 0.015);

    if (Math.random() < hitChance) {
      const damage = Math.floor(10 + Math.random() * 8);
      player.takeDamage(damage);
    }
  }

  public takeDamage(amount: number): void {
    if (this.isDead) return;
    this.health -= amount;

    // Flinch
    this.mesh.position.y += 0.08;
    setTimeout(() => {
      this.mesh.position.y = this.position.y;
    }, 60);

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isDead = true;
    this.state = EnemyState.DEAD;
    this.health = 0;

    // Collapse to floor animation
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0.2;

    this.eventBus.emit('enemy:killed', { enemy: this });
  }
}

export class EnemyManager {
  public enemies: Enemy[] = [];
  private scene: THREE.Scene;
  private audio: AudioManager;
  private eventBus: EventBus;

  constructor(scene: THREE.Scene, audio: AudioManager) {
    this.scene = scene;
    this.audio = audio;
    this.eventBus = EventBus.getInstance();

    // Listen for player gunfire raycast hits
    this.eventBus.on('npc:hit', ({ npc, point }) => {
      if ((npc as any).isEnemy) {
        (npc as any).enemyEntity.takeDamage(35);
      }
    });
  }

  public spawnSyndicateAmbush(pos1: THREE.Vector3, pos2: THREE.Vector3): void {
    const e1 = new Enemy(this.scene, pos1, this.audio);
    const e2 = new Enemy(this.scene, pos2, this.audio);
    this.enemies.push(e1, e2);
  }

  public update(deltaTime: number, player: Player): void {
    this.enemies.forEach(e => e.update(deltaTime, player));
  }

  public areAllDead(): boolean {
    if (this.enemies.length === 0) return false;
    return this.enemies.every(e => e.isDead);
  }
}
