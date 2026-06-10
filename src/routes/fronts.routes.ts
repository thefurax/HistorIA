import { FastifyInstance } from 'fastify';
import { FrontsService } from '../services/fronts.service';
import { UpsertFrontsSchema } from '../schemas/fronts.schemas';

const frontsService = new FrontsService();

export default async function (fastify: FastifyInstance) {
  fastify.get('/sessions/:sessionId/actors/:actorId/fronts', {
    schema: {
      operationId: 'getFronts',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return frontsService.getVisibleFronts(sessionId, actorId);
  });

  fastify.post('/sessions/:sessionId/fronts/upsert', {
    schema: {
      operationId: 'upsertFronts',
      params: { sessionId: { type: 'string' } },
      body: UpsertFrontsSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    const { fronts } = request.body as any;
    return frontsService.upsertFronts(sessionId, fronts);
  });
}
