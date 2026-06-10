import { describe, it, expect } from 'vitest';
import * as visibilityService from '../src/services/visibility.service';

describe('Visibility Service', () => {
  it('should identify public visibility', () => {
    expect(visibilityService.isVisibilityPublic('public')).toBe(true);
    expect(visibilityService.isVisibilityPublic('advisor_known')).toBe(true);
    expect(visibilityService.isVisibilityPublic('private')).toBe(false);
  });
});
