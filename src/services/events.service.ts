import prisma from '../lib/prisma';
import * as visibilityService from './visibility.service';


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
