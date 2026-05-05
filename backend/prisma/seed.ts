import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  // Note: Using the exact model names from your schema
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Privilege", "Role", "RolePrivilege", "User", "Doctor", "Specialty", "Appointment"
    RESTART IDENTITY CASCADE;
  `);

  const privileges = [
    { name: 'MANAGE PRIVILEGE', description: 'Can create, edit and delete privileges' },
    { name: 'MANAGE Role', description: 'Can create, edit and delete role' },
    { name: 'MANAGE DOCTORS', description: 'Can create, edit and delete doctors' },
    { name: 'MANAGE APPOINTMENTS', description: 'Can view and cancel appointments' },
    { name: 'MANAGE USERS', description: 'Can manage admin users and roles' },
  ];

  for (const p of privileges) {
    await prisma.privilege.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  // Create System Admin Role
  const role = await prisma.role.create({
    data: {
      name: 'System Administrator'
    }
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'System Administrator' } });

  if (adminRole) {
    const allPrivs = await prisma.privilege.findMany();
    for (const p of allPrivs) {
      await prisma.rolePrivilege.upsert({
        where: { roleId_privilegeId: { roleId: adminRole.id, privilegeId: p.id } },
        update: {},
        create: { roleId: adminRole.id, privilegeId: p.id },
      });
    }
  }

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Nikini Mandakini',
      username: 'admin',
      password: hashedPassword,
      roleId: role.id,
    },
  });



  // Create Specialities
  const cardio = await prisma.specialty.create({ data: { name: 'Cardiologist', createdById: admin.id } });
  const derm = await prisma.specialty.create({ data: { name: 'Dermatologist', createdById: admin.id } });
  const pedia = await prisma.specialty.create({ data: { name: 'Pediatrician', createdById: admin.id } });
  const neuro = await prisma.specialty.create({ data: { name: 'Neurologist', createdById: admin.id } });

  // Create Doctors
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
        specialtyId: derm.id, 
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