import { z } from 'zod';

export const DiplomacyMessageSchema = z.object({
  toActorId: z.string(),
  message: z.string(),
  tone: z.string().optional(),
  visibility: z.string().optional(),
});
