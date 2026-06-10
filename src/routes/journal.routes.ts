import { FastifyInstance } from 'fastify';
import { JournalService } from '../services/journal.service';

const journalService = new JournalService();

export default async function (fastify: FastifyInstance) {
  fastify.get('/sessions/:sessionId/actors/:actorId/journal', {
    schema: {
      operationId: 'getJournal',
      params: { sessionId: { type: 'string' }, actorId: { type: 'string' } },
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId, actorId } = request.params as any;
    return journalService.getJournal(sessionId, actorId);
  });
}
