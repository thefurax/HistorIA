import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';


export class ActorsService {
  async createActor(sessionId: string, data: any) {
    return prisma.actor.create({
      data: {
        ...data,
        sessionId,
        normalizedName: data.normalizedName || data.name.toLowerCase().replace(/\s+/g, '_'),
      },
    });
  }

  async claimActor(sessionId: string, actorCode: string) {
    const actor = await prisma.actor.findFirst({
      where: { sessionId, actorCode },
    });
    if (!actor) throw new NotFoundError(`Actor with code ${actorCode} not found`);

    return {
      sessionId: actor.sessionId,
      actorId: actor.id,
      actorName: actor.name,
      permissions: ["advisor", "diplomacy", "actions", "jump_request"],
      viewScope: "actor_known_state"
    };
  }
}
