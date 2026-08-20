import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        if (admin.lockoutUntil && admin.lockoutUntil > new Date()) {
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          const attempts = admin.failedLoginAttempts + 1;
          await prisma.admin.update({
            where: { id: admin.id },
            data: {
              failedLoginAttempts: attempts,
              lockoutUntil:
                attempts >= MAX_FAILED_ATTEMPTS
                  ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
                  : null,
            },
          });
          return null;
        }

        if (admin.failedLoginAttempts > 0 || admin.lockoutUntil) {
          await prisma.admin.update({
            where: { id: admin.id },
            data: { failedLoginAttempts: 0, lockoutUntil: null },
          });
        }

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
});
