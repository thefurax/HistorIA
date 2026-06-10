import { FastifyInstance } from 'fastify';
import { SessionsService } from '../services/sessions.service';
import { CreateSessionSchema, SessionResponseSchema } from '../schemas/sessions.schemas';

const sessionsService = new SessionsService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions', {
    schema: {
      operationId: 'createSession',
      body: CreateSessionSchema,
      response: { 200: SessionResponseSchema },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    return sessionsService.createSession(request.body);
  });

  fastify.get('/sessions/by-code/:joinCode', {
    schema: {
      operationId: 'getSessionByJoinCode',
      params: { joinCode: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { joinCode } = request.params as any;
    return sessionsService.getSessionByJoinCode(joinCode);
  });
}
