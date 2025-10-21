import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

interface CreateApplicationParams {
  userId: string;
  shiftId: string;
}

interface UpdateApplicationParams {
  id: string;
  status: ApplicationStatus;
}

export class ApplicationService {
  /**
   * Get all applications for a user
   */
  static async getApplicationsByUserId(userId: string) {
    if (!userId) {
      throw new Error('userId is required');
    }

    return prisma.application.findMany({
      where: { userId },
      include: {
        shift: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new application
   */
  static async createApplication({ userId, shiftId }: CreateApplicationParams) {
    // Validate required fields
    if (!userId || !shiftId) {
      throw new Error('userId and shiftId are required');
    }

    // Check if user already applied to this shift
    const existingApplication = await prisma.application.findUnique({
      where: {
        shiftId_userId: { shiftId, userId },
      },
    });

    if (existingApplication) {
      throw new Error('You have already applied to this shift');
    }

    // Check if shift exists and is still open
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new Error('Shift not found');
    }

    if (shift.status !== 'OPEN') {
      throw new Error('This shift is no longer accepting applications');
    }

    return prisma.application.create({
      data: {
        userId,
        shiftId,
        status: 'APPLIED',
      },
      include: {
        shift: true,
      },
    });
  }

  /**
   * Update application status
   */
  static async updateApplication({ id, status }: UpdateApplicationParams) {
    if (!id || !status) {
      throw new Error('id and status are required');
    }

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return prisma.application.update({
      where: { id },
      data: { status },
      include: {
        shift: true,
      },
    });
  }

  /**
   * Delete an application
   */
  static async deleteApplication(id: string) {
    if (!id) {
      throw new Error('id is required');
    }

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    return prisma.application.delete({
      where: { id },
    });
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        shift: true,
        user: true,
      },
    });
  }
}
