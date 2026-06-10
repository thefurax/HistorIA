import prisma from '../lib/prisma';
import { EventsService } from './events.service';
import { MapService } from './map.service';
import { CriteriaService } from './criteria.service';
import { ActionsService } from './actions.service';


export class AdvisorService {
  private eventsService = new EventsService();
  private mapService = new MapService();
  private criteriaService = new CriteriaService();
  private actionsService = new ActionsService();

  async getAdvisorState(sessionId: string, actorId: string) {
    const [session, events, mapData, criteria, actions] = await Promise.all([
      prisma.session.findUnique({ where: { id: sessionId } }),
      this.eventsService.getKnownEvents(sessionId, actorId),
      this.mapService.getVisibleMap(sessionId, actorId),
      this.criteriaService.getVisibleCriteria(sessionId, actorId),
      this.actionsService.getPendingActions(sessionId, actorId),
    ]);

    const actor = await prisma.actor.findUnique({ where: { id: actorId } });
    const relations = await prisma.relation.findMany({
      where: {
        sessionId,
        OR: [
          { actorAId: actorId },
          { actorBId: actorId },
          { visibility: 'public' },
          { visibility: 'advisor_known' }
        ]
      }
    });

    return {
      sessionSummary: session,
      actorSummary: actor,
      events,
      criteria,
      relations,
      pendingActions: actions,
      regions: mapData.regions,
      fronts: mapData.fronts,
      mapChanges: mapData.mapChanges,
      features: mapData.features,
    };
  }
}
