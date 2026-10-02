import { Panel, StatusText } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { cn, getDevice, timeAgo } from "@/lib/utils";
import { Laptop2, Loader2, Smartphone, UserCheck } from "lucide-react";
import React from "react";

type SessionItem = {
    id: string;
    token: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export function SessionsView() {
    const { data: current } = authClient.useSession();
    const currentToken = current?.session?.token;

    const [sessions, setSessions] = React.useState<SessionItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [busy, setBusy] = React.useState<string | null>(null);
    const [error, setError] = React.useState("");

    const load = React.useCallback(async () => {
        try {
            const { data, error } = await authClient.listSessions();

            if (error) {
                setError(error.message || "Couldn't Load Your Sessions.");
                return;
            }

            setError("");
            setSessions((data ?? []) as SessionItem[]);
        } catch {
            setError("Couldn't Load Your Sessions.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load();
    }, [load]);

    const revoke = async (token: string) => {
        setBusy(token);

        const { error } = await authClient.revokeSession({ token });

        if (error) {
            setError(error.message || "Couldn't Sign Out That Device.");
        } else {
            await load();
        }

        setBusy(null);
    };

    const revokeOthers = async () => {
        setBusy("others");

        const { error } = await authClient.revokeOtherSessions();

        if (error) {
            setError(error.message || "Couldn't Sign Out Other Devices.");
        } else {
            await load();
        }

        setBusy(null);
    };

    const sorted = React.useMemo(
        () =>
            [...sessions].sort(
                (a, b) =>
                    Number(b.token === currentToken) -
                    Number(a.token === currentToken),
            ),
        [sessions, currentToken],
    );

    return (
        <Panel
            eyebrow="Device management"
            title="Active Sessions"
            description={
                loading
                    ? "Devices Currently Authenticated With Your Account."
                    : `Manage ${sessions.length} Active ${
                          sessions.length === 1 ? "Session" : "Sessions"
                      } Across Your Devices.`
            }

            action={
                sessions.length > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={revokeOthers}
                        disabled={busy !== null}
                        className="rounded-xl border-black/10 dark:border-white/10"
                    >
                        {busy === "others" && (
                            <Loader2 className="size-3.5 animate-spin" />
                        )}
                        Sign Out All Other Devices
                    </Button>
                )
            }
            footer={
                error ? (
                    <StatusText
                        status={{
                            type: "error",
                            text: error,
                        }}
                    />
                ) : null
            }
        >
            {loading ? (
                <div className="grid gap-3">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-muted/10 text-center dark:border-white/10">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-muted/40">
                        <Laptop2 className="size-6 text-muted-foreground" />
                    </span>

                    <p className="mt-3 text-sm font-semibold">
                        No Active Sessions
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        No Other Active Logins Found.
                    </p>
                </div>
            ) : (
                <ul className="grid gap-3">
                    {sorted.map((s) => {
                        const device = getDevice(s.userAgent);
                        const Icon = device.mobile ? Smartphone : Laptop2;
                        const isCurrent = s.token === currentToken;

                        return (
                            <li
                                key={s.id ?? s.token}
                                className={cn(
                                    "group flex items-center gap-4 rounded-2xl border p-4 transition-all",
                                    isCurrent
                                        ? "border-primary/20 bg-primary/3 shadow-xs"
                                        : "border-black/6 bg-background hover:border-black/12 dark:border-white/8",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                                        isCurrent
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    <Icon className="size-5" />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate text-sm font-semibold">
                                            {device.name}
                                        </p>

                                        {isCurrent && (
                                            <Badge className="h-5 gap-1 rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold text-primary hover:bg-primary/10">
                                                <UserCheck className="size-3" />
                                                This Device
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {s.ipAddress || "Unknown IP"} · Active{" "}
                                        {timeAgo(s.updatedAt)}
                                    </p>
                                </div>

                                {!isCurrent && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => revoke(s.token)}
                                        disabled={busy !== null}
                                        className="rounded-xl text-xs text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
                                    >
                                        {busy === s.token ? (
                                            <Loader2 className="size-3.5 animate-spin" />
                                        ) : (
                                            "Revoke"
                                        )}
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </Panel>
    );
}
