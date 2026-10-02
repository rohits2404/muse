"use client";

import { highlightCode } from "@/lib/highlight";
import { useEffect, useState } from "react";

interface CodeViewProps {
    code: string;
}

export function CodeView({ code }: CodeViewProps) {
    const [html, setHtml] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const getCodeHighlight = async () => {
            setIsLoading(true);

            try {
                const result = await highlightCode(code);

                if (!cancelled) {
                    setHtml(result);
                }
            } catch (error) {
                console.error("Failed to highlight code:", error);

                if (!cancelled) {
                    setHtml("");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        getCodeHighlight();

        return () => {
            cancelled = true;
        };
    }, [code]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#0d1117]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
                    <span className="font-mono text-xs text-slate-500">
                        Loading code...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="h-full w-full overflow-auto bg-[#0d1117] text-sm [&>pre]:min-h-full [&>pre]:p-6 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
