import { PrismaClient } from '@prisma/client';
import { EventsService } from './events.service';
import { CriteriaService } from './criteria.service';
import { MapService } from './map.service';
import { FrontsService } from './fronts.service';
import { AdvisorService } from './advisor.service';

const prisma = new PrismaClient();

export class JumpService {
  private eventsService = new EventsService();
  private criteriaService = new CriteriaService();
  private mapService = new MapService();
  private frontsService = new FrontsService();
  private advisorService = new AdvisorService();

  async resolveJump(sessionId: string, data: any) {
    const { jump, events, criteriaUpdates, mapChanges, frontUpdates, actorId } = data;

    if (events) await this.eventsService.createEvents(sessionId, events);
    if (criteriaUpdates) await this.criteriaService.upsertCriteria(sessionId, criteriaUpdates);
    if (mapChanges) await prisma.mapChange.createMany({ data: mapChanges.map((mc: any) => ({ ...mc, sessionId })) });
    if (frontUpdates) await this.frontsService.upsertFronts(sessionId, frontUpdates);

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        currentDate: jump.toDate,
        currentTurn: { increment: 1 },
      }
    });

    if (actorId) return this.advisorService.getAdvisorState(sessionId, actorId);
    return { success: true, newDate: jump.toDate };
  }
}
