# IntentOS — REST API Reference & Data Contracts

**Product**: IntentOS — Autonomous AI Sales Platform  
**Document**: API Specifications & Schemas  
**Version**: v1.0.0  

---

## 1. Dashboard & Telemetry APIs

### `GET /api/dashboard`
Returns 7 KPI metrics, the Opportunity Funnel breakdown, and the AI Priority Queue.

**Response `200 OK`**:
```json
{
  "totalOpportunities": 10,
  "highIntentCount": 4,
  "readyToContactCount": 6,
  "aiCallsCount": 3,
  "interestedCount": 3,
  "meetingsCount": 2,
  "totalPipelineValue": 725000,
  "funnelData": [
    { "stage": "DISCOVERED", "count": 2, "percentage": 20 },
    { "stage": "HIGH_INTENT", "count": 2, "percentage": 20 },
    { "stage": "QUALIFIED", "count": 2, "percentage": 20 },
    { "stage": "MEETING", "count": 2, "percentage": 20 }
  ],
  "priorityQueue": [
    {
      "id": "lead-1",
      "companyName": "TechNova Solutions",
      "contactName": "John Smith",
      "contactTitle": "Chief Technology Officer",
      "intentScore": 94,
      "urgency": "HIGH",
      "status": "HIGH_INTENT",
      "pipelineValue": 150000,
      "topRequirement": "SharePoint 2016 to M365 Cloud Migration",
      "primarySource": "LINKEDIN"
    }
  ]
}
```

---

## 2. Opportunity Intelligence APIs

### `GET /api/opportunities`
Query parameter filtering and sorting across all ingested leads.

**Query Parameters**:
- `search` (string): Text filter across company, contact, title, requirement.
- `minIntent` (number): Minimum intent score (0-100).
- `industry` (string): Filter by industry vertical.
- `source` (string): Filter by sourcing platform.
- `status` (string): Filter by funnel status.
- `sortBy` (`intent` | `newest` | `qualification` | `company`).
- `limit` (number), `offset` (number).

### `GET /api/opportunities/:id`
Returns full opportunity intelligence record with company profile, requirements, qualifications, recommendations, and activity logs.

### `POST /api/opportunities/:id/analyze`
Triggers full AI requirement understanding, 8-dimension scoring, evidence extraction, fit calculation, and sales brief synthesis.

### `POST /api/opportunities/:id/sales-brief`
Regenerates pre-call sales brief, friction points, opening statement, and objection playbook.

### `POST /api/opportunities/:id/score`
Recalculates 8-dimension Intent and Company Fit metrics.

---

## 3. Autonomous Voice & CRM APIs

### `POST /api/calls/start`
Initializes a new autonomous voice calling session for a target lead.

**Request Body**:
```json
{
  "leadId": "lead-1",
  "campaignId": "camp-1",
  "language": "en-US"
}
```

### `POST /api/calls/:id/end`
Terminates the voice session, computes conversation intelligence, updates BANT qualification, and generates the recommended Next Best Action.

### `POST /api/calls/:id/handoff`
Triggers human representative transfer alert.

### `POST /api/calls/:id/crm-push`
Pushes qualified opportunity, contact, and call transcript into Salesforce / HubSpot.

**Response `200 OK`**:
```json
{
  "success": true,
  "crmSyncId": "CRM-SYNC-819204",
  "contactId": "cnt-abc-101",
  "opportunityId": "opp-abc-101",
  "callLogId": "call-log-819204",
  "status": "SYNCHRONIZED",
  "syncedAt": "2026-08-30T12:00:00.000Z"
}
```

---

## 4. Campaigns, Analytics & Admin APIs

### `GET /api/campaigns` & `POST /api/campaigns`
Fetches and creates multi-channel ICP outreach campaigns.

### `GET /api/campaigns/:id` & `PATCH /api/campaigns/:id`
Retrieves campaign details with enrolled accounts and updates campaign parameters.

### `GET /api/analytics`
Returns 10 real-time conversion metrics and data for 5 charts.

### `GET /api/admin`
Returns subsystem telemetry metrics and immutable activity audit logs.

### `POST /api/demo/reset`
Restores the database to deterministic initial seed state.
