import { z } from 'zod';

export const CreateActorSchema = z.object({
  name: z.string(),
  normalizedName: z.string().optional(),
  type: z.string(),
  isPlayer: z.boolean().optional(),
  actorCode: z.string().optional(),
  governmentType: z.string().optional(),
  color: z.string().optional(),
});

export const ClaimActorSchema = z.object({
  actorCode: z.string(),
});

export const ActorClaimResponseSchema = z.object({
  sessionId: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  permissions: z.array(z.string()),
  viewScope: z.string(),
});
