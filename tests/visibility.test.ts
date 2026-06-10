import { describe, it, expect } from 'vitest';
import * as visibilityService from '../src/services/visibility.service';

describe('Visibility Rules', () => {
  const actorId = 'france-id';

  it('should allow public and advisor_known visibility', () => {
    expect(visibilityService.canActorSeeEvent({ visibility: 'public' }, actorId)).toBe(true);
    expect(visibilityService.canActorSeeEvent({ visibility: 'advisor_known' }, actorId)).toBe(true);
  });

  it('should forbid foreign_private, gm_private, and never_reveal_raw even if actorId matches', () => {
    const forbidden = ['foreign_private', 'gm_private', 'never_reveal_raw'];
    for (const v of forbidden) {
      expect(visibilityService.canActorSeeEvent({ visibility: v, actorId }, actorId)).toBe(false);
      expect(visibilityService.canActorSeeCriteria({ visibility: v, actorId }, actorId)).toBe(false);
      expect(visibilityService.canActorSeeMapChange({ visibility: v, payload: { actorId } }, actorId)).toBe(false);
    }
  });

  it('should allow actor:<actorId> specifically for that actor', () => {
    expect(visibilityService.canActorSeeEvent({ visibility: `actor:${actorId}` }, actorId)).toBe(true);
    expect(visibilityService.canActorSeeEvent({ visibility: `actor:germany-id` }, actorId)).toBe(false);
  });

  it('should allow player_private only for the owner', () => {
    expect(visibilityService.canActorSeeEvent({ visibility: 'player_private', actorId }, actorId)).toBe(true);
    expect(visibilityService.canActorSeeEvent({ visibility: 'player_private', actorId: 'germany-id' }, actorId)).toBe(false);
  });

  it('should allow mapChange if actorId is in payload', () => {
    expect(visibilityService.canActorSeeMapChange({ visibility: 'some-v', payload: { actorId } }, actorId)).toBe(true);
    expect(visibilityService.canActorSeeMapChange({ visibility: 'some-v', payload: { actorId: 'other' } }, actorId)).toBe(false);
  });
});
