import { prisma } from '@/lib/prisma';
import { ShiftStatus } from '@prisma/client';

interface GetShiftsParams {
  userId?: string;
  status?: string;
}

interface CreateShiftParams {
  title: string;
  description?: string;
  facilityName: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  hourlyRateCents: number;
}

interface HireProviderParams {
  applicationId: string;
  shiftId: string;
}

export class ShiftService {
  /**
   * Get all shifts with optional filters
   */
  static async getShifts({ userId, status }: GetShiftsParams = {}) {
    const shifts = await prisma.shift.findMany({
      where: status ? { status: status as ShiftStatus } : undefined,
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
    return shifts.map((shift) => ({
      ...shift,
      userHasApplied:
        userId && shift.applications && shift.applications.length > 0,
      applications: undefined, // Remove from response
    }));
  }

  /**
   * Get shift by ID with optional user context
   */
  static async getShiftById(id: string, userId?: string) {
    return prisma.shift.findUnique({
      where: { id },
      include: {
        hiredProvider: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: userId
          ? {
              where: { userId },
              select: { id: true, status: true },
            }
          : {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
      },
    });
  }

  /**
   * Create a new shift
   */
  static async createShift(params: CreateShiftParams) {
    const {
      title,
      description,
      facilityName,
      location,
      startsAt,
      endsAt,
      hourlyRateCents,
    } = params;

    // Validate required fields
    if (!title || !facilityName || !startsAt || !endsAt || !hourlyRateCents) {
      throw new Error('Missing required fields');
    }

    return prisma.shift.create({
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
  }

  /**
   * Hire a provider for a shift
   */
  static async hireProvider({ applicationId, shiftId }: HireProviderParams) {
    // Validate required fields
    if (!applicationId || !shiftId) {
      throw new Error('applicationId and shiftId are required');
    }

    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { shift: true },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.shiftId !== shiftId) {
      throw new Error('Application does not belong to this shift');
    }

    if (application.shift.status === 'HIRED') {
      throw new Error('Shift is already filled');
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

    return {
      shift: updatedShift,
      application: updatedApplication,
      message: 'Provider hired successfully',
    };
  }
}
