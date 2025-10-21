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
