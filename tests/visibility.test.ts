import { describe, it, expect, beforeEach } from 'vitest';
import * as visibilityService from '../src/services/visibility.service';

describe('Visibility Filtering', () => {
  const actorId = 'actor-1';

  it('should see public events', () => {
    const event = { title: 'Public', visibility: 'public' };
    expect(visibilityService.canActorSeeEvent(event, actorId)).toBe(true);
  });

  it('should not see foreign_private events', () => {
    const event = { title: 'Secret', visibility: 'foreign_private', actorId: 'other-actor' };
    expect(visibilityService.canActorSeeEvent(event, actorId)).toBe(false);
  });

  it('should see its own player_private events', () => {
    const event = { title: 'Private', visibility: 'player_private', actorId };
    expect(visibilityService.canActorSeeEvent(event, actorId)).toBe(true);
  });

  it('should see public map changes', () => {
    const mc = { visibility: 'public' };
    expect(visibilityService.canActorSeeMapChange(mc, actorId)).toBe(true);
  });

  it('should see map changes specifically for the actor', () => {
    const mc = { visibility: `actor:${actorId}` };
    expect(visibilityService.canActorSeeMapChange(mc, actorId)).toBe(true);
  });

  it('should see map changes if payload contains actorId', () => {
    const mc = { visibility: 'private', payload: { actorId } };
    expect(visibilityService.canActorSeeMapChange(mc, actorId)).toBe(true);
  });

  it('should not see gm_private criteria', () => {
    const criteria = { visibility: 'gm_private' };
    expect(visibilityService.canActorSeeCriteria(criteria, actorId)).toBe(false);
  });
});
