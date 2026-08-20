import { authRepository } from "./authRepository";
import { verifyPassword, signToken, hashPassword } from "@/lib/auth";
import crypto from "crypto";

export class AuthService {
  /**
   * Validate credentials and return a signed JWT token
   */
  async login(email: string, passwordAttempt: string, ip?: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated. Please contact an administrator.");
    }

    const isPasswordValid = await verifyPassword(passwordAttempt, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    await authRepository.updateLastLogin(user.id, ip);

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user, token };
  }

  /**
   * Generate a password reset token for the given email
   */
  async generatePasswordResetToken(email: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.isActive) {
      // Return null rather than throwing to prevent email enumeration attacks
      return null;
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    
    // Hash it before storing in DB
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await authRepository.createResetToken(user.id, hashedToken, expiresAt);

    // Return the RAW token (this goes in the email URL). The DB stores the hashed version.
    return rawToken;
  }

  /**
   * Reset a user's password using a valid reset token
   */
  async resetPassword(rawToken: string, newPassword: string) {
    // Hash the incoming raw token to find it in the DB
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const resetToken = await authRepository.findValidResetToken(hashedToken);

    if (!resetToken) {
      throw new Error("Invalid or expired password reset link.");
    }

    const newHash = await hashPassword(newPassword);

    await authRepository.updatePassword(resetToken.userId, newHash);
    await authRepository.markTokenUsed(resetToken.id);

    return true;
  }
}

export const authService = new AuthService();
