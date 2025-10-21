import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const shifts = await prisma.shift.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        applications: userId
          ? {
              where: { userId },
              select: { id: true, status: true },
            }
          : false,
      },
      orderBy: { startsAt: 'asc' },
    });

    // Add userHasApplied flag for convenience
    const shiftsWithAppliedFlag = shifts.map((shift) => ({
      ...shift,
      userHasApplied:
        userId && shift.applications && shift.applications.length > 0,
      applications: undefined, // Remove from response
    }));

    return NextResponse.json(shiftsWithAppliedFlag);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      facilityName,
      location,
      startsAt,
      endsAt,
      hourlyRateCents,
    } = body;

    // Validate required fields
    if (!title || !facilityName || !startsAt || !endsAt || !hourlyRateCents) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the shift
    const shift = await prisma.shift.create({
      data: {
        title,
        description,
        facilityName,
        location,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        hourlyRateCents,
        status: 'OPEN',
      },
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}
