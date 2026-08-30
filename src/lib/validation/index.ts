import { z } from 'zod';

export const LeadFilterSchema = z.object({
  search: z.string().optional(),
  minIntent: z.coerce.number().min(0).max(100).optional(),
  maxIntent: z.coerce.number().min(0).max(100).optional(),
  industry: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  urgency: z.string().optional(),
  location: z.string().optional(),
  sortBy: z.enum(['intent', 'newest', 'qualification', 'company']).optional().default('intent'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.coerce.number().min(1).max(200).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const OnboardingSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  website: z.string().url('Must be a valid URL'),
  products: z.array(z.string()).min(1, 'Add at least one product or service'),
  targetIndustries: z.array(z.string()).min(1, 'Select at least one industry'),
  targetLocations: z.array(z.string()).min(1, 'Select target geographies'),
  idealCustomerProfile: z.string().min(10, 'Provide a brief ICP description'),
  voiceAgentName: z.string().default('Nova Voice AI'),
});

export const CreateCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  targetAudience: z.string().min(3, 'Target audience description required'),
  goal: z.string().optional(),
  channels: z.string().default('Voice AI, Email'),
});

export const CallTriggerSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  campaignId: z.string().optional(),
  notes: z.string().optional(),
});
