"use client";

import { useEffect, useState } from "react";
import {
    TransformComponent,
    TransformWrapper,
    useControls,
    useTransformContext,
} from "react-zoom-pan-pinch";
import { LayoutTemplate, Maximize2, Minus, Plus } from "lucide-react";

import { ScreenFrame } from "./screen-frame";

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

interface DesignCanvasProps {
    pages: Page[];
    isGenerating?: boolean;
    type: "WEB" | "MOBILE";
    onDeletePage?: (pageId: string) => void;
}

const CANVAS_PAD = 600;
const WEB_FRAME_WIDTH = 1440;
const MOBILE_FRAME_WIDTH = 390;

export function DesignCanvas({
    pages,
    isGenerating,
    type,
    onDeletePage,
}: DesignCanvasProps) {
    const initialScale = 0.4;

    const initialX = 80 - CANVAS_PAD * initialScale;
    const initialY = 80 - CANVAS_PAD * initialScale;

    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <TransformWrapper
                minScale={0.05}
                maxScale={2}
                limitToBounds={false}
                initialScale={initialScale}
                initialPositionX={initialX}
                initialPositionY={initialY}
                centerOnInit={false}
                panning={{ excluded: ["input", "button", "textarea"] }}
                wheel={{ step: 0.04 }}
                doubleClick={{ disabled: true }}
            >
                <CanvasTopBar count={pages.length} />

                <TransformComponent
                    wrapperClass="!h-full !w-full"
                    contentClass="!min-h-full"
                    wrapperStyle={{
                        backgroundColor: "#f8fafc",
                        backgroundImage:
                            "radial-gradient(circle, rgba(148,163,184,0.45) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                >
                    <div
                        className="relative flex min-h-[2200px] min-w-[5000px] items-start"
                        onClick={() => setSelectedPageId(null)}
                    >
                        {pages.map((page, index) => {
                            const x =
                                type === "WEB"
                                    ? 100 + index * 1000
                                    : 100 + index * 500;
                            const y = 500;

                            if (page.generating && !page.code) {
                                return (
                                    <div
                                        key={page.id}
                                        className="absolute"
                                        style={{ left: x, top: y }}
                                    >
                                        <SkeletonFrame type={type} />
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={page.id}
                                    className="absolute"
                                    style={{ left: x, top: y }}
                                >
                                    <ScreenFrame
                                        page={page}
                                        initialPosition={{ x: 0, y: 0 }}
                                        isSelected={selectedPageId === page.id}
                                        onSelect={(event) => {
                                            event.stopPropagation();
                                            setSelectedPageId(page.id);
                                        }}
                                        type={type}
                                        onDeletePage={onDeletePage}
                                    />
                                </div>
                            );
                        })}

                        {pages.length === 0 && !isGenerating && <EmptyCanvas />}
                    </div>
                </TransformComponent>

                <ZoomControls />
            </TransformWrapper>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Top toolbar                                                                */
/* -------------------------------------------------------------------------- */

function CanvasTopBar({ count }: { count: number }) {
    return (
        <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                <LayoutTemplate className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                    Canvas
                </span>
                <span className="h-3 w-px bg-slate-200" />
                <span className="text-xs tabular-nums text-slate-500">
                    {count} {count === 1 ? "screen" : "screens"}
                </span>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyCanvas() {
    return (
        <div className="absolute left-190 top-190 flex -translate-x-1/2 -translate-y-1/2 select-none flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <LayoutTemplate className="h-6 w-6 text-indigo-600" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-800">
                No screens yet
            </h2>

            <p className="mt-2 max-w-sm text-base leading-7 text-slate-500">
                Describe what you want to build in the chat below and Muse will
                design the screens for you.
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Generation skeleton                                                        */
/* -------------------------------------------------------------------------- */

function SkeletonFrame({ type }: { type: "WEB" | "MOBILE" }) {
    const width = type === "WEB" ? WEB_FRAME_WIDTH : MOBILE_FRAME_WIDTH;
    const height = type === "WEB" ? 900 : 844;

    return (
        <div className="relative" style={{ width }}>
            <div className="mb-3 flex items-center gap-2 px-1">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <div className="h-3.5 w-32 animate-pulse rounded bg-slate-300/70" />
            </div>

            <div
                className="relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-900/5"
                style={{ width, height }}
            >
                {/* Light sweep */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-y-0 left-[-40%] w-[40%] animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-slate-100/80 to-transparent" />
                </div>

                <div className="relative flex h-full flex-col p-8">
                    <div className="flex items-center justify-between">
                        <div className="h-7 w-28 animate-pulse rounded-md bg-slate-200" />
                        <div className="flex gap-2">
                            <div className="h-7 w-16 animate-pulse rounded-md bg-slate-100" />
                            <div className="h-7 w-20 animate-pulse rounded-md bg-slate-200" />
                        </div>
                    </div>

                    <div className="mt-20">
                        <div className="h-8 w-[45%] animate-pulse rounded-md bg-slate-200" />
                        <div className="mt-4 h-4 w-[65%] animate-pulse rounded bg-slate-100" />
                        <div className="mt-2 h-4 w-[50%] animate-pulse rounded bg-slate-100" />
                        <div className="mt-7 h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
                    </div>

                    <div className="mt-auto grid grid-cols-3 gap-4">
                        <SkeletonBlock />
                        <SkeletonBlock />
                        <SkeletonBlock />
                    </div>
                </div>

                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-md">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span className="text-sm font-medium text-slate-600">
                        Muse Is Generating...
                    </span>
                </div>
            </div>
        </div>
    );
}

function SkeletonBlock() {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-5">
            <div className="h-6 w-10 animate-pulse rounded-md bg-slate-200" />
            <div className="mt-5 h-3 w-full animate-pulse rounded bg-slate-200/70" />
            <div className="mt-2 h-3 w-[70%] animate-pulse rounded bg-slate-100" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Zoom controls                                                              */
/* -------------------------------------------------------------------------- */

function ZoomControls() {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    const [zoom, setZoom] = useState(40);

    const ctx = useTransformContext();

    useEffect(() => {
        return ctx.onChange((state) => {
            setZoom(Math.round(state.state.scale * 100));
        });
    }, [ctx]);

    const btn =
        "flex h-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:bg-slate-200";

    return (
        <div className="absolute bottom-4 left-4 z-50">
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <button
                    type="button"
                    onClick={() => zoomOut()}
                    className={`${btn} w-8`}
                    aria-label="Zoom out"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => resetTransform()}
                    className={`${btn} group min-w-15 gap-1.5 px-2 text-xs font-medium tabular-nums`}
                    title="Reset zoom"
                >
                    <span>{zoom}%</span>
                    <Maximize2 className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                </button>

                <button
                    type="button"
                    onClick={() => zoomIn()}
                    className={`${btn} w-8`}
                    aria-label="Zoom in"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
