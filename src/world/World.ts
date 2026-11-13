import * as THREE from 'three';
import { ApartmentInterior } from './ApartmentInterior.ts';

export interface WorldPOI {
  id: string;
  name: string;
  position: THREE.Vector3;
  type: 'apartment' | 'garage' | 'docks' | 'store' | 'diner' | 'office';
}

export class World {
  public scene: THREE.Scene;
  public colliders: THREE.Box3[] = [];
  public pois: WorldPOI[] = [];
  public apartmentInterior: ApartmentInterior;
  
  // Roads and buildings data for minimap
  public roads: Array<{ x1: number; z1: number; x2: number; z2: number; width: number }> = [];
  public buildingRects: Array<{ x: number; z: number; w: number; d: number }> = [];

  // Key story building positions
  public lenaApartmentPos: THREE.Vector3 = new THREE.Vector3(30, 0, -45);
  public adrianGaragePos: THREE.Vector3 = new THREE.Vector3(-60, 0, 50);
  public pier19Pos: THREE.Vector3 = new THREE.Vector3(65, 0, -180);
  public warehouseEntrancePos: THREE.Vector3 = new THREE.Vector3(85, 0, -156);
  public warehouseDeskPos: THREE.Vector3 = new THREE.Vector3(92, 0, -178);
  public warehouseLockerPos: THREE.Vector3 = new THREE.Vector3(78, 0, -180);

  // Southside Diner (Mara Vale meeting location) & Meridian Properties HQ
  public southsideDinerPos: THREE.Vector3 = new THREE.Vector3(50, 0, 46);
  public meridianOfficePos: THREE.Vector3 = new THREE.Vector3(0, 0, -160);
  public meridianDeskPos: THREE.Vector3 = new THREE.Vector3(0, 0, -164);

  // Mission M06: BAD BUSINESS locations
  public redevelopmentSitePos: THREE.Vector3 = new THREE.Vector3(45, 0, -100);
  public contractorMeetingPos: THREE.Vector3 = new THREE.Vector3(72, 0, -118);
  public shellOfficePos: THREE.Vector3 = new THREE.Vector3(-25, 0, -140);

  // Mission M07: OLD FRIENDS location
  public harborDepotPos: THREE.Vector3 = new THREE.Vector3(30, 0, -145);

  // Mission M08: PAPER TRAIL locations
  public financeOfficePos: THREE.Vector3 = new THREE.Vector3(-35, 0, -135);
  public financeArchivePos: THREE.Vector3 = new THREE.Vector3(-38, 0, -140);
  public financeTerminalPos: THREE.Vector3 = new THREE.Vector3(-33, 0, -142);

  // Warehouse 19 Shutter & Interior
  public warehouseShutterMesh!: THREE.Mesh;
  public warehouseShutterCollider!: THREE.Box3;
  public isWarehouseShutterOpen: boolean = false;

  // Adrian's Garage Workshop & Shutter
  public garageShutterMesh!: THREE.Mesh;
  public garageShutterCollider!: THREE.Box3;
  public isGarageShutterOpen: boolean = false;
  public garageBeaconGroup!: THREE.Group;

