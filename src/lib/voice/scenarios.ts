import { ConversationAnalysis } from '@/types/voice';

export interface ScenarioTurn {
  turnIndex: number;
  aiStatement: string;
  leadResponse: string;
  signals: {
    intent: number;
    interest: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    detectedRequirement: string;
    timeline: string;
    painPoint: string;
    objection: string;
    decisionMaker: string;
    buyingStage: string;
  };
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  language: string;
  prospectName: string;
  prospectTitle: string;
  companyName: string;
  turns: ScenarioTurn[];
  finalAnalysis: ConversationAnalysis;
}

export const HERO_SCENARIO_EN: ScenarioDefinition = {
  id: 'HIGH_INTENT_SHAREPOINT_EN',
  name: 'SharePoint Modernization (Hero Lead - English)',
  language: 'en-US',
  prospectName: 'Marcus Vance',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'ABC Technologies',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        "Hi, I'm the AI sales assistant from IntentOS. I'm calling regarding your recent SharePoint implementation requirement. Is this a good time?",
      leadResponse:
        'Yes, we are currently evaluating implementation partners.',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Implementation Partner',
        timeline: 'Evaluating vendors',
        painPoint: 'Vendor search',
        objection: 'None',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement: "What is the biggest challenge you're trying to solve?",
      leadResponse: 'Our legacy migration is the biggest concern.',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint 2016 Legacy Migration & Modern SPFx Apps',
        timeline: 'Immediate planning',
        painPoint: 'Legacy SharePoint 2016 on-premise infrastructure migration',
        objection: 'Potential cutover downtime & workflow disruption',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement: 'What timeline are you working with?',
      leadResponse: 'We want to shortlist vendors within 30 days.',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Online, Microsoft 365, Legacy Migration, Training, 24/7 Support',
        timeline: 'Within 30 Days (Active Shortlist Window)',
        painPoint: 'Legacy migration & 750 user change management',
        objection: 'SLA guarantees for post-launch support',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement: 'Would a technical discussion with an implementation specialist be useful?',
      leadResponse: "Yes, we'd be interested in that.",
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Complete SharePoint Online Architecture & Custom SPFx Modernization',
        timeline: 'Next 30 Days',
        painPoint: 'Legacy migration with zero business disruption',
        objection: 'Resolved via phased migration methodology',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Decision & Meeting Scheduled',
      },
    },
  ],
  finalAnalysis: {
    callSummary:
      'CTO Marcus Vance confirmed active vendor evaluation for SharePoint Online modernization. Key friction point is legacy 2016 migration with zero downtime. Target vendor shortlist deadline is 30 days. Marcus explicitly agreed to a technical discovery session with our lead implementation specialist.',
    summary:
      'CTO Marcus Vance confirmed active vendor evaluation for SharePoint Online modernization. Key friction point is legacy 2016 migration with zero downtime. Target vendor shortlist deadline is 30 days. Marcus explicitly agreed to a technical discovery session with our lead implementation specialist.',
    qualificationScore: 92,
    interestLevel: 'HIGH',
    timeline: '30 days',
    decisionMaker: 'Confirmed (CTO Marcus Vance)',
    budget: '$150,000 ARR allocated for turnkey deployment',
    painPoints: [
      'Legacy on-premise SharePoint 2016 server end-of-life risks',
      'Custom form refactoring to modern SPFx web parts',
      'Zero-downtime cutover across 750 enterprise employees',
    ],
    objections: [
      'Migration downtime and operational disruption risks during cutover',
    ],
    buyingStage: 'Vendor Selection',
    nextBestAction: 'Schedule a technical discovery meeting within 48 hours.',
    actionPriority: 'HIGH',
    recommendedPositioning:
      'Position IntentOS as the specialized SharePoint Online partner with turnkey zero-downtime migration accelerators.',
  },
};

