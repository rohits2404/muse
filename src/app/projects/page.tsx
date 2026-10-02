import { db } from "@/drizzle/db";
import { authSession } from "@/lib/auth-utils";
import { ProjectClient } from "@/modules/projects/client";
import { redirect } from "next/navigation";
import React from "react";

const fetchProjects = async () => {
    const session = await authSession();

    if (!session?.user?.id) {
        redirect("/auth/sign-in");
    }

    try {
        return await db.query.project.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            limit: 50,
            with: {
                pages: {
                    limit: 1,
                },
            },
        });
    } catch {
        throw new Error("Something Went Wrong");
    }
};

const groupProjects = (projects: Awaited<ReturnType<typeof fetchProjects>>) => {
    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );

    const yesterdayStart = new Date(todayStart);
    const lastWeekStart = new Date(todayStart);
    const lastMonthStart = new Date(todayStart);

    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);

    const groups: Record<string, typeof projects> = {
        Recent: [],
        Yesterday: [],
        "Last week": [],
        "Last month": [],
        "Last year": [],
        Examples: [],
    };

    for (const p of projects) {
        const d = new Date(p.createdAt);

        if (d >= todayStart) {
            groups.Recent.push(p);
        } else if (d >= yesterdayStart) {
            groups.Yesterday.push(p);
        } else if (d >= lastWeekStart) {
            groups["Last week"].push(p);
        } else if (d >= lastMonthStart) {
            groups["Last month"].push(p);
        } else if (d >= lastYearStart) {
            groups["Last year"].push(p);
        } else {
            groups.Examples.push(p);
        }
    }

    return groups;
};

export default async function ProjectPage() {
    const projects = await fetchProjects();
    const grouped = groupProjects(projects);

    return <ProjectClient grouped={grouped} />;
}
