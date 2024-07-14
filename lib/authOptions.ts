import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";
import { AuthOptions } from "next-auth";
import { UserRole } from "@prisma/client";
import { fetchCurrentUser } from "@/actions/user-actions";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  pages:{
    signIn: '/sign-in',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, trigger, session }) {
      const user = await fetchCurrentUser(token.email);
      token = { ...token, role: user?.role };
      return token;
    },
    async session({ session, token }) {
      session.user = token as {
        id?: string;
        name?: string;
        email?: string;
        role?: UserRole;
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