export const HERO_SCENARIO_HI: ScenarioDefinition = {
  id: 'HIGH_INTENT_SHAREPOINT_HI',
  name: 'SharePoint Modernization (Hero Lead - Hindi / हिंदी)',
  language: 'hi-IN',
  prospectName: 'Marcus Vance',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'ABC Technologies',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        'नमस्ते, मैं IntentOS का AI सेल्स असिस्टेंट हूँ। मैं आपकी हालिया SharePoint इम्प्लीमेंटेशन आवश्यकता के संबंध में बात कर रहा हूँ। क्या यह बात करने का सही समय है?',
      leadResponse:
        'हाँ, हम वर्तमान में इम्प्लीमेंटेशन पार्टनर्स का मूल्यांकन कर रहे हैं।',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Implementation Partner',
        timeline: 'Evaluating vendors',
        painPoint: 'Vendor search',
        objection: 'None',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement: 'सबसे बड़ी तकनीकी चुनौती क्या है जिसका आप समाधान ढूंढ रहे हैं?',
      leadResponse: 'हमारा लेगेसी माइग्रेशन सबसे बड़ी चिंता है।',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint 2016 Legacy Migration',
        timeline: 'Immediate planning',
        painPoint: 'Legacy SharePoint 2016 migration',
        objection: 'Downtime risk',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement: 'आप किस समय सीमा (Timeline) के साथ काम कर रहे हैं?',
      leadResponse: 'हम 30 दिनों के भीतर वेंडर्स को शॉर्टलिस्ट करना चाहते हैं।',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Online, Microsoft 365, Migration',
        timeline: '30 Days',
        painPoint: 'Legacy migration',
        objection: 'SLA guarantees',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement: 'क्या हमारे मुख्य इम्प्लीमेंटेशन विशेषज्ञ के साथ तकनीकी चर्चा उपयोगी होगी?',
      leadResponse: 'हाँ, हम इसमें रुचि रखते हैं।',
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Complete Architecture & Custom SPFx Modernization',
        timeline: 'Next 30 Days',
        painPoint: 'Zero-downtime cutover',
        objection: 'None',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Decision & Meeting Scheduled',
      },
    },
  ],
  finalAnalysis: HERO_SCENARIO_EN.finalAnalysis,
};

export const HERO_SCENARIO_GU: ScenarioDefinition = {
  id: 'HIGH_INTENT_SHAREPOINT_GU',
  name: 'SharePoint Modernization (Hero Lead - Gujarati / ગુજરાતી)',
  language: 'gu-IN',
  prospectName: 'Marcus Vance',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'ABC Technologies',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        'નમસ્તે, હું IntentOS નો AI સેલ્સ આસિસ્ટન્ટ છું. હું આપની SharePoint ઈમ્પ્લિમેન્ટેશન જરૂરિયાત સંદર્ભે વાત કરી રહ્યો છું. શું આ વાત કરવાનો યોગ્ય સમય છે?',
      leadResponse:
        'હા, અમે હાલમાં ઈમ્પ્લિમેન્ટેશન પાર્ટનર્સની ચકાસણી કરી રહ્યા છીએ.',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Implementation Partner',
        timeline: 'Evaluating vendors',
        painPoint: 'Vendor search',
        objection: 'None',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement: 'આપ સૌથી મોટો કયો ટેકનિકલ પડકાર હલ કરવા માંગો છો?',
      leadResponse: 'અમારું લેગસી માઈગ્રેશન સૌથી મોટી ચિંતા છે.',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint 2016 Legacy Migration',
        timeline: 'Immediate planning',
        painPoint: 'Legacy SharePoint 2016 migration',
        objection: 'Downtime risk',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement: 'આપ કઈ સમયમર્યાદા (Timeline) માં કામ કરી રહ્યા છો?',
      leadResponse: 'અમે 30 દિવસમાં વેન્ડર્સને શોર્ટલિસ્ટ કરવા માંગીએ છીએ.',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'SharePoint Online, Microsoft 365, Migration',
        timeline: '30 Days',
        painPoint: 'Legacy migration',
        objection: 'SLA guarantees',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement: 'શું અમારા ટેકનિકલ સ્પેશિયાલિસ્ટ સાથે આર્કિટેક્ચરલ ચર્ચા ઉપયોગી રહેશે?',
      leadResponse: 'હા, અમને તેમાં ચોક્કસ રસ છે.',
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Complete Architecture & Custom SPFx Modernization',
        timeline: 'Next 30 Days',
        painPoint: 'Zero-downtime cutover',
        objection: 'None',
        decisionMaker: 'Confirmed (CTO Marcus Vance)',
        buyingStage: 'Decision & Meeting Scheduled',
      },
    },
  ],
  finalAnalysis: HERO_SCENARIO_EN.finalAnalysis,
};

export const AVAILABLE_SCENARIOS: Record<string, ScenarioDefinition> = {
  'en-US': HERO_SCENARIO_EN,
  'hi-IN': HERO_SCENARIO_HI,
  'gu-IN': HERO_SCENARIO_GU,
};
