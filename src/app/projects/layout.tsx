import { authIsRequired } from "@/lib/auth-utils";
import React from "react";

export const dynamic = "force-dynamic";

export default async function ProjectLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await authIsRequired();

    return <div className="h-full w-full">{children}</div>;
}
