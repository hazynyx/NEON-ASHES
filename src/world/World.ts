import * as THREE from 'three';

export interface WorldPOI {
  id: string;
  name: string;
  position: THREE.Vector3;
  type: 'apartment' | 'garage' | 'docks' | 'store';
}

export class World {
  public scene: THREE.Scene;
  public colliders: THREE.Box3[] = [];
  public pois: WorldPOI[] = [];
  
  // Roads and buildings data for minimap
  public roads: Array<{ x1: number; z1: number; x2: number; z2: number; width: number }> = [];
  public buildingRects: Array<{ x: number; z: number; w: number; d: number }> = [];

  // Key story building positions
  public lenaApartmentPos: THREE.Vector3 = new THREE.Vector3(30, 0, -45);
  public adrianGaragePos: THREE.Vector3 = new THREE.Vector3(-60, 0, 50);
  public pier19Pos: THREE.Vector3 = new THREE.Vector3(65, 0, -180);

  // Streetlights
  private streetlightPoints: THREE.PointLight[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.buildCity();
  }

  private buildCity(): void {
    // 1. Ground Plane (City base)
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x181c22,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Build Road Grid (Eastline / Southside District)
    this.createRoadGrid();

    // 3. Build City Blocks & Buildings
    this.createCityBuildings();

    // 4. Build Lena's Apartment Complex (Special Story Building)
    this.createLenaApartment();

    // 5. Build Adrian's Garage
    this.createAdrianGarage();

    // 6. Build Old Harbor & Pier 19
    this.createOldHarborPier();

    // 7. Add Street Furniture & Props (Streetlights, Dumpsters, Hydrants)
    this.createStreetProps();
  }

