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

  // Simplified Geometries (GeoJSON)
  const geometries: Record<string, any> = {
    'Germany': { type: 'Polygon', coordinates: [[[5, 47], [15, 47], [15, 55], [5, 55], [5, 47]]] },
    'France': { type: 'Polygon', coordinates: [[[-5, 42], [8, 42], [8, 51], [-5, 51], [-5, 42]]] },
    'United Kingdom': { type: 'Polygon', coordinates: [[[-8, 50], [2, 50], [2, 60], [-8, 60], [-8, 50]]] },
    'Republican Spain': { type: 'Polygon', coordinates: [[[-9, 36], [-1, 36], [-1, 43], [-9, 43], [-9, 36]]] },
    'Nationalist Spain': { type: 'Polygon', coordinates: [[[-1, 36], [4, 36], [4, 43], [-1, 43], [-1, 36]]] },
  };

  // Regions
  const regionsData = [
    'Germany', 'France', 'United Kingdom', 'Soviet Union', 'Italy', 'Poland',
    'Republican Spain', 'Nationalist Spain', 'Contested Spain'
  ];

  const regions: any = {};
  for (const name of regionsData) {
    let controllerActorId = null;
    if (name === 'Republican Spain') controllerActorId = actors['Spanish Republicans'].id;
    if (name === 'Nationalist Spain') controllerActorId = actors['Spanish Nationalists'].id;
    if (actors[name]) controllerActorId = actors[name].id;

    regions[name] = await prisma.region.create({
      data: {
        sessionId: session.id,
        name,
        type: 'sovereign_territory',
        status: 'controlled',
        visibility: 'public',
        controllerActorId,
        geometry: geometries[name] || null,
      }
    });
  }

  // Relations
  const relations = [
    { a: 'Germany', b: 'France', tension: 80, score: -50 },
    { a: 'France', b: 'United Kingdom', tension: 10, score: 70 },
    { a: 'Germany', b: 'Poland', tension: 60, score: -30 },
    { a: 'Germany', b: 'Soviet Union', tension: 70, score: -60 },
    { a: 'Spanish Republicans', b: 'Spanish Nationalists', tension: 100, score: -100, atWar: true },
  ];

  for (const r of relations) {
    await prisma.relation.upsert({
      where: { sessionId_actorAId_actorBId: { sessionId: session.id, actorAId: actors[r.a].id, actorBId: actors[r.b].id } },
      update: {},
      create: {
        sessionId: session.id,
        actorAId: actors[r.a].id,
        actorBId: actors[r.b].id,
        atWar: r.atWar || false,
        tension: r.tension,
        relationScore: r.score,
        visibility: 'public',
      }
    });
  }

  // Fronts
  await prisma.front.create({
    data: {
      sessionId: session.id,
      name: 'Spanish Civil War Front',
      type: 'civil_war_front',
      status: 'active',
      attackerActorId: actors['Spanish Nationalists'].id,
      defenderActorId: actors['Spanish Republicans'].id,
      visibility: 'public',
      geometry: { type: 'LineString', coordinates: [[-1, 36], [-1, 43]] },
    }
  });

  // Criteria
  const criteria = [
    { actor: 'France', key: 'doctrine_flexibility', label: 'Doctrine Flexibility', type: 'numeric', value: 30 },
    { actor: 'France', key: 'army_radiofication_level', label: 'Army Radiofication Level', type: 'numeric', value: 20 },
    { actor: 'Germany', key: 'rearmament_pressure', label: 'Rearmament Pressure', type: 'numeric', value: 80 },
    { actor: 'Spanish Republicans', key: 'republican_legitimacy', label: 'Republican Legitimacy', type: 'numeric', value: 60 },
    { actor: 'Spanish Nationalists', key: 'nationalist_military_cohesion', label: 'Nationalist Military Cohesion', type: 'numeric', value: 75 },
  ];

  for (const c of criteria) {
    await prisma.simulationCriteria.create({
      data: {
        sessionId: session.id,
        actorId: actors[c.actor].id,
        scope: 'actor',
        key: c.key,
        label: c.label,
        type: c.type,
        value: c.value,
        visibility: 'player_private',
        createdBy: 'seed',
      }
    });
  }

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
