"use client";

import {
    ArrowUp,
    Calendar,
    ChevronRight,
    FileCode2,
    FolderOpen,
    Layers3,
    LoaderCircle,
    Monitor,
    Plus,
    Search,
    Sparkles,
    Smartphone,
    WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UserMenu } from "./components/user-button";
import Image from "next/image";

interface PageSnippet {
    id: string;
    code: string | null;
}

interface ProjectItem {
    id: string;
    name: string;
    createdAt: Date;
    pages: PageSnippet[];
}

interface ProjectProps {
    grouped: Record<string, ProjectItem[]>;
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

const formatShortDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

export function ProjectClient({ grouped }: ProjectProps) {
    const router = useRouter();

    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"mobile" | "web">("web");
    const [search, setSearch] = useState("");

    const allProjects = useMemo(() => Object.values(grouped).flat(), [grouped]);

    const filteredProjects = useMemo(() => {
        if (!search.trim()) return allProjects;

        return allProjects.filter((project) =>
            project.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [allProjects, search]);

    const recentProjects = useMemo(() => {
        return [...allProjects]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(0, 6);
    }, [allProjects]);

    const handleGenerate = async (text = prompt) => {
        if (!text.trim() || isLoading) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/projects/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: text,
                    type: mode.toUpperCase(),
                }),
            });

            if (!res.ok) {
                throw new Error("Failed To Create Project");
            }

            const data = await res.json();

            if (!data?.project?.id) {
                throw new Error("Project ID Missing From Response");
            }