  private createRoadGrid(): void {
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.8,
      metalness: 0.15
    });

    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x3d444d,
      roughness: 0.9,
      metalness: 0.05
    });

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f }); // Yellow divider
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xecf0f1 });

    // Define main avenues (Z-axis) and cross streets (X-axis)
    const avenuePositions = [-100, -50, 0, 50, 100];
    const streetPositions = [-120, -60, 0, 60, 120];

    const roadWidth = 14;
    const sidewalkWidth = 3.5;
    const sidewalkHeight = 0.2;

    // Create longitudinal avenues
    avenuePositions.forEach(x => {
      const roadGeo = new THREE.PlaneGeometry(roadWidth, 360);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.02, 0);
      road.receiveShadow = true;
      this.scene.add(road);

      this.roads.push({ x1: x, z1: -180, x2: x, z2: 180, width: roadWidth });

      // Yellow centerline
      const lineGeo = new THREE.PlaneGeometry(0.3, 350);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.03, 0);
      this.scene.add(line);

      // Sidewalks on left and right
      [-1, 1].forEach(side => {
        const swGeo = new THREE.BoxGeometry(sidewalkWidth, sidewalkHeight, 360);
        const sw = new THREE.Mesh(swGeo, sidewalkMat);
        const swX = x + side * (roadWidth / 2 + sidewalkWidth / 2);
        sw.position.set(swX, sidewalkHeight / 2, 0);
        sw.receiveShadow = true;
        this.scene.add(sw);
      });
    });

    // Create cross streets
    streetPositions.forEach(z => {
      const roadGeo = new THREE.PlaneGeometry(360, roadWidth);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.025, z);
      road.receiveShadow = true;
      this.scene.add(road);

      this.roads.push({ x1: -180, z1: z, x2: 180, z2: z, width: roadWidth });

      // Yellow centerline
      const lineGeo = new THREE.PlaneGeometry(350, 0.3);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.035, z);
      this.scene.add(line);
    });
  }

  private createCityBuildings(): void {
    const buildingColors = [0x2c333a, 0x1f2429, 0x363d45, 0x272c33, 0x3a424b];
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd993 }); // Warm lit windows
    const darkWindowMat = new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.2, metalness: 0.9 });

    // Grid blocks between roads
    const blockXCoords = [-75, -25, 25, 75];
    const blockZCoords = [-90, -30, 30, 90];

    blockXCoords.forEach(bx => {
      blockZCoords.forEach(bz => {
        // Skip blocks reserved for Lena's Apartment and Adrian's Garage
        if (Math.abs(bx - 25) < 15 && Math.abs(bz - (-30)) < 15) return;
        if (Math.abs(bx - (-75)) < 15 && Math.abs(bz - 30) < 15) return;

        // Populate block with 2-4 varied buildings
        const bWidth = 24;
        const bDepth = 32;
        const bHeight = 15 + Math.random() * 35; // 15m to 50m tall

        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const col = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        const bMat = new THREE.MeshStandardMaterial({
          color: col,
          roughness: 0.7,
          metalness: 0.2
        });

        const building = new THREE.Mesh(bGeo, bMat);
        building.position.set(bx, bHeight / 2, bz);
        building.castShadow = true;
        building.receiveShadow = true;
        this.scene.add(building);

        // Add to colliders & minimap
        const bbox = new THREE.Box3().setFromObject(building);
        this.colliders.push(bbox);
        this.buildingRects.push({ x: bx, z: bz, w: bWidth, d: bDepth });

        // Add decorative rooftop AC unit or antenna
        const acGeo = new THREE.BoxGeometry(4, 2, 4);
        const acMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.5 });
        const ac = new THREE.Mesh(acGeo, acMat);
        ac.position.set(bx + (Math.random() * 4 - 2), bHeight + 1, bz + (Math.random() * 4 - 2));
        this.scene.add(ac);

        // Add lit window strips on front and side facades
        const numFloors = Math.floor(bHeight / 3.5);
        for (let f = 1; f < numFloors; f++) {
          const floorY = f * 3.5;
          // Front window strip
          const winGeo = new THREE.PlaneGeometry(bWidth * 0.75, 1.2);
          const winMat = (f % 2 === 0 || Math.random() > 0.3) ? windowMat : darkWindowMat;
          const winMesh = new THREE.Mesh(winGeo, winMat);
          winMesh.position.set(bx, floorY, bz + bDepth / 2 + 0.05);
          this.scene.add(winMesh);

          // Back window strip
          const winMeshBack = new THREE.Mesh(winGeo, winMat);
          winMeshBack.position.set(bx, floorY, bz - bDepth / 2 - 0.05);
          winMeshBack.rotation.y = Math.PI;
          this.scene.add(winMeshBack);
        }

        // Add subtle neon shop sign on ground floor for night atmosphere
        if (Math.random() > 0.4) {
          const signColors = [0xe74c3c, 0x3498db, 0xe67e22, 0x9b59b6];
          const signCol = signColors[Math.floor(Math.random() * signColors.length)];
          const signGeo = new THREE.BoxGeometry(6, 1.2, 0.4);
          const signMat = new THREE.MeshBasicMaterial({ color: signCol });
          const sign = new THREE.Mesh(signGeo, signMat);
          sign.position.set(bx, 4, bz + bDepth / 2 + 0.3);
          this.scene.add(sign);
        }
      });
    });
  }

  private createLenaApartment(): void {
    const pos = this.lenaApartmentPos;
    const width = 28;
    const depth = 32;
    const height = 22; // 4-story residential brick building

    // Main building structure
    const bGeo = new THREE.BoxGeometry(width, height, depth);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21, // Red-brown brick tone
      roughness: 0.85,
      metalness: 0.1
    });

    const building = new THREE.Mesh(bGeo, bMat);
    building.position.set(pos.x, height / 2, pos.z);
    building.castShadow = true;
    building.receiveShadow = true;
    this.scene.add(building);

    // Collider
    const bbox = new THREE.Box3().setFromObject(building);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z, w: width, d: depth });

    // Lena's Entrance Canopy & Sign
    const canopyGeo = new THREE.BoxGeometry(8, 0.4, 4);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(pos.x, 3.8, pos.z + depth / 2 + 2);
    this.scene.add(canopy);

    // Neon Address / Building Sign: "128 EASTLINE APARTMENTS"
    const signGeo = new THREE.BoxGeometry(7, 0.8, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0xe58e26 }); // Amber neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, 4.8, pos.z + depth / 2 + 0.2);
    this.scene.add(sign);

    // Warm entrance porch light
    const porchLight = new THREE.PointLight(0xffa726, 1.5, 12);
    porchLight.position.set(pos.x, 3.4, pos.z + depth / 2 + 2);
    this.scene.add(porchLight);

    // Register POI
    this.pois.push({
      id: 'lena_apartment',
      name: "Lena's Apartment (128 Eastline)",
      position: new THREE.Vector3(pos.x, 0, pos.z + depth / 2 + 2.5),
      type: 'apartment'
    });
  }

  private createAdrianGarage(): void {
    const pos = this.adrianGaragePos;
    const width = 26;
    const depth = 28;
    const height = 9;

    const gGeo = new THREE.BoxGeometry(width, height, depth);
    const gMat = new THREE.MeshStandardMaterial({
      color: 0x374151, // Industrial steel/brick
      roughness: 0.8,
      metalness: 0.3
    });

    const garage = new THREE.Mesh(gGeo, gMat);
    garage.position.set(pos.x, height / 2, pos.z);
    garage.castShadow = true;
    garage.receiveShadow = true;
    this.scene.add(garage);

    // Collider
    const bbox = new THREE.Box3().setFromObject(garage);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z, w: width, d: depth });

    // Shutter door
    const shutterGeo = new THREE.BoxGeometry(8, 6, 0.2);
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.4 });
    const shutter = new THREE.Mesh(shutterGeo, shutterMat);
    shutter.position.set(pos.x, 3, pos.z + depth / 2 + 0.1);
    this.scene.add(shutter);

    // "VOSS AUTO REPAIR" Sign
    const signGeo = new THREE.BoxGeometry(12, 1.2, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Light blue neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, 7.5, pos.z + depth / 2 + 0.2);
    this.scene.add(sign);

    this.pois.push({
      id: 'adrian_garage',
      name: 'Adrian Voss Auto Repair',
      position: new THREE.Vector3(pos.x, 0, pos.z + depth / 2 + 2.5),
      type: 'garage'
    });
  }

  private createStreetProps(): void {
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.6 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff4d0 });

    // Place streetlights along road intersections
    const lightCoords = [
      { x: -58, z: -60 }, { x: -42, z: -60 },
      { x: -8, z: -60 }, { x: 8, z: -60 },
      { x: 42, z: -60 }, { x: 58, z: -60 },
      { x: -58, z: 0 }, { x: -42, z: 0 },
      { x: -8, z: 0 }, { x: 8, z: 0 },
      { x: 42, z: 0 }, { x: 58, z: 0 },
      { x: -58, z: 60 }, { x: -42, z: 60 },
      { x: -8, z: 60 }, { x: 8, z: 60 },
      { x: 42, z: 60 }, { x: 58, z: 60 }
    ];

    lightCoords.forEach(coord => {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(coord.x, 3.5, coord.z);
      pole.castShadow = true;
      this.scene.add(pole);

      // Lamp head
      const headGeo = new THREE.BoxGeometry(0.6, 0.25, 1.2);
      const head = new THREE.Mesh(headGeo, lampMat);
      head.position.set(coord.x, 7, coord.z);
      this.scene.add(head);

      // Point light
      const pLight = new THREE.PointLight(0xffecd1, 2.8, 28, 1.1);
      pLight.position.set(coord.x, 6.8, coord.z);
      this.scene.add(pLight);
      this.streetlightPoints.push(pLight);
    });

    // Add dumpsters & trash cans
    const dumpsterGeo = new THREE.BoxGeometry(3, 1.8, 1.8);
    const dumpsterMat = new THREE.MeshStandardMaterial({ color: 0x1e3a2f, roughness: 0.7 }); // Dark green
    [-40, 20, -80, 60].forEach((dx, i) => {
      const dumpster = new THREE.Mesh(dumpsterGeo, dumpsterMat);
      const dz = (i % 2 === 0) ? -25 : 35;
      dumpster.position.set(dx, 0.9, dz);
      dumpster.castShadow = true;
      dumpster.receiveShadow = true;
      this.scene.add(dumpster);

      const dBox = new THREE.Box3().setFromObject(dumpster);
      this.colliders.push(dBox);
    });
  }

  private createOldHarborPier(): void {
    const dockPos = this.pier19Pos;

    // 1. Water Surface
    const waterGeo = new THREE.PlaneGeometry(600, 300);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a192f,
      roughness: 0.15,
      metalness: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.3, -310);
    this.scene.add(water);

    // 2. Concrete Pier / Wharf Platform
    const pierGeo = new THREE.BoxGeometry(95, 1.2, 90);
    const pierMat = new THREE.MeshStandardMaterial({
      color: 0x333b45,
      roughness: 0.9,
      metalness: 0.1
    });
    const pier = new THREE.Mesh(pierGeo, pierMat);
    pier.position.set(dockPos.x, 0.6, dockPos.z);
    pier.receiveShadow = true;
    this.scene.add(pier);

    // Dock road for minimap
    this.roads.push({ x1: 50, z1: -120, x2: dockPos.x, z2: dockPos.z, width: 12 });

    // 3. Pier 19 Cold Storage Warehouse
    const whGeo = new THREE.BoxGeometry(32, 14, 28);
    const whMat = new THREE.MeshStandardMaterial({
      color: 0x222a36,
      roughness: 0.75,
      metalness: 0.3
    });
    const warehouse = new THREE.Mesh(whGeo, whMat);
    warehouse.position.set(dockPos.x + 20, 7, dockPos.z + 10);
    warehouse.castShadow = true;
    warehouse.receiveShadow = true;
    this.scene.add(warehouse);

    const whBox = new THREE.Box3().setFromObject(warehouse);
    this.colliders.push(whBox);
    this.buildingRects.push({ x: dockPos.x + 20, z: dockPos.z + 10, w: 32, d: 28 });

    // Warehouse Neon Sign
    const signGeo = new THREE.BoxGeometry(14, 1.4, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Cyan neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(dockPos.x + 20, 12, dockPos.z + 24.1);
    this.scene.add(sign);

    // 4. Harbor Gantry Crane
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.4 });
    const craneTower = new THREE.Mesh(new THREE.BoxGeometry(3.5, 32, 3.5), craneMat);
    craneTower.position.set(dockPos.x - 28, 16, dockPos.z - 20);
    craneTower.castShadow = true;
    this.scene.add(craneTower);

    const craneArm = new THREE.Mesh(new THREE.BoxGeometry(36, 2.5, 2.5), craneMat);
    craneArm.position.set(dockPos.x - 14, 30, dockPos.z - 20);
    craneArm.castShadow = true;
    this.scene.add(craneArm);

    // 5. Stacked Shipping Containers (Red, Blue, Green, Orange)
    const containerColors = [0xb91c1c, 0x1d4ed8, 0x15803d, 0xc2410c];
    const containerCoords = [
      { x: dockPos.x - 15, z: dockPos.z + 15, h: 0, c: 0 },
      { x: dockPos.x - 15, z: dockPos.z + 15, h: 2.8, c: 1 },
      { x: dockPos.x - 15, z: dockPos.z + 8, h: 0, c: 2 },
      { x: dockPos.x - 22, z: dockPos.z + 15, h: 0, c: 3 },
      { x: dockPos.x - 22, z: dockPos.z + 8, h: 0, c: 0 },
      { x: dockPos.x - 22, z: dockPos.z + 8, h: 2.8, c: 2 },
      { x: dockPos.x + 5, z: dockPos.z - 25, h: 0, c: 1 },
      { x: dockPos.x + 5, z: dockPos.z - 25, h: 2.8, c: 3 },
      { x: dockPos.x + 13, z: dockPos.z - 25, h: 0, c: 0 }
    ];

    containerCoords.forEach(cc => {
      const cGeo = new THREE.BoxGeometry(6.2, 2.6, 2.8);
      const cMat = new THREE.MeshStandardMaterial({
        color: containerColors[cc.c],
        roughness: 0.65,
        metalness: 0.4
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cc.x, 1.3 + cc.h, cc.z);
      cMesh.castShadow = true;
      cMesh.receiveShadow = true;
      this.scene.add(cMesh);

      const cBox = new THREE.Box3().setFromObject(cMesh);
      this.colliders.push(cBox);
      this.buildingRects.push({ x: cc.x, z: cc.z, w: 6.2, d: 2.8 });
    });

    this.pois.push({
      id: 'pier_19',
      name: 'Pier 19 Old Harbor',
      position: new THREE.Vector3(dockPos.x, 0, dockPos.z),
      type: 'docks'
    });
  }

  public updateStreetlights(timeOfDay: number): void {
    const isNight = timeOfDay < 6.0 || timeOfDay > 19.5;
    const intensity = isNight ? 1.0 : 0.0;
    this.streetlightPoints.forEach(light => {
      light.intensity = intensity;
    });
  }
}
