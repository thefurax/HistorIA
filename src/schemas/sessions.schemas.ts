import { z } from 'zod';

export const CreateSessionSchema = z.object({
  title: z.string(),
  scenarioType: z.string(),
  startDate: z.string().optional(),
  currentDate: z.string().optional(),
  realismMode: z.enum(['strict_historical', 'plausible_alt_history', 'speculative', 'dieselpunk_pulp']),
  initialActors: z.array(z.object({
    name: z.string(),
    type: z.string(),
    actorCode: z.string().optional(),
    isPlayer: z.boolean().optional(),
  })).optional(),
});

export const SessionResponseSchema = z.object({
  sessionId: z.string(),
  joinCode: z.string(),
  title: z.string(),
  mapUrl: z.string(),
  currentDate: z.string(),
  currentTurn: z.number(),
  realismMode: z.string(),
});