            router.push(`/projects/${data.project.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-[#f8f8f7] text-zinc-900">
            {/* =========================================================
          SIDEBAR
      ========================================================= */}

            <aside className="hidden w-67.5 shrink-0 flex-col border-r border-zinc-200/80 bg-[#f8f8f7] lg:flex">
                {/* Brand */}
                <div className="flex h-18 items-center px-5">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-2.5"
                    >
                        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
                            <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-white" />

                            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/logo.svg"
                                    alt="Muse"
                                    width={28}
                                    height={28}
                                    priority
                                    className="h-7 w-7 object-contain"
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <p className="text-[15px] font-semibold tracking-[-0.02em]">
                                Muse
                            </p>
                            <p className="text-[10px] text-zinc-400">
                                AI Design Workspace
                            </p>
                        </div>
                    </button>
                </div>

                {/* New project */}
                <div className="px-4 pb-4">
                    <button
                        type="button"
                        onClick={() => {
                            document
                                .querySelector<HTMLTextAreaElement>(
                                    "#project-prompt",
                                )
                                ?.focus();
                        }}
                        className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        New Project
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <div className="group flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 shadow-sm transition-all focus-within:border-zinc-300 focus-within:shadow-md">
                        <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="min-w-0 flex-1 bg-transparent text-xs text-zinc-800 outline-none placeholder:text-zinc-400"
                        />

                        <kbd className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400 xl:block">
                            /
                        </kbd>
                    </div>
                </div>

                {/* Project list */}
                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                    {search.trim() ? (
                        <div>
                            <div className="mb-2 flex items-center justify-between px-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                                    Search Results
                                </p>

                                <span className="text-[10px] text-zinc-400">
                                    {filteredProjects.length}
                                </span>
                            </div>

                            {filteredProjects.length > 0 ? (
                                <div className="space-y-0.5">
                                    {filteredProjects.map((project) => (
                                        <ProjectRow
                                            key={project.id}
                                            project={project}
                                            router={router}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptySearch />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(grouped).map(
                                ([label, projects]) => {
                                    if (projects.length === 0) return null;

                                    return (
                                        <div key={label}>
                                            <div className="mb-2 flex items-center justify-between px-2">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                                                    {label}
                                                </p>

                                                <span className="text-[10px] text-zinc-400">
                                                    {projects.length}
                                                </span>
                                            </div>

                                            <div className="space-y-0.5">
                                                {projects.map((project) => (
                                                    <ProjectRow
                                                        key={project.id}
                                                        project={project}
                                                        router={router}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                },
                            )}

                            {allProjects.length === 0 && (
                                <div className="px-2 py-10 text-center">
                                    <FolderOpen className="mx-auto mb-2 h-5 w-5 text-zinc-300" />

                                    <p className="text-xs font-medium text-zinc-500">
                                        No Projects Yet
                                    </p>

                                    <p className="mt-1 text-[10px] leading-4 text-zinc-400">
                                        Your Creations Will Appear Here.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar footer */}
                <div className="border-t border-zinc-200/70 p-3">
                    <div className="flex items-center gap-2 rounded-xl px-2 py-2 text-zinc-400">
                        <Sparkles className="h-3.5 w-3.5 text-orange-500" />

                        <span className="text-[10px]">Powered By AI</span>
                    </div>
                </div>
            </aside>

            {/* =========================================================
          MAIN
      ========================================================= */}

            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.55]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />

                    <div className="absolute left-1/2 -top-70 h-137.5 w-200 -translate-x-1/2 rounded-full bg-orange-200/25 blur-[130px]" />

                    <div className="absolute -bottom-62.5 -right-37.5 h-125 w-125 rounded-full bg-purple-200/15 blur-[130px]" />
                </div>

                {/* Header */}
                <header className="relative z-20 flex h-18 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-[#f8f8f7]/70 px-5 backdrop-blur-xl sm:px-7">
                    {/* Mobile logo */}
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 lg:hidden"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm">
                            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/logo.svg"
                                    alt="Muse"
                                    width={28}
                                    height={28}
                                    priority
                                    className="h-7 w-7 object-contain"
                                />
                            </div>
                        </div>

                        <span className="text-sm font-semibold">Muse</span>
                    </button>

                    {/* Desktop breadcrumb */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <span className="text-xs text-zinc-400">Workspace</span>

                        <ChevronRight className="h-3 w-3 text-zinc-300" />

                        <span className="text-xs font-medium text-zinc-700">
                            Overview
                        </span>
                    </div>

                    <UserMenu />
                </header>

                {/* Main content */}
                <main className="relative z-10 min-h-0 flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-300 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
                        {/* =====================================================
                HERO
            ===================================================== */}

                        <section className="mx-auto max-w-225 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />

                                    <span className="relative h-2 w-2 rounded-full bg-orange-500" />
                                </span>

                                <span className="text-[10px] font-medium text-orange-700">
                                    Muse AI Is Ready
                                </span>
                            </div>

                            <h1 className="text-[clamp(38px,5vw,64px)] font-bold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                                What Will You{" "}
                                <span className="relative inline-block">
                                    Create
                                    <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 rounded-full bg-orange-400/30" />
                                </span>
                                ?
                            </h1>

                            <p className="mx-auto mt-5 max-w-142.5 text-sm leading-6 text-zinc-500 sm:text-[15px]">
                                Describe An Idea, Product, Or Experience. Muse
                                Turns Your Words Into Beautiful, Structured
                                Interfaces.
                            </p>
                        </section>

                        {/* =====================================================
                AI COMPOSER
            ===================================================== */}

                        <section className="mx-auto mt-8 max-w-195">
                            <div className="group relative overflow-hidden rounded-[24px] border border-zinc-200/90 bg-white/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] backdrop-blur-xl transition-all duration-300 focus-within:border-zinc-300 focus-within:shadow-[0_25px_90px_rgba(0,0,0,0.11)]">
                                {/* top glow */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-400 to-transparent opacity-70" />

                                {/* Prompt */}
                                <div className="relative">
                                    <textarea
                                        id="project-prompt"
                                        value={prompt}
                                        onChange={(e) =>
                                            setPrompt(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            mode === "mobile"
                                                ? "Describe The Mobile Experience You Want To Build..."
                                                : "Describe The Web Experience You Want To Build..."
                                        }

                                        disabled={isLoading}
                                        rows={4}
                                        className="min-h-36.25 w-full resize-none bg-transparent px-5 pt-5 pb-3 text-[14px] leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                                    />

                                    {!prompt && (
                                        <div className="pointer-events-none absolute bottom-4 right-5 hidden items-center gap-1.5 text-[10px] text-zinc-300 sm:flex">
                                            <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono">
                                                Enter
                                            </kbd>

                                            <span>To Generate</span>
                                        </div>
                                    )}
                                </div>

                                {/* Composer footer */}
                                <div className="flex items-center justify-between gap-3 px-4 pb-4 sm:px-5">
                                    {/* Type selector */}
                                    <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50/80 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setMode("web")}
                                            disabled={isLoading}
                                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium transition-all ${
                                                mode === "web"
                                                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/70"
                                                    : "text-zinc-400 hover:text-zinc-600"
                                            }`}
                                        >
                                            <Monitor className="h-3.5 w-3.5" />
                                            Web
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setMode("mobile")}
                                            disabled={isLoading}
                                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium transition-all ${
                                                mode === "mobile"
                                                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/70"
                                                    : "text-zinc-400 hover:text-zinc-600"
                                            }`}
                                        >
                                            <Smartphone className="h-3.5 w-3.5" />
                                            Mobile
                                        </button>
                                    </div>

                                    {/* Generate */}
                                    <button
                                        type="button"
                                        onClick={() => handleGenerate()}
                                        disabled={!prompt.trim() || isLoading}
                                        className="group flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
                                    >
                                        {isLoading ? (
                                            <>
                                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                                <span className="hidden sm:inline">
                                                    Creating...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-3.5 w-3.5 text-orange-300" />

                                                <span className="hidden sm:inline">
                                                    Generate
                                                </span>

                                                <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Composer hint */}
                            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                                <WandSparkles className="h-3 w-3 text-orange-400" />

                                <span>
                                    Start With An Idea. Muse Handles The Rest.
                                </span>
                            </div>
                        </section>

                        {/* =====================================================
                RECENT PROJECTS
            ===================================================== */}

                        <section className="mx-auto mt-14 max-w-262.5">
                            <div className="mb-5 flex items-end justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                                            Recent Projects
                                        </h2>

                                        {allProjects.length > 0 && (
                                            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400">
                                                {allProjects.length}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-[11px] text-zinc-400">
                                        Pick Up Where You Left Off.
                                    </p>
                                </div>

                                {allProjects.length > 6 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            document
                                                .querySelector<HTMLInputElement>(
                                                    'input[placeholder="Search projects..."]',
                                                )
                                                ?.focus();
                                        }}
                                        className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                                    >
                                        View All
                                        <ChevronRight className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {recentProjects.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {recentProjects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                            router={router}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyProjects
                                    onCreate={() => {
                                        document
                                            .querySelector<HTMLTextAreaElement>(
                                                "#project-prompt",
                                            )
                                            ?.focus();
                                    }}
                                />
                            )}
                        </section>

                        {/* Bottom breathing room */}
                        <div className="h-10" />
                    </div>
                </main>
            </div>
        </div>
    );
}

/* ================================================================
   PROJECT CARD
================================================================ */

function ProjectCard({
    project,
    router,
}: {
    project: ProjectItem;
    router: ReturnType<typeof useRouter>;
}) {
    const pageCount = project.pages?.length ?? 0;

    return (
        <button
            type="button"
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(0,0,0,0.09)]"
        >
            {/* Preview */}
            <ProjectPreview project={project} />

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight text-zinc-800">
                            {project.name}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                                <Calendar className="h-3 w-3" />
                                {formatShortDate(project.createdAt)}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-zinc-300" />

                            <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                                <FileCode2 className="h-3 w-3" />
                                {pageCount} {pageCount === 1 ? "Page" : "Pages"}
                            </span>
                        </div>
                    </div>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 shadow-sm transition-all group-hover:border-zinc-300 group-hover:text-zinc-900">
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </button>
    );
}

/* ================================================================
   PROJECT PREVIEW
================================================================ */

function ProjectPreview({ project }: { project: ProjectItem }) {
    const palettes = [
        {
            bg: "from-blue-50 via-indigo-50 to-white",
            accent: "bg-blue-500",
            secondary: "bg-indigo-200",
        },
        {
            bg: "from-orange-50 via-amber-50 to-white",
            accent: "bg-orange-500",
            secondary: "bg-amber-200",
        },
        {
            bg: "from-violet-50 via-purple-50 to-white",
            accent: "bg-violet-500",
            secondary: "bg-purple-200",
        },
        {
            bg: "from-emerald-50 via-teal-50 to-white",
            accent: "bg-emerald-500",
            secondary: "bg-teal-200",
        },
        {
            bg: "from-rose-50 via-pink-50 to-white",
            accent: "bg-rose-500",
            secondary: "bg-pink-200",
        },
        {
            bg: "from-slate-100 via-zinc-50 to-white",
            accent: "bg-slate-700",
            secondary: "bg-slate-300",
        },
    ];

    const index =
        project.name
            .split("")
            .reduce((total, char) => total + char.charCodeAt(0), 0) %
        palettes.length;

    const palette = palettes[index];

    return (
        <div
            className={`relative h-36.25 overflow-hidden bg-linear-to-br ${palette.bg}`}
        >
            {/* browser top */}
            <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 border-b border-black/5 bg-white/60 px-3 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />

                <div className="ml-2 h-2 w-24 rounded-full bg-zinc-200/70" />
            </div>

            {/* fake UI */}
            <div className="absolute inset-x-5 bottom-0 top-10">
                <div className="flex h-full gap-3">
                    <div className="w-8 rounded-t-lg border border-black/5 bg-white/70 p-1.5">
                        <div
                            className={`mb-2 h-2 w-2 rounded ${palette.accent}`}
                        />

                        <div className="space-y-1">
                            <div className="h-1 w-full rounded bg-zinc-200" />
                            <div className="h-1 w-3/4 rounded bg-zinc-200" />
                            <div className="h-1 w-full rounded bg-zinc-200" />
                            <div className="h-1 w-2/3 rounded bg-zinc-200" />
                        </div>
                    </div>

                    <div className="flex-1 rounded-t-lg border border-black/5 bg-white/75 p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="space-y-1.5">
                                <div className="h-2 w-20 rounded bg-zinc-300" />
                                <div className="h-1.5 w-32 rounded bg-zinc-200" />
                            </div>

                            <div
                                className={`h-5 w-10 rounded-md ${palette.accent} opacity-80`}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="h-14 rounded-lg bg-zinc-100" />
                            <div
                                className={`h-14 rounded-lg ${palette.secondary} opacity-60`}
                            />
                            <div className="h-14 rounded-lg bg-zinc-100" />
                        </div>

                        <div className="mt-2 flex gap-2">
                            <div className="h-2 w-20 rounded bg-zinc-200" />
                            <div className="h-2 w-12 rounded bg-zinc-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-zinc-950/0 transition-colors duration-300 group-hover:bg-zinc-950/2" />

            {/* generated badge */}
            {project.pages.some((page) => page.code) && (
                <div className="absolute right-3 top-10 flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-medium text-zinc-500 shadow-sm backdrop-blur-md">
                    <Sparkles className="h-2.5 w-2.5 text-orange-500" />
                    Generated
                </div>
            )}
        </div>
    );
}

/* ================================================================
   SIDEBAR PROJECT ROW
================================================================ */

function ProjectRow({
    project,
    router,
}: {
    project: ProjectItem;
    router: ReturnType<typeof useRouter>;
}) {
    return (
        <button
            type="button"
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-all hover:bg-white hover:shadow-sm"
        >
            <ProjectThumb project={project} />

            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-700 transition-colors group-hover:text-zinc-950">
                    {project.name}
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-400">
                    {formatDate(project.createdAt)}
                </p>
            </div>

            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
    );
}

/* ================================================================
   PROJECT THUMB
================================================================ */

function ProjectThumb({ project }: { project: ProjectItem }) {
    const colors = [
        "from-blue-400 to-indigo-600",
        "from-orange-400 to-amber-600",
        "from-violet-400 to-purple-600",
        "from-emerald-400 to-teal-600",
        "from-rose-400 to-pink-600",
        "from-slate-500 to-zinc-800",
    ];

    const index =
        project.name
            .split("")
            .reduce((total, char) => total + char.charCodeAt(0), 0) %
        colors.length;

    return (
        <div
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br ${colors[index]} shadow-sm`}
        >
            <div className="absolute inset-0 bg-white/10" />

            {project.pages?.some((page) => page.code) ? (
                <FileCode2 className="relative h-4 w-4 text-white" />
            ) : (
                <Layers3 className="relative h-4 w-4 text-white/90" />
            )}
        </div>
    );
}

