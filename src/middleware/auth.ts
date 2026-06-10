import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../utils/errors';
import { HISTORIA_GPT_ACTION_KEY } from '../config';

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }
  const token = authHeader.split(' ')[1];
  if (token !== HISTORIA_GPT_ACTION_KEY) {
    throw new UnauthorizedError('Invalid API key');
  }
};
