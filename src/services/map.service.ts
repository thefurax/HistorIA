import prisma from '../lib/prisma';
import * as visibilityService from './visibility.service';
import { NotFoundError } from '../utils/errors';


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

    const filteredRegions = regions.filter(r => visibilityService.canActorSeeRegion(r, actorId));
    const filteredFeatures = features.filter(f => visibilityService.canActorSeeMapFeature(f, actorId));
    const filteredFronts = fronts.filter(f => visibilityService.canActorSeeFront(f, actorId));
    const filteredMapChanges = mapChanges.filter(mc => visibilityService.canActorSeeMapChange(mc, actorId));

    // Return as standard objects, frontend will wrap them in GeoJSON FeatureCollections
    return {
      session: {
        id: session.id,
        currentDate: session.currentDate,
        currentTurn: session.currentTurn,
      },
      regions: filteredRegions.map(r => ({
        type: 'Feature',
        id: r.id,
        geometry: r.geometry,
        properties: {
          name: r.name,
          type: r.type,
          status: r.status,
          controllerActorId: r.controllerActorId,
          ...(r.properties as any || {}),
        }
      })),
      features: filteredFeatures.map(f => ({
        type: 'Feature',
        id: f.id,
        geometry: f.geometry,
        properties: {
          name: f.name,
          featureType: f.featureType,
          actorId: f.actorId,
          confidence: f.confidence,
          ...(f.properties as any || {}),
        }
      })),
      fronts: filteredFronts.map(f => ({
        type: 'Feature',
        id: f.id,
        geometry: f.geometry,
        properties: {
          name: f.name,
          type: f.type,
          status: f.status,
          attackerActorId: f.attackerActorId,
          defenderActorId: f.defenderActorId,
          ...(f.payload as any || {}),
        }
      })),
      mapChanges: filteredMapChanges,
    };
  }
}
