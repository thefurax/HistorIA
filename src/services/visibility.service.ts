import { Event, MapChange, Region, Front, MapFeature, SimulationCriteria } from '@prisma/client';

export const isVisibilityPublic = (visibility: string): boolean => {
  return visibility === 'public' || visibility === 'advisor_known';
};

export const canActorSeeEvent = (event: Partial<Event>, actorId: string): boolean => {
  const v = event.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  if (v === 'player_private' || v === 'intelligence_report' || v === 'foreign_private') return event.actorId === actorId;
  return false;
};

export const canActorSeeRegion = (region: Partial<Region>, actorId: string): boolean => {
  const v = region.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  if (region.controllerActorId === actorId) return true;
  return false;
};

export const canActorSeeFront = (front: Partial<Front>, actorId: string): boolean => {
  const v = front.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  if (front.attackerActorId === actorId || front.defenderActorId === actorId) return true;
  return false;
};

export const canActorSeeMapFeature = (feature: Partial<MapFeature>, actorId: string): boolean => {
  const v = feature.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  if (feature.actorId === actorId) return true;
  return false;
};

export const canActorSeeCriteria = (criteria: Partial<SimulationCriteria>, actorId: string): boolean => {
  const v = criteria.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  if (v === 'player_private') return criteria.actorId === actorId;
  return false;
};

export const canActorSeeMapChange = (mapChange: Partial<MapChange>, actorId: string): boolean => {
  const v = mapChange.visibility;
  if (!v) return false;
  if (isVisibilityPublic(v)) return true;
  if (v === `actor:${actorId}`) return true;
  const payload = (mapChange.payload as any) || {};
  if (payload.actorId === actorId) return true;
  return false;
};
