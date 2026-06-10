import prisma from '../lib/prisma';
import * as visibilityService from './visibility.service';


export class CriteriaService {
  async upsertCriteria(sessionId: string, criteria: any[]) {
    const results = [];
    for (const c of criteria) {
      const res = await prisma.simulationCriteria.upsert({
        where: {
          sessionId_actorId_scope_key: {
            sessionId,
            actorId: c.actorId || null,
            scope: c.scope,
            key: c.key,
          }
        },
        update: { ...c, sessionId },
        create: { ...c, sessionId, createdBy: 'system' },
      });
      results.push(res);
    }
    return results;
  }

  async getVisibleCriteria(sessionId: string, actorId: string) {
    const criteria = await prisma.simulationCriteria.findMany({
      where: { sessionId },
    });
    return criteria.filter(c => visibilityService.canActorSeeCriteria(c, actorId));
  }
}
