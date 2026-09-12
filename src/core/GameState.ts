export enum GameMode {
  MAIN_MENU = 'MAIN_MENU',
  LOADING = 'LOADING',
  FREE_ROAM = 'FREE_ROAM',
  MISSION_ACTIVE = 'MISSION_ACTIVE',
  IN_VEHICLE = 'IN_VEHICLE',
  DIALOGUE = 'DIALOGUE',
  INSPECT_EVIDENCE = 'INSPECT_EVIDENCE',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  MISSION_RESULT = 'MISSION_RESULT'
}

export class GameStateManager {
  private currentState: GameMode = GameMode.MAIN_MENU;
  private previousState: GameMode = GameMode.MAIN_MENU;

  public getState(): GameMode {
    return this.currentState;
  }

  public setState(newState: GameMode): void {
    if (this.currentState === newState) return;
    this.previousState = this.currentState;
    this.currentState = newState;
  }

  public revertState(): void {
    const temp = this.currentState;
    this.currentState = this.previousState;
    this.previousState = temp;
  }

  public isPaused(): boolean {
    return (
      this.currentState === GameMode.PAUSED ||
      this.currentState === GameMode.MAIN_MENU ||
      this.currentState === GameMode.INSPECT_EVIDENCE
    );
  }

  public canPlayerMove(): boolean {
    return (
      this.currentState === GameMode.FREE_ROAM ||
      this.currentState === GameMode.MISSION_ACTIVE
    );
  }

  public isVehicleMode(): boolean {
    return this.currentState === GameMode.IN_VEHICLE;
  }
}
