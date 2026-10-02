"use client";

import { ArrowUp, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

interface ChatBarProps {
    projectId: string;
    suggestions?: string[];
    onSubmit?: (prompt: string) => void;
    tip?: string;
}

export function ChatBar({
    projectId,
    suggestions = [],
    onSubmit,
    tip,
}: ChatBarProps) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const hasPrompt = prompt.trim().length > 0;

    const resize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    };

    const handleSubmit = async (text = prompt) => {
        const trimmed = text.trim();

        if (!trimmed || isLoading) return;

        try {
            setIsLoading(true);

            onSubmit?.(trimmed);

            const response = await fetch(`/api/projects/${projectId}/page`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: trimmed }),
            });

            if (!response.ok) {
                throw new Error("Failed to send prompt");
            }

            setPrompt("");

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (error) {
            console.error("ChatBar error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
            return;
        }

        if (event.key === "Escape") {
            setPrompt("");
            textareaRef.current?.blur();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(event.target.value);
        resize(event.target);
    };

    const handleSuggestion = (suggestion: string) => {
        setPrompt(suggestion);

        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                resize(textareaRef.current);
            }
        });
    };

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6 sm:px-4">
            <div className="pointer-events-auto flex w-full max-w-170 flex-col items-center gap-2.5">
                {/* Tip */}
                {tip && (
                    <div className="flex max-w-[92%] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        <p className="truncate text-xs text-slate-600">
                            {tip.replace(/^Tip:\s*/i, "")}
                        </p>
                    </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && !isLoading && (
                    <div className="flex max-w-full items-center gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
                        {suggestions.slice(0, 4).map((suggestion, index) => (
                            <button
                                key={`${suggestion}-${index}`}
                                type="button"
                                onClick={() => handleSuggestion(suggestion)}
                                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <span className="block max-w-55 truncate">
                                    {suggestion}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Composer */}
                <div
                    className={`relative w-full overflow-hidden rounded-xl border bg-white shadow-lg shadow-slate-900/5 transition-colors ${
                        hasPrompt
                            ? "border-indigo-300 ring-4 ring-indigo-500/10"
                            : "border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10"
                    }`}
                >
                    <div className="flex gap-3 px-4 pt-3.5">
                        <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                                hasPrompt || isLoading
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-400"
                            }`}
                        >
                            {isLoading ? (
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                            )}
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            rows={1}
                            placeholder={
                                isLoading
                                    ? "Muse Is Working..."
                                    : "Ask Muse To Change Anything..."
                            }
                            className="max-h-37.5 min-h-8 flex-1 resize-none overflow-y-auto bg-transparent py-1 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ scrollbarWidth: "none" }}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 pb-3 pt-2">
                        <p className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] text-slate-500">
                                Enter
                            </kbd>
                            To Send
                            <span className="mx-1 text-slate-300">|</span>
                            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] text-slate-500">
                                Shift + Enter
                            </kbd>
                            For a New Line
                        </p>

                        <p className="text-xs text-slate-400 sm:hidden">
                            Describe Your Next Change
                        </p>

                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={!hasPrompt || isLoading}
                            aria-label="Send prompt"
                            className={`ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                hasPrompt && !isLoading
                                    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                                    : "cursor-not-allowed bg-slate-100 text-slate-300"
                            }`}
                        >
                            {isLoading ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowUp className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-indigo-100">
                            <div className="h-full w-1/3 animate-[chat-progress_1.4s_ease-in-out_infinite] rounded-full bg-indigo-600" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
