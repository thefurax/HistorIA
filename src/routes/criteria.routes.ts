import { FastifyInstance } from 'fastify';
import { CriteriaService } from '../services/criteria.service';
import { UpsertCriteriaSchema } from '../schemas/criteria.schemas';

const criteriaService = new CriteriaService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/criteria/upsert', {
    schema: {
      operationId: 'upsertCriteria',
      params: { sessionId: { type: 'string' } },
      body: UpsertCriteriaSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    const { criteria } = request.body as any;
    return criteriaService.upsertCriteria(sessionId, criteria);
  });

  fastify.get('/sessions/:sessionId/actors/:actorId/criteria', {
    schema: {
      operationId: 'getCriteria',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return criteriaService.getVisibleCriteria(sessionId, actorId);
  });
}
