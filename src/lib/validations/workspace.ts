import { z } from "zod";

export const businessProfileSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  domain: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  headquarters: z.string().optional().or(z.literal("")),
  targetGeographies: z.string().optional().or(z.literal("")),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  targetAudience: z.string().optional().or(z.literal("")),
  priceRange: z.string().optional().or(z.literal("")),
  valueProps: z.string().optional().or(z.literal("")),
});

export const icpProfileSchema = z.object({
  targetIndustries: z.string().optional().or(z.literal("")),
  companySize: z.string().optional().or(z.literal("")),
  geographies: z.string().optional().or(z.literal("")),
  decisionMakers: z.string().optional().or(z.literal("")),
  technologies: z.string().optional().or(z.literal("")),
  buyingSignals: z.string().optional().or(z.literal("")),
  excludedIndustries: z.string().optional().or(z.literal("")),
  excludedGeographies: z.string().optional().or(z.literal("")),
});

export const workspaceUpdateSchema = z.object({
  businessProfile: businessProfileSchema.optional(),
  icpProfile: icpProfileSchema.optional(),
});
