import { FastifyInstance } from 'fastify';
import { AdvisorService } from '../services/advisor.service';

const advisorService = new AdvisorService();

export default async function (fastify: FastifyInstance) {
  fastify.get('/sessions/:sessionId/actors/:actorId/advisor-state', {
    schema: {
      operationId: 'getAdvisorState',
      params: {
        sessionId: { type: 'string' },
        actorId: { type: 'string' }
      },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return advisorService.getAdvisorState(sessionId, actorId);
  });
}
