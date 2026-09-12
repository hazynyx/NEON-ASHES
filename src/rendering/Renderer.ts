import * as THREE from 'three';

export class EngineRenderer {
  public renderer: THREE.WebGLRenderer;
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.45;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public setExposure(val: number): void {
    this.renderer.toneMappingExposure = Math.max(0.5, Math.min(3.0, val));
  }

  public setShadows(enabled: boolean): void {
    this.renderer.shadowMap.enabled = enabled;
  }

  public setResolutionScale(scale: number): void {
    const dpr = Math.min(window.devicePixelRatio, 2) * scale;
    this.renderer.setPixelRatio(Math.max(0.5, dpr));
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }
}
