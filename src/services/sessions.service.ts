import { PrismaClient } from '@prisma/client';
import { generateJoinCode } from '../utils/joinCode';
import { NotFoundError } from '../utils/errors';
import { PUBLIC_MAP_BASE_URL } from '../config';

const prisma = new PrismaClient();

export class SessionsService {
  async createSession(data: any) {
    const joinCode = generateJoinCode();
    const mapUrl = `${PUBLIC_MAP_BASE_URL}/${joinCode}`;

    const session = await prisma.session.create({
      data: {
        title: data.title,
        scenarioType: data.scenarioType,
        startDate: data.startDate || data.currentDate || '1936-01-01',
        currentDate: data.currentDate || '1936-01-01',
        realismMode: data.realismMode,
        joinCode,
        mapUrl,
        actors: data.initialActors ? {
          create: data.initialActors.map((a: any) => ({
            name: a.name,
            normalizedName: a.name.toLowerCase().replace(/\s+/g, '_'),
            type: a.type,
            actorCode: a.actorCode,
            isPlayer: a.isPlayer ?? false,
          }))
        } : undefined,
      },
    });

    return {
      sessionId: session.id,
      joinCode: session.joinCode,
      title: session.title,
      mapUrl: session.mapUrl,
      currentDate: session.currentDate,
      currentTurn: session.currentTurn,
      realismMode: session.realismMode,
    };
  }

  async getSessionByJoinCode(joinCode: string) {
    const session = await prisma.session.findUnique({
      where: { joinCode },
    });
    if (!session) throw new NotFoundError(`Session with code ${joinCode} not found`);
    return session;
  }
}
