import * as THREE from 'three';

export class DestinationMarker {
  public group: THREE.Group;
  private cylinderMesh: THREE.Mesh;
  private groundRingMesh: THREE.Mesh;
  private chevronGroup: THREE.Group;
  private chevronMesh: THREE.Mesh;
  private pointLight: THREE.PointLight;

  private isVisible: boolean = false;
  private animTime: number = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.visible = false;

    // 1. Vertical holographic light pillar
    const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 32, 16, 1, true);
    const cylMat = new THREE.MeshBasicMaterial({
      color: 0xe58e26, // Warm amber
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.cylinderMesh = new THREE.Mesh(cylGeo, cylMat);
    this.cylinderMesh.position.y = 16;
    this.group.add(this.cylinderMesh);

    // 2. Concentric ground pulsing radar ring
    const ringGeo = new THREE.RingGeometry(1.4, 2.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.groundRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.groundRingMesh.rotation.x = -Math.PI / 2;
    this.groundRingMesh.position.y = 0.08;
    this.group.add(this.groundRingMesh);

    // 3. Hovering animated waypoint chevron / diamond
    this.chevronGroup = new THREE.Group();
    this.chevronGroup.position.y = 2.4;

    const diamondGeo = new THREE.OctahedronGeometry(0.7, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xe58e26,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8
    });
    this.chevronMesh = new THREE.Mesh(diamondGeo, diamondMat);
    this.chevronGroup.add(this.chevronMesh);
    this.group.add(this.chevronGroup);

    // 4. Ground illumination point light
    this.pointLight = new THREE.PointLight(0xe58e26, 2.5, 14);
    this.pointLight.position.set(0, 1.5, 0);
    this.group.add(this.pointLight);

    scene.add(this.group);
  }

  public setPosition(targetPos: THREE.Vector3 | null): void {
    if (!targetPos) {
      this.group.visible = false;
      this.isVisible = false;
      return;
    }

    this.group.position.set(targetPos.x, targetPos.y, targetPos.z);
    this.group.visible = true;
    this.isVisible = true;
  }

  public update(deltaTime: number): void {
    if (!this.isVisible) return;

    this.animTime += deltaTime;

    // Hover bob & spin
    this.chevronGroup.position.y = 2.4 + Math.sin(this.animTime * 3.0) * 0.35;
    this.chevronMesh.rotation.y += deltaTime * 1.8;
    this.chevronMesh.rotation.x = Math.sin(this.animTime * 2.0) * 0.2;

    // Ground ring pulse expansion
    const pulse = 1.0 + Math.sin(this.animTime * 4.0) * 0.25;
    this.groundRingMesh.scale.set(pulse, pulse, 1);

    // Cylinder pillar subtle glow shimmer
    (this.cylinderMesh.material as THREE.MeshBasicMaterial).opacity =
      0.30 + Math.sin(this.animTime * 3.5) * 0.12;
  }
}
