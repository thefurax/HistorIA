import { FastifyInstance } from 'fastify';
import { JumpService } from '../services/jump.service';
import { JumpResolutionSchema } from '../schemas/jump.schemas';

const jumpService = new JumpService();

export default async function (fastify: FastifyInstance) {
  fastify.post('/sessions/:sessionId/jump-resolution', {
    schema: {
      operationId: 'submitJumpResolution',
      params: { sessionId: { type: 'string' } },
      body: JumpResolutionSchema,
      security: [{ bearerAuth: [] }],
    }
  }, async (request) => {
    const { sessionId } = request.params as any;
    return jumpService.resolveJump(sessionId, request.body);
  });
}
