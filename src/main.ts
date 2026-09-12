import { Game } from './core/Game.ts';
import { GameLoop } from './core/GameLoop.ts';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Failed to locate #webgl-canvas');
    return;
  }

  const game = new Game(canvas);
  (window as any).game = game;
  const loop = new GameLoop(game);
  loop.start();

  console.log('NEON ASHES engine initialized successfully.');
});
