import { z } from 'zod';

export const MapChangeSchema = z.object({
  changeType: z.string(),
  targetType: z.string(),
  targetId: z.string().optional(),
  payload: z.any().optional(),
  visibility: z.string(),
});

export const CreateMapChangesSchema = z.object({
  mapChanges: z.array(MapChangeSchema),
});