  // Streetlights
  private streetlightPoints: THREE.PointLight[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.apartmentInterior = new ApartmentInterior(this.scene);
    this.colliders.push(...this.apartmentInterior.colliders);
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

    // 7. Build Southside Diner (Mara Vale Story Location)
    this.createSouthsideDiner();

    // 8. Build Meridian Properties Corporate Office (Infiltration Location)
    this.createMeridianOffice();

    // 9. Build Eastline Redevelopment Zone & Meeting Spot (M06)
    this.createRedevelopmentZone();

    // 10. Build Apex Land Holdings Shell Office (M06)
    this.createShellOffice();

    // 11. Build Harbor Depot Contraband Cache (M07)
    this.createHarborDepotCache();

    // 12. Build Vespera Municipal Trust Finance Office (M08)
    this.createFinanceOffice();

    // 13. Add Street Furniture & Props (Streetlights, Dumpsters, Hydrants)
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

    // Entrance Doorway on Front Facade (Unit 102 Main Entry)
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 0.4), doorFrameMat);
    doorFrame.position.set(pos.x, 1.7, pos.z + depth / 2 + 0.1);
    this.scene.add(doorFrame);

    const doorPanelMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d11, // Dark mahogany
      roughness: 0.4,
      metalness: 0.2
    });
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 0.15), doorPanelMat);
    doorPanel.position.set(pos.x, 1.5, pos.z + depth / 2 + 0.2);
    this.scene.add(doorPanel);

    // Brass Kickplate & Handles
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const kickplate = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 0.05), brassMat);
    kickplate.position.set(pos.x, 0.2, pos.z + depth / 2 + 0.28);
    this.scene.add(kickplate);

    [-0.3, 0.3].forEach(hx => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), brassMat);
      handle.position.set(pos.x + hx, 1.4, pos.z + depth / 2 + 0.3);
      this.scene.add(handle);
    });

    // Register POI
    this.pois.push({
      id: 'lena_apartment',
      name: "Lena's Apartment (128 Eastline)",
      position: new THREE.Vector3(pos.x, 0, pos.z + depth / 2 + 2.5),
      type: 'apartment'
    });
  }

  private createAdrianGarage(): void {
    const pos = this.adrianGaragePos; // (-60, 0, 50)
    const width = 24;
    const depth = 28;
    const height = 8.5;

    // Materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x2e3440, // Weathered industrial steel & charcoal masonry
      roughness: 0.85,
      metalness: 0.25
    });
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x23272e, // Oily concrete slab
      roughness: 0.9,
      metalness: 0.1
    });
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x333842, // Weathered asphalt driveway apron
      roughness: 0.92,
      metalness: 0.05
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8
    });
    const shutterMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Galvanized corrugated roll-up shutter
      metalness: 0.75,
      roughness: 0.35
    });
    const hazardMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Safety yellow warning stripe
      roughness: 0.5
    });

    // 1. Interior Concrete Slab
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, depth), floorMat);
    floor.position.set(pos.x, 0.1, pos.z);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Hazard safety stripe around work bays
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.02, 12), hazardMat);
    stripe1.position.set(pos.x + 5, 0.21, pos.z);
    this.scene.add(stripe1);

    // 2. Forecourt Apron (Driveway leading out to street)
    const apron = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, 14), apronMat);
    apron.position.set(pos.x, 0.05, pos.z + depth / 2 + 7);
    apron.receiveShadow = true;
    this.scene.add(apron);

    // 3. Hollow Perimeter Walls
    // North Wall (Back)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(width + 1.2, height, 1.2), wallMat);
    backWall.position.set(pos.x, height / 2, pos.z - depth / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    this.colliders.push(new THREE.Box3().setFromObject(backWall));

    // West Wall (Left)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, depth), wallMat);
    leftWall.position.set(pos.x - width / 2, height / 2, pos.z);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);
    this.colliders.push(new THREE.Box3().setFromObject(leftWall));

    // East Wall (Right)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, depth), wallMat);
    rightWall.position.set(pos.x + width / 2, height / 2, pos.z);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
    this.colliders.push(new THREE.Box3().setFromObject(rightWall));

    // Front Wall Left Segment (Width 7.4m)
    const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(7.4, height, 1.2), wallMat);
    frontWallLeft.position.set(pos.x - 8.3, height / 2, pos.z + depth / 2);
    frontWallLeft.castShadow = true;
    frontWallLeft.receiveShadow = true;
    this.scene.add(frontWallLeft);
    this.colliders.push(new THREE.Box3().setFromObject(frontWallLeft));

    // Front Wall Right Segment (Width 7.4m)
    const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(7.4, height, 1.2), wallMat);
    frontWallRight.position.set(pos.x + 8.3, height / 2, pos.z + depth / 2);
    frontWallRight.castShadow = true;
    frontWallRight.receiveShadow = true;
    this.scene.add(frontWallRight);
    this.colliders.push(new THREE.Box3().setFromObject(frontWallRight));

    // Front Wall Header Beam (above shutter door, y = 5.4m to 8.5m)
    const frontHeader = new THREE.Mesh(new THREE.BoxGeometry(9.4, 3.2, 1.2), wallMat);
    frontHeader.position.set(pos.x, 7.0, pos.z + depth / 2);
    frontHeader.castShadow = true;
    this.scene.add(frontHeader);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 2, 0.5, depth + 2), steelMat);
    roof.position.set(pos.x, height + 0.25, pos.z);
    this.scene.add(roof);

    // 4. Roll-up Shutter Bay Door (8.8m wide, 5.4m tall)
    const shutterGeo = new THREE.BoxGeometry(8.8, 5.4, 0.3);
    this.garageShutterMesh = new THREE.Mesh(shutterGeo, shutterMat);
    this.garageShutterMesh.position.set(pos.x, 2.7, pos.z + depth / 2);
    this.garageShutterMesh.castShadow = true;
    this.scene.add(this.garageShutterMesh);

    this.garageShutterCollider = new THREE.Box3().setFromObject(this.garageShutterMesh);
    this.colliders.push(this.garageShutterCollider);

    // Register building rect for minimap
    this.buildingRects.push({ x: pos.x, z: pos.z, w: width, d: depth });

    // 5. Exterior Neon Sign: "ADRIAN VOSS AUTO REPAIR"
    const signGroup = new THREE.Group();
    signGroup.position.set(pos.x, 7.2, pos.z + depth / 2 + 0.65);

    const signBacking = new THREE.Mesh(
      new THREE.BoxGeometry(11, 1.6, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    signGroup.add(signBacking);

    const signNeon = new THREE.Mesh(
      new THREE.BoxGeometry(10.2, 0.9, 0.08),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b }) // Amber industrial neon
    );
    signNeon.position.z = 0.1;
    signGroup.add(signNeon);

    const signLight = new THREE.PointLight(0xf59e0b, 2.5, 14);
    signLight.position.set(0, 0, 1.2);
    signGroup.add(signLight);

    this.scene.add(signGroup);

    // 6. Hydraulic Twin-Post Car Lift & Suspended Project Car (East Bay)
    const liftCol1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 0.4), steelMat);
    liftCol1.position.set(pos.x + 5, 2.75, pos.z - 3.5);
    this.scene.add(liftCol1);
    this.colliders.push(new THREE.Box3().setFromObject(liftCol1));

    const liftCol2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 0.4), steelMat);
    liftCol2.position.set(pos.x + 5, 2.75, pos.z + 3.5);
    this.scene.add(liftCol2);
    this.colliders.push(new THREE.Box3().setFromObject(liftCol2));

    // Lift horizontal carriage crossbars
    const liftArm1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 2.4), steelMat);
    liftArm1.position.set(pos.x + 5, 2.0, pos.z - 2.0);
    this.scene.add(liftArm1);

    const liftArm2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 2.4), steelMat);
    liftArm2.position.set(pos.x + 5, 2.0, pos.z + 2.0);
    this.scene.add(liftArm2);

    // Suspended Project Car (Chassis & Body on lift at y = 2.4m)
    const carGroup = new THREE.Group();
    carGroup.position.set(pos.x + 5, 2.4, pos.z);

    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.0, 4.4),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4, metalness: 0.6 }) // Crimson sports body
    );
    carBody.position.y = 0.5;
    carBody.castShadow = true;
    carGroup.add(carBody);

    const carCabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.7, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2, metalness: 0.8 })
    );
    carCabin.position.set(0, 1.25, -0.3);
    carGroup.add(carCabin);

    this.scene.add(carGroup);

    // Low-angle inspection light under car
    const undercarLight = new THREE.PointLight(0xffedd5, 1.8, 6);
    undercarLight.position.set(pos.x + 5, 0.4, pos.z);
    this.scene.add(undercarLight);

    // 7. Adrian's Heavy-Duty Steel Workbench (West Bay against Back Wall)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(pos.x - 4, 0, pos.z - depth / 2 + 3);

    const benchTable = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.1, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.7 }) // Stained hardwood slab
    );
    benchTable.position.y = 0.55;
    benchTable.castShadow = true;
    benchTable.receiveShadow = true;
    benchGroup.add(benchTable);

    // Workbench steel legs
    const legMat = steelMat;
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), legMat);
    leg1.position.set(-1.9, 0.55, -0.65);
    benchGroup.add(leg1);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), legMat);
    leg2.position.set(1.9, 0.55, -0.65);
    benchGroup.add(leg2);
    const leg3 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), legMat);
    leg3.position.set(-1.9, 0.55, 0.65);
    benchGroup.add(leg3);
    const leg4 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.12), legMat);
    leg4.position.set(1.9, 0.55, 0.65);
    benchGroup.add(leg4);

    // Heavy Cast Iron Bench Vice
    const vice = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.35, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.2 })
    );
    vice.position.set(-1.6, 1.25, 0.4);
    benchGroup.add(vice);

    // Toolboxes, socket set trays, spark plug boxes
    const toolbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.3, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.7, roughness: 0.3 })
    );
    toolbox.position.set(1.2, 1.22, 0.3);
    benchGroup.add(toolbox);

    // Blueprints / documents on desk
    const blueprint = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.02, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.9 })
    );
    blueprint.position.set(-0.2, 1.11, 0.1);
    benchGroup.add(blueprint);

    // Green Banker's Workbench Lamp
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), steelMat);
    lampArm.position.set(0.6, 1.35, -0.4);
    benchGroup.add(lampArm);

    const lampShade = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.15, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 }) // Green enamel shade
    );
    lampShade.position.set(0.6, 1.6, -0.3);
    benchGroup.add(lampShade);

    const benchLight = new THREE.PointLight(0xfff8db, 2.4, 7);
    benchLight.position.set(0.6, 1.5, -0.3);
    benchGroup.add(benchLight);

    this.scene.add(benchGroup);
    this.colliders.push(new THREE.Box3().setFromObject(benchGroup));

    // 8. Tool Pegboard Mounted on North Back Wall behind workbench
    const pegboard = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 2.2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 })
    );
    pegboard.position.set(pos.x - 4, 2.8, pos.z - depth / 2 + 0.65);
    this.scene.add(pegboard);

    // Hanging tools on pegboard (wrenches, pliers)
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });
    for (let i = -1.6; i <= 1.6; i += 0.45) {
      const toolHanger = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.04), chromeMat);
      toolHanger.position.set(pos.x - 4 + i, 2.8, pos.z - depth / 2 + 0.72);
      this.scene.add(toolHanger);
    }

    // 9. Adrian's Concealed Heavy Steel Wall Safe
    // Positioned in back wall directly behind the workbench: (-64, 1.5, 36.65)
    const safeGroup = new THREE.Group();
    safeGroup.position.set(pos.x - 4, 1.5, pos.z - depth / 2 + 0.65);

    // Reinforced safe frame
    const safeFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.9, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 })
    );
    safeGroup.add(safeFrame);

    // Combination lock dial & keypad
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.06),
      chromeMat
    );
    dial.rotation.x = Math.PI / 2;
    dial.position.set(-0.15, 0, 0.12);
    safeGroup.add(dial);

    // Keypad LED
    const keypadLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x10b981 }) // Blinking active green LED
    );
    keypadLed.position.set(0.18, 0.15, 0.11);
    safeGroup.add(keypadLed);

    // Hinged Aurelia license plates swung slightly open (concealment cover)
    const plateCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.35, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.4 })
    );
    plateCover.position.set(-0.1, -0.05, 0.14);
    plateCover.rotation.y = -0.35; // Swung open to reveal lock
    safeGroup.add(plateCover);

    this.scene.add(safeGroup);

    // 10. Pulsing Golden Investigation Beacon Ring for "crack_safe"
    this.garageBeaconGroup = new THREE.Group();
    this.garageBeaconGroup.position.set(pos.x - 4, 1.3, pos.z - depth / 2 + 2.5);

    const beaconRingGeo = new THREE.TorusGeometry(0.38, 0.04, 8, 24);
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.rotation.x = Math.PI / 2;
    this.garageBeaconGroup.add(beaconRing);

    const beaconLight = new THREE.PointLight(0xf59e0b, 2.0, 5);
    beaconLight.position.y = 0.2;
    this.garageBeaconGroup.add(beaconLight);

    this.scene.add(this.garageBeaconGroup);

    // 11. Workshop Shelving, Oil Drums & Gas Cylinders
    // High industrial shelving against West wall
    const shelfRack = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 5.5, 9.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    shelfRack.position.set(pos.x - width / 2 + 1.2, 2.75, pos.z + 1);
    shelfRack.castShadow = true;
    this.scene.add(shelfRack);
    this.colliders.push(new THREE.Box3().setFromObject(shelfRack));

    // Stacks of red oil drums in corner
    const drumMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.7, roughness: 0.35 });
    const drumCoords = [
      { x: pos.x - 9.5, z: pos.z - 8 },
      { x: pos.x - 8.4, z: pos.z - 8 },
      { x: pos.x - 8.9, z: pos.z - 7 }
    ];
    drumCoords.forEach(dc => {
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 16), drumMat);
      drum.position.set(dc.x, 0.65, dc.z);
      drum.castShadow = true;
      this.scene.add(drum);
      this.colliders.push(new THREE.Box3().setFromObject(drum));
    });

    // Tall gas welding tanks
    const tankGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16);
    const tankMat1 = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 }); // Green Oxygen
    const tankMat2 = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 }); // Blue Argon
    const tank1 = new THREE.Mesh(tankGeo, tankMat1);
    tank1.position.set(pos.x - 9.8, 1.0, pos.z - 10.5);
    this.scene.add(tank1);
    const tank2 = new THREE.Mesh(tankGeo, tankMat2);
    tank2.position.set(pos.x - 9.2, 1.0, pos.z - 10.5);
    this.scene.add(tank2);

    // 12. Industrial Fluorescent Shop Lights (Suspended from ceiling)
    const shopLight1 = new THREE.PointLight(0xfef08a, 2.6, 20);
    shopLight1.position.set(pos.x - 4, 7.2, pos.z - 3);
    this.scene.add(shopLight1);

    const shopLight2 = new THREE.PointLight(0xfef08a, 2.6, 20);
    shopLight2.position.set(pos.x + 5, 7.2, pos.z + 4);
    this.scene.add(shopLight2);

    // 13. Forecourt Props (Tire Stacks & Work Floodlight near Jonah)
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.95 });
    for (let i = 0; i < 4; i++) {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.26, 16), tireMat);
      tire.position.set(pos.x + 6, 0.13 + i * 0.26, pos.z + depth / 2 + 4);
      tire.castShadow = true;
      this.scene.add(tire);
      if (i === 0) {
        this.colliders.push(new THREE.Box3().setFromObject(tire));
      }
    }

    // Forecourt tripod work floodlight
    const floodlightGroup = new THREE.Group();
    floodlightGroup.position.set(pos.x + 6, 0, pos.z + depth / 2 + 6);

    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8), steelMat);
    tripod.position.y = 0.9;
    floodlightGroup.add(tripod);

    const lampBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 })
    );
    lampBox.position.set(0, 1.8, 0);
    lampBox.rotation.y = -Math.PI / 4;
    floodlightGroup.add(lampBox);

    const floodlight = new THREE.PointLight(0xffedd5, 3.2, 16);
    floodlight.position.set(0, 1.8, 0.2);
    floodlightGroup.add(floodlight);

    this.scene.add(floodlightGroup);

    // POI Registration
    this.pois.push({
      id: 'adrian_garage',
      name: 'Adrian Voss Auto Repair',
      position: new THREE.Vector3(pos.x, 0, pos.z + depth / 2 + 5),
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
      const pLight = new THREE.PointLight(0xffecd1, 4.2, 38, 1.0);
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

    // 3. Pier 19 Cold Storage Warehouse (Hollow Structure with Accessible Interior)
    const whWallMat = new THREE.MeshStandardMaterial({
      color: 0x222a36,
      roughness: 0.75,
      metalness: 0.3
    });
    const whRoofMat = new THREE.MeshStandardMaterial({
      color: 0x161b22,
      roughness: 0.85,
      metalness: 0.2
    });

    // 3a. Warehouse Walls & Roof
    // Back Wall (Z = -184)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(32, 14, 1.2), whWallMat);
    backWall.position.set(dockPos.x + 20, 7, dockPos.z - 4);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.scene.add(backWall);
    this.colliders.push(new THREE.Box3().setFromObject(backWall));

    // Left Wall (X = 69)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 14, 28), whWallMat);
    leftWall.position.set(dockPos.x + 4, 7, dockPos.z + 10);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);
    this.colliders.push(new THREE.Box3().setFromObject(leftWall));

    // Right Wall (X = 101)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 14, 28), whWallMat);
    rightWall.position.set(dockPos.x + 36, 7, dockPos.z + 10);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
    this.colliders.push(new THREE.Box3().setFromObject(rightWall));

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(33, 1, 29), whRoofMat);
    roof.position.set(dockPos.x + 20, 14.5, dockPos.z + 10);
    this.scene.add(roof);

    // Front Wall Left Segment
    const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(11.5, 14, 1.2), whWallMat);
    frontWallLeft.position.set(dockPos.x + 9.75, 7, dockPos.z + 24);
    this.scene.add(frontWallLeft);
    this.colliders.push(new THREE.Box3().setFromObject(frontWallLeft));

    // Front Wall Right Segment
    const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(11.5, 14, 1.2), whWallMat);
    frontWallRight.position.set(dockPos.x + 30.25, 7, dockPos.z + 24);
    this.scene.add(frontWallRight);
    this.colliders.push(new THREE.Box3().setFromObject(frontWallRight));

    // Front Wall Header Beam (above roll-up door)
    const frontHeader = new THREE.Mesh(new THREE.BoxGeometry(9, 6.5, 1.2), whWallMat);
    frontHeader.position.set(dockPos.x + 20, 10.75, dockPos.z + 24);
    this.scene.add(frontHeader);

    // Roll-up Shutter Door
    const shutterMat = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      metalness: 0.8,
      roughness: 0.35
    });
    this.warehouseShutterMesh = new THREE.Mesh(new THREE.BoxGeometry(8.6, 7.5, 0.4), shutterMat);
    this.warehouseShutterMesh.position.set(dockPos.x + 20, 3.75, dockPos.z + 24);
    this.warehouseShutterMesh.castShadow = true;
    this.scene.add(this.warehouseShutterMesh);

    this.warehouseShutterCollider = new THREE.Box3().setFromObject(this.warehouseShutterMesh);
    this.colliders.push(this.warehouseShutterCollider);

    this.buildingRects.push({ x: dockPos.x + 20, z: dockPos.z + 10, w: 32, d: 28 });

    // Warehouse Neon Sign
    const signGeo = new THREE.BoxGeometry(16, 1.4, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Cyan neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(dockPos.x + 20, 12.5, dockPos.z + 24.7);
    this.scene.add(sign);

    // 3b. Warehouse 19 Interior
    // Interior Concrete Floor
    const interiorFloor = new THREE.Mesh(
      new THREE.BoxGeometry(31, 0.3, 27),
      new THREE.MeshStandardMaterial({ color: 0x252a32, roughness: 0.95 })
    );
    interiorFloor.position.set(dockPos.x + 20, 0.75, dockPos.z + 10);
    this.scene.add(interiorFloor);

    // Cold Industrial Blue Overhead Lamps
    const lamp1 = new THREE.PointLight(0x93c5fd, 2.5, 22);
    lamp1.position.set(dockPos.x + 20, 9.5, dockPos.z + 16);
    this.scene.add(lamp1);

    const lamp2 = new THREE.PointLight(0x67e8f9, 2.5, 22);
    lamp2.position.set(dockPos.x + 20, 9.5, dockPos.z + 4);
    this.scene.add(lamp2);

    // Industrial Storage Shelving Racks (Left side & Right side)
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });

    // Left Shelf Rack
    const leftRack = new THREE.Mesh(new THREE.BoxGeometry(3.5, 7, 14), rackMat);
    leftRack.position.set(dockPos.x + 9, 3.5, dockPos.z + 8);
    this.scene.add(leftRack);
    this.colliders.push(new THREE.Box3().setFromObject(leftRack));

    // Right Shelf Rack
    const rightRack = new THREE.Mesh(new THREE.BoxGeometry(3.5, 7, 14), rackMat);
    rightRack.position.set(dockPos.x + 31, 3.5, dockPos.z + 8);
    this.scene.add(rightRack);
    this.colliders.push(new THREE.Box3().setFromObject(rightRack));

    // Office Desk & Manifest Computer Terminal (at warehouseDeskPos: 92, 0, -178)
    const deskMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    deskMesh.position.set(this.warehouseDeskPos.x, 0.6, this.warehouseDeskPos.z);
    this.scene.add(deskMesh);
    this.colliders.push(new THREE.Box3().setFromObject(deskMesh));

    // Glowing Computer Terminal Screen
    const screenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.8, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 }) // Glowing cyan display
    );
    screenMesh.position.set(this.warehouseDeskPos.x, 1.6, this.warehouseDeskPos.z - 0.5);
    this.scene.add(screenMesh);

    // Cold Storage Locker 4B (at warehouseLockerPos: 78, 0, -180)
    const lockerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 3.2, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    lockerMesh.position.set(this.warehouseLockerPos.x, 1.6, this.warehouseLockerPos.z);
    this.scene.add(lockerMesh);
    this.colliders.push(new THREE.Box3().setFromObject(lockerMesh));

    // Electronic Keypad Glow
    const keypadGlow = new THREE.PointLight(0x10b981, 1.5, 4); // Emerald lock glow
    keypadGlow.position.set(this.warehouseLockerPos.x, 2.0, this.warehouseLockerPos.z + 0.9);
    this.scene.add(keypadGlow);

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

  private createSouthsideDiner(): void {
    const pos = this.southsideDinerPos;
    const width = 22;
    const depth = 16;
    const height = 5.5;

    // Main Diner Structure (Retro Brick & Stainless Steel)
    const dMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Dark red-brown brick
      roughness: 0.8,
      metalness: 0.2
    });

    const dinerMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), dMat);
    dinerMesh.position.set(pos.x, height / 2, pos.z);
    dinerMesh.castShadow = true;
    dinerMesh.receiveShadow = true;
    this.scene.add(dinerMesh);

    // Collider
    const bbox = new THREE.Box3().setFromObject(dinerMesh);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z, w: width, d: depth });

    // Stainless Steel Roof Trim
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.85,
      roughness: 0.25
    });
    const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.8, 0.45, depth + 0.8), trimMat);
    roofTrim.position.set(pos.x, height + 0.2, pos.z);
    this.scene.add(roofTrim);

    // Warm Illuminated Windows
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    [-6, 0, 6].forEach(dx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 0.2), winMat);
      win.position.set(pos.x + dx, 2.5, pos.z - depth / 2 - 0.1);
      this.scene.add(win);
    });

    // Neon Roof Sign: "SOUTHSIDE DINER // 24H"
    const signGeo = new THREE.BoxGeometry(10, 1.2, 0.3);
    const signMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Amber neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, height + 1.2, pos.z - depth / 2 + 0.5);
    this.scene.add(sign);

    // Outdoor Patio Awning & Tables (Where Mara Vale meets Kaleb)
    const awningMat = new THREE.MeshStandardMaterial({ color: 0x991b1b }); // Burgundy red awning
    const awning = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 5), awningMat);
    awning.position.set(pos.x, 3.6, pos.z - depth / 2 - 3.2);
    this.scene.add(awning);

    const tableMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    [-3, 3].forEach(tx => {
      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.9, 12), tableMat);
      table.position.set(pos.x + tx, 0.45, pos.z - depth / 2 - 3.2);
      this.scene.add(table);
    });

    // Warm Patio Lighting
    const patioLight = new THREE.PointLight(0xf59e0b, 2.8, 16);
    patioLight.position.set(pos.x, 3.2, pos.z - depth / 2 - 3.2);
    this.scene.add(patioLight);

    this.pois.push({
      id: 'southside_diner',
      name: 'Southside Diner (Mara Vale)',
      position: new THREE.Vector3(pos.x, 0, pos.z - depth / 2 - 3.2),
      type: 'diner'
    });
  }

  private createMeridianOffice(): void {
    const pos = this.meridianOfficePos;
    const width = 36;
    const depth = 26;
    const height = 28;

    // Corporate Tower Base (Polished Dark Slate & Glass)
    const oMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.7
    });

    const towerMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), oMat);
    towerMesh.position.set(pos.x, height / 2, pos.z);
    towerMesh.castShadow = true;
    towerMesh.receiveShadow = true;
    this.scene.add(towerMesh);

    // Collider
    const bbox = new THREE.Box3().setFromObject(towerMesh);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z, w: width, d: depth });

    // Office Floor Windows (Cyan / Corporate Blue Glow)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1
    });

    for (let floor = 1; floor < 5; floor++) {
      [-12, -4, 4, 12].forEach(wx => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.8, 0.2), glassMat);
        win.position.set(pos.x + wx, floor * 5.2 + 2, pos.z + depth / 2 + 0.12);
        this.scene.add(win);
      });
    }

    // Entrance Canopy & Cyan Neon Sign: "MERIDIAN PROPERTIES"
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 6), canopyMat);
    canopy.position.set(pos.x, 4.5, pos.z + depth / 2 + 3);
    this.scene.add(canopy);

    const signGeo = new THREE.BoxGeometry(14, 1.0, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Cyan neon
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, 5.4, pos.z + depth / 2 + 0.2);
    this.scene.add(sign);

    // Front Lobby Archival Desk & Terminal (Evidence Collection Target)
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 1.8), deskMat);
    desk.position.set(this.meridianDeskPos.x, 0.55, this.meridianDeskPos.z);
    this.scene.add(desk);

    // File Archive Cabinet
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 1.4), cabinetMat);
    cabinet.position.set(this.meridianDeskPos.x + 2.8, 1.3, this.meridianDeskPos.z);
    this.scene.add(cabinet);

    // Terminal Screen (Cyan Glow)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2
    });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.1), screenMat);
    screen.position.set(this.meridianDeskPos.x, 1.4, this.meridianDeskPos.z - 0.2);
    this.scene.add(screen);

    // Entrance illumination
    const officeLight = new THREE.PointLight(0x38bdf8, 3.0, 18);
    officeLight.position.set(pos.x, 4.0, pos.z + depth / 2 + 2);
    this.scene.add(officeLight);

    this.pois.push({
      id: 'meridian_properties',
      name: 'Meridian Properties Corporate Office',
      position: new THREE.Vector3(pos.x, 0, pos.z + depth / 2 + 2),
      type: 'office'
    });
  }

  private createRedevelopmentZone(): void {
    const pos = this.redevelopmentSitePos;
    const meetPos = this.contractorMeetingPos;

    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    // Construction Fence / Barrier perimeter around site
    for (let i = -16; i <= 16; i += 8) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(6, 1.4, 0.4), hazardMat);
      barrier.position.set(pos.x + i, 0.7, pos.z + 10);
      this.scene.add(barrier);
      this.colliders.push(new THREE.Box3().setFromObject(barrier));
    }

    // Overlook staging platform near pos (45, 0, -100)
    const overlookPlat = new THREE.Mesh(new THREE.BoxGeometry(10, 0.25, 8), barrierMat);
    overlookPlat.position.set(pos.x, 0.12, pos.z);
    overlookPlat.receiveShadow = true;
    this.scene.add(overlookPlat);

    // Hazard sign: "EASTLINE REDEVELOPMENT // DEMOLITION IN PROGRESS"
    const signGroup = new THREE.Group();
    signGroup.position.set(pos.x, 2.5, pos.z + 9.8);
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.1), hazardMat);
    signGroup.add(signBoard);
    const signBorder = new THREE.Mesh(new THREE.BoxGeometry(4.7, 1.4, 0.05), steelMat);
    signGroup.add(signBorder);
    this.scene.add(signGroup);

    // Construction Floodlight pole at overlook
    const floodlightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5), steelMat);
    floodlightPole.position.set(pos.x - 4, 2.5, pos.z - 3);
    this.scene.add(floodlightPole);
    const floodlightLamp = new THREE.PointLight(0xfef08a, 2.8, 22);
    floodlightLamp.position.set(pos.x - 4, 5, pos.z - 3);
    this.scene.add(floodlightLamp);

    // Demolition rubble / stacks in construction yard between pos and meetPos
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const rubble1 = new THREE.Mesh(new THREE.BoxGeometry(5, 2.2, 6), rubbleMat);
    rubble1.position.set(58, 1.1, -108);
    this.scene.add(rubble1);
    this.colliders.push(new THREE.Box3().setFromObject(rubble1));

    // Scaffolding tower near meeting spot
    const scaffold = new THREE.Mesh(new THREE.BoxGeometry(3, 8, 3), steelMat);
    scaffold.position.set(meetPos.x - 5, 4, meetPos.z);
    this.scene.add(scaffold);
    this.colliders.push(new THREE.Box3().setFromObject(scaffold));

    // Shipping container in the alley at meeting spot
    const meetContainer = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2.8, 7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 })
    );
    meetContainer.position.set(meetPos.x + 3.5, 1.4, meetPos.z);
    this.scene.add(meetContainer);
    this.colliders.push(new THREE.Box3().setFromObject(meetContainer));

    // Wooden cargo pallets at meeting spot
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.2), palletMat);
    pallet.position.set(meetPos.x, 0.2, meetPos.z);
    this.scene.add(pallet);

    // Dim meeting area light
    const alleyLight = new THREE.PointLight(0xf59e0b, 1.5, 12);
    alleyLight.position.set(meetPos.x, 3.5, meetPos.z);
    this.scene.add(alleyLight);

    // POI Registration
    this.pois.push({
      id: 'redevelopment_site',
      name: 'Eastline Redevelopment Zone',
      position: this.redevelopmentSitePos.clone(),
      type: 'office'
    });
  }

  private createShellOffice(): void {
    const pos = this.shellOfficePos;
    const width = 22;
    const depth = 20;
    const height = 18;

    // Commercial Office Building (Dark granite & tinted architectural glass)
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.65
    });
    const officeMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bMat);
    officeMesh.position.set(pos.x, height / 2, pos.z - depth / 2);
    officeMesh.castShadow = true;
    officeMesh.receiveShadow = true;
    this.scene.add(officeMesh);

    const bbox = new THREE.Box3().setFromObject(officeMesh);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z - depth / 2, w: width, d: depth });

    // Entrance Canopy
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 4), canopyMat);
    canopy.position.set(pos.x, 3.8, pos.z + 1);
    this.scene.add(canopy);

    // Glass Double Entrance Doors
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.1
    });
    const doors = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.0, 0.15), glassMat);
    doors.position.set(pos.x, 1.5, pos.z + 0.05);
    this.scene.add(doors);

    // Directory Plaque on exterior wall (Right of door, target for identify_shell_company)
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.12), brassMat);
    plaque.position.set(pos.x + 2.8, 1.8, pos.z + 0.1);
    this.scene.add(plaque);

    // Corporate Name Neon Sign: "APEX LAND HOLDINGS LLC"
    const signGeo = new THREE.BoxGeometry(11, 1.0, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, 4.8, pos.z + 0.2);
    this.scene.add(sign);

    // Entrance illumination
    const porchLight = new THREE.PointLight(0x38bdf8, 2.2, 14);
    porchLight.position.set(pos.x, 3.5, pos.z + 1.2);
    this.scene.add(porchLight);

    // Register POI
    this.pois.push({
      id: 'apex_land_holdings',
      name: 'Apex Land Holdings (Shell Office)',
      position: this.shellOfficePos.clone(),
      type: 'office'
    });
  }

  private createHarborDepotCache(): void {
    const pos = this.harborDepotPos;

    // Security Chainlink / Steel Fence Enclosure (approx 6m x 6m around cache)
    const fenceMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.35,
      wireframe: true
    });
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2
    });

    // Fence Posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
    const postOffsets = [
      { x: -3, z: -3 },
      { x: 3, z: -3 },
      { x: -3, z: 3 },
      { x: 1, z: 3 } // Leave gap between 1 and 3 for gate entrance
    ];

    postOffsets.forEach(offset => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(pos.x + offset.x, 1.25, pos.z + offset.z);
      this.scene.add(post);
    });

    // Fence Panels (North, West, South partial, East)
    // North wall (Z = -3)
    const northFence = new THREE.Mesh(new THREE.BoxGeometry(6, 2.2, 0.1), fenceMat);
    northFence.position.set(pos.x, 1.1, pos.z - 3);
    this.scene.add(northFence);
    this.colliders.push(new THREE.Box3().setFromObject(northFence));

    // West wall (X = -3)
    const westFence = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 6), fenceMat);
    westFence.position.set(pos.x - 3, 1.1, pos.z);
    this.scene.add(westFence);
    this.colliders.push(new THREE.Box3().setFromObject(westFence));

    // East wall (X = 3)
    const eastFence = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 6), fenceMat);
    eastFence.position.set(pos.x + 3, 1.1, pos.z);
    this.scene.add(eastFence);
    this.colliders.push(new THREE.Box3().setFromObject(eastFence));

    // South wall (partial: left side from -3 to 0, open from 0 to 3)
    const southFence = new THREE.Mesh(new THREE.BoxGeometry(3, 2.2, 0.1), fenceMat);
    southFence.position.set(pos.x - 1.5, 1.1, pos.z + 3);
    this.scene.add(southFence);
    this.colliders.push(new THREE.Box3().setFromObject(southFence));

    // Concrete pad foundation
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.2, 5.8), padMat);
    pad.position.set(pos.x, 0.1, pos.z);
    this.scene.add(pad);

    // Contraband Cache Tactical Locker Mesh
    const lockerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.75,
      roughness: 0.3
    });
    const locker = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 1.1), lockerMat);
    locker.position.set(pos.x, 0.525, pos.z);
    locker.castShadow = true;
    locker.receiveShadow = true;
    this.scene.add(locker);

    // Add locker collider
    const lockerBox = new THREE.Box3().setFromObject(locker);
    this.colliders.push(lockerBox);

    // Glowing electronic keypad / indicator
    const keypadMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.05), keypadMat);
    keypad.position.set(pos.x, 0.7, pos.z + 0.56);
    this.scene.add(keypad);

    // Keypad indicator light & depot floodlight
    const cacheLight = new THREE.PointLight(0x06b6d4, 2.2, 8);
    cacheLight.position.set(pos.x, 1.2, pos.z + 0.6);
    this.scene.add(cacheLight);

    const depotFloodlight = new THREE.PointLight(0x38bdf8, 1.8, 16);
    depotFloodlight.position.set(pos.x - 2.8, 2.6, pos.z - 2.8);
    this.scene.add(depotFloodlight);

    // Register POI
    this.pois.push({
      id: 'harbor_depot_cache',
      name: 'Harbor Depot Cache',
      position: this.harborDepotPos.clone(),
      type: 'docks'
    });
  }

  private createFinanceOffice(): void {
    const pos = this.financeOfficePos;
    const width = 28;
    const height = 26;
    const depth = 22;

    // Corporate Headquarters Mesh (Emerald obsidian granite)
    const officeMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.25,
      metalness: 0.75
    });
    const officeGeo = new THREE.BoxGeometry(width, height, depth);
    const officeMesh = new THREE.Mesh(officeGeo, officeMat);
    officeMesh.position.set(pos.x, height / 2, pos.z - depth / 2);
    officeMesh.castShadow = true;
    officeMesh.receiveShadow = true;
    this.scene.add(officeMesh);

    const bbox = new THREE.Box3().setFromObject(officeMesh);
    this.colliders.push(bbox);
    this.buildingRects.push({ x: pos.x, z: pos.z - depth / 2, w: width, d: depth });

    // Architectural floor window strips
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    });
    for (let floor = 1; floor <= 4; floor++) {
      [-10, -3, 3, 10].forEach(wx => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.6, 0.2), windowMat);
        win.position.set(pos.x + wx, floor * 5.2 + 2, pos.z + 0.12);
        this.scene.add(win);
      });
    }

    // Side Service / Main Infiltration Entrance Canopy
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 4), canopyMat);
    canopy.position.set(pos.x, 3.8, pos.z + 1);
    this.scene.add(canopy);

    // Glass Double Entrance Doors
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      roughness: 0.1
    });
    const doors = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.0, 0.15), glassMat);
    doors.position.set(pos.x, 1.5, pos.z + 0.05);
    this.scene.add(doors);

    // Emerald Neon Sign: "VESPERA MUNICIPAL TRUST"
    const signGeo = new THREE.BoxGeometry(14, 1.1, 0.2);
    const signMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(pos.x, 4.8, pos.z + 0.2);
    this.scene.add(sign);

    // Entrance Porch Light (Emerald Neon Glow)
    const porchLight = new THREE.PointLight(0x10b981, 2.8, 16);
    porchLight.position.set(pos.x, 3.5, pos.z + 1.5);
    this.scene.add(porchLight);

    // Archive Filing Cabinets Props at financeArchivePos (-38, 0, -140)
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 1.2), cabinetMat);
    cabinet.position.set(this.financeArchivePos.x, 1.4, this.financeArchivePos.z);
    this.scene.add(cabinet);

    // Document Archival Stacks / Boxes
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), boxMat);
    box1.position.set(this.financeArchivePos.x + 1.2, 0.25, this.financeArchivePos.z);
    this.scene.add(box1);
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.55), boxMat);
    box2.position.set(this.financeArchivePos.x + 1.2, 0.7, this.financeArchivePos.z);
    this.scene.add(box2);

    // Executive Terminal Desk Props at financeTerminalPos (-33, 0, -142)
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x291810, roughness: 0.4 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.8), deskMat);
    desk.position.set(this.financeTerminalPos.x, 0.55, this.financeTerminalPos.z);
    this.scene.add(desk);

    // Glowing Terminal Screen (Emerald Green Glow)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 2.5
    });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.1), screenMat);
    screen.position.set(this.financeTerminalPos.x, 1.4, this.financeTerminalPos.z - 0.2);
    this.scene.add(screen);

    // Workstation ambient spotlight
    const termLight = new THREE.PointLight(0x10b981, 2.0, 8);
    termLight.position.set(this.financeTerminalPos.x, 1.8, this.financeTerminalPos.z);
    this.scene.add(termLight);

    // Register POI
    this.pois.push({
      id: 'vespera_municipal_trust',
      name: 'Vespera Municipal Trust',
      position: this.financeOfficePos.clone(),
      type: 'office'
    });
  }

  public openWarehouseShutter(): void {
    this.isWarehouseShutterOpen = true;
    const idx = this.colliders.indexOf(this.warehouseShutterCollider);
    if (idx !== -1) {
      this.colliders.splice(idx, 1);
    }
  }

  public openGarageShutter(): void {
    if (this.isGarageShutterOpen) return;
    this.isGarageShutterOpen = true;
    const idx = this.colliders.indexOf(this.garageShutterCollider);
    if (idx !== -1) {
      this.colliders.splice(idx, 1);
    }
  }

  public update(deltaTime: number): void {
    if (this.isWarehouseShutterOpen && this.warehouseShutterMesh && this.warehouseShutterMesh.position.y < 9.5) {
      this.warehouseShutterMesh.position.y += deltaTime * 3.5;
    }
    if (this.isGarageShutterOpen && this.garageShutterMesh && this.garageShutterMesh.position.y < 7.8) {
      this.garageShutterMesh.position.y += deltaTime * 4.5;
    }
    if (this.garageBeaconGroup) {
      this.garageBeaconGroup.rotation.y += deltaTime * 2.5;
    }
    if (this.apartmentInterior) {
      this.apartmentInterior.update(deltaTime);
    }
  }

  public updateStreetlights(timeOfDay: number): void {
    const isDuskOrNight = timeOfDay < 6.5 || timeOfDay > 18.0;
    const intensity = isDuskOrNight ? 1.0 : 0.25;
    this.streetlightPoints.forEach(light => {
      light.intensity = 4.2 * intensity;
    });
  }
}
