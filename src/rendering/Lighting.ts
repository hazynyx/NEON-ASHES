import * as THREE from 'three';

export class CityLighting {
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public hemiLight: THREE.HemisphereLight;
  
  // Time of day (0.0 to 24.0 hours)
  public timeOfDay: number = 19.0; // Starts at scenic sunset twilight (7:00 PM) for rich visibility & atmosphere
  public timeSpeed: number = 0.05; // Game hours per real second
  private cityFillLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    // Hemisphere light for natural sky/ground ambient bounce
    this.hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.0);
    scene.add(this.hemiLight);

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0x475569, 1.1);
    scene.add(this.ambientLight);

    // Directional sunlight / moonlight
    this.sunLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    this.sunLight.position.set(60, 100, 40);
    this.sunLight.castShadow = true;

    // Configure shadow map parameters
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 280;
    this.sunLight.shadow.camera.left = -90;
    this.sunLight.shadow.camera.right = 90;
    this.sunLight.shadow.camera.top = 90;
    this.sunLight.shadow.camera.bottom = -90;
    this.sunLight.shadow.bias = -0.0005;

    scene.add(this.sunLight);
    scene.add(this.sunLight.target);

    // City street bounce fill light (soft upward sky/neon reflection)
    this.cityFillLight = new THREE.DirectionalLight(0x60a5fa, 0.45);
    this.cityFillLight.position.set(-40, -10, -40);
    scene.add(this.cityFillLight);
  }

  public update(deltaTime: number, playerPos: THREE.Vector3): void {
    // Advance time
    this.timeOfDay = (this.timeOfDay + deltaTime * this.timeSpeed) % 24.0;

    // Follow player with shadow frustum center
    this.sunLight.target.position.set(playerPos.x, 0, playerPos.z);
    this.sunLight.target.updateMatrixWorld();

    // Calculate sun elevation and angle based on hour
    const angle = ((this.timeOfDay - 6.0) / 24.0) * Math.PI * 2;
    const height = Math.sin(angle);
    const distance = 100;

    this.sunLight.position.set(
      playerPos.x + Math.cos(angle) * distance,
      Math.max(20, height * distance),
      playerPos.z + Math.sin(angle * 0.5) * 40
    );

    // Adjust light colors and intensity based on daytime vs night
    if (this.timeOfDay >= 6.0 && this.timeOfDay < 18.0) {
      // Daytime
      this.sunLight.color.setHex(0xfff5e6);
      this.sunLight.intensity = 1.4;
      this.ambientLight.color.setHex(0x475569);
      this.ambientLight.intensity = 1.0;
      this.hemiLight.color.setHex(0xbae6fd);
      this.hemiLight.groundColor.setHex(0x334155);
      this.hemiLight.intensity = 1.1;
      this.cityFillLight.intensity = 0.35;
    } else if (this.timeOfDay >= 18.0 && this.timeOfDay < 20.5) {
      // Dusk / Sunset (Amber/Crimson twilight)
      this.sunLight.color.setHex(0xffaa55);
      this.sunLight.intensity = 1.35;
      this.ambientLight.color.setHex(0x64748b);
      this.ambientLight.intensity = 1.15;
      this.hemiLight.color.setHex(0xfb923c);
      this.hemiLight.groundColor.setHex(0x1e293b);
      this.hemiLight.intensity = 1.05;
      this.cityFillLight.intensity = 0.45;
    } else {
      // Night (Moonlit coastal noir with clear city visibility)
      this.sunLight.color.setHex(0xa5f3fc);
      this.sunLight.intensity = 1.1;
      this.ambientLight.color.setHex(0x334155);
      this.ambientLight.intensity = 1.25;
      this.hemiLight.color.setHex(0x7dd3fc);
      this.hemiLight.groundColor.setHex(0x1e293b);
      this.hemiLight.intensity = 1.1;
      this.cityFillLight.intensity = 0.55;
    }
  }

  public getTimeString(): string {
    const hours = Math.floor(this.timeOfDay);
    const minutes = Math.floor((this.timeOfDay % 1) * 60);
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
}
