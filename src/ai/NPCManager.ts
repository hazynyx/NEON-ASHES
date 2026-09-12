import * as THREE from 'three';
import { Player } from '../player/Player.ts';
import { InputManager } from '../core/InputManager.ts';
import { EventBus } from '../core/EventBus.ts';

export interface NPCData {
  id: string;
  name: string;
  isStoryNPC: boolean;
  position: THREE.Vector3;
  heading: number;
  dialogue?: Array<{ speaker: string; text: string }>;
}

export class NPC {
  public mesh: THREE.Group;
  public data: NPCData;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public isFleeing: boolean = false;
  public fleeTimer: number = 0;

  // Limbs for walking
  private leftLeg!: THREE.Group;
  private rightLeg!: THREE.Group;
  private animTimer: number = 0;

  constructor(scene: THREE.Scene, data: NPCData) {
    this.data = data;
    this.position = data.position.clone();

    this.mesh = new THREE.Group();
    this.buildNPCMesh();
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = data.heading;
    scene.add(this.mesh);

    // Tag for bullet hit detection
    (this.mesh as any).isNPC = true;
    (this.mesh as any).npcEntity = this;
  }

  private buildNPCMesh(): void {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd2a078 });
    const clothesColors = [0x334155, 0x475569, 0x64748b, 0x1e293b, 0x581c87];
    const clothCol = this.data.isStoryNPC
      ? 0x854d0e // Brown/gold cardigan for neighbor Mrs. Gable
      : clothesColors[Math.floor(Math.random() * clothesColors.length)];

    const clothMat = new THREE.MeshStandardMaterial({ color: clothCol });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.28), clothMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    this.mesh.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    this.mesh.add(head);

    // Hair
    const hair = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.1, 0.28),
      new THREE.MeshStandardMaterial({ color: this.data.isStoryNPC ? 0x94a3b8 : 0x1c1917 })
    );
    hair.position.y = 1.74;
    this.mesh.add(hair);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.18, 0.7, 0.18);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.15, 0.7, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.35;
    this.leftLeg.add(leftLegMesh);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.15, 0.7, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.35;
    this.rightLeg.add(rightLegMesh);
    this.mesh.add(this.rightLeg);
  }

  public update(deltaTime: number): void {
    if (this.isFleeing) {
      this.fleeTimer -= deltaTime;
      if (this.fleeTimer <= 0) {
        this.isFleeing = false;
        this.velocity.set(0, 0, 0);
      } else {
        // Run away in direction
        this.position.addScaledVector(this.velocity, deltaTime);
        this.mesh.position.copy(this.position);
        this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);

        // Animate legs running
        this.animTimer += deltaTime * 12;
        this.leftLeg.rotation.x = Math.sin(this.animTimer) * 0.7;
        this.rightLeg.rotation.x = -Math.sin(this.animTimer) * 0.7;
        return;
      }
    }

    // Story NPCs stay stationary to talk
    if (this.data.isStoryNPC) {
      return;
    }

    // Gentle idle/patrol for ambient NPCs
    this.animTimer += deltaTime * 2;
    this.leftLeg.rotation.x *= 0.8;
    this.rightLeg.rotation.x *= 0.8;
  }

  public scare(fromPos: THREE.Vector3): void {
    if (this.data.isStoryNPC) return;
    this.isFleeing = true;
    this.fleeTimer = 5.0; // Flee for 5s
    const fleeDir = this.position.clone().sub(fromPos);
    fleeDir.y = 0;
    fleeDir.normalize().multiplyScalar(4.5); // Run speed
    this.velocity.copy(fleeDir);
  }
}

export class NPCManager {
  public npcs: NPC[] = [];
  public nearbyNPC: NPC | null = null;
  private scene: THREE.Scene;
  private eventBus: EventBus;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.eventBus = EventBus.getInstance();
    this.spawnNPCs();

    // Listen for gunfire to scare pedestrians
    this.eventBus.on('player:weaponFire', (data) => {
      this.handleGunfireScare();
    });
  }

  private spawnNPCs(): void {
    // 1. Story NPC: Mrs. Gable outside Lena's Apartment
    const mrsGable = new NPC(this.scene, {
      id: 'mrs_gable',
      name: 'Mrs. Gable',
      isStoryNPC: true,
      position: new THREE.Vector3(26, 0, -28), // Standing on sidewalk near entrance
      heading: Math.PI / 4,
      dialogue: [
        {
          speaker: 'MRS. GABLE',
          text: "Kaleb? Good heavens, child... I almost didn't recognize you. You look so much like Adrian."
        },
        {
          speaker: 'KALEB',
          text: "Mrs. Gable. I came as soon as I heard. Where is Lena? Her phone's been dead for days."
        },
        {
          speaker: 'MRS. GABLE',
          text: "Three nights ago, there was shouting in the hallway. A tall man in a dark coat was pounding on her door, demanding 'the ledger files'. Lena slipped out through the back alley."
        },
        {
          speaker: 'MRS. GABLE',
          text: "Her apartment door was left unlocked. Someone tore her place apart looking for something. Go inside and look for yourself, Kaleb. Be careful."
        }
      ]
    });
    this.npcs.push(mrsGable);

    // 2. Ambient Pedestrians around Eastline sidewalks
    const pedestrianSpawns = [
      { pos: new THREE.Vector3(38, 0, -15), heading: 0 },
      { pos: new THREE.Vector3(22, 0, 10), heading: Math.PI },
      { pos: new THREE.Vector3(-42, 0, -30), heading: Math.PI / 2 },
      { pos: new THREE.Vector3(-42, 0, 20), heading: -Math.PI / 2 },
      { pos: new THREE.Vector3(8, 0, -80), heading: 0 },
      { pos: new THREE.Vector3(-55, 0, 65), heading: Math.PI }
    ];

    pedestrianSpawns.forEach((spawn, idx) => {
      const npc = new NPC(this.scene, {
        id: `ped_${idx}`,
        name: 'Citizen',
        isStoryNPC: false,
        position: spawn.pos,
        heading: spawn.heading
      });
      this.npcs.push(npc);
    });
  }

  public update(deltaTime: number, player: Player, input: InputManager): void {
    this.nearbyNPC = null;
    let closestDist = 2.8;

    for (const npc of this.npcs) {
      npc.update(deltaTime);

      if (!player.isInVehicle) {
        const dist = player.position.distanceTo(npc.position);
        if (dist < closestDist) {
          closestDist = dist;
          this.nearbyNPC = npc;
        }
      }
    }
  }

  private handleGunfireScare(): void {
    this.npcs.forEach(npc => {
      if (!npc.data.isStoryNPC) {
        npc.scare(new THREE.Vector3(0, 0, 0));
      }
    });
  }
}
