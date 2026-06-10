import { FastifyInstance } from 'fastify';
import { EventsService } from '../services/events.service';
import { CreateEventsSchema } from '../schemas/events.schemas';

const eventsService = new EventsService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/events', {
    schema: {
      operationId: 'createEvents',
      params: { sessionId: { type: 'string' } },
      body: CreateEventsSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    const { events } = request.body as any;
    return eventsService.createEvents(sessionId, events);
  });

  fastify.get('/sessions/:sessionId/actors/:actorId/known-events', {
    schema: {
      operationId: 'getKnownEvents',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return eventsService.getKnownEvents(sessionId, actorId);
  });
}
