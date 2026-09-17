import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "SALES_REP",
      },
      avatarUrl: {
        type: "string",
        required: false,
      }
    }
  },
  secret: process.env.BETTER_AUTH_SECRET || "development_secret_do_not_use_in_prod",
});
