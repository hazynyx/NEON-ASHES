import { HUD } from '../ui/HUD.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import { InputManager } from '../core/InputManager.ts';
import { NarrationManager } from '../audio/NarrationManager.ts';

export interface DialogueLine {
  speaker: string;
  text: string;
}

export class DialogueManager {
  private hud: HUD;
  private audio: AudioManager;
  private narrationMgr?: NarrationManager;
  public isActive: boolean = false;
  private currentLines: DialogueLine[] = [];
  private lineIndex: number = 0;
  private onFinishedCallback?: () => void;

  constructor(hud: HUD, audio: AudioManager, narrationMgr?: NarrationManager) {
    this.hud = hud;
    this.audio = audio;
    this.narrationMgr = narrationMgr;

    // Listen for click on dialogue box
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
      dialogueBox.addEventListener('click', () => {
        if (this.isActive) {
          this.advance();
        }
      });
    }
  }

  public setNarrationManager(mgr: NarrationManager): void {
    this.narrationMgr = mgr;
  }

  public startDialogue(lines: DialogueLine[], onFinished?: () => void): void {
    if (lines.length === 0) return;
    this.isActive = true;
    this.currentLines = lines;
    this.lineIndex = 0;
    this.onFinishedCallback = onFinished;

    this.showCurrentLine();
  }

  private showCurrentLine(): void {
    const line = this.currentLines[this.lineIndex];
    this.hud.showDialogue(line.speaker, line.text);
    this.audio.playDialogueBlip();
    if (this.narrationMgr) {
      this.narrationMgr.speak(line.speaker, line.text);
    }
  }

  public advance(): void {
    if (!this.isActive) return;
    this.lineIndex++;
    if (this.lineIndex >= this.currentLines.length) {
      this.endDialogue();
    } else {
      this.showCurrentLine();
    }
  }

  public endDialogue(): void {
    this.isActive = false;
    this.hud.hideDialogue();
    if (this.narrationMgr) {
      this.narrationMgr.stop();
    }
    if (this.onFinishedCallback) {
      const cb = this.onFinishedCallback;
      this.onFinishedCallback = undefined;
      cb();
    }
  }

  public update(input: InputManager): void {
    if (!this.isActive) return;

    if (input.isKeyPressed('Space') || input.isKeyPressed('KeyF') || input.isKeyPressed('KeyE')) {
      this.advance();
    }
  }
}
