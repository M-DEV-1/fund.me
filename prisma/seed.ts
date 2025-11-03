import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.request.deleteMany();
  await prisma.nGO.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });
  console.log('Created admin:', admin.email);

  // Create Donor
  const donor = await prisma.user.create({
    data: {
      name: 'John Donor',
      email: 'donor@example.com',
      passwordHash: await bcrypt.hash('donor123', 10),
      role: 'DONOR',
    },
  });
  console.log('Created donor:', donor.email);

  // Create NGO User (verified)
  const ngoUser1 = await prisma.user.create({
    data: {
      name: 'Hope Foundation',
      email: 'hope@ngo.com',
      passwordHash: await bcrypt.hash('ngo123', 10),
      role: 'NGO',
      ngo: {
        create: {
          name: 'Hope Foundation',
          description: 'Providing food and shelter to the homeless',
          verified: true,
        },
      },
    },
    include: {
      ngo: true,
    },
  });
  console.log('Created verified NGO:', ngoUser1.ngo?.name);

  // Create NGO User (unverified)
  const ngoUser2 = await prisma.user.create({
    data: {
      name: 'Green Earth Initiative',
      email: 'green@ngo.com',
      passwordHash: await bcrypt.hash('ngo123', 10),
      role: 'NGO',
      ngo: {
        create: {
          name: 'Green Earth Initiative',
          description: 'Environmental conservation and sustainability',
          verified: false,
        },
      },
    },
    include: {
      ngo: true,
    },
  });
  console.log('Created unverified NGO:', ngoUser2.ngo?.name);

  // Create Requests for verified NGO
  const request1 = await prisma.request.create({
    data: {
      ngoId: ngoUser1.ngo!.id,
      itemName: 'Rice',
      quantity: 100,
      unit: 'kg',
      description: 'Need rice for weekly food distribution',
      status: 'OPEN',
    },
  });

  const request2 = await prisma.request.create({
    data: {
      ngoId: ngoUser1.ngo!.id,
      itemName: 'Blankets',
      quantity: 50,
      unit: 'pieces',
      description: 'Winter blankets for homeless shelter',
      status: 'OPEN',
    },
  });

  const request3 = await prisma.request.create({
    data: {
      ngoId: ngoUser1.ngo!.id,
      itemName: 'Cooking Oil',
      quantity: 20,
      unit: 'liters',
      description: 'Cooking oil for community kitchen',
      status: 'FULFILLED',
    },
  });

  console.log('Created 3 requests');

  // Create Donations
  const donation1 = await prisma.donation.create({
    data: {
      donorId: donor.id,
      ngoId: ngoUser1.ngo!.id,
      requestId: request1.id,
      donationType: 'Rice',
      quantity: 25,
      notes: 'Happy to help!',
      status: 'PENDING',
    },
  });

  const donation2 = await prisma.donation.create({
    data: {
      donorId: donor.id,
      ngoId: ngoUser1.ngo!.id,
      requestId: request2.id,
      donationType: 'Blankets',
      quantity: 10,
      notes: 'Winter is coming, hope this helps',
      status: 'RECEIVED',
    },
  });

  const donation3 = await prisma.donation.create({
    data: {
      donorId: donor.id,
      ngoId: ngoUser1.ngo!.id,
      donationType: 'Monetary',
      notes: 'General donation for operations',
      status: 'VERIFIED',
    },
  });

  console.log('Created 3 donations');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Login credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Donor: donor@example.com / donor123');
  console.log('NGO (verified): hope@ngo.com / ngo123');
  console.log('NGO (unverified): green@ngo.com / ngo123\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
