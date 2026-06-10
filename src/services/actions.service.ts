import prisma from '../lib/prisma';


export class ActionsService {
  async validateAction(sessionId: string, actorId: string, data: any) {
    const { interpretedAction } = data;
    const actionType = interpretedAction.actionType;
    const session = await prisma.session.findUnique({ where: { id: sessionId } });

    if (actionType === 'use_nuclear_weapon') {
      const criteria = await prisma.simulationCriteria.findMany({ where: { sessionId, actorId } });
      const hasNukes = criteria.find(c => c.key === 'nuclear_weapons_operational' && c.value === true);
      const stock = criteria.find(c => c.key === 'nuclear_stockpile');
      const hasDelivery = criteria.find(c => c.key === 'delivery_capability');

      if (!hasNukes || (stock && (stock.value as number) <= 0) || !hasDelivery) {
        return {
          allowed: false,
          validity: "invalid",
          reason: "Nuclear capabilities not operational or insufficient stockpile.",
          missingRequirements: ["nuclear_weapons_operational", "nuclear_stockpile > 0", "delivery_capability"],
          suggestedAlternatives: [
            { actionType: "start_research_project", label: "Lancer un programme atomique secret" },
            { actionType: "strategic_bombing_program", label: "Développer un programme de bombardement stratégique conventionnel" }
          ]
        };
      }
    }

    if (interpretedAction.requestedTone === 'dieselpunk_pulp' || interpretedAction.realismRequired === 'dieselpunk_pulp') {
      if (session?.realismMode !== 'dieselpunk_pulp') {
        return {
          allowed: false,
          validity: "requires_mode_change",
          reason: "Action is dieselpunk but session is not in dieselpunk_pulp mode.",
        };
      }
    }

    return { allowed: true, validity: "valid", reason: "Action validated." };
  }

  async addPendingActions(sessionId: string, actorId: string, actions: any[]) {
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    const currentTurn = session?.currentTurn || 1;
    return prisma.pendingAction.createMany({
      data: actions.map(a => ({ ...a, sessionId, actorId, status: 'pending', createdTurn: currentTurn })),
    });
  }

  async getPendingActions(sessionId: string, actorId: string) {
    return prisma.pendingAction.findMany({ where: { sessionId, actorId } });
  }
}
