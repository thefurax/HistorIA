import { FastifyInstance } from 'fastify';
import { MapService } from '../services/map.service';

const mapService = new MapService();

export default async function (fastify: FastifyInstance) {
  fastify.get('/sessions/:sessionId/actors/:actorId/visible-map', {
    schema: {
      operationId: 'getVisibleMap',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return mapService.getVisibleMap(sessionId, actorId);
  });
}
