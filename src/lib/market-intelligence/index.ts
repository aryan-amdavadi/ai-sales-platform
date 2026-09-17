export * from './provider';

import { DeterministicMarketIntelligenceProvider } from './provider';

export function getMarketIntelligenceProvider() {
  // Can be expanded to return other providers based on env vars
  return new DeterministicMarketIntelligenceProvider();
}
