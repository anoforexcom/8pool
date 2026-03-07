
class AudioService {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private activeOscillators: Set<OscillatorNode> = new Set();
  private bgMusic: HTMLAudioElement | null = null;
  private bgVolume: number = 0.3;
  private currentTrackIndex: number = 0;

  tracks = [
    { name: "Zen Garden", url: "https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3" },
    { name: "Deep Focus", url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" },
    { name: "Relaxing Rain", url: "https://assets.mixkit.co/music/preview/mixkit-relaxing-rain-and-thunder-storm-1250.mp3" }
  ];

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playTap() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playCorrect() {
    this.playTone(600, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(900, 'sine', 0.2, 0.05), 50);
  }

  playIncorrect() {
    this.playTone(150, 'sawtooth', 0.3, 0.05);
  }

  playPlacement() {
    this.playTone(400, 'triangle', 0.15, 0.05);
  }

  playWin() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.1), i * 150);
    });
  }

  playClick() {
    this.playTone(1000, 'sine', 0.05, 0.03);
  }

  startBackgroundMusic(trackIndex: number = 0) {
    if (this.bgMusic && !this.bgMusic.paused && this.currentTrackIndex === trackIndex) return;

    // Stop generative music if running (clearing oscillators)
    this.stopGenerativeMusic();

    // If switching tracks or starting new
    if (this.bgMusic) {
      this.bgMusic.pause();
    }

    this.currentTrackIndex = trackIndex;
    const track = this.tracks[trackIndex] || this.tracks[0];

    this.bgMusic = new Audio(track.url);
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.bgVolume;
    this.bgMusic.play().catch(e => console.log('Autoplay prevented', e));
  }

  stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      // this.bgMusic = null; // Keep instance to resume? No, creating new is safer for track switch
    }
    this.stopGenerativeMusic();
  }

  private stopGenerativeMusic() {
    this.isMusicPlaying = false;
    if (this.musicGain && this.ctx) {
      this.musicGain.disconnect();
      this.musicGain = null;
      this.activeOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { }
      });
      this.activeOscillators.clear();
    }
  }

  setTrack(index: number) {
    if (index >= 0 && index < this.tracks.length) {
      this.startBackgroundMusic(index);
    }
  }
}

export const audioService = new AudioService();
