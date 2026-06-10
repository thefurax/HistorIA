import { z } from 'zod';

export const CriteriaSchema = z.object({
  actorId: z.string().optional().nullable(),
  scope: z.string(),
  key: z.string(),
  label: z.string(),
  type: z.string(),
  value: z.any(),
  minValue: z.number().optional().nullable(),
  maxValue: z.number().optional().nullable(),
  visibility: z.string(),
  description: z.string().optional().nullable(),
});

export const UpsertCriteriaSchema = z.object({
  criteria: z.array(CriteriaSchema),
});
