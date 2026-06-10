import { z } from 'zod';

export const JumpResolutionSchema = z.object({
  actorId: z.string().optional(),
  jump: z.object({
    fromDate: z.string(),
    toDate: z.string(),
    durationLabel: z.string()
  }),
  resolvedActions: z.array(z.any()).optional(),
  events: z.array(z.any()).optional(),
  stateUpdates: z.array(z.any()).optional(),
  criteriaUpdates: z.array(z.any()).optional(),
  mapChanges: z.array(z.any()).optional(),
  equipmentUpdates: z.array(z.any()).optional(),
  projectsUpdates: z.array(z.any()).optional(),
  frontUpdates: z.array(z.any()).optional(),
});
