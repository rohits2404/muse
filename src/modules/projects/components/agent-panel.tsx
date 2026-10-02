"use client";

import {
    AlertTriangle,
    Check,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AgentPanelProps {
    prompt: string;
    agentMessage: string;
    currentStep: string | null;
    status: string;
    totalPages: number;
    donePages: number;
}

export function AgentPanel({
    prompt,
    agentMessage,
    currentStep,
    status,
    totalPages,
    donePages,
}: AgentPanelProps) {
    const textRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(true);

    const isGenerating = status === "ANALYZING" || status === "GENERATING";
    const isComplete = status === "COMPLETED";
    const isFailed = status === "FAILED";

    const progress =
        totalPages > 0 ? Math.min((donePages / totalPages) * 100, 100) : 0;

    /* Keep the activity log scrolled to the newest message. */
    useEffect(() => {
        if (!textRef.current || !isOpen) return;

        textRef.current.scrollTo({
            top: textRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [agentMessage, isOpen]);

    return (
        <aside className="w-82.5 max-w-[calc(100vw-32px)]">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                isComplete
                                    ? "bg-emerald-50 text-emerald-600"
                                    : isFailed
                                      ? "bg-red-50 text-red-600"
                                      : "bg-indigo-50 text-indigo-600"
                            }`}
                        >
                            {isComplete ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : isFailed ? (
                                <AlertTriangle className="h-4 w-4" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-semibold leading-none text-slate-900">
                                Muse
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {isGenerating
                                    ? "Designing your screens"
                                    : isComplete
                                      ? "Design Complete"
                                      : isFailed
                                        ? "Something Went Wrong"
                                        : "Design Agent"}
                            </p>
                        </div>
                    </div>

                    {isGenerating ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-60" />
                                <span className="relative h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            </span>
                            Working
                        </span>
                    ) : isComplete ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                            <Check className="h-3 w-3" />
                            Ready
                        </span>
                    ) : null}
                </div>

                {/* Prompt (toggle) */}
                <button
                    type="button"
                    onClick={() => setIsOpen((value) => !value)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                >
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500">
                            Your prompt
                        </p>
                        <p className="mt-0.5 truncate text-sm text-slate-800">
                            {prompt}
                        </p>
                    </div>

                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="space-y-3 border-t border-slate-100 p-4">
                        {/* Progress */}
                        {(isGenerating || isComplete) && (
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        {isComplete ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                        ) : (
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-600" />
                                        )}

                                        <span className="truncate text-sm font-medium text-slate-800">
                                            {isComplete
                                                ? "All Screens Generated"
                                                : currentStep ||
                                                  "Working On Your Design"}
                                        </span>
                                    </div>

                                    {totalPages > 0 && (
                                        <span className="shrink-0 text-xs tabular-nums text-slate-500">
                                            {donePages} of {totalPages}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
                                    role="progressbar"
                                    aria-valuenow={Math.round(
                                        isComplete ? 100 : progress,
                                    )}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            isComplete
                                                ? "bg-emerald-500"
                                                : "bg-indigo-600"
                                        }`}
                                        style={{
                                            width:
                                                totalPages > 0
                                                    ? `${progress}%`
                                                    : isGenerating
                                                      ? "35%"
                                                      : "100%",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Activity */}
                        {agentMessage && (
                            <div>
                                <p className="mb-1.5 text-xs font-medium text-slate-500">
                                    Activity
                                </p>

                                <div
                                    ref={textRef}
                                    className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                                    style={{ scrollbarWidth: "thin" }}
                                >
                                    <p className="whitespace-pre-wrap text-xs leading-5 text-slate-600">
                                        {agentMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Complete */}
                        {isComplete && (
                            <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">
                                        Your Design Is Ready
                                    </p>
                                    <p className="mt-0.5 text-xs text-emerald-700/80">
                                        Use The Chat Below To Refine Any Screen.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Failed */}
                        {isFailed && (
                            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 px-3 py-2.5 ring-1 ring-red-100">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">
                                        Generation Stopped
                                    </p>
                                    <p className="mt-0.5 text-xs text-red-700/80">
                                        Something Went Wrong While Generating.
                                        Send A New Prompt To Try Again.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Collapsed footer */}
                {!isOpen && (
                    <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-2.5">
                        {isGenerating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        ) : (
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    isComplete
                                        ? "bg-emerald-500"
                                        : isFailed
                                          ? "bg-red-500"
                                          : "bg-slate-300"
                                }`}
                            />
                        )}

                        <span className="truncate text-xs text-slate-500">
                            {currentStep || "Agent Activity"}
                        </span>
                    </div>
                )}
            </div>
        </aside>
    );
}
