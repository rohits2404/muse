import { Panel, StatusText, useStatus } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import React from "react";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

export function ProfileView({ user }: { user: User }) {
    const [name, setName] = React.useState(user.name);
    const [savedName, setSavedName] = React.useState(user.name);
    const [saving, setSaving] = React.useState(false);
    const [status, setStatus] = useStatus();

    const trimmed = name.trim();
    const dirty = trimmed.length > 0 && trimmed !== savedName;

    const handleSave = async () => {
        if (!dirty) return;

        setSaving(true);
        setStatus(null);

        try {
            const { error } = await authClient.updateUser({
                name: trimmed,
            });

            if (error) {
                setStatus({
                    type: "error",
                    text: error.message || "Couldn't Update Your Profile.",
                });
                return;
            }

            setSavedName(trimmed);
            setName(trimmed);

            setStatus(
                {
                    type: "success",
                    text: "Profile Updated Successfully.",
                },
                3000,
            );
        } catch {
            setStatus({
                type: "error",
                text: "Something Went Wrong. Try Again.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Panel
            eyebrow="Personal details"
            title="Public Profile"
            description="Manage How Your Identity Is Displayed To Teammates."
            footer={
                <>
                    <StatusText status={status} />

                    <Button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className="ml-auto rounded-xl px-6 shadow-sm transition-all"
                    >
                        {saving && (
                            <Loader2 className="size-3.5 animate-spin" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </>
            }
        >
            <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
                {/* Profile Card Highlight */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/6 bg-linear-to-b from-muted/50 via-muted/20 to-transparent p-6 text-center dark:border-white/8">
                    <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/10 blur-2xl" />

                    <div className="relative flex flex-col items-center">
                        <UserAvatar
                            user={user}
                            className="size-24 text-2xl shadow-xl ring-4 ring-background"
                        />

                        <h3 className="mt-4 truncate font-bold tracking-tight text-foreground">
                            {savedName}
                        </h3>

                        <p className="mt-0.5 max-w-45 truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>

                        <Badge
                            variant="outline"
                            className="mt-4 gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Verified Profile
                        </Badge>
                    </div>
                </div>

                {/* Fields */}
                <form
                    className="grid content-start gap-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <div className="grid gap-2.5">
                        <Label
                            htmlFor="name"
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            Display Name
                        </Label>

                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            autoComplete="name"
                            maxLength={60}
                            className="h-11 rounded-xl border-black/8 bg-background/50 shadow-none transition-all focus-visible:bg-background focus-visible:ring-2 dark:border-white/10"
                        />

                        <p className="text-xs text-muted-foreground">
                            Your Name Appears Across Workspace Projects And
                            Comments.
                        </p>
                    </div>

                    <div className="h-px bg-border/40" />

                    <div className="grid gap-2.5">
                        <Label
                            htmlFor="email"
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            Email Address
                        </Label>

                        <Input
                            id="email"
                            value={user.email}
                            disabled
                            readOnly
                            className="h-11 rounded-xl border-black/6 bg-muted/40 shadow-none dark:border-white/8"
                        />

                        <p className="text-xs text-muted-foreground">
                            Your Primary Email Address Is Managed Via Your SSO
                            Provider.
                        </p>
                    </div>
                </form>
            </div>
        </Panel>
    );
}
