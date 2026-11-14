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
    if (this.data.id === 'jonah_reyes') {
      this.buildJonahMesh();
      return;
    }

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

  private buildJonahMesh(): void {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd2a078, roughness: 0.8 });
    const coverallMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.75, metalness: 0.2 }); // Dark navy mechanic coveralls
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }); // Heavy brown leather toolbelt
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 }); // Steel-toe boots
    const toolMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 }); // Chrome vanadium steel
    const capMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }); // Grey shop cap
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }); // Amber name badge

    // 1. Torso (Mechanic Coveralls)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.74, 0.3), coverallMat);
    torso.position.y = 1.12;
    torso.castShadow = true;
    this.mesh.add(torso);

    // Embroidered "JONAH" name patch on left breast
    const patch = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.02), badgeMat);
    patch.position.set(-0.16, 1.28, 0.16);
    this.mesh.add(patch);

    // Heavy Leather Toolbelt with pockets
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.34), beltMat);
    belt.position.y = 0.78;
    this.mesh.add(belt);

    // Hanging socket wrench on belt loop
    const hangingWrench = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.04), toolMat);
    hangingWrench.position.set(-0.24, 0.72, 0.18);
    hangingWrench.rotation.z = -0.2;
    this.mesh.add(hangingWrench);

    // 2. Head with Stubble & Mechanic Cap
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.66;

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.26), skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Mechanic baseball cap
    const capDome = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.28), capMat);
    capDome.position.y = 0.14;
    headGroup.add(capDome);

    const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), capMat);
    capVisor.position.set(0, 0.1, 0.18);
    headGroup.add(capVisor);

    this.mesh.add(headGroup);

    // 3. Arms
    const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);

    // Left Arm (hanging at side)
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.38, 1.4, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, coverallMat);
    leftArmMesh.position.y = -0.3;
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), skinMat);
    leftHand.position.y = -0.65;
    leftArm.add(leftHand);
    this.mesh.add(leftArm);

    // Right Arm (raised forward holding heavy torque wrench)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.38, 1.4, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, coverallMat);
    rightArmMesh.position.y = -0.3;
    rightArmMesh.rotation.x = -0.6; // Angled forward
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), skinMat);
    rightHand.position.set(0, -0.6, 0.15);
    rightArm.add(rightHand);

    // Heavy-Duty Torque Wrench
    const wrenchShaft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), toolMat);
    wrenchShaft.position.set(0, -0.55, 0.25);
    wrenchShaft.rotation.x = 0.5;
    rightArm.add(wrenchShaft);

    const wrenchHead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), toolMat);
    wrenchHead.position.set(0, -0.38, 0.35);
    rightArm.add(wrenchHead);

    this.mesh.add(rightArm);

    // 4. Legs with Knee Patches & Work Boots
    const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.16, 0.7, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, coverallMat);
    leftLegMesh.position.y = -0.35;
    this.leftLeg.add(leftLegMesh);
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 0.28), bootsMat);
    leftBoot.position.set(0, -0.68, 0.04);
    this.leftLeg.add(leftBoot);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.16, 0.7, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, coverallMat);
    rightLegMesh.position.y = -0.35;
    this.rightLeg.add(rightLegMesh);
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 0.28), bootsMat);
    rightBoot.position.set(0, -0.68, 0.04);
    this.rightLeg.add(rightBoot);
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

    // Ambient Sidewalk Pedestrian Patrol
    this.animTimer += deltaTime * 5.5;
    const walkSpeed = 1.35; // ~3 mph walking speed
    const forwardX = Math.sin(this.mesh.rotation.y) * walkSpeed * deltaTime;
    const forwardZ = Math.cos(this.mesh.rotation.y) * walkSpeed * deltaTime;

    this.position.x += forwardX;
    this.position.z += forwardZ;
    this.mesh.position.copy(this.position);

    // Leg swinging animation
    this.leftLeg.rotation.x = Math.sin(this.animTimer) * 0.45;
    this.rightLeg.rotation.x = -Math.sin(this.animTimer) * 0.45;

    // Turn around at patrol limits
    this.patrolDistance += walkSpeed * deltaTime;
    if (this.patrolDistance > 24.0) {
      this.patrolDistance = 0;
      this.mesh.rotation.y += Math.PI; // Turn around 180 degrees
    }
  }

  private patrolDistance: number = 0;

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
      const source = data?.position;
      this.handleGunfireScare(source instanceof THREE.Vector3 ? source : null);
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

    // 2. Story NPC: Jonah Reyes at Adrian's Auto Repair garage forecourt
    const jonahReyes = new NPC(this.scene, {
      id: 'jonah_reyes',
      name: 'Jonah Reyes',
      isStoryNPC: true,
      position: new THREE.Vector3(-56, 0, 67),
      heading: Math.PI, // Facing South towards driveway
      dialogue: [
        {
          speaker: 'JONAH REYES',
          text: "Kaleb! Man, look at you... Two years in the outer counties and you still walk like you're carrying the weight of Vespera."
        },
        {
          speaker: 'KALEB',
          text: "Good to see you, Jonah. Someone tore Lena's place apart. She left a note pointing to Adrian's old safe in the shop."
        },
        {
          speaker: 'JONAH REYES',
          text: "Adrian's safe? Your old man kept that workbench locked down. But listen, Kaleb... Lena was here three nights ago asking about Adrian's old shipping clients. Some Marrow Syndicate muscle has been watching this garage ever since."
        },
        {
          speaker: 'JONAH REYES',
          text: "Hit the wall switch [E] to raise the workshop shutter. Safe's behind the Aurelia license plates on the back wall. But watch yourself."
        }
      ]
    });
    this.npcs.push(jonahReyes);

    // 3. Story NPC: Mara Vale at Southside Diner Patio
    const maraVale = new NPC(this.scene, {
      id: 'mara_vale',
      name: 'Mara Vale',
      isStoryNPC: true,
      position: new THREE.Vector3(50, 0, 34.8), // On Southside Diner patio under awning
      heading: -Math.PI / 3,
      dialogue: [
        {
          speaker: 'MARA VALE',
          text: "You're Kaleb Voss. Adrian's son. You carry yourself like him... cautious, calculating, and looking for answers."
        },
        {
          speaker: 'KALEB',
          text: "You're Mara Vale. The investigative journalist Lena trusted. What happened to my sister, Mara?"
        },
        {
          speaker: 'MARA VALE',
          text: "Lena uncovered a web of corruption. Meridian Properties isn't just redeveloping Eastline—they're executing violent forced evictions using Marrow Syndicate muscle, signed off by Councilman Vance Albright."
        },
        {
          speaker: 'MARA VALE',
          text: "Lena hid her evidence before vanishing. The crucial link is the secret acquisition agreement stored in Meridian's Central Vesper office."
        },
        {
          speaker: 'MARA VALE',
          text: "Infiltrate Meridian Properties in Central Vesper. Photograph their zoning buyout agreements from their ground-floor archive desk. Bring me the photos, and I'll unlock Lena's encrypted audio journal."
        },
        {
          speaker: 'KALEB',
          text: "Consider it done. Wait here."
        }
      ]
    });
    this.npcs.push(maraVale);

    // 3. Ambient Pedestrians around Eastline sidewalks
    const pedestrianSpawns = [
      { pos: new THREE.Vector3(38, 0, -15), heading: 0 },
      { pos: new THREE.Vector3(22, 0, 10), heading: Math.PI },
      { pos: new THREE.Vector3(-42, 0, -30), heading: Math.PI / 2 },
      { pos: new THREE.Vector3(-42, 0, 20), heading: -Math.PI / 2 },
      { pos: new THREE.Vector3(8, 0, -80), heading: 0 },
      { pos: new THREE.Vector3(-35, 0, 85), heading: 0 }
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
    let closestDist = 999;

    for (const npc of this.npcs) {
      npc.update(deltaTime);

      if (!player.isInVehicle) {
        const dist = player.position.distanceTo(npc.position);
        const maxDist = npc.data.isStoryNPC ? 3.8 : 2.5;
        if (dist < maxDist && dist < closestDist) {
          closestDist = dist;
          this.nearbyNPC = npc;
        }
      }
    }
  }

  private handleGunfireScare(source: THREE.Vector3 | null): void {
    this.npcs.forEach(npc => {
      if (!npc.data.isStoryNPC) {
        npc.scare(source || npc.position.clone().add(new THREE.Vector3(0, 0, 1)));
      }
    });
  }
}
