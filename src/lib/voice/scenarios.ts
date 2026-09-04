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
  prospectName: 'John Smith',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'TechNova Solutions',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        'Hello John, this is the AI sales assistant from IntentOS. I noticed TechNova Solutions is evaluating partners for a Microsoft 365 and SharePoint implementation. Am I reaching the right person?',
      leadResponse:
        'Yes, this is John. We are looking at partners, but we are quite early in the process.',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Microsoft 365 & SharePoint Implementation',
        timeline: 'Early vendor evaluation',
        painPoint: 'Vendor evaluation',
        objection: 'Early in process',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement:
        'Understood. Based on your public RFP, you are migrating from on-premise infrastructure and need custom SPFx development. Is that still the primary scope?',
      leadResponse:
        'Yes, that is accurate. Our main concern is legacy migration downtime and user adoption across our teams.',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'On-premise migration & custom SPFx development',
        timeline: 'Active procurement window',
        painPoint: 'Legacy migration complexity, Workflow interruption',
        objection: 'Migration downtime concern, User adoption resistance',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement:
        'That makes complete sense. We specialize in zero-downtime SharePoint migrations with comprehensive training programs. What timeline are you targeting for vendor selection?',
      leadResponse: 'We need to make a decision within 30 days to stay on schedule.',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Zero-downtime SharePoint migration with staff training',
        timeline: '30 days',
        painPoint: 'Legacy migration downtime & team enablement',
        objection: 'Migration downtime',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement:
        'Perfect. I would like to schedule a 30-minute technical scoping call with our solutions architect to review your migration roadmap. Would Thursday at 2 PM work for you?',
      leadResponse: 'Thursday at 2 PM works. Please send the calendar invite to my email.',
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: '30-min Technical Scoping Call & Migration Roadmap Review',
        timeline: 'Thursday 2 PM (30 days total timeline)',
        painPoint: 'Migration roadmap validation',
        objection: 'Resolved with scoping call',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Meeting Scheduled',
      },
    },
  ],
  finalAnalysis: {
    callSummary:
      'CTO John Smith confirmed active vendor evaluation for Microsoft 365 & SharePoint Implementation at TechNova Solutions. Primary requirements are migrating from on-premise infrastructure and custom SPFx development. Main concerns are legacy migration downtime and user adoption. John confirmed a strict 30-day vendor selection timeline and agreed to a 30-minute technical scoping call on Thursday at 2 PM.',
    summary:
      'CTO John Smith confirmed active vendor evaluation for Microsoft 365 & SharePoint Implementation at TechNova Solutions. Primary requirements are migrating from on-premise infrastructure and custom SPFx development. Main concerns are legacy migration downtime and user adoption. John confirmed a strict 30-day vendor selection timeline and agreed to a 30-minute technical scoping call on Thursday at 2 PM.',
    qualificationScore: 92,
    interestLevel: 'HIGH',
    timeline: '30 days',
    decisionMaker: 'Confirmed (John Smith, CTO)',
    budget: 'Not disclosed on call (estimated $45,000–$65,000 from RFP signals)',
    painPoints: [
      'Legacy migration complexity',
      'Workflow interruption',
      'Retiring on-premise infrastructure without business disruption',
    ],
    objections: [
      'Migration downtime concern',
      'User adoption resistance',
    ],
    buyingStage: 'Meeting Scheduled',
    nextBestAction:
      'Schedule technical scoping call for Thursday 2 PM, send calendar invite, attach SharePoint migration case study',
    actionPriority: 'HIGH',
    recommendedPositioning:
      'Position IntentOS as the specialized Microsoft partner with proven zero-downtime migration accelerators and change management programs.',
  },
};

export const HERO_SCENARIO_HI: ScenarioDefinition = {
  id: 'HIGH_INTENT_SHAREPOINT_HI',
  name: 'SharePoint Modernization (Hero Lead - Hindi / हिंदी)',
  language: 'hi-IN',
  prospectName: 'John Smith',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'TechNova Solutions',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        'नमस्ते John, मैं IntentOS का AI सेल्स असिस्टेंट हूँ। मैंने देखा कि TechNova Solutions Microsoft 365 और SharePoint इम्प्लीमेंटेशन के लिए पार्टनर्स का मूल्यांकन कर रहा है। क्या मैं सही व्यक्ति से बात कर रहा हूँ?',
      leadResponse:
        'हाँ, मैं John हूँ। हम पार्टनर्स देख रहे हैं, लेकिन हम इस प्रक्रिया में काफी शुरुआती चरण में हैं।',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Microsoft 365 & SharePoint Implementation',
        timeline: 'Evaluating vendors',
        painPoint: 'Vendor search',
        objection: 'Early in process',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement:
        'समझ गया। आपके सार्वजनिक RFP के आधार पर, आप ऑन-प्रेमिस इन्फ्रास्ट्रक्चर से माइग्रेट कर रहे हैं और कस्टम SPFx डेवलपमेंट की आवश्यकता है। क्या यही मुख्य दायरा है?',
      leadResponse:
        'हाँ, यह बिल्कुल सही है। हमारी मुख्य चिंता लेगेसी माइग्रेशन डाउनटाइम और हमारी टीमों में यूजर एडॉप्शन है।',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'On-premise migration & custom SPFx development',
        timeline: 'Immediate planning',
        painPoint: 'Legacy migration complexity, Workflow interruption',
        objection: 'Migration downtime concern, User adoption resistance',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement:
        'बिल्कुल समझ में आता है। हम व्यापक प्रशिक्षण कार्यक्रमों के साथ जीरो-डाउनटाइम SharePoint माइग्रेशन में विशेषज्ञ हैं। आप वेंडर चयन के लिए किस समय सीमा का लक्ष्य बना रहे हैं?',
      leadResponse: 'शेड्यूल पर बने रहने के लिए हमें 30 दिनों के भीतर निर्णय लेना होगा।',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Zero-downtime SharePoint migration with staff training',
        timeline: '30 days',
        painPoint: 'Legacy migration',
        objection: 'Migration downtime',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement:
        'उत्कृष्ट। मैं आपके माइग्रेशन रोडमैप की समीक्षा के लिए हमारे सॉल्यूशंस आर्किटेक्ट के साथ 30 मिनट का टेक्निकल स्कोपिंग कॉल शेड्यूल करना चाहता हूँ। क्या गुरुवार को दोपहर 2 बजे आपके लिए ठीक रहेगा?',
      leadResponse: 'गुरुवार को दोपहर 2 बजे काम करेगा। कृपया मेरी ईमेल पर कैलेंडर आमंत्रण भेजें।',
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: '30-min Technical Scoping Call & Roadmap Review',
        timeline: 'Thursday 2 PM (30 days total)',
        painPoint: 'Roadmap validation',
        objection: 'None',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Meeting Scheduled',
      },
    },
  ],
  finalAnalysis: HERO_SCENARIO_EN.finalAnalysis,
};

