// app/services/audioService.ts

// 这些时间点是从原作者的 music.js 文件中提取的
const SOUND_TIMES = {
    clear: { offset: 0, duration: 0.7675 },
    fall: { offset: 1.2558, duration: 0.3546 },
    gameover: { offset: 8.1276, duration: 1.1437 },
    rotate: { offset: 2.2471, duration: 0.0807 },
    move: { offset: 2.9088, duration: 0.1437 },
    start: { offset: 3.7202, duration: 3.6224 },
};

class AudioService {
    private audioContext: AudioContext | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private isMuted: boolean = false;
    private isInitialized: boolean = false;

    // 仅在浏览器环境中初始化 AudioContext
    constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    // 异步加载并解码音频文件
    public async init() {
        if (this.isInitialized || !this.audioContext) return;
        this.isInitialized = true;

        try {
            const response = await fetch('/music.mp3'); // 从 public 文件夹加载
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("音频文件加载失败:", error);
            this.audioContext = null; // 如果加载失败，则禁用音频
        }
    }

    // 播放指定片段的核心方法
    private async playSound(sound: keyof typeof SOUND_TIMES) {
        if (!this.audioContext || !this.audioBuffer || this.isMuted) return;

        // 现代浏览器要求用户交互后才能播放音频，这里尝试恢复被暂停的上下文
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioContext.destination);

        const { offset, duration } = SOUND_TIMES[sound];
        source.start(0, offset, duration);
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    // 暴露给外部调用的具体音效方法
    public playMove() { this.playSound('move'); }
    public playRotate() { this.playSound('rotate'); }
    public playDrop() { this.playSound('fall'); }
    public playClear() { this.playSound('clear'); }
    public playGameOver() { this.playSound('gameover'); }
    public playStart() { this.playSound('start'); }
}

// 导出一个单例，确保整个应用中只有一个音频服务实例
export const audioService = new AudioService();