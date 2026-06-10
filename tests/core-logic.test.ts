import { describe, it, expect } from 'vitest';
import * as visibilityService from '../src/services/visibility.service';

describe('HistorIA Core Logic (Mocked)', () => {
  describe('Visibility and State Filtering', () => {
    it('should correctly filter events based on visibility rules', async () => {
      const publicEvent = { visibility: 'public' };
      const privateEvent = { visibility: 'player_private', actorId: 'germany' };

      expect(visibilityService.canActorSeeEvent(publicEvent, 'france')).toBe(true);
      expect(visibilityService.canActorSeeEvent(privateEvent, 'france')).toBe(false);
      expect(visibilityService.canActorSeeEvent(privateEvent, 'germany')).toBe(true);
    });

    it('should correctly filter map changes based on actor-specific rules', async () => {
      const franceChange = { visibility: 'actor:france' };
      const publicChange = { visibility: 'public' };

      expect(visibilityService.canActorSeeMapChange(franceChange, 'france')).toBe(true);
      expect(visibilityService.canActorSeeMapChange(franceChange, 'germany')).toBe(false);
      expect(visibilityService.canActorSeeMapChange(publicChange, 'germany')).toBe(true);
    });
  });
});
