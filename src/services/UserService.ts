import { prisma } from '@/lib/prisma';

export class UserService {
  /**
   * Get all users ordered by name
   */
  static async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}
