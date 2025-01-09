import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (
          user &&
          bcrypt.compareSync(credentials?.password ?? "", user.password)
        ) {
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" as SessionStrategy },
};
