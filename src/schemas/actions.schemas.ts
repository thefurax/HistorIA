import { z } from 'zod';

export const PendingActionSchema = z.object({
  actionType: z.string(),
  title: z.string(),
  description: z.string(),
  intent: z.string().optional(),
  payload: z.any().optional(),
  visibility: z.string(),
  resolveAfter: z.string().optional(),
});

export const AddPendingActionsSchema = z.object({
  actions: z.array(PendingActionSchema),
});
