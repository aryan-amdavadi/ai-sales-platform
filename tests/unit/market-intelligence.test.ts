import { describe, it, expect } from 'vitest';
import { DeterministicMarketIntelligenceProvider } from '../../src/lib/market-intelligence/provider';

describe('Market Intelligence Engine (Why Now?)', () => {
  it('should return a 0 score and "no actionable signals" rationale when no signals exist', async () => {
    const provider = new DeterministicMarketIntelligenceProvider();
    
    const leadWithoutSignals: any = {
      id: 'lead_1',
      company: {
        id: 'comp_1',
        marketSignals: [],
      }
    };

    const result = await provider.evaluateWhyNow(leadWithoutSignals);

    expect(result.score).toBe(0);
    expect(result.rationale).toContain('No recent market signals detected');
    expect(result.contributingSignals.length).toBe(0);
  });

  it('should aggregate relevance and provide a strong rationale for high relevance signals', async () => {
    const provider = new DeterministicMarketIntelligenceProvider();
    
    const leadWithSignals: any = {
      id: 'lead_2',
      company: {
        id: 'comp_2',
        marketSignals: [
          { type: 'FUNDING', title: 'Series C Raised', relevance: 40, confidence: 95 },
          { type: 'HIRING', title: 'VP of Engineering', relevance: 50, confidence: 90 },
          { type: 'TECHNOLOGY', title: 'Migration to Cloud', relevance: 15, confidence: 80 },
        ],
      }
    };

    const result = await provider.evaluateWhyNow(leadWithSignals);

    // Score should cap at 100
    expect(result.score).toBe(100);
    expect(result.rationale).toContain('Immediate action recommended');
    // It should include the top signals sorted by relevance
    expect(result.contributingSignals.length).toBe(3);
    expect(result.contributingSignals[0].type).toBe('HIRING');
    expect(result.contributingSignals[1].type).toBe('FUNDING');
  });

  it('should return moderate scores and rationale for warm signals', async () => {
    const provider = new DeterministicMarketIntelligenceProvider();
    
    const leadWithWarmSignals: any = {
      id: 'lead_3',
      company: {
        id: 'comp_3',
        marketSignals: [
          { type: 'GROWTH', title: 'New office opened', relevance: 30, confidence: 85 },
          { type: 'HIRING', title: 'Sales Reps', relevance: 30, confidence: 90 },
        ],
      }
    };

    const result = await provider.evaluateWhyNow(leadWithWarmSignals);

    // 30 + 30 = 60
    expect(result.score).toBe(60);
    expect(result.rationale).toContain('Good timing');
  });
});
