import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // This will delete existing doctors so we don't get duplicates
  await prisma.doctor.deleteMany();

  // Create 3 doctors
  await prisma.doctor.createMany({
    data: [
      { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist' },
      { name: 'Dr. Michael Chen', specialty: 'Dermatologist' },
      { name: 'Dr. Emily Williams', specialty: 'Pediatrician' },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });