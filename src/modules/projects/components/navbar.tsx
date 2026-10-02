"use client";

import { ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserMenu } from "./user-button";
import Image from "next/image";

interface NavbarProps {
    projectName: string;
    status: string;
    currentStep: string | null;
}

export function Navbar({ projectName, status, currentStep }: NavbarProps) {
    const router = useRouter();

    const isGenerating = status === "ANALYZING" || status === "GENERATING";
    const isCompleted = status === "COMPLETED";
    const isFailed = status === "FAILED";

    return (
        <header className="relative z-50 grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-slate-200 bg-white px-3 sm:px-4">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="hidden items-center gap-2 sm:flex">
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

                    <span className="text-sm font-semibold text-slate-900">
                        Muse
                    </span>

                    <span className="mx-1 text-slate-300" aria-hidden>
                        /
                    </span>
                </div>

                <button
                    type="button"
                    className="flex min-w-0 max-w-45 items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:max-w-65"
                >
                    <span className="truncate text-sm font-medium text-slate-700">
                        {projectName}
                    </span>
                </button>
            </div>

            {/* Center status */}
            <div className="flex justify-center">
                {isGenerating ? (
                    <div className="hidden items-center gap-2 rounded-full bg-indigo-50 py-1 pl-2.5 pr-3 ring-1 ring-indigo-100 sm:flex">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        <span className="max-w-60 truncate text-xs font-medium text-indigo-700">
                            {currentStep ?? "Generating Your Design"}
                        </span>
                    </div>
                ) : isCompleted ? (
                    <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-2 pr-3 ring-1 ring-emerald-100 sm:flex">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600">
                            <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                        <span className="text-xs font-medium text-emerald-700">
                            Design Ready
                        </span>
                    </div>
                ) : isFailed ? (
                    <div className="hidden items-center gap-2 rounded-full bg-red-50 py-1 pl-2.5 pr-3 ring-1 ring-red-100 sm:flex">
                        <span className="h-2 w-2 rounded-full bg-red-600" />
                        <span className="text-xs font-medium text-red-700">
                            Generation Failed
                        </span>
                    </div>
                ) : null}
            </div>

            {/* Right */}
            <div className="flex items-center justify-end gap-2">
                {isGenerating && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 sm:hidden">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    </div>
                )}

                <UserMenu />
            </div>
        </header>
    );
}
