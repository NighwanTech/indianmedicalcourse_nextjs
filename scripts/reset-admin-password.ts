import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Usage: npx tsx scripts/reset-admin-password.ts <email> <new_password>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    if (user.role !== 'SUPER_ADMIN') {
      console.warn(`Warning: User ${email} is a ${user.role}, not a SUPER_ADMIN. Proceeding anyway...`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });

    console.log(`✅ Password successfully reset for ${email}`);
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
