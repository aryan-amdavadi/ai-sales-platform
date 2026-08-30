import { VoiceProvider } from '@/types/voice';
import { DemoVoiceProvider } from './demo-voice-provider';

export class BrowserVoiceProvider implements VoiceProvider {
  name = 'BrowserVoiceProvider';
  private fallbackProvider = new DemoVoiceProvider();
  private recognition: any = null;

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  async start(): Promise<void> {
    if (!this.isSupported()) {
      return this.fallbackProvider.start();
    }
    return Promise.resolve();
  }

  async speak(text: string, lang = 'en-US', onEnd?: () => void): Promise<void> {
    if (!this.isSupported() || !window.speechSynthesis) {
      return this.fallbackProvider.speak(text, lang, onEnd);
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      return new Promise((resolve) => {
        utterance.onend = () => {
          if (onEnd) onEnd();
          resolve();
        };
        utterance.onerror = () => {
          if (onEnd) onEnd();
          resolve();
        };
        window.speechSynthesis.speak(utterance);
      });
    } catch {
      return this.fallbackProvider.speak(text, lang, onEnd);
    }
  }

  async listen(onResult: (text: string) => void, onError?: (err: any) => void): Promise<void> {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.stop();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        if (onError) onError(event.error);
      };

      this.recognition.start();
    } catch (err) {
      if (onError) onError(err);
    }
  }

  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
    this.fallbackProvider.stop();
  }
}
