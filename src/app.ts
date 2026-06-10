import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import swaggerPlugin from './plugins/swagger';
import { authMiddleware } from './middleware/auth';
import healthRoutes from './routes/health.routes';
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

app.setErrorHandler((error, request, reply) => {
  if (error.statusCode) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    console.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

export default app;
