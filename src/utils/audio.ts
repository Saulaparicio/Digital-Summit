// Web Audio API Sound Generator for Real-Time Event Alerts

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Two-tone pleasant notification chime for upcoming activities (e.g. 5 min / 2 min warning)
   */
  public playApproachingAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // First note: E5 (659.25Hz), then B5 (987.77Hz)
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.15);

      osc2.frequency.setValueAtTime(329.63, now);
      osc2.frequency.setValueAtTime(493.88, now + 0.15);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch {
      // Audio playback failed silently
    }
  }

  /**
   * Triumphant chime when an activity starts now
   */
  public playStartedAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0.001, now + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.55);
      });
    } catch {
      // Audio playback failed silently
    }
  }

  /**
   * Subtle alert beep for stage overtime warning
   */
  public playOvertimeBeep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio playback failed silently
    }
  }
}

export const soundEngine = new SoundEngine();
