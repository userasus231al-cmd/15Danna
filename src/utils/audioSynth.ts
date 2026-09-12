/**
 * Web Audio API gentle waltz music box synthesizer.
 * Creates an elegant, romantic acoustic music-box waltz (3/4 time signature)
 * Plays smoothly and loops infinitely without any external network dependency.
 */

class WaltzSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private masterGain: GainNode | null = null;

  // Romantic Once Upon a Dream (Sleeping Beauty Waltz) melody in G Major (3/4 time)
  private melodyNotes: { note: number; duration: number }[] = [
    // "I know you..."
    { note: 587.33, duration: 1.0 }, // D5 (I)
    { note: 493.88, duration: 2.0 }, // B4 (know)
    { note: 392.00, duration: 3.0 }, // G4 (you)
    // "I walked with you once upon a"
    { note: 587.33, duration: 1.0 }, // D5
    { note: 659.25, duration: 1.0 }, // E5
    { note: 587.33, duration: 1.0 }, // D5
    { note: 523.25, duration: 1.0 }, // C5
    { note: 493.88, duration: 1.0 }, // B4
    { note: 440.00, duration: 1.0 }, // A4
    // "dream..."
    { note: 493.88, duration: 3.0 }, // B4
    { note: 392.00, duration: 3.0 }, // G4
    // "I know you..."
    { note: 587.33, duration: 1.0 }, // D5
    { note: 493.88, duration: 2.0 }, // B4
    { note: 392.00, duration: 3.0 }, // G4
    // "The gleam in your eyes is so familiar a"
    { note: 587.33, duration: 1.0 }, // D5
    { note: 659.25, duration: 1.0 }, // E5
    { note: 587.33, duration: 1.0 }, // D5
    { note: 659.25, duration: 1.0 }, // E5
    { note: 739.99, duration: 1.0 }, // F#5
    { note: 783.99, duration: 1.0 }, // G5
    // "gleam..."
    { note: 880.00, duration: 3.0 }, // A5
    { note: 739.99, duration: 3.0 }, // F#5
    // "Yet I know it's true, that visions are seldom all they seem..."
    { note: 880.00, duration: 1.0 }, // A5
    { note: 783.99, duration: 1.0 }, // G5
    { note: 739.99, duration: 1.0 }, // F#5
    { note: 659.25, duration: 1.0 }, // E5
    { note: 587.33, duration: 1.0 }, // D5
    { note: 523.25, duration: 1.0 }, // C5
    // "But if I know you, I know what you'll do..."
    { note: 493.88, duration: 2.0 }, // B4
    { note: 523.25, duration: 1.0 }, // C5
    { note: 587.33, duration: 3.0 }, // D5
    // "You'll love me at once, the way you did once upon a dream!"
    { note: 659.25, duration: 1.0 }, // E5
    { note: 739.99, duration: 1.0 }, // F#5
    { note: 783.99, duration: 1.0 }, // G5
    { note: 880.00, duration: 2.0 }, // A5
    { note: 587.33, duration: 1.0 }, // D5
    { note: 783.99, duration: 3.0 }, // G5
    { note: 0, duration: 1.0 },      // Rest
  ];

  // Bass accompaniment pattern (Oom-pah-pah in 3/4)
  private bassChords: { bass: number; chord: number[] }[] = [
    { bass: 196.00, chord: [293.66, 392.00, 493.88] }, // G major
    { bass: 196.00, chord: [293.66, 392.00, 493.88] },
    { bass: 220.00, chord: [261.63, 329.63, 440.00] }, // A minor
    { bass: 146.83, chord: [293.66, 369.99, 440.00] }, // D major
    { bass: 164.81, chord: [246.94, 329.63, 392.00] }, // E minor
    { bass: 261.63, chord: [329.63, 392.00, 523.25] }, // C major
    { bass: 146.83, chord: [293.66, 369.99, 440.00] }, // D7
    { bass: 196.00, chord: [293.66, 392.00, 493.88] }, // G major
  ];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play() {
    if (this.isPlaying) return;
    const ctx = this.getAudioContext();
    this.isPlaying = true;
    this.noteIndex = 0;

    let currentStep = 0;
    const stepTime = 420; // ms per beat

    const scheduleNext = () => {
      if (!this.isPlaying) return;

      const now = ctx.currentTime;
      const beat = currentStep % 3; // 0, 1, 2
      const barIndex = Math.floor(currentStep / 3) % this.bassChords.length;
      const barChord = this.bassChords[barIndex];

      // Play bass on beat 0, chord on beat 1 and 2
      if (beat === 0) {
        this.playPluckNote(ctx, barChord.bass, now, 0.8, 'triangle', 0.2);
      } else {
        barChord.chord.forEach((freq) => {
          this.playPluckNote(ctx, freq, now, 0.45, 'sine', 0.1);
        });
      }

      // Play melody note
      const currentMelody = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
      if (currentMelody.note > 0) {
        // Celestial music box bell sound (Sine + Harmonic)
        this.playMusicBoxBell(ctx, currentMelody.note, now, currentMelody.duration * 0.7);
      }

      this.noteIndex++;
      currentStep++;

      this.timerId = window.setTimeout(scheduleNext, stepTime);
    };

    scheduleNext();
  }

  private playMusicBoxBell(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (!this.masterGain) return;

    // Fundamental oscillator (crystal pure bell)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle octave shimmer
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + Math.max(duration, 0.8));

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.5);
    osc2.stop(startTime + duration + 0.5);
  }

  private playPluckNote(ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType, volume: number) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val * 0.4)), this.ctx.currentTime);
    }
  }

  /**
   * Generates an authentic, gentle parchment paper turn sound effect
   */
  public playPageFlip() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.36); // ~360ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft pink/brown velvet noise texture
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.045;
        b1 = 0.99332 * b1 + white * 0.065;
        b2 = 0.96900 * b2 + white * 0.125;
        const pink = b0 + b1 + b2 + white * 0.42;
        // Smooth sine bell envelope with soft tail
        const progress = i / bufferSize;
        const env = Math.sin(progress * Math.PI) * (1 - progress * 0.25);
        output[i] = pink * 0.09 * env;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Soft lowpass/bandpass air filter sweep
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.34);
      filter.Q.setValueAtTime(1.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.36);
    } catch {
      // safe fallback if audio is not yet activated
    }
  }
}

export const waltzSynthesizer = new WaltzSynthesizer();
export const playPageFlipSound = () => waltzSynthesizer.playPageFlip();

