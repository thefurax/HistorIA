import { FastifyInstance } from 'fastify';
import { ActionsService } from '../services/actions.service';
import { AddPendingActionsSchema } from '../schemas/actions.schemas';

const actionsService = new ActionsService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/actors/:actorId/pending-actions', {
    schema: {
      operationId: 'addPendingActions',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      body: AddPendingActionsSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    const { actions } = request.body as any;
    return actionsService.addPendingActions(sessionId, actorId, actions);
  });

  fastify.get('/sessions/:sessionId/actors/:actorId/pending-actions', {
    schema: {
      operationId: 'getPendingActions',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return actionsService.getPendingActions(sessionId, actorId);
  });
}
