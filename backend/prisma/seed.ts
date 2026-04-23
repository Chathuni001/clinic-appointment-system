import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete existing rows
  // await prisma.user.deleteMany();
  // await prisma.doctor.deleteMany();

  // Truncate existing rows
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Doctor"
    RESTART IDENTITY CASCADE;
  `);

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'System Administrator',
      username: 'admin',
      password: hashedPassword,
      role: 'SYSTEM ADMINISTRATOR',
    },
  });

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
