import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Nurse Mike Chen',
        email: 'mike.chen@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Nurse James Wilson',
        email: 'james.wilson@example.com',
      },
    }),
  ]);

  console.log('Created users:', users.length);

  // Create shifts
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const shifts = await Promise.all([
    prisma.shift.create({
      data: {
        title: 'Night Shift - Emergency Department',
        description: 'Urgent care coverage needed for busy ER. Must have trauma experience.',
        facilityName: 'City General Hospital',
        location: 'San Francisco, CA',
        startsAt: new Date(tomorrow.setHours(20, 0, 0, 0)),
        endsAt: new Date(tomorrow.setHours(28, 0, 0, 0)), // Next day 4 AM
        hourlyRateCents: 8500, // $85/hr
        status: 'OPEN',
      },
    }),
    prisma.shift.create({
      data: {
        title: 'Day Shift - ICU',
        description: 'Critical care unit coverage. ICU certification required.',
        facilityName: 'Metro Medical Center',
        location: 'Oakland, CA',
        startsAt: new Date(tomorrow.setHours(7, 0, 0, 0)),
        endsAt: new Date(tomorrow.setHours(19, 0, 0, 0)),
        hourlyRateCents: 9500, // $95/hr
        status: 'OPEN',
      },
    }),
    prisma.shift.create({
      data: {
        title: 'Evening Shift - Pediatrics',
        description: 'Pediatric ward evening coverage. Great with kids required!',
        facilityName: "Children's Hospital",
        location: 'Berkeley, CA',
        startsAt: new Date(nextWeek.setHours(15, 0, 0, 0)),
        endsAt: new Date(nextWeek.setHours(23, 0, 0, 0)),
        hourlyRateCents: 7500, // $75/hr
        status: 'OPEN',
      },
    }),
    prisma.shift.create({
      data: {
        title: 'Weekend Shift - Surgery',
        description: 'OR coverage for weekend surgeries. Experienced surgical staff needed.',
        facilityName: 'Bay Area Surgical Center',
        location: 'San Jose, CA',
        startsAt: new Date(nextWeek.setHours(8, 0, 0, 0)),
        endsAt: new Date(nextWeek.setHours(20, 0, 0, 0)),
        hourlyRateCents: 12000, // $120/hr
        status: 'OPEN',
      },
    }),
    prisma.shift.create({
      data: {
        title: 'Night Shift - Med/Surg',
        description: 'Medical-surgical floor coverage. Standard nursing care.',
        facilityName: 'Community Hospital',
        location: 'Palo Alto, CA',
        startsAt: new Date(tomorrow.setHours(19, 0, 0, 0)),
        endsAt: new Date(tomorrow.setHours(31, 0, 0, 0)), // Next day 7 AM
        hourlyRateCents: 7000, // $70/hr
        status: 'OPEN',
      },
    }),
    prisma.shift.create({
      data: {
        title: 'Day Shift - Cardiology',
        description: 'Cardiac care unit. Experience with telemetry monitoring required.',
        facilityName: 'Heart & Vascular Institute',
        location: 'Mountain View, CA',
        startsAt: new Date(nextWeek.setHours(6, 0, 0, 0)),
        endsAt: new Date(nextWeek.setHours(18, 0, 0, 0)),
        hourlyRateCents: 8800, // $88/hr
        status: 'OPEN',
      },
    }),
  ]);

  console.log('Created shifts:', shifts.length);

  // Create some sample applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        userId: users[0].id,
        shiftId: shifts[0].id,
        status: 'APPLIED',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[1].id,
        shiftId: shifts[0].id,
        status: 'APPLIED',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[0].id,
        shiftId: shifts[2].id,
        status: 'APPLIED',
      },
    }),
  ]);

  console.log('Created applications:', applications.length);

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
