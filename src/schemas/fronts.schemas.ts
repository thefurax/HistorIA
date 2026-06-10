import { z } from 'zod';

export const FrontSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
  attackerActorId: z.string().optional().nullable(),
  defenderActorId: z.string().optional().nullable(),
  regionIds: z.any().optional(),
  geometry: z.any().optional(),
  visibility: z.string(),
  payload: z.any().optional(),
});

export const UpsertFrontsSchema = z.object({
  fronts: z.array(FrontSchema),
});
