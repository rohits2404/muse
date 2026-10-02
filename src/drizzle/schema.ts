import {
    pgTable,
    pgEnum,
    text,
    boolean,
    integer,
    timestamp,
    index,
    unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ---------- Enums ----------
export const statusEnum = pgEnum("Status", [
    "IDLE",
    "ANALYZING",
    "GENERATING",
    "COMPLETED",
    "FAILED",
]);

export const typeEnum = pgEnum("Type", ["WEB", "MOBILE"]);

// Prisma's DateTime on Postgres = timestamp(3) without time zone
const ts = (name: string) => timestamp(name, { precision: 3 });

// ---------- Auth tables ----------
export const user = pgTable(
    "user",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        name: text("name").notNull(),
        email: text("email").notNull(),
        emailVerified: boolean("emailVerified").notNull().default(false),
        image: text("image"),
        createdAt: ts("createdAt").notNull().defaultNow(),
        updatedAt: ts("updatedAt")
            .notNull()
            .$defaultFn(() => new Date())
            .$onUpdate(() => new Date()),
    },
    (t) => [unique("user_email_key").on(t.email)],
);

export const session = pgTable(
    "session",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        expiresAt: ts("expiresAt").notNull(),
        token: text("token").notNull(),
        createdAt: ts("createdAt").notNull().defaultNow(),
        updatedAt: ts("updatedAt")
            .notNull()
            .$defaultFn(() => new Date())
            .$onUpdate(() => new Date()),
        ipAddress: text("ipAddress"),
        userAgent: text("userAgent"),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (t) => [
        unique("session_token_key").on(t.token),
        index("session_userId_idx").on(t.userId),
    ],
);

export const account = pgTable(
    "account",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        accountId: text("accountId").notNull(),
        providerId: text("providerId").notNull(),
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("accessToken"),
        refreshToken: text("refreshToken"),
        idToken: text("idToken"),
        accessTokenExpiresAt: ts("accessTokenExpiresAt"),
        refreshTokenExpiresAt: ts("refreshTokenExpiresAt"),
        scope: text("scope"),
        password: text("password"),
        createdAt: ts("createdAt").notNull().defaultNow(),
        updatedAt: ts("updatedAt")
            .notNull()
            .$defaultFn(() => new Date())
            .$onUpdate(() => new Date()),
    },
    (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: ts("expiresAt").notNull(),
        createdAt: ts("createdAt").notNull().defaultNow(),
        updatedAt: ts("updatedAt")
            .notNull()
            .$defaultFn(() => new Date())
            .$onUpdate(() => new Date()),
    },
    (t) => [index("verification_identifier_idx").on(t.identifier)],
);

// ---------- App tables ----------
export const project = pgTable("Project", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    prompt: text("prompt").notNull(),
    status: statusEnum("status").notNull().default("IDLE"),
    agentMessage: text("agentMessage"),
    currentStep: text("currentStep"),
    totalPages: integer("totalPages").notNull().default(0),
    donePages: integer("donePages").notNull().default(0),
    suggestions: text("suggestions"),
    type: typeEnum("type").notNull().default("WEB"),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: ts("createdAt").notNull().defaultNow(),
    updatedAt: ts("updatedAt")
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});

export const page = pgTable("Page", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    path: text("path").notNull(),
    description: text("description"),
    type: text("type").notNull(),
    code: text("code"),
    generating: boolean("generating").notNull().default(false),
    projectId: text("projectId")
        .notNull()
        .references(() => project.id, { onDelete: "cascade" }),
    createdAt: ts("createdAt").notNull().defaultNow(),
    updatedAt: ts("updatedAt")
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});
