import { EventsService } from './events.service';

export class JournalService {
  private eventsService = new EventsService();

  async getJournal(sessionId: string, actorId: string) {
    return this.eventsService.getKnownEvents(sessionId, actorId);
  }
}
