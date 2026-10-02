"use client";

import {
    ArrowUp,
    Check,
    ChevronRight,
    Monitor,
    MousePointer2,
    PencilRuler,
    Sparkles,
    Smartphone,
    WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LandingPage() {
    const router = useRouter();

    const [prompt, setPrompt] = useState("");
    const [mode, setMode] = useState<"mobile" | "web">("mobile");

    const handleSubmit = () => {
        router.push("/auth/sign-in");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#f7f7f5] font-sans text-zinc-900">
            {/* =========================================================
          BACKGROUND
      ========================================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
          PAGE CONTAINER
      ========================================================== */}

            <div className="relative mx-auto flex h-full w-full max-w-375 flex-col px-5 sm:px-8 lg:px-12">
                {/* =======================================================
            HEADER
        ======================================================== */}

                <header className="flex h-17 shrink-0 items-center justify-between sm:h-19">
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-2.5"
                    >
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

                        <span className="text-[17px] font-semibold tracking-[-0.02em]">
                            Muse
                        </span>
                    </button>

                    {/* Header actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/auth/sign-in")}
                            className="hidden text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 sm:block"
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/auth/sign-up")}
                            className="group flex h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_8px_25px_rgba(0,0,0,0.16)] sm:h-10 sm:px-4"
                        >
                            Get Started
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </header>

                {/* =======================================================
            MAIN
        ======================================================== */}

                <main className="flex min-h-0 flex-1 flex-col items-center overflow-hidden">
                    {/* =====================================================
              HERO
          ====================================================== */}

                    <section className="flex w-full max-w-250 flex-col items-center pt-[clamp(12px,4vh,78px)] text-center">
                        {/* Eyebrow */}
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/75 px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                            </span>
                            AI-Powered Design Agent
                        </div>

                        {/* Heading */}
                        <h1 className="max-w-225 text-[clamp(36px,min(6vw,8.5vh),76px)] font-bold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                            Turn Ideas Into{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10">Beautiful</span>

                                <span className="absolute bottom-0.5 left-0 right-0 z-0 h-2.5 -rotate-1 rounded-full bg-orange-400/30 sm:h-3" />
                            </span>
                            <br />
                            Designs.
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-3 max-w-157.5 text-[14px] leading-6 text-zinc-500 sm:text-[15px] sm:leading-7">
                            Describe What You Want To Build And Let Muse
                            Transform Your Thoughts Into Structured, Visual
                            Experiences In Seconds.
                        </p>

                        {/* =================================================
                PROMPT COMPOSER
            ================================================== */}

                        <div className="relative mt-5 w-full max-w-180">
                            {/* Floating left card */}
                            <div className="pointer-events-none absolute -left-20 top-10 z-0 hidden -rotate-6 lg:block">
                                <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 shadow-lg shadow-zinc-900/5 backdrop-blur-md">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
                                        <PencilRuler className="h-3.5 w-3.5 text-orange-600" />
                                    </div>

                                    <span className="text-[11px] font-medium text-zinc-600">
                                        Visual Thinking
                                    </span>
                                </div>
                            </div>

                            {/* Floating right card */}
                            <div className="pointer-events-none absolute -right-16 top-16 z-0 hidden rotate-6 lg:block">
                                <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 shadow-lg shadow-zinc-900/5 backdrop-blur-md">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                                        <WandSparkles className="h-3.5 w-3.5 text-blue-600" />
                                    </div>

                                    <span className="text-[11px] font-medium text-zinc-600">
                                        AI Generated
                                    </span>
                                </div>
                            </div>

                            {/* Composer */}
                            <div className="group relative z-10 overflow-hidden rounded-[22px] border border-zinc-200/90 bg-white/95 text-left shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 focus-within:border-zinc-300 focus-within:shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
                                {/* Top highlight */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300 to-transparent opacity-70" />

                                {/* Textarea */}
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={
                                        mode === "mobile"
                                            ? "Describe The Mobile App You Want To Design..."
                                            : "Describe The Web Experience You Want To Design..."
                                    }
                                    rows={3}
                                    className="min-h-28.75 w-full resize-none bg-transparent px-5 pt-5 pb-3 text-[14px] leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 sm:min-h-31.25 sm:px-6 sm:pt-5"
                                />

                                {/* Composer footer */}
                                <div className="flex items-center justify-between px-4 pb-4 sm:px-5">
                                    {/* Device selector */}
                                    <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50/80 p-1">
                                        {/* Mobile */}
                                        <button
                                            type="button"
                                            onClick={() => setMode("mobile")}
                                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all ${
                                                mode === "mobile"
                                                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/70"
                                                    : "text-zinc-400 hover:text-zinc-600"
                                            }`}
                                        >
                                            <Smartphone className="h-3.5 w-3.5" />
                                            Mobile
                                        </button>

                                        {/* Web */}
                                        <button
                                            type="button"
                                            onClick={() => setMode("web")}
                                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all ${
                                                mode === "web"
                                                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/70"
                                                    : "text-zinc-400 hover:text-zinc-600"
                                            }`}
                                        >
                                            <Monitor className="h-3.5 w-3.5" />
                                            Web
                                        </button>
                                    </div>

                                    {/* Generate */}
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="group flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />

                                        <span className="hidden sm:block">
                                            Generate
                                        </span>

                                        <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Keyboard hint */}
                            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                                <span>Press</span>

                                <kbd className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[9px] shadow-sm">
                                    Enter
                                </kbd>

                                <span>To Continue</span>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
              FEATURE STRIP
          ====================================================== */}

                    <section className="mt-auto w-full max-w-212.5 pb-3 pt-4">
                        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/55 backdrop-blur-md sm:grid-cols-3">
                            <Feature
                                icon={<WandSparkles className="h-4 w-4" />}
                                title="Describe"
                                description="Start With An Idea"
                            />

                            <Feature
                                icon={<PencilRuler className="h-4 w-4" />}
                                title="Visualize"
                                description="Turn Words Into Visuals"
                                border
                            />

                            <Feature
                                icon={<MousePointer2 className="h-4 w-4" />}
                                title="Refine"
                                description="Shape It Your Way"
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                            <Check className="h-3 w-3" />
                            No Design Experience Required
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

/* ===============================================================
   FEATURE COMPONENT
================================================================ */

function Feature({
    icon,
    title,
    description,
    border = false,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    border?: boolean;
}) {
    return (
        <div
            className={`group flex items-center gap-3 px-5 py-3.5 ${
                border
                    ? "border-y border-zinc-200/80 sm:border-x sm:border-y-0"
                    : ""
            }`}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-800">{title}</p>

                <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                    {description}
                </p>
            </div>
        </div>
    );
}
