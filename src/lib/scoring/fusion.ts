export interface FusedSignal {
  text: string;
  type: 'REQUIREMENT' | 'MARKET_SIGNAL' | 'AUTHORITY' | 'URGENCY' | 'SOURCE';
  weight: number;
}

export interface FusionResult {
  confidence: number;
  explanation: string;
  signals: FusedSignal[];
}

export function computeFusedSignals(opportunity: any): FusionResult {
  if (!opportunity) {
    return { confidence: 0, explanation: 'No data available', signals: [] };
  }

  const signals: FusedSignal[] = [];
  let baseScore = 40; // Base confidence just for existing in the system

  // 1. Source Context
  if (opportunity.source?.platform) {
    const isHighIntentSource = ['WEBSITE_INBOUND', 'RFP', 'REFERRAL'].includes(opportunity.source.platform);
    const weight = isHighIntentSource ? 15 : 5;
    signals.push({
      text: `Originated from ${opportunity.source.platform}`,
      type: 'SOURCE',
      weight,
    });
    baseScore += weight;
  }

  // 2. Requirement / Need
  const req = opportunity.requirements?.[0];
  if (req) {
    const weight = req.confidenceScore > 80 ? 25 : 15;
    signals.push({
      text: `Active requirement: ${req.category || req.title}`,
      type: 'REQUIREMENT',
      weight,
    });
    baseScore += weight;
    
    // Check Timeline
    if (req.timeframe) {
      const isUrgent = req.timeframe.toLowerCase().includes('immediate') || 
                       req.timeframe.toLowerCase().includes('30') || 
                       opportunity.urgency === 'IMMEDIATE' || 
                       opportunity.urgency === 'HIGH';
      if (isUrgent) {
        signals.push({
          text: `Urgent Timeline: ${req.timeframe}`,
          type: 'URGENCY',
          weight: 15,
        });
        baseScore += 15;
      }
    }
  } else if (opportunity.urgency === 'IMMEDIATE' || opportunity.urgency === 'HIGH') {
    signals.push({
      text: 'High Urgency Flagged',
      type: 'URGENCY',
      weight: 10,
    });
    baseScore += 10;
  }

  // 3. Authority
  if (opportunity.title) {
    const titleLower = opportunity.title.toLowerCase();
    const isExecutive = ['ceo', 'cto', 'cio', 'ciso', 'vp', 'founder', 'director'].some(t => titleLower.includes(t));
    if (isExecutive) {
      signals.push({
        text: `Executive Authority: ${opportunity.title}`,
        type: 'AUTHORITY',
        weight: 15,
      });
      baseScore += 15;
    }
  }

  // 4. Market Signals (from Company)
  const marketSignals = opportunity.company?.marketSignals || [];
  if (marketSignals.length > 0) {
    // Only take the top 2 to avoid blowing out the score
    const topSignals = marketSignals.slice(0, 2);
    topSignals.forEach((ms: any) => {
      const weight = ms.relevance > 80 ? 10 : 5;
      signals.push({
        text: `${ms.type} Signal: ${ms.title}`,
        type: 'MARKET_SIGNAL',
        weight,
      });
      baseScore += weight;
    });
  }

  // Normalize confidence to 100 max
  const confidence = Math.min(100, baseScore);

  // Generate Explanation
  let explanation = '';
  if (confidence >= 90) {
    explanation = 'Exceptional buying alignment. Multiple high-intent signals (authority, urgency, and requirement) converge.';
  } else if (confidence >= 70) {
    explanation = 'Strong buying alignment. Core requirement exists with supporting signals.';
  } else if (confidence >= 50) {
    explanation = 'Moderate alignment. Need identified but lacks urgency or executive authority.';
  } else {
    explanation = 'Low alignment. Few actionable buying signals detected.';
  }

  return {
    confidence,
    explanation,
    signals,
  };
}
