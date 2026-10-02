import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountSettings } from "@/components/account-settings";
import { MuseBackground } from "@/components/shared/muse-background";

const validPaths = ["profile", "security", "sessions"] as const;

type AccountPath = (typeof validPaths)[number];

export const dynamicParams = false;

export function generateStaticParams() {
    return validPaths.map((path) => ({
        path,
    }));
}

export default async function AccountPage({
    params,
}: {
    params: Promise<{ path: string }>;
}) {
    const { path } = await params;

    // Only allow the paths defined above.
    if (!validPaths.includes(path as AccountPath)) {
        notFound();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // User must be authenticated to access account pages.
    if (!session) {
        redirect("/auth/sign-in");
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f7f7f5] text-zinc-900">
            <MuseBackground />

            <div className="relative z-10">
                <AccountSettings
                    path={path as AccountPath}
                    user={session.user}
                />
            </div>
        </div>
    );
}
