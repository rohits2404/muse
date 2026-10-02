"use client";

import { AlertCircle, LoaderCircle, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Navbar } from "./components/navbar";
import { DesignCanvas } from "./components/design-canvas";
import { AgentPanel } from "./components/agent-panel";
import { ChatBar } from "./components/chat-bar";

interface Page {
    id: string;
    name: string;
    path: string;
    type: string;
    code: string | null;
    description: string | null;
    generating: boolean;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ProjectIdProps {
    id: string;
    name: string;
    prompt: string;
    status: string;
    agentMessage: string;
    currentStep: string | null;
    totalPages: number;
    donePages: number;
    suggestions: string[];
    pages: Page[];
    type: "WEB" | "MOBILE";
}

const TIPS = [
    "Use The Zoom Controls Or Scroll To Move Around The Canvas.",
    'Ask For Specific Outcomes, Like "Make The Pricing Section Clearer".',
    "Select A Screen To Switch Between Design And Code, Or Delete It.",
];

export function ProjectId() {
    const { id } = useParams<{ id: string }>();

    const [project, setProject] = useState<ProjectIdProps | null>(null);
    const [tipIndex, setTipIndex] = useState(0);
    const [isError, setIsError] = useState(false);

    const statusRef = useRef<string>("IDLE");

    /* Rotate tips while Muse is generating. */
    useEffect(() => {
        if (
            project?.status !== "ANALYZING" &&
            project?.status !== "GENERATING"
        ) {
            return;
        }

        const interval = setInterval(() => {
            setTipIndex((current) => (current + 1) % TIPS.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [project?.status]);

    /*
     * Poll project state. Fast while generating, slow otherwise.
     */
    useEffect(() => {
        let canceled = false;
        let timerId: ReturnType<typeof setTimeout> | undefined;

        async function fetchOnce() {
            try {
                const res = await fetch(`/api/projects/${id}`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    if (!canceled) setIsError(true);
                    return;
                }

                const data = (await res.json()) as ProjectIdProps;

                if (canceled) return;

                statusRef.current = data.status;
                setProject(data);
                setIsError(false);
            } catch {
                if (!canceled) setIsError(true);
            } finally {
                if (!canceled) schedule();
            }
        }

        function schedule() {
            const active =
                statusRef.current === "ANALYZING" ||
                statusRef.current === "GENERATING";

            timerId = setTimeout(fetchOnce, active ? 1200 : 8000);
        }

        fetchOnce();

        return () => {
            canceled = true;
            if (timerId) clearTimeout(timerId);
        };
    }, [id]);

    /* Delete a page. Optimistic, with a refetch on failure. */
    const onDeletePage = async (pageId: string) => {
        setProject((prev) =>
            prev
                ? {
                      ...prev,
                      pages: prev.pages.filter((page) => page.id !== pageId),
                  }
                : prev,
        );

        try {
            const response = await fetch(`/api/projects/${id}/page`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete page");
            }
        } catch (error) {
            console.error("Failed to delete page:", error);

            try {
                const res = await fetch(`/api/projects/${id}`, {
                    cache: "no-store",
                });

                if (res.ok) {
                    const data = (await res.json()) as ProjectIdProps;

                    if (!statusRef.current) {
                        statusRef.current = data.status;
                    }

                    setProject(data);
                }
            } catch (refreshError) {
                console.error(
                    "Failed To Refresh The Project After Deleting : ",
                    refreshError,
                );
            }
        }
    };

    /* ------------------------------ ERROR STATE ----------------------------- */

    if (isError) {
        return (
            <div className="flex h-dvh w-full items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 ring-1 ring-red-100">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>

                    <h1 className="mt-4 text-base font-semibold text-slate-900">
                        Project Not Found
                    </h1>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        We Couldn&apos;t Load This Project. It May Have Been
                        Deleted, Or The Link Is No Longer Valid.
                    </p>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    /* ----------------------------- LOADING STATE ---------------------------- */

    if (!project) {
        return (
            <div className="flex h-dvh w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700">
                            Loading Workspace
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Getting Your Design Canvas Ready.
                    </p>
                </div>
            </div>
        );
    }

    const isGenerating =
        project.status === "ANALYZING" || project.status === "GENERATING";

    /* ----------------------------- MAIN WORKSPACE --------------------------- */

    return (
        <main className="flex h-dvh w-full flex-col overflow-hidden bg-slate-50 text-slate-900">
            <Navbar
                projectName={project.name}
                status={project.status}
                currentStep={project.currentStep}
            />

            {/* Workspace: positioning context for canvas, panel and chat bar */}
            <div className="relative min-h-0 flex-1">
                <DesignCanvas
                    pages={project.pages}
                    isGenerating={isGenerating}
                    type={project.type}
                    onDeletePage={onDeletePage}
                />

                {/* Agent panel */}
                <div className="pointer-events-none absolute right-4 top-4 z-40">
                    <div className="pointer-events-auto">
                        <AgentPanel
                            prompt={project.prompt}
                            agentMessage={project.agentMessage}
                            currentStep={project.currentStep}
                            status={project.status}
                            totalPages={project.totalPages}
                            donePages={project.donePages}
                        />
                    </div>
                </div>

                {/* Chat bar */}
                <ChatBar
                    projectId={project.id}
                    suggestions={
                        project.status === "COMPLETED"
                            ? project.suggestions
                            : []
                    }
                    tip={isGenerating ? TIPS[tipIndex] : undefined}
                />
            </div>
        </main>
    );
}
