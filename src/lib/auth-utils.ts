import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const authSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        return session;
    } catch {
        return null;
    }
};

export const authIsRequired = async () => {
    const session = await authSession();

    if (!session) {
        redirect("/");
    }

    return session;
};

export const authIsNotRequired = async () => {
    const session = await authSession();

    if (session) {
        redirect("/projects");
    }
};
