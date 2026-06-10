import { z } from 'zod';

export const EventSchema = z.object({
  turn: z.number().optional(),
  date: z.string().optional(),
  title: z.string(),
  eventType: z.string(),
  description: z.string(),
  visibility: z.string(),
  actorId: z.string().optional(),
  targetActorId: z.string().optional(),
  affectedRegions: z.any().optional(),
  payload: z.any().optional(),
  publicSummary: z.string().optional(),
  privateSummary: z.string().optional(),
});

export const CreateEventsSchema = z.object({
  events: z.array(EventSchema),
});