export const HERO_SCENARIO_GU: ScenarioDefinition = {
  id: 'HIGH_INTENT_SHAREPOINT_GU',
  name: 'SharePoint Modernization (Hero Lead - Gujarati / ગુજરાતી)',
  language: 'gu-IN',
  prospectName: 'John Smith',
  prospectTitle: 'Chief Technology Officer (CTO)',
  companyName: 'TechNova Solutions',
  turns: [
    {
      turnIndex: 1,
      aiStatement:
        'નમસ્તે John, હું IntentOS નો AI સેલ્સ આસિસ્ટન્ટ છું. મેં જોયું કે TechNova Solutions Microsoft 365 અને SharePoint ઈમ્પ્લિમેન્ટેશન માટે પાર્ટનર્સનું મૂલ્યાંકન કરી રહ્યું છે. શું હું યોગ્ય વ્યક્તિ સાથે વાત કરી રહ્યો છું?',
      leadResponse:
        'હા, હું John છું. અમે પાર્ટનર્સ શોધી રહ્યા છીએ, પરંતુ અમે પ્રક્રિયાના પ્રારંભિક તબક્કામાં છીએ.',
      signals: {
        intent: 90,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Microsoft 365 & SharePoint Implementation',
        timeline: 'Evaluating vendors',
        painPoint: 'Vendor search',
        objection: 'Early in process',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 2,
      aiStatement:
        'સમજાયું. આપના જાહેર RFP ના આધારે, આપ ઓન-પ્રેમિસ ઇન્ફ્રાસ્ટ્રક્ચરથી માઇગ્રેટ કરી રહ્યા છો અને કસ્ટમ SPFx ડેવલપમેન્ટ જરૂરી છે. શું હજુ પણ આ મુખ્ય સ્કોપ છે?',
      leadResponse:
        'હા, તે સાચું છે. અમારી મુખ્ય ચિંતા લેગસી માઇગ્રેશન ડાઉનટાઇમ અને ટીમોમાં યુઝર એડોપ્શન છે.',
      signals: {
        intent: 92,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'On-premise migration & custom SPFx development',
        timeline: 'Immediate planning',
        painPoint: 'Legacy migration complexity, Workflow interruption',
        objection: 'Migration downtime concern, User adoption resistance',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 3,
      aiStatement:
        'ચોક્કસ. અમે વ્યાપક તાલીમ કાર્યક્રમો સાથે ઝીરો-ડાઉનટાઇમ SharePoint માઇગ્રેશનમાં વિશેષતા ધરાવીએ છીએ. વેન્ડર પસંદગી માટે આપ કઈ સમયમર્યાદા ધ્યાનમાં રાખી રહ્યા છો?',
      leadResponse: 'સમયસર રહેવા માટે અમારે 30 દિવસની અંદર નિર્ણય લેવો પડશે.',
      signals: {
        intent: 94,
        interest: 'HIGH',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: 'Zero-downtime SharePoint migration with staff training',
        timeline: '30 days',
        painPoint: 'Legacy migration',
        objection: 'Migration downtime',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Vendor Selection',
      },
    },
    {
      turnIndex: 4,
      aiStatement:
        'ઉત્તમ. આપના માઇગ્રેશન રોડમેપની સમીક્ષા માટે હું અમારા સોલ્યુશન્સ આર્કિટેક્ટ સાથે 30 મિનિટનો ટેકનિકલ સ્કોપિંગ કૉલ શેડ્યૂલ કરવા માંગુ છું. શું ગુરુવારે બપોરે 2 વાગ્યે આપને અનુકૂળ રહેશે?',
      leadResponse: 'ગુરુવારે બપોરે 2 વાગ્યે અનુકૂળ રહેશે. કૃપા કરીને મારા ઇમેઇલ પર કેલેન્ડર ઇન્વાઇટ મોકલો.',
      signals: {
        intent: 96,
        interest: 'EXTREME',
        urgency: 'HIGH',
        sentiment: 'POSITIVE',
        detectedRequirement: '30-min Technical Scoping Call & Roadmap Review',
        timeline: 'Thursday 2 PM (30 days total)',
        painPoint: 'Roadmap validation',
        objection: 'None',
        decisionMaker: 'Confirmed (John Smith, CTO)',
        buyingStage: 'Meeting Scheduled',
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
