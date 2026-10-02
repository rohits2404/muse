import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { htmlContentWrapper } from "@/lib/html-content-wrapper";
import { cn } from "@/lib/utils";
import { Code2Icon, MonitorIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { CodeView } from "./code-view";

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

interface ScreenFrameProps {
    page: Page;
    initialPosition?: { x: number; y: number };
    scale?: number;
    onDeletePage?: (pageId: string) => void;
    isSelected: boolean;
    onSelect: (e: MouseEvent) => void;
    type: "WEB" | "MOBILE";
}

export function ScreenFrame({
    page,
    initialPosition = { x: 0, y: 0 },
    scale = 1,
    onDeletePage,
    isSelected,
    onSelect,
    type,
}: ScreenFrameProps) {
    const initialSize =
        type === "WEB"
            ? { width: 1550, height: 900 }
            : { width: 700, height: 900 };
    const [size, setSize] = useState(initialSize);
    const [viewMode, setViewMode] = useState<"code" | "design">("design");

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const htmlContent = htmlContentWrapper(
        page.code as string,
        page.name,
        page.id,
    );

    useEffect(() => {
        const handleSizeChange = (e: MessageEvent) => {
            if (e.data.type === "FRAME_HEIGHT" && e.data.pageId === page.id) {
                setSize((prev) => ({
                    ...prev,
                    height: e.data.height,
                }));
            }
        };

        window.addEventListener("message", handleSizeChange);

        return () => window.removeEventListener("message", handleSizeChange);
    }, [page.id]);

    return (
        <Rnd
            default={{
                x: initialPosition.x,
                y: initialPosition.y,
                width: size.width,
                height: size.height,
            }}
            size={{ width: size.width, height: size.height }}
            minWidth={320}
            minHeight={900}
            scale={scale}
            onMouseDown={onSelect}
            onResize={(_, __, ref) => {
                setSize({
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                });
            }}
            className={cn(
                "relative z-30 cursor-move rounded-md transition-shadow",
                isSelected
                    ? "shadow-2xl shadow-slate-900/10 ring-[6px] ring-indigo-600"
                    : "shadow-xl shadow-slate-900/5 ring-1 ring-slate-300 hover:ring-slate-400",
            )}
        >
            {/* Frame toolbar */}
            {isSelected && (
                <div
                    className="absolute -top-14 left-0 z-50 flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-md"
                    style={{
                        transform: `scale(${1 / scale})`,
                        transformOrigin: "bottom left",
                    }}
                >
                    <h5 className="max-w-48 truncate px-3 text-xs font-medium text-slate-800">
                        {page.name}
                    </h5>

                    <Separator
                        orientation="vertical"
                        className="h-4 bg-slate-200"
                    />

                    <div className="flex items-center gap-1 px-1.5">
                        <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
                            <Button
                                className={cn(
                                    "size-6 cursor-pointer p-1 text-slate-500 hover:text-slate-900",
                                    viewMode === "design" &&
                                        "bg-white text-slate-900 shadow-sm hover:bg-white",
                                )}
                                size="icon"
                                variant="ghost"
                                aria-label="Design view"
                                onClick={() => setViewMode("design")}
                            >
                                <MonitorIcon className="size-4" />
                            </Button>
                            <Button
                                className={cn(
                                    "size-6 cursor-pointer p-1 text-slate-500 hover:text-slate-900",
                                    viewMode === "code" &&
                                        "bg-white text-slate-900 shadow-sm hover:bg-white",
                                )}
                                size="icon"
                                variant="ghost"
                                aria-label="Code view"
                                onClick={() => setViewMode("code")}
                            >
                                <Code2Icon className="size-4" />
                            </Button>
                        </div>

                        <Separator
                            orientation="vertical"
                            className="h-4 bg-slate-200"
                        />

                        <Button
                            className="size-6 cursor-pointer p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            size="icon"
                            variant="ghost"
                            aria-label="Delete screen"
                            onClick={() => onDeletePage?.(page.id)}
                        >
                            <TrashIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Frame content */}
            <div className="relative w-full overflow-hidden rounded-md bg-white">
                {page.generating ? (
                    <div
                        className="flex w-full animate-pulse flex-col gap-3 bg-slate-100 p-10"
                        style={{ width: size.width, height: size.height }}
                    >
                        <Skeleton className="h-8 w-full bg-slate-200" />
                        <Skeleton className="h-10 w-1/2 bg-slate-200" />
                    </div>
                ) : viewMode === "code" ? (
                    <div
                        className="w-full overflow-hidden"
                        style={{ height: size.height }}
                    >
                        <CodeView code={page?.code ?? ""} />
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        srcDoc={htmlContent}
                        title={page.name}
                        sandbox="allow-scripts"
                        style={{
                            width: "100%",
                            height: `${size.height}px`,
                            border: "none",
                            display: "block",
                            pointerEvents: "none",
                        }}
                    />
                )}
            </div>
        </Rnd>
    );
}
