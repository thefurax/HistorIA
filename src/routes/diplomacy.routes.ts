import { FastifyInstance } from 'fastify';
import { DiplomacyService } from '../services/diplomacy.service';
import { DiplomacyMessageSchema } from '../schemas/diplomacy.schemas';

const diplomacyService = new DiplomacyService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/actors/:actorId/diplomacy-message', {
    schema: {
      operationId: 'sendDiplomacyMessage',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      body: DiplomacyMessageSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return diplomacyService.sendMessage(sessionId, actorId, request.body);
  });
}
