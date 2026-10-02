import { Check, CircleAlert, Eye, EyeOff } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function Panel({
    eyebrow,
    title,
    description,
    action,
    footer,
    children,
}: {
    eyebrow?: string;
    title: string;
    description: string;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-black/6 bg-white/70 shadow-xl shadow-black/2 backdrop-blur-2xl dark:border-white/8 dark:bg-white/2 dark:shadow-none">
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/6 px-6 py-6 sm:px-8 dark:border-white/8">
                <div className="min-w-0">
                    {eyebrow && (
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="text-xl font-bold tracking-tight">
                        {title}
                    </h1>

                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>

                {action}
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {children}
            </div>

            {/* Footer */}
            {footer !== null && footer !== undefined && (
                <div className="flex min-h-17.5 shrink-0 items-center justify-between border-t border-black/6 bg-muted/20 px-6 py-3.5 sm:px-8 dark:border-white/8">
                    {footer}
                </div>
            )}
        </section>
    );
}

type Status = {
    type: "success" | "error";
    text: string;
} | null;

export function useStatus() {
    const [status, setStatusState] = React.useState<Status>(null);
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current);
        },
        [],
    );

    const setStatus = React.useCallback((next: Status, clearAfter?: number) => {
        if (timer.current) clearTimeout(timer.current);

        setStatusState(next);

        if (next && clearAfter) {
            timer.current = setTimeout(() => setStatusState(null), clearAfter);
        }
    }, []);

    return [status, setStatus] as const;
}

export function StatusText({ status }: { status: Status }) {
    if (!status) return null;

    return (
        <p
            role="status"
            aria-live="polite"
            className={cn(
                "flex min-w-0 items-center gap-2 text-xs font-medium",
                status.type === "error"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400",
            )}
        >
            {status.type === "success" && <Check className="size-4 shrink-0" />}
            {status.type === "error" && (
                <CircleAlert className="size-4 shrink-0" />
            )}
            <span className="truncate">{status.text}</span>
        </p>
    );
}

export function PasswordField({
    id,
    label,
    value,
    onChange,
    autoComplete,
    invalid,
    hint,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    invalid?: boolean;
    hint?: string;
}) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className="grid gap-2">
            {label && (
                <Label
                    htmlFor={id}
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                    {label}
                </Label>
            )}

            <div className="relative">
                <Input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    autoComplete={autoComplete}
                    aria-invalid={invalid || undefined}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 rounded-xl border-black/8 bg-background/50 pr-10 shadow-none transition-all focus-visible:bg-background focus-visible:ring-2 dark:border-white/10"
                />

                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                >
                    {visible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </button>
            </div>

            {hint && <p className="text-xs text-rose-500">{hint}</p>}
        </div>
    );
}

export function StrengthMeter({
    score,
    label,
}: {
    score: number;
    label: string;
}) {
    const tone =
        score <= 1
            ? "bg-rose-500"
            : score === 2
              ? "bg-amber-500"
              : "bg-emerald-500";

    return (
        <div
            className="flex items-center gap-2.5 pt-1"
            aria-hidden={score === 0}
        >
            <div className="flex flex-1 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full bg-muted/60 transition-colors",
                            i <= score && tone,
                        )}
                    />
                ))}
            </div>

            <span className="w-12 text-right text-[11px] font-medium text-muted-foreground">
                {label}
            </span>
        </div>
    );
}
