"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { SideNav } from "@/modules/account/components/side-nav";
import { ProfileView } from "@/modules/account/components/profile-view";
import { SecurityView } from "@/modules/account/components/security-view";
import { SessionsView } from "@/modules/account/components/session-view";

type AccountPath = "profile" | "security" | "sessions";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

type Props = {
    path: AccountPath;
    user: User;
};

export function AccountSettings({ path, user }: Props) {
    const router = useRouter();
    const [signingOut, setSigningOut] = React.useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
                onError: () => setSigningOut(false),
            },
        });
    };

    return (
        <div className="relative flex h-dvh flex-col overflow-hidden bg-[#f7f7f5] text-zinc-900 antialiased">
            {/* =========================================================
                BACKGROUND
            ========================================================== */}

            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.55]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #c9c9c5 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Orange ambient glow */}
                <div className="absolute left-1/2 -top-80 h-162.5 w-212.5 -translate-x-1/2 rounded-full bg-orange-300/20 blur-[130px]" />

                {/* Blue ambient glow */}
                <div className="absolute -bottom-75 -left-50 h-137.5 w-137.5 rounded-full bg-blue-300/10 blur-[140px]" />

                {/* Purple ambient glow */}
                <div className="absolute -right-50 top-[35%] h-125 w-125 rounded-full bg-purple-300/10 blur-[140px]" />
            </div>

            {/* =========================================================
                HEADER
            ========================================================== */}

            <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-black/6 bg-white/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-xl border border-black/8 bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo.svg"
                                alt="Muse"
                                width={22}
                                height={22}
                                className="size-5.5"
                            />
                        </span>

                        <span className="text-[15px] font-bold tracking-tight">
                            Muse
                        </span>
                    </Link>

                    {/* Section label */}
                    <div className="hidden items-center gap-3 sm:flex">
                        <Separator
                            orientation="vertical"
                            className="h-4 bg-black/10"
                        />

                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Account Preferences
                        </span>
                    </div>
                </div>

                {/* Header actions */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            }),
                            "rounded-xl border border-transparent text-zinc-500 transition-all hover:border-black/6 hover:bg-black/3 hover:text-zinc-900",
                        )}
                    >
                        <ArrowLeft className="size-3.5" />

                        <span className="hidden sm:inline">Workspace</span>

                        <span className="sm:hidden">Back</span>
                    </Link>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="rounded-xl text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                    >
                        {signingOut ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <LogOut className="size-3.5" />
                        )}

                        <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                </div>
            </header>

            {/* =========================================================
                MAIN LAYOUT
            ========================================================== */}

            <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 lg:p-8">
                {/* Sidebar */}
                <SideNav path={path} user={user} />

                {/* Content */}
                <main className="min-h-0 flex-1 overflow-y-auto">
                    {path === "profile" && <ProfileView user={user} />}

                    {path === "security" && <SecurityView />}

                    {path === "sessions" && <SessionsView />}
                </main>
            </div>
        </div>
    );
}
