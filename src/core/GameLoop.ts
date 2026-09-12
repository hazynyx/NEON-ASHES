import { Game } from './Game.ts';

export class GameLoop {
  private game: Game;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedDeltaTime: number = 1 / 60; // 60 Hz physics

  constructor(game: Game) {
    this.game = game;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  public stop(): void {
    this.isRunning = false;
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp delta to avoid large jumps if tab was backgrounded
    if (delta > 0.1) delta = 0.1;

    this.accumulator += delta;

    // Fixed physics steps
    while (this.accumulator >= this.fixedDeltaTime) {
      this.game.update(this.fixedDeltaTime);
      this.accumulator -= this.fixedDeltaTime;
    }

    // Render frame
    this.game.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
