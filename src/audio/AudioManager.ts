export class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  
  // Continuous audio nodes
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private isEngineRunning: boolean = false;

  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenActive: boolean = false;

  constructor() {
    // Lazy initialize on first user interaction
  }

  public init(): void {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.ctx.destination);
  }

  private ensureContext(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return !!this.ctx && !!this.masterGain;
  }

  // --- Gunshot SFX ---
  public playGunshot(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    // Noise burst for gunshot crack
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // Punch tone
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);

    noise.start(now);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // --- Shotgun Blast & Pump SFX ---
  public playShotgunFire(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    // 1. Heavy noise explosive burst
    const bufferSize = ctx.sampleRate * 0.28;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.95, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    // 2. Sub-bass concussive punch
    const sub = ctx.createOscillator();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.22);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.85, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    sub.connect(subGain);
    subGain.connect(this.masterGain!);

    noise.start(now);
    sub.start(now);
    sub.stop(now + 0.25);

    // 3. Pump action racking sound (0.35s after shot)
    const pumpTime = now + 0.32;
    [0, 0.12].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 0 ? 1100 : 750, pumpTime + offset);
      pGain.gain.setValueAtTime(0.35, pumpTime + offset);
      pGain.gain.exponentialRampToValueAtTime(0.001, pumpTime + offset + 0.06);

      osc.connect(pGain);
      pGain.connect(this.masterGain!);
      osc.start(pumpTime + offset);
      osc.stop(pumpTime + offset + 0.06);
    });
  }

  // --- Weapon Reload Click ---
  public playReload(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    [0, 0.25, 0.4].forEach((timeOffset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 1 ? 1200 : 800, now + timeOffset);
      gain.gain.setValueAtTime(0.2, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.06);
    });
  }

  // --- Footsteps ---
  public playFootstep(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.value = 250;

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // --- Vehicle Engine Sound (Dynamic Pitch & Volume) ---
  public startEngine(): void {
    if (!this.ensureContext() || this.isEngineRunning) return;
    const ctx = this.ctx!;
    this.isEngineRunning = true;

    this.engineOsc = ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, ctx.currentTime);

    this.engineFilter = ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(350, ctx.currentTime);

    this.engineGain = ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.25, ctx.currentTime);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain!);

    this.engineOsc.start();
  }

  public updateEngine(speedNormalized: number, throttle: number): void {
    if (!this.isEngineRunning || !this.engineOsc || !this.engineFilter || !this.engineGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const targetFreq = 40 + speedNormalized * 90 + (throttle > 0 ? 30 : 0);
    const targetFilter = 280 + speedNormalized * 800 + (throttle > 0 ? 400 : 0);
    const targetGain = 0.2 + speedNormalized * 0.25 + (throttle > 0 ? 0.15 : 0);

    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.1);
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  public stopEngine(): void {
    if (!this.isEngineRunning || !this.engineOsc) return;
    try {
      this.engineOsc.stop();
      this.engineOsc.disconnect();
    } catch (_) {}
    this.isEngineRunning = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
  }

  // --- Tire Screech ---
  public playTireScreech(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.value = 5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
  }

  // --- Collision Impact ---
  public playCollision(intensity: number = 1.0): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const gainVal = Math.min(0.7, Math.max(0.2, intensity * 0.5));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // --- Door Slam ---
  public playDoorSlam(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // --- Mission Complete / Fanfare ---
  public playMissionPassed(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const notes = [220, 277.18, 329.63, 440]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.35, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.65);
    });
  }

  // --- UI Click / Interaction ---
  public playUIClick(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- Dialogue Beep ---
  public playDialogueBlip(): void {
    if (!this.ensureContext() || this.isMuted) return;
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}
