import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import React from "react";

interface AuthPageProps {
    params: Promise<{
        path: string;
    }>;
}

export default async function AuthPage({ params }: AuthPageProps) {
    const { path } = await params;

    if (path !== "sign-in" && path !== "sign-up") {
        notFound();
    }

    return (
        <main className="relative min-h-svh overflow-x-clip bg-[#f7f7f5]">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-clip">
                {/* dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.45]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #cfcfca 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* orange glow */}
                <div className="absolute left-1/2 -top-70 h-150 w-200 -translate-x-1/2 rounded-full bg-orange-300/20 blur-[130px]" />

                {/* blue glow */}
                <div className="absolute -bottom-75 -left-45 h-125 w-125 rounded-full bg-blue-300/10 blur-[140px]" />

                {/* purple glow */}
                <div className="absolute -right-50 top-[35%] h-125 w-125 rounded-full bg-purple-300/10 blur-[140px]" />
            </div>

            {/* Auth */}
            <div className="relative flex min-h-[calc(100svh-80px)] items-center justify-center px-5 py-12">
                <AuthForm
                    initialMode={path === "sign-up" ? "sign-up" : "sign-in"}
                />
            </div>
        </main>
    );
}
