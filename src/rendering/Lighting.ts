import * as THREE from 'three';

export class CityLighting {
  public sunLight: THREE.DirectionalLight;
  public ambientLight: THREE.AmbientLight;
  public hemiLight: THREE.HemisphereLight;
  
  // Time of day (0.0 to 24.0 hours)
  public timeOfDay: number = 21.5; // Starts at dusk/night (9:30 PM) per story atmosphere
  public timeSpeed: number = 0.05; // Game hours per real second

  constructor(scene: THREE.Scene) {
    // Hemisphere light for natural sky/ground ambient bounce
    this.hemiLight = new THREE.HemisphereLight(0x8eb5d0, 0x222225, 0.45);
    scene.add(this.hemiLight);

    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0x1a202c, 0.5);
    scene.add(this.ambientLight);

    // Directional sunlight / moonlight
    this.sunLight = new THREE.DirectionalLight(0xfff3db, 1.2);
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
      Math.max(15, height * distance),
      playerPos.z + Math.sin(angle * 0.5) * 40
    );

    // Adjust light colors and intensity based on daytime vs night
    if (this.timeOfDay >= 6.0 && this.timeOfDay < 18.0) {
      // Daytime
      this.sunLight.color.setHex(0xfff5e6);
      this.sunLight.intensity = 1.3;
      this.ambientLight.color.setHex(0x334155);
      this.ambientLight.intensity = 0.6;
      this.hemiLight.color.setHex(0x93c5fd);
      this.hemiLight.groundColor.setHex(0x1e293b);
    } else if (this.timeOfDay >= 18.0 && this.timeOfDay < 20.5) {
      // Dusk / Sunset (Amber/Crimson transition)
      this.sunLight.color.setHex(0xff7733);
      this.sunLight.intensity = 1.0;
      this.ambientLight.color.setHex(0x3d2833);
      this.ambientLight.intensity = 0.7;
      this.hemiLight.color.setHex(0xf97316);
      this.hemiLight.groundColor.setHex(0x111827);
    } else {
      // Night (Moody coastal noir with moonlight and city bounce)
      this.sunLight.color.setHex(0x7dd3fc);
      this.sunLight.intensity = 0.65;
      this.ambientLight.color.setHex(0x1e293b);
      this.ambientLight.intensity = 0.85;
      this.hemiLight.color.setHex(0x38bdf8);
      this.hemiLight.groundColor.setHex(0x0f172a);
      this.hemiLight.intensity = 0.65;
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
