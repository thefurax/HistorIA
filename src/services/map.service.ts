import { PrismaClient } from '@prisma/client';
import * as visibilityService from './visibility.service';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export class MapService {
  async getVisibleMap(sessionId: string, actorId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);

    const [regions, features, fronts, mapChanges] = await Promise.all([
      prisma.region.findMany({ where: { sessionId } }),
      prisma.mapFeature.findMany({ where: { sessionId } }),
      prisma.front.findMany({ where: { sessionId } }),
      prisma.mapChange.findMany({ where: { sessionId } }),
    ]);

    return {
      session: {
        id: session.id,
        currentDate: session.currentDate,
        currentTurn: session.currentTurn,
      },
      regions: regions.filter(r => visibilityService.canActorSeeRegion(r, actorId)),
      features: features.filter(f => visibilityService.canActorSeeMapFeature(f, actorId)),
      fronts: fronts.filter(f => visibilityService.canActorSeeFront(f, actorId)),
      mapChanges: mapChanges.filter(mc => visibilityService.canActorSeeMapChange(mc, actorId)),
    };
  }
}
