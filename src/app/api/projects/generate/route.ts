import { db } from "@/drizzle/db";
import { project } from "@/drizzle/schema";
import { inngest } from "@/inngest/client";
import { authSession } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();
        const session = await authSession();

        const [newProject] = await db
            .insert(project)
            .values({
                name: prompt.slice(0, 30) + "...",
                prompt,
                status: "ANALYZING",
                userId: session?.user.id as string,
                type,
            })
            .returning();

        await inngest.send({
            name: "app/generate.requested",
            data: {
                projectId: newProject.id,
                prompt,
                type,
            },
        });

        return NextResponse.json({ project: newProject });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
