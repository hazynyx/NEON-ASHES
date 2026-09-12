export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private keysJustPressed: Map<string, boolean> = new Map();
  private mouseButtons: Map<number, boolean> = new Map();
  private mouseButtonsJustPressed: Map<number, boolean> = new Map();
  
  public mouseDeltaX: number = 0;
  public mouseDeltaY: number = 0;
  public isPointerLocked: boolean = false;
  
  private targetCanvas: HTMLCanvasElement | null = null;
  private pointerLockChangeCallback?: (isLocked: boolean) => void;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this));
  }

  public attachCanvas(canvas: HTMLCanvasElement): void {
    this.targetCanvas = canvas;
  }

  public setPointerLockCallback(cb: (isLocked: boolean) => void): void {
    this.pointerLockChangeCallback = cb;
  }

  public requestPointerLock(): void {
    if (this.targetCanvas && document.pointerLockElement !== this.targetCanvas) {
      this.targetCanvas.requestPointerLock();
    }
  }

  public exitPointerLock(): void {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const code = e.code;
    if (!this.keys.get(code)) {
      this.keysJustPressed.set(code, true);
    }
    this.keys.set(code, true);

    // Prevent default scrolling for game keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'F1'].includes(code)) {
      e.preventDefault();
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.set(e.code, false);
  }

  private handleMouseDown(e: MouseEvent): void {
    if (!this.mouseButtons.get(e.button)) {
      this.mouseButtonsJustPressed.set(e.button, true);
    }
    this.mouseButtons.set(e.button, true);
  }

  private handleMouseUp(e: MouseEvent): void {
    this.mouseButtons.set(e.button, false);
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isPointerLocked) {
      this.mouseDeltaX += e.movementX || 0;
      this.mouseDeltaY += e.movementY || 0;
    }
  }

  private handlePointerLockChange(): void {
    this.isPointerLocked = (document.pointerLockElement === this.targetCanvas);
    if (this.pointerLockChangeCallback) {
      this.pointerLockChangeCallback(this.isPointerLocked);
    }
  }

  public isKeyDown(code: string): boolean {
    return !!this.keys.get(code);
  }

  public isKeyPressed(code: string): boolean {
    return !!this.keysJustPressed.get(code);
  }

  public isMouseButtonDown(btn: number): boolean {
    return !!this.mouseButtons.get(btn);
  }

  public isMouseButtonPressed(btn: number): boolean {
    return !!this.mouseButtonsJustPressed.get(btn);
  }

  public consumeMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }

  public update(): void {
    // Clear edge-triggered states after each frame
    this.keysJustPressed.clear();
    this.mouseButtonsJustPressed.clear();
  }
}
