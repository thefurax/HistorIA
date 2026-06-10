import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HistorIA Europe 1936 scenario...');

  const session = await prisma.session.upsert({
    where: { joinCode: 'HIA-1936' },
    update: {},
    create: {
      joinCode: 'HIA-1936',
      title: 'Europe 1936 — Démonstration HistorIA',
      scenarioType: 'europe_1936',
      currentDate: '1936-01-01',
      realismMode: 'plausible_alt_history',
      mapUrl: 'http://localhost:5173/map/HIA-1936',
    }
  });

  const actorsData = [
    { name: 'Germany', actorCode: 'GER-1936', type: 'country' },
    { name: 'France', actorCode: 'FRA-1936', type: 'country' },
    { name: 'United Kingdom', actorCode: 'UK-1936', type: 'country' },
    { name: 'Soviet Union', actorCode: 'USSR-1936', type: 'country' },
    { name: 'Italy', actorCode: 'ITA-1936', type: 'country' },
    { name: 'Poland', actorCode: 'POL-1936', type: 'country' },
    { name: 'Spanish Republicans', actorCode: 'SPA-REP-1936', type: 'civil_war_faction' },
    { name: 'Spanish Nationalists', actorCode: 'SPA-NAT-1936', type: 'civil_war_faction' },
  ];

  const actors: any = {};
  for (const a of actorsData) {
    actors[a.name] = await prisma.actor.upsert({
      where: { actorCode: a.actorCode },
      update: { sessionId: session.id },
      create: {
        ...a,
        sessionId: session.id,
        normalizedName: a.name.toLowerCase().replace(/\s+/g, '_'),
      }
    });
  }

  // Relations
  await prisma.relation.upsert({
    where: { sessionId_actorAId_actorBId: { sessionId: session.id, actorAId: actors['Spanish Republicans'].id, actorBId: actors['Spanish Nationalists'].id } },
    update: {},
    create: {
      sessionId: session.id,
      actorAId: actors['Spanish Republicans'].id,
      actorBId: actors['Spanish Nationalists'].id,
      atWar: true,
      tension: 100,
      relationScore: -100,
      visibility: 'public',
    }
  });

  // Events
  await prisma.event.create({
    data: {
      sessionId: session.id,
      turn: 1,
      date: '1936-01-01',
      title: 'Europe 1936 — Tensions croissantes',
      eventType: 'scenario_start',
      description: 'Le monde est au bord du gouffre.',
      visibility: 'public',
    }
  });

  await prisma.event.create({
    data: {
      sessionId: session.id,
      turn: 1,
      date: '1936-01-01',
      title: 'Opération secrète allemande',
      eventType: 'intelligence',
      description: 'Mouvements suspects à la frontière.',
      visibility: 'foreign_private',
      actorId: actors['Germany'].id,
    }
  });

  // Map Changes
  await prisma.mapChange.create({
    data: {
      sessionId: session.id,
      changeType: 'scenario_marker',
      targetType: 'region',
      payload: { label: 'Europe 1936 — tensions croissantes' },
      visibility: 'public',
    }
  });

  await prisma.mapChange.create({
    data: {
      sessionId: session.id,
      changeType: 'private_military_note',
      targetType: 'region',
      payload: { note: 'Observation française interne' },
      visibility: `actor:${actors['France'].id}`,
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
