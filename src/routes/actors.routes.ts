import { FastifyInstance } from 'fastify';
import { ActorsService } from '../services/actors.service';
import { CreateActorSchema, ClaimActorSchema, ActorClaimResponseSchema } from '../schemas/actors.schemas';

const actorsService = new ActorsService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/actors', {
    schema: {
      operationId: 'createActor',
      params: { sessionId: { type: 'string' } },
      body: CreateActorSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    return actorsService.createActor(sessionId, request.body);
  });

  fastify.post('/sessions/:sessionId/actors/claim', {
    schema: {
      operationId: 'claimActor',
      params: { sessionId: { type: 'string' } },
      body: ClaimActorSchema,
      response: { 200: ActorClaimResponseSchema },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    const { actorCode } = request.body as any;
    return actorsService.claimActor(sessionId, actorCode);
  });
}
