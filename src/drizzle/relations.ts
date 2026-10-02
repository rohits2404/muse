import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
        projects: r.many.project(),
    },
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id,
        }),
    },
    project: {
        user: r.one.user({
            from: r.project.userId,
            to: r.user.id,
        }),
        pages: r.many.page(),
    },
    page: {
        project: r.one.project({
            from: r.page.projectId,
            to: r.project.id,
        }),
    },
}));
