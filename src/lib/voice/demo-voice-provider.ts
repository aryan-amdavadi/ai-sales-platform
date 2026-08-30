import { VoiceProvider } from '@/types/voice';

export class DemoVoiceProvider implements VoiceProvider {
  name = 'DemoVoiceProvider';
  private currentTimeout: any = null;

  isSupported(): boolean {
    return true; // Always supported in all environments
  }

  async start(): Promise<void> {
    return Promise.resolve();
  }

  async speak(text: string, lang = 'en-US', onEnd?: () => void): Promise<void> {
    // Deterministic simulation delay based on text length (e.g. ~40ms per word, min 400ms)
    const words = text.split(' ').length;
    const duration = Math.min(2500, Math.max(500, words * 70));

    return new Promise((resolve) => {
      this.currentTimeout = setTimeout(() => {
        if (onEnd) onEnd();
        resolve();
      }, duration);
    });
  }

  async listen(onResult: (text: string) => void, onError?: (err: any) => void): Promise<void> {
    return Promise.resolve();
  }

  stop(): void {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}
