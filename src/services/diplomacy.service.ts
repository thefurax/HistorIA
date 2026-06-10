import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

export class DiplomacyService {
  async sendMessage(sessionId: string, fromActorId: string, data: any) {
    return prisma.diplomacyMessage.create({
      data: {
        ...data,
        sessionId,
        fromActorId,
        visibility: data.visibility || 'player_private',
        status: 'sent',
      }
    });
  }
}
