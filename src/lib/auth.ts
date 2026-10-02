import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "../drizzle/schema";
import { getDiceBearAvatar } from "./utils";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),

    emailAndPassword: {
        enabled: true,
    },

    trustedOrigins: ["http://localhost:3000", process.env.NEXT_PUBLIC_APP_URL!],

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (user.image) {
                        return {
                            data: user,
                        };
                    }

                    return {
                        data: {
                            ...user,
                            image: getDiceBearAvatar(user.email),
                        },
                    };
                },
            },
        },
    },

    plugins: [nextCookies()],
});
