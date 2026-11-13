import * as THREE from 'three';

export class ApartmentInterior {
  public group: THREE.Group;
  public colliders: THREE.Box3[] = [];
  public origin: THREE.Vector3 = new THREE.Vector3(300, 0, -300);
  public spawnPos: THREE.Vector3 = new THREE.Vector3(300, 0, -298.2);
  public deskPos: THREE.Vector3 = new THREE.Vector3(297.2, 0, -302.2);
  public exitDoorPos: THREE.Vector3 = new THREE.Vector3(300, 0, -296.8);

  // Animated investigation beacon for the loose floorboard
  private floorboardBeacon!: THREE.Group;
  private animTime: number = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.buildApartment();
    scene.add(this.group);
  }

  private buildApartment(): void {
    const ox = this.origin.x;
    const oz = this.origin.z;
    const roomW = 10;
    const roomD = 8;
    const roomH = 3.4;

    // 0. Warm Atmospheric Room Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.8);
    this.group.add(ambientLight);

    // 1. Polished Hardwood Parquet Floor
    const floorGeo = new THREE.BoxGeometry(roomW, 0.2, roomD);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c17, // Rich warm polished oak
      roughness: 0.35,
      metalness: 0.15
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(ox, -0.1, oz);
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // 2. Ceiling with Molded Trim
    const ceilGeo = new THREE.BoxGeometry(roomW, 0.2, roomD);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9
    });
    const ceilMesh = new THREE.Mesh(ceilGeo, ceilMat);
    ceilMesh.position.set(ox, roomH + 0.1, oz);
    this.group.add(ceilMesh);

    // 3. Wall Materials (Vintage Teal Wallpaper + Mahogany Wainscoting)
    const wallUpperMat = new THREE.MeshStandardMaterial({
      color: 0x133842, // Rich vintage teal plaster
      roughness: 0.75
    });
    const wallLowerMat = new THREE.MeshStandardMaterial({
      color: 0x2e180d, // Dark mahogany wainscoting wood
      roughness: 0.45,
      metalness: 0.1
    });

    // North Wall (Z = -304)
    const northWall = new THREE.Mesh(
      new THREE.BoxGeometry(roomW + 0.4, roomH, 0.3),
      wallUpperMat
    );
    northWall.position.set(ox, roomH / 2, oz - roomD / 2 - 0.15);
    this.group.add(northWall);
    this.colliders.push(new THREE.Box3().setFromObject(northWall));

    // North Wainscot
    const northWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(roomW + 0.4, 1.1, 0.35),
      wallLowerMat
    );
    northWainscot.position.set(ox, 0.55, oz - roomD / 2 - 0.12);
    this.group.add(northWainscot);

    // South Wall Left & Right Segments (Leaving Doorway in center at X = 300)
    const southLeft = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, roomH, 0.3),
      wallUpperMat
    );
    southLeft.position.set(ox - 2.8, roomH / 2, oz + roomD / 2 + 0.15);
    this.group.add(southLeft);
    this.colliders.push(new THREE.Box3().setFromObject(southLeft));

    const southRight = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, roomH, 0.3),
      wallUpperMat
    );
    southRight.position.set(ox + 2.8, roomH / 2, oz + roomD / 2 + 0.15);
    this.group.add(southRight);
    this.colliders.push(new THREE.Box3().setFromObject(southRight));

    const southHeader = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.1, 0.3),
      wallUpperMat
    );
    southHeader.position.set(ox, roomH - 0.55, oz + roomD / 2 + 0.15);
    this.group.add(southHeader);

    // South Wall Back Collider (Prevents backing out into void)
    const southWallBack = new THREE.Box3(
      new THREE.Vector3(ox - roomW / 2, 0, oz + roomD / 2),
      new THREE.Vector3(ox + roomW / 2, roomH, oz + roomD / 2 + 1.0)
    );
    this.colliders.push(southWallBack);

    // East Wall (X = 305)
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, roomH, roomD + 0.4),
      wallUpperMat
    );
    eastWall.position.set(ox + roomW / 2 + 0.15, roomH / 2, oz);
    this.group.add(eastWall);
    this.colliders.push(new THREE.Box3().setFromObject(eastWall));

    // West Wall with Window Frame (X = 295)
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, roomH, roomD + 0.4),
      wallUpperMat
    );
    westWall.position.set(ox - roomW / 2 - 0.15, roomH / 2, oz);
    this.group.add(westWall);
    this.colliders.push(new THREE.Box3().setFromObject(westWall));

    // 4. Entrance Door & Doormat
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d11, // Dark mahogany door
      roughness: 0.35,
      metalness: 0.2
    });
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.3, 0.12), doorMat);
    doorMesh.position.set(ox, 1.15, oz + roomD / 2);
    this.group.add(doorMesh);

    // Brass Door Knob & Lock Plate
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2
    });
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), brassMat);
    knob.position.set(ox + 0.48, 1.1, oz + roomD / 2 - 0.08);
    this.group.add(knob);

    // "UNIT 102" Plaque
    const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8 });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.03), plaqueMat);
    plaque.position.set(ox, 1.6, oz + roomD / 2 - 0.08);
    this.group.add(plaque);

    // Doormat
    const doormatMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95 });
    const doormat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 0.8), doormatMat);
    doormat.position.set(ox, 0.01, oz + roomD / 2 - 0.6);
    this.group.add(doormat);

    // 5. Window Looking Out to City Rain Silhouette
    const winGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.1
    });
    const winMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 2.8), winGlassMat);
    winMesh.position.set(ox - roomW / 2 + 0.02, 1.8, oz);
    this.group.add(winMesh);

    const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
    const winFrameH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 2.9), winFrameMat);
    winFrameH.position.set(ox - roomW / 2 + 0.03, 1.8, oz);
    this.group.add(winFrameH);

    // 6. Persian Area Rug in Living Area
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x831843, // Deep crimson Persian rug
      roughness: 0.9
    });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.02, 3.2), rugMat);
    rug.position.set(ox, 0.01, oz);
    this.group.add(rug);

    // 7. Investigation Desk & Evidence Area (North-West corner)
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x271406,
      roughness: 0.35,
      metalness: 0.1
    });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.3), deskMat);
    deskTop.position.set(ox - 2.8, 0.85, oz - 2.6);
    deskTop.castShadow = true;
    this.group.add(deskTop);

    // Desk Legs / Pedestals
    const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 1.1), deskMat);
    legLeft.position.set(ox - 3.75, 0.4, oz - 2.6);
    this.group.add(legLeft);

    const legRight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 1.1), deskMat);
    legRight.position.set(ox - 1.85, 0.4, oz - 2.6);
    this.group.add(legRight);

    // Desk Collider
    this.colliders.push(
      new THREE.Box3(
        new THREE.Vector3(ox - 4.1, 0, oz - 3.4),
        new THREE.Vector3(ox - 1.5, 1.2, oz - 1.8)
      )
    );

    // Ransacked Pulled-Out Desk Drawer resting on floor
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x3f220d, roughness: 0.5 });
    const pulledDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.7), drawerMat);
    pulledDrawer.position.set(ox - 2.0, 0.12, oz - 1.6);
    pulledDrawer.rotation.y = 0.4;
    this.group.add(pulledDrawer);

    // Scattered Paper Manila Case Folders on Desk & Floor
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
    const manilaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

    [-0.5, 0, 0.5].forEach((dx, i) => {
      const folder = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.3), i % 2 === 0 ? manilaMat : paperMat);
      folder.position.set(ox - 2.8 + dx, 0.91, oz - 2.6 + (i * 0.1));
      folder.rotation.y = 0.2 * (i - 1);
      this.group.add(folder);
    });

    // Papers spilled onto floor
    for (let p = 0; p < 6; p++) {
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.005, 0.35), paperMat);
      sheet.position.set(ox - 2.4 + (p * 0.22), 0.02, oz - 1.8 + ((p % 3) * 0.2));
      sheet.rotation.y = p * 0.7;
      this.group.add(sheet);
    }

    // Overturned Wooden Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), chairMat);
    chairSeat.position.set(ox - 2.8, 0.18, oz - 1.2);
    chairSeat.rotation.z = Math.PI / 2.2; // Tilted on its side
    chairSeat.rotation.y = 0.3;
    this.group.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.06), chairMat);
    chairBack.position.set(ox - 3.1, 0.38, oz - 1.2);
    chairBack.rotation.z = Math.PI / 2.2;
    this.group.add(chairBack);

    // Evidence Corkboard on Wall Above Desk
    const corkMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
    const corkFrameMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3 });

    const corkboard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 0.05), corkMat);
    corkboard.position.set(ox - 2.8, 2.1, oz - roomD / 2 + 0.05);
    this.group.add(corkboard);

    const corkFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.04), corkFrameMat);
    corkFrame.position.set(ox - 2.8, 2.1, oz - roomD / 2 + 0.03);
    this.group.add(corkFrame);

    // Pinned Evidence Polaroids & Red Yarn String
    const photoMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const redThreadMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    [-0.7, -0.2, 0.4, 0.8].forEach((px, idx) => {
      const pinPhoto = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.01), photoMat);
      pinPhoto.position.set(ox - 2.8 + px, 2.1 + (idx % 2 ? 0.2 : -0.2), oz - roomD / 2 + 0.08);
      pinPhoto.rotation.z = (idx - 1.5) * 0.1;
      this.group.add(pinPhoto);
    });

    // Red yarn line
    const yarnGeo = new THREE.CylinderGeometry(0.006, 0.006, 1.2, 4);
    const yarn1 = new THREE.Mesh(yarnGeo, redThreadMat);
    yarn1.position.set(ox - 2.8 - 0.35, 2.1, oz - roomD / 2 + 0.09);
    yarn1.rotation.z = Math.PI / 3;
    this.group.add(yarn1);

    // 8. Secret Loose Floorboard Compartment (Interactive Clue Target!)
    const cavityMat = new THREE.MeshStandardMaterial({ color: 0x110c08, roughness: 0.95 });
    const cavity = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.5), cavityMat);
    cavity.position.set(this.deskPos.x, -0.04, this.deskPos.z);
    this.group.add(cavity);

    // Displaced Floorboard Plank tilted open
    const loosePlank = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.22), floorMat);
    loosePlank.position.set(this.deskPos.x + 0.05, 0.06, this.deskPos.z - 0.15);
    loosePlank.rotation.x = -0.25;
    loosePlank.rotation.y = 0.15;
    this.group.add(loosePlank);

    // Hidden Manila Document Envelope nestled inside cavity
    const secretEnvelope = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.26), manilaMat);
    secretEnvelope.position.set(this.deskPos.x, 0.01, this.deskPos.z);
    secretEnvelope.rotation.y = 0.2;
    this.group.add(secretEnvelope);

    // Floorboard Pulsing Investigation Beacon
    this.floorboardBeacon = new THREE.Group();
    this.floorboardBeacon.position.set(this.deskPos.x, 0.05, this.deskPos.z);

    const beaconRingGeo = new THREE.RingGeometry(0.4, 0.65, 24);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.rotation.x = -Math.PI / 2;
    this.floorboardBeacon.add(beaconRing);

    const beaconDiamondGeo = new THREE.OctahedronGeometry(0.22, 0);
    const beaconDiamondMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      roughness: 0.2
    });
    const beaconDiamond = new THREE.Mesh(beaconDiamondGeo, beaconDiamondMat);
    beaconDiamond.position.y = 0.55;
    this.floorboardBeacon.add(beaconDiamond);

    this.group.add(this.floorboardBeacon);

    // 9. Lena's Bed & Sleeping Area (North-East corner)
    const bedFrameMat = new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.5 });
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.45, 1.6), bedFrameMat);
    bedFrame.position.set(ox + 3.4, 0.22, oz - 2.7);
    this.group.add(bedFrame);

    const mattressMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 1.45), mattressMat);
    mattress.position.set(ox + 3.4, 0.5, oz - 2.7);
    this.group.add(mattress);

    // Rumpled Navy Duvet
    const duvetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 1.4), duvetMat);
    duvet.position.set(ox + 3.2, 0.62, oz - 2.7);
    duvet.rotation.z = 0.05;
    this.group.add(duvet);

    // Bed Collider
    this.colliders.push(
      new THREE.Box3(
        new THREE.Vector3(ox + 2.1, 0, oz - 3.6),
        new THREE.Vector3(ox + 4.8, 1.0, oz - 1.8)
      )
    );

    // Nightstand with Bedside Lamp
    const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.6, 0.6), bedFrameMat);
    nightstand.position.set(ox + 4.3, 0.3, oz - 1.5);
    this.group.add(nightstand);

    // 10. Tall Bookshelf with Emptied Shelves (East wall)
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x2d1708, roughness: 0.4 });
    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.6, 1.8), shelfMat);
    shelfBack.position.set(ox + roomW / 2 - 0.25, 1.3, oz + 0.6);
    this.group.add(shelfBack);

    // Bookshelf Collider
    this.colliders.push(
      new THREE.Box3(
        new THREE.Vector3(ox + roomW / 2 - 0.7, 0, oz - 0.4),
        new THREE.Vector3(ox + roomW / 2, 2.7, oz + 1.6)
      )
    );

    // Fallen books on the floor near the bookshelf
    const bookColors = [0x991b1b, 0x1e3a8a, 0x065f46, 0x78350f];
    for (let b = 0; b < 5; b++) {
      const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[b % 4], roughness: 0.6 });
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.2), bookMat);
      book.position.set(ox + roomW / 2 - 0.8 - (b * 0.18), 0.03, oz + 0.5 + ((b % 2) * 0.25));
      book.rotation.y = b * 0.6;
      this.group.add(book);
    }

    // 11. Room Atmospheric Point Lights
    // Warm Ceiling Light
    const ceilingLamp = new THREE.PointLight(0xfef3c7, 3.2, 22);
    ceilingLamp.position.set(ox, roomH - 0.4, oz);
    this.group.add(ceilingLamp);

    // Ceiling Fixture Globe
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), globeMat);
    globe.position.set(ox, roomH - 0.25, oz);
    this.group.add(globe);

    // Investigation Desk Banker's Lamp (Amber Pool of Light)
    const deskLampLight = new THREE.PointLight(0xf59e0b, 4.5, 12);
    deskLampLight.position.set(ox - 2.8, 1.3, oz - 2.6);
    this.group.add(deskLampLight);

    const deskShadeMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Emerald green glass shade
      emissive: 0x16a34a,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.12, 12), deskShadeMat);
    lampShade.position.set(ox - 2.8, 1.15, oz - 2.6);
    this.group.add(lampShade);

    // Bedside Table Warm Lamp
    const bedLamp = new THREE.PointLight(0xf59e0b, 2.8, 10);
    bedLamp.position.set(ox + 4.3, 1.2, oz - 1.5);
    this.group.add(bedLamp);

    // Cool Window Moonlight
    const winLight = new THREE.PointLight(0x38bdf8, 1.6, 12);
    winLight.position.set(ox - roomW / 2 + 0.6, 1.8, oz);
    this.group.add(winLight);
  }

  public update(deltaTime: number): void {
    this.animTime += deltaTime;

    if (this.floorboardBeacon) {
      // Bob and spin diamond
      const diamond = this.floorboardBeacon.children[1];
      if (diamond) {
        diamond.position.y = 0.55 + Math.sin(this.animTime * 3.5) * 0.12;
        diamond.rotation.y += deltaTime * 2.0;
      }

      // Pulse ground ring
      const ring = this.floorboardBeacon.children[0];
      if (ring) {
        const pulse = 1.0 + Math.sin(this.animTime * 4.0) * 0.18;
        ring.scale.set(pulse, pulse, 1);
      }
    }
  }

  public setFloorboardBeaconVisible(visible: boolean): void {
    if (this.floorboardBeacon) {
      this.floorboardBeacon.visible = visible;
    }
  }
}
