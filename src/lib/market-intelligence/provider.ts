import { MarketSignal, Lead, Company } from '@prisma/client';

export interface WhyNowEvaluation {
  score: number; // 0 to 100
  rationale: string;
  contributingSignals: MarketSignal[];
}

export interface MarketIntelligenceProvider {
  name: string;
  
  /**
   * Evaluates the "Why Now?" score for an opportunity based on its associated company's market signals.
   */
  evaluateWhyNow(lead: Lead & { company: Company & { marketSignals: MarketSignal[] } }): Promise<WhyNowEvaluation>;
}

export class DeterministicMarketIntelligenceProvider implements MarketIntelligenceProvider {
  name = 'DeterministicMarketIntelligenceProvider';

  async evaluateWhyNow(lead: Lead & { company: Company & { marketSignals: MarketSignal[] } }): Promise<WhyNowEvaluation> {
    const signals = lead.company.marketSignals || [];
    
    if (signals.length === 0) {
      return {
        score: 0,
        rationale: 'No recent market signals detected for this company.',
        contributingSignals: [],
      };
    }

    let totalRelevance = 0;
    const contributingSignals: MarketSignal[] = [];

    // Sort signals by relevance
    const sortedSignals = [...signals].sort((a, b) => b.relevance - a.relevance);

    for (const signal of sortedSignals) {
      if (signal.relevance > 0) {
        totalRelevance += signal.relevance;
        contributingSignals.push(signal);
      }
    }

    // Base score calculation
    const baseScore = Math.min(100, totalRelevance);
    
    // Time decay: highly relevant signals from a long time ago decay.
    // For deterministic provider, we just cap it and write a rationale.
    let rationale = '';
    if (baseScore >= 80) {
      rationale = 'Immediate action recommended. Highly relevant recent market signals (e.g. key executive hiring, funding, or technology shifts) strongly validate the timing of this opportunity.';
    } else if (baseScore >= 50) {
      rationale = 'Good timing. Recent market activity suggests an environment conducive to evaluating new solutions.';
    } else if (baseScore > 0) {
      rationale = 'Weak timing signals. Some market activity detected but relevance to the current opportunity is low.';
    } else {
      rationale = 'No actionable timing signals detected.';
    }

    return {
      score: baseScore,
      rationale,
      contributingSignals: contributingSignals.slice(0, 5), // Top 5 signals
    };
  }
}
