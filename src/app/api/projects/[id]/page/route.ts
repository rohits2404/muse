import { db } from "@/drizzle/db";
import { page, project } from "@/drizzle/schema";
import { inngest } from "@/inngest/client";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id: projectId } = await params;
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
        return NextResponse.json(
            { error: "Prompt is required" },
            { status: 400 },
        );
    }

    const projectData = await db.query.project.findFirst({
        where: {
            id: projectId,
        },
    });

    if (!projectData) {
        return NextResponse.json(
            { error: "Project not found" },
            { status: 404 },
        );
    }

    const [newPage] = await db
        .insert(page)
        .values({
            projectId,
            name: prompt.split(" ").slice(0, 5).join(" "),
            path: `/${prompt.split(" ").slice(0, 2).join(" ").toLowerCase()}`,
            type: "dashboard",
            generating: true,
            code: null,
        })
        .returning();

    await db
        .update(project)
        .set({
            status: "GENERATING",
            currentStep: "Generating screen",
            agentMessage: `I will create a ${prompt} screen that fits the existing design system.`,
        })
        .where(eq(project.id, projectId));

    await inngest.send({
        name: "app/add-page.requested",
        data: {
            projectId,
            pageId: newPage.id,
            prompt,
        },
    });

    return NextResponse.json({ pageId: newPage.id });
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id: projectId } = await params;
    const { pageId: id } = await req.json();

    await db
        .delete(page)
        .where(and(eq(page.id, id), eq(page.projectId, projectId)));

    return NextResponse.json({ ok: true });
}
