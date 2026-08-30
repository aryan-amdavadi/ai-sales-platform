import { VoiceProvider } from '@/types/voice';
import { BrowserVoiceProvider } from './browser-voice-provider';
import { DemoVoiceProvider } from './demo-voice-provider';

export * from './browser-voice-provider';
export * from './demo-voice-provider';
export * from './scenarios';
export * from './intelligence';

export function getVoiceProvider(): VoiceProvider {
  const browserProvider = new BrowserVoiceProvider();
  if (browserProvider.isSupported()) {
    return browserProvider;
  }
  return new DemoVoiceProvider();
}
