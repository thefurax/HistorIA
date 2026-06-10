import { PrismaClient } from '@prisma/client';
import * as visibilityService from './visibility.service';

const prisma = new PrismaClient();

export class FrontsService {
  async upsertFronts(sessionId: string, fronts: any[]) {
    const results = [];
    for (const f of fronts) {
      if (f.id) {
        const res = await prisma.front.update({ where: { id: f.id }, data: { ...f, sessionId } });
        results.push(res);
      } else {
        const res = await prisma.front.create({ data: { ...f, sessionId } });
        results.push(res);
      }
    }
    return results;
  }

  async getVisibleFronts(sessionId: string, actorId: string) {
    const fronts = await prisma.front.findMany({ where: { sessionId } });
    return fronts.filter(f => visibilityService.canActorSeeFront(f, actorId));
  }
}
