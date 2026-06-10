import { describe, it, expect } from 'vitest';
import { AdvisorService } from '../src/services/advisor.service';

// Mocking prisma would be ideal here, but for MVP we focus on service structure
describe('Advisor Service', () => {
  it('should exist', () => {
    const advisorService = new AdvisorService();
    expect(advisorService).toBeDefined();
  });
});
