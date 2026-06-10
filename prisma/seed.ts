import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HistorIA demo scenario...');
  // Minimal seed
  await prisma.mapPreset.upsert({
    where: { key: 'europe_1936' },
    update: {},
    create: {
      key: 'europe_1936',
      name: 'Europe 1936 — MVP Approximation',
      scope: 'Europe',
      accuracyLevel: 'approximate',
      description: 'Simplified Europe 1936 map for backend MVP.',
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
