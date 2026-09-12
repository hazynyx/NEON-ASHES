import { AudioManager } from './AudioManager.ts';
import { HUD } from '../ui/HUD.ts';

export interface NarrationItem {
  speaker: string;
  text: string;
  delayAfter?: number;
}

export class NarrationManager {
  public isVoiceEnabled: boolean = true;
  public isSpeaking: boolean = false;
  
  private audio: AudioManager;
  private hud: HUD;
  private voices: SpeechSynthesisVoice[] = [];
  private currentQueue: NarrationItem[] = [];
  private onQueueComplete: (() => void) | null = null;
  private hideTimer: number | null = null;

  constructor(audio: AudioManager, hud: HUD) {
    this.audio = audio;
    this.hud = hud;
    this.loadVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isVoiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  private getBestVoice(speaker: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    if (this.voices.length === 0) return null;

    const isFemale = speaker.includes('MRS. GABLE') || speaker.includes('MARA') || speaker.includes('LENA');
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    if (isFemale) {
      const femaleVoice = pool.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('victoria')
      );
      if (femaleVoice) return femaleVoice;
    } else {
      const maleVoice = pool.find(v =>
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('mark')
      );
      if (maleVoice) return maleVoice;
    }

    return pool[0] || null;
  }

  public speak(
    speaker: string,
    text: string,
    onEnd?: () => void
  ): void {
    // Always show subtitle on HUD
    this.hud.showNarration(speaker, text);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.audio.playRadioClick();

    if (!this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Visual subtitle duration fallback
      const duration = Math.max(3200, text.length * 68);
      this.hideTimer = window.setTimeout(() => {
        this.hud.hideNarration();
        if (onEnd) onEnd();
      }, duration);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice(speaker);
    if (voice) {
      utterance.voice = voice;
    }

    // Configure distinct voice personalities
    if (speaker.includes('KALEB')) {
      utterance.pitch = 0.85; // Deep, gritty noir protagonist
      utterance.rate = 0.92;
    } else if (speaker.includes('MRS. GABLE')) {
      utterance.pitch = 1.18; // Elderly neighbor
      utterance.rate = 0.95;
    } else if (speaker.includes('JONAH')) {
      utterance.pitch = 0.94;
      utterance.rate = 1.0;
    } else if (speaker.includes('SYNDICATE') || speaker.includes('HITMAN')) {
      utterance.pitch = 0.78; // Aggressive enforcer
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 0.96;
      utterance.rate = 0.95;
    }

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.hideTimer = window.setTimeout(() => {
        this.hud.hideNarration();
      }, 400);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.hideTimer = window.setTimeout(() => {
        this.hud.hideNarration();
      }, 800);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public queueNarrations(items: NarrationItem[], onComplete?: () => void): void {
    this.currentQueue = [...items];
    this.onQueueComplete = onComplete || null;
    this.processQueue();
  }

  private processQueue(): void {
    if (this.currentQueue.length === 0) {
      if (this.onQueueComplete) {
        this.onQueueComplete();
        this.onQueueComplete = null;
      }
      return;
    }

    const next = this.currentQueue.shift()!;
    this.speak(next.speaker, next.text, () => {
      const delay = next.delayAfter || 600;
      setTimeout(() => {
        this.processQueue();
      }, delay);
    });
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentQueue = [];
    this.isSpeaking = false;
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.hud.hideNarration();
  }
}
