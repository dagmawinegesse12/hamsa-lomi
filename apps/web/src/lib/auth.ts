import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@edir/types";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(rawCredentials) {
        const credentials = credentialsSchema.parse(rawCredentials);
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.hashedPassword || !user.isActive) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          return null;
        }
        return { id: user.id, email: user.email, role: user.role };
      }
    }),
    ...(env.RESEND_API_KEY ? [Email({ apiKey: env.RESEND_API_KEY, from: "Hamsa Lomi <noreply@example.com>" })] : [])
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role as Role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.role = token.role;
      return session;
    }
  }
});
