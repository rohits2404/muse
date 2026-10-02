import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const project = await db.query.project.findFirst({
        where: {
            id,
        },
    });

    if (!project) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pages = await db.query.page.findMany({
        where: {
            projectId: id,
        },
    });

    return NextResponse.json({
        ...project,
        suggestions: project.suggestions
            ? (JSON.parse(project.suggestions) as string[])
            : [],
        pages,
    });
}
