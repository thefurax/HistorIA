import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import swaggerPlugin from './plugins/swagger';
import { authMiddleware } from './middleware/auth';
import healthRoutes from './routes/health.routes';
import sessionRoutes from './routes/sessions.routes';
import actorRoutes from './routes/actors.routes';
import advisorRoutes from './routes/advisor.routes';
import eventsRoutes from './routes/events.routes';
import actionsRoutes from './routes/actions.routes';
import criteriaRoutes from './routes/criteria.routes';
import mapRoutes from './routes/map.routes';
import cors from '@fastify/cors';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors);
app.register(prismaPlugin);
app.register(swaggerPlugin);

app.addHook('preHandler', async (request, reply) => {
  if (request.url.startsWith('/gpt')) {
    await authMiddleware(request, reply);
  }
});

app.register(healthRoutes);
app.register(sessionRoutes, { prefix: '/gpt' });
app.register(actorRoutes, { prefix: '/gpt' });
app.register(advisorRoutes, { prefix: '/gpt' });
app.register(eventsRoutes, { prefix: '/gpt' });
app.register(actionsRoutes, { prefix: '/gpt' });
app.register(criteriaRoutes, { prefix: '/gpt' });
app.register(mapRoutes, { prefix: '/gpt' });

app.setErrorHandler((error, request, reply) => {
  if (error.statusCode) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    console.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

export default app;
