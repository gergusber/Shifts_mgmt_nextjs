import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, shiftId } = body;

    if (!applicationId || !shiftId) {
      return NextResponse.json(
        { error: 'applicationId and shiftId are required' },
        { status: 400 }
      );
    }

    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { shift: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.shiftId !== shiftId) {
      return NextResponse.json(
        { error: 'Application does not belong to this shift' },
        { status: 400 }
      );
    }

    if (application.shift.status === 'HIRED') {
      return NextResponse.json(
        { error: 'Shift is already filled' },
        { status: 400 }
      );
    }

    // Update the shift and application in a transaction
    const [updatedShift, updatedApplication] = await prisma.$transaction([
      prisma.shift.update({
        where: { id: shiftId },
        data: {
          status: 'HIRED',
          hiredProviderId: application.userId,
        },
      }),
      prisma.application.update({
        where: { id: applicationId },
        data: { status: 'HIRED' },
      }),
    ]);

    return NextResponse.json({
      shift: updatedShift,
      application: updatedApplication,
      message: 'Provider hired successfully',
    });
  } catch (error) {
    console.error('Error hiring provider:', error);
    return NextResponse.json(
      { error: 'Failed to hire provider' },
      { status: 500 }
    );
  }
}