/* ================================================================
   EMPTY SEARCH
================================================================ */

function EmptySearch() {
    return (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-white/40 px-4 py-8 text-center">
            <Search className="mx-auto mb-2 h-4 w-4 text-zinc-300" />

            <p className="text-xs font-medium text-zinc-500">
                No Projects Found
            </p>

            <p className="mt-1 text-[10px] text-zinc-400">
                Try Searching For Another Project.
            </p>
        </div>
    );
}

/* ================================================================
   EMPTY PROJECTS
================================================================ */

function EmptyProjects({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-200 bg-white/50 px-6 py-14 text-center backdrop-blur-sm">
            <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-orange-100/40 blur-3xl" />

            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500 shadow-sm">
                <WandSparkles className="h-5 w-5" />
            </div>

            <h3 className="relative mt-4 text-sm font-semibold text-zinc-800">
                Your Canvas Is Waiting
            </h3>

            <p className="relative mx-auto mt-1.5 max-w-90 text-xs leading-5 text-zinc-400">
                Start With An Idea Above And Let Muse Turn It Into Your First
                Beautiful Interface.
            </p>

            <button
                type="button"
                onClick={onCreate}
                className="relative mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-xs font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md"
            >
                <Plus className="h-3.5 w-3.5" />
                Create Your First Project
            </button>
        </div>
    );
}
