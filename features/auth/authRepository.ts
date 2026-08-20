import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export class AuthRepository {
  /**
   * Find a user by email address
   */
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their ID
   */
  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get all users for the admin management page
   */
  async listAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Create a new user (for Admin & Roles page)
   */
  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role: Role;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        phone: data.phone,
        role: data.role,
        isActive: true,
      },
    });
  }

  /**
   * Update an existing user's details
   */
  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      role?: Role;
      isActive?: boolean;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Update a user's password hash
   */
  async updatePassword(id: number, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  /**
   * Record a user's login timestamp and IP
   */
  async updateLastLogin(id: number, ip?: string) {
    return prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });
  }

  // ==========================================
  // PASSWORD RESET TOKENS
  // ==========================================

  /**
   * Save a newly generated password reset token
   */
  async createResetToken(userId: number, token: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Find an unused, unexpired reset token
   */
  async findValidResetToken(token: string) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) return null;
    if (resetToken.usedAt !== null) return null;
    if (resetToken.expiresAt < new Date()) return null;

    return resetToken;
  }

  /**
   * Mark a reset token as used
   */
  async markTokenUsed(id: number) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}

export const authRepository = new AuthRepository();
