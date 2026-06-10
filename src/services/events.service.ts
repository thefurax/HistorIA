import { PrismaClient } from '@prisma/client';
import * as visibilityService from './visibility.service';

const prisma = new PrismaClient();

export class EventsService {
  async createEvents(sessionId: string, events: any[]) {
    return prisma.event.createMany({
      data: events.map(e => ({ ...e, sessionId })),
    });
  }

  async getKnownEvents(sessionId: string, actorId: string) {
    const events = await prisma.event.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
    return events.filter(e => visibilityService.canActorSeeEvent(e, actorId));
  }
}
