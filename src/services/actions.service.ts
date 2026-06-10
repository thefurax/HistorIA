import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActionsService {
  async addPendingActions(sessionId: string, actorId: string, actions: any[]) {
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    const currentTurn = session?.currentTurn || 1;

    return prisma.pendingAction.createMany({
      data: actions.map(a => ({
        ...a,
        sessionId,
        actorId,
        status: 'pending',
        createdTurn: currentTurn,
      })),
    });
  }

  async getPendingActions(sessionId: string, actorId: string) {
    return prisma.pendingAction.findMany({
      where: { sessionId, actorId },
    });
  }
}
