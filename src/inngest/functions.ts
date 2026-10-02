import { eq } from "drizzle-orm";
import { inngest } from "./client";
import { db } from "@/drizzle/db";
import { page, project } from "@/drizzle/schema";
import { streamText, generateText, Output } from "ai";
import { groqModel } from "@/lib/ai";
import { z } from "zod";

const PageSchema = z.object({
    pages: z.array(
        z.object({
            name: z.string(),
            path: z.string(),
            description: z.string(),
            type: z.enum([
                "dashboard",
                "landing",
                "ecommerce",
                "form",
                "settings",
            ]),
        }),
    ),
});

const SuggestionsSchema = z.object({
    suggestions: z.array(z.string()).min(3).max(5),
});

type ProjectData = Partial<typeof project.$inferInsert>;

const updateProject = async (id: string, data: ProjectData) => {
    await db.update(project).set(data).where(eq(project.id, id));
};

export const generateAppAction = inngest.createFunction(
    {
        id: "generate-web-app",
        triggers: {
            event: "app/generate.requested",
        },
    },
    async ({ event, step }) => {
        const { prompt, projectId } = event.data;

        await step.run("stream-planning", async () => {
            await updateProject(projectId, {
                status: "ANALYZING",
                currentStep: "Planning your app",
            });

            const { textStream } = streamText({
                model: groqModel,
                system: "You are a friendly AI designer. In 2-3 sentences explain how you will build this app, mentioning the design system and key screens. Then list each screen as a short bullet. Be concise.",
                prompt: `Plan the design for ${prompt}`,
            });

            let accumulated = "";
            let lastWrite = 0;

            for await (const textDelta of textStream) {
                accumulated += textDelta;

                if (accumulated.length - lastWrite > 80) {
                    await updateProject(projectId, {
                        agentMessage: accumulated,
                    });

                    lastWrite = accumulated.length;
                }
            }

            await updateProject(projectId, {
                agentMessage: accumulated,
            });
        });

        const schema = await step.run("generate-schema", async () => {
            await updateProject(projectId, {
                status: "GENERATING",
                currentStep: "Building the design system",
            });

            const result = await generateText({
                model: groqModel,
                output: Output.object({
                    schema: PageSchema,
                }),
                system: "Design a comprehensive app sitemap. Always start with a Design System page.",
                prompt: `Sitemap for ${prompt}. Include 4 pages total. First page must be name="Design System", path="/design-system", type="dashboard".`,
            });

            const sitemap = result.output;

            await updateProject(projectId, {
                totalPages: sitemap.pages.length,
                name: prompt.split(" ").slice(0, 5).join(" "),
            });

            return sitemap;
        });

        await step.run("generate-skeleton", async () => {
            for (const pageData of schema.pages) {
                await db.insert(page).values({
                    projectId,
                    name: pageData.name,
                    path: pageData.path,
                    type: pageData.type,
                    description: pageData.description,
                    generating: true,
                    code: null,
                });
            }
        });

        for (let i = 0; i < schema.pages.length; i++) {
            const pageData = schema.pages[i];

            const generated = await step.run(`generate-page-${i}`, async () => {
                const stepLabel =
                    i === 0
                        ? "Building the design system"
                        : `Applying the design system to the screens (${i}/${schema.pages.length - 1})`;

                await updateProject(projectId, {
                    currentStep: stepLabel,
                });

                const existingPage = await db.query.page.findFirst({
                    where: {
                        projectId,
                        path: pageData.path,
                    },
                });

                const { text } = await generateText({
                    model: groqModel,
                    system: "You are a Master Web Designer. Output ONLY raw inner HTML for the <body> tag. Use Tailwind via CDN. NO markdown, no code fences, no DOCTYPE.",
                    prompt: `Build a pixel-perfect "${pageData.name}" screen.

App context:
${prompt}

Screen purpose:
${pageData.description}

Style:
vibrant, accents, Inter font, realistic data, Tailwind only.

Output only the inner HTML of the body.`,
                });

                return {
                    html: text.replace(/```html|```/g, "").trim(),
                    pageId: existingPage?.id ?? "",
                };
            });

            await step.run(`save-page-${i}`, async () => {
                if (generated.pageId) {
                    await db
                        .update(page)
                        .set({
                            code: generated.html,
                            generating: false,
                        })
                        .where(eq(page.id, generated.pageId));
                }

                await updateProject(projectId, {
                    donePages: i + 1,
                });
            });
        }

        await step.run("finish", async () => {
            const result = await generateText({
                model: groqModel,
                output: Output.object({
                    schema: SuggestionsSchema,
                }),
                prompt: `App: "${prompt}". Give 3-5 short follow-up design prompts a user might want next. Under 45 chars each.`,
            });

            const { suggestions } = result.output;

            await updateProject(projectId, {
                status: "COMPLETED",
                currentStep: null,
                suggestions: JSON.stringify(suggestions),
            });
        });

        return {
            pageCount: schema.pages.length,
        };
    },
);

export const generatePageAction = inngest.createFunction(
    {
        id: "generate-single-page",
        retries: 1,
        triggers: {
            event: "app/add-page.requested",
        },
    },
    async ({ event, step }) => {
        const { projectId, pageId, prompt, type } = event.data;

        const projectData = await step.run("get-context", async () => {
            return db.query.project.findFirst({
                where: {
                    id: projectId,
                },

                with: {
                    pages: {
                        where: {
                            code: {
                                isNotNull: true,
                            },
                        },

                        limit: 1,
                    },
                },
            });
        });

        await step.run("plan-page", async () => {
            await updateProject(projectId, {
                status: "GENERATING",
                currentStep: `Designing: ${prompt}`,
            });

            const { textStream } = streamText({
                model: groqModel,
                system: "You are a friendly designer. In 1-2 sentences describe how you will build this screen to match the existing app design. Be specific.",
                prompt: `Plan a new screen: "${prompt}" for an app about: ${
                    projectData?.prompt ?? ""
                }`,
            });

            let accumulated = "";
            let lastWrite = 0;

            for await (const textDelta of textStream) {
                accumulated += textDelta;

                if (accumulated.length - lastWrite > 80) {
                    await updateProject(projectId, {
                        agentMessage: accumulated,
                    });

                    lastWrite = accumulated.length;
                }
            }

            await updateProject(projectId, {
                agentMessage: accumulated,
            });
        });

        const html = await step.run("generate-html", async () => {
            const styleRef = projectData?.pages[0]?.code?.slice(0, 600) ?? "";

            const { text } = await generateText({
                model: groqModel,
                system: `You are a Master ${
                    type === "WEB" ? "Web" : "Mobile App"
                } Designer.

Output ONLY raw inner HTML for the <body> tag.

Use Tailwind via CDN.

NO markdown.
NO code fences.
NO DOCTYPE.`,

                prompt: `Build a pixel-perfect "${prompt}" screen.

App context:
${projectData?.prompt ?? prompt}

${
    styleRef
        ? `Match the visual style of the existing screens.

Reference snippet:
${styleRef}`
        : "Style: vibrant accents, Inter font, realistic data, Tailwind only."
}

Output only the <body> inner HTML.`,
            });

            return text.replace(/```html|```/g, "").trim();
        });

        await step.run("save-page", async () => {
            await db
                .update(page)
                .set({
                    name: prompt.split(" ").slice(0, 5).join(" "),
                    code: html,
                    generating: false,
                })
                .where(eq(page.id, pageId));

            await updateProject(projectId, {
                status: "COMPLETED",
                currentStep: null,
            });
        });

        return {
            pageId,
        };
    },
);
