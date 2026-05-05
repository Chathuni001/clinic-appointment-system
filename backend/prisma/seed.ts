import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  // Note: Using the exact model names from your schema
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Role", "User", "Doctor", "Specialty", "Appointment"
    RESTART IDENTITY CASCADE;
  `);

  // 1. Create System Admin Role
  const role = await prisma.role.create({
    data: {
      name: 'SYSTEM ADMINISTRATOR'
    }
  });

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      username: 'admin',
      password: hashedPassword,
      roleId: role.id,
    },
  });

  // 3. Create Specialities
  // We create them individually or capture the IDs to link them to doctors
  const cardio = await prisma.specialty.create({ data: { name: 'Cardiologist', createdById: admin.id } });
  const derm = await prisma.specialty.create({ data: { name: 'Dermatologist', createdById: admin.id } });
  const pedia = await prisma.specialty.create({ data: { name: 'Pediatrician', createdById: admin.id } });
  const neuro = await prisma.specialty.create({ data: { name: 'Neurologist', createdById: admin.id } });

  // 4. Create Doctors
  // Now we use the specific IDs from the specialities created above
  await prisma.doctor.createMany({
    data: [
      { 
        name: 'Dr. Sarah Johnson', 
        specialtyId: cardio.id, 
        image: 'uploads/1777888627866-860791945.png', 
        createdById: admin.id 
      },
      { 
        name: 'Dr. Michael Chen', 
        specialtyId: neuro.id, 
        image: 'uploads/1777888627866-860791944.png',
        createdById: admin.id 
      },
      { 
        name: 'Dr. Emily Williams', 
        specialtyId: pedia.id, 
        image: 'uploads/1777888627866-860791946.png',
        createdById: admin.id 
      },
      { 
        name: 'Dr. Christopher Doe', 
        specialtyId: pedia.id, 
        image: 'uploads/1777888627866-860791947.png',
        createdById: admin.id 
      },
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