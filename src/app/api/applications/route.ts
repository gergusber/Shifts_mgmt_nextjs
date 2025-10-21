import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        shift: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shiftId, userId } = body;

    if (!shiftId || !userId) {
      return NextResponse.json(
        { error: 'shiftId and userId are required' },
        { status: 400 }
      );
    }

    // Check if shift is still open
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    if (shift.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Shift is not available' },
        { status: 400 }
      );
    }

    // Check if application already exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        shiftId_userId: {
          shiftId,
          userId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this shift' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        shiftId,
        userId,
        status: 'APPLIED',
      },
      include: {
        shift: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
