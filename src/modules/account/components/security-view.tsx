import {
    Panel,
    PasswordField,
    StatusText,
    StrengthMeter,
    useStatus,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { getStrength } from "@/lib/utils";
import { KeyRound, Loader2 } from "lucide-react";
import React from "react";
import { FaGithub } from "react-icons/fa";

export function SecurityView() {
    const [current, setCurrent] = React.useState("");
    const [next, setNext] = React.useState("");
    const [confirm, setConfirm] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [status, setStatus] = useStatus();

    const strength = getStrength(next);
    const mismatch = confirm.length > 0 && next !== confirm;

    const handleSubmit = async () => {
        setStatus(null);

        if (next.length < 8) {
            setStatus({
                type: "error",
                text: "Use At Least 8 Characters For Your New Password.",
            });
            return;
        }

        if (next !== confirm) {
            setStatus({
                type: "error",
                text: "The New Passwords Don't Match.",
            });
            return;
        }

        setSaving(true);

        try {
            const { error } = await authClient.changePassword({
                currentPassword: current,
                newPassword: next,
                revokeOtherSessions: true,
            });

            if (error) {
                setStatus({
                    type: "error",
                    text: error.message || "Couldn't Change Your Password.",
                });
                return;
            }

            setCurrent("");
            setNext("");
            setConfirm("");

            setStatus(
                {
                    type: "success",
                    text: "Password Changed. Other Devices Were Signed Out.",
                },
                4000,
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
            eyebrow="Account protection"
            title="Security & Access"
            description="Update Authentication Methods And Manage Connected Apps."
            footer={
                <>
                    <StatusText status={status} />

                    <Button
                        onClick={handleSubmit}
                        disabled={saving || !current || !next || !confirm}
                        className="ml-auto rounded-xl px-6 shadow-sm"
                    >
                        {saving && (
                            <Loader2 className="size-3.5 animate-spin" />
                        )}
                        {saving ? "Updating..." : "Update Password"}
                    </Button>
                </>
            }
        >
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
                <form
                    className="grid content-start gap-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="grid gap-2.5">
                        <Label
                            htmlFor="current-password"
                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                            Current Password
                        </Label>

                        <PasswordField
                            id="current-password"
                            label=""
                            autoComplete="current-password"
                            value={current}
                            onChange={setCurrent}
                        />
                    </div>

                    <div className="h-px bg-border/40" />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid content-start gap-2.5">
                            <PasswordField
                                id="new-password"
                                label="New password"
                                autoComplete="new-password"
                                value={next}
                                onChange={setNext}
                            />

                            <StrengthMeter
                                score={strength.score}
                                label={strength.label}
                            />
                        </div>

                        <PasswordField
                            id="confirm-password"
                            label="Confirm password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={setConfirm}
                            invalid={mismatch}
                            hint={
                                mismatch ? "Passwords Don't Match." : undefined
                            }
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 px-4 py-3.5 text-blue-900 dark:text-blue-200">
                        <KeyRound className="size-4 shrink-0 text-blue-500" />
                        <p className="text-xs leading-relaxed">
                            Updating Your Password Revokes Active Credentials On
                            All Other Browsers And Mobile Devices.
                        </p>
                    </div>
                </form>

                {/* Connected accounts section */}
                <div className="grid content-start gap-4">
                    <div>
                        <h4 className="text-sm font-semibold">
                            Third-Party Connections
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            External Platforms Linked For Single Sign-On Access.
                        </p>
                    </div>

                    <div className="group flex items-center gap-3.5 rounded-2xl border border-black/6 bg-muted/20 p-4 transition-all hover:bg-muted/40 dark:border-white/8">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-background shadow-xs dark:border-white/10">
                            <FaGithub className="size-5" />
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">GitHub</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Connected For SSO
                            </p>
                        </div>

                        <Badge
                            variant="secondary"
                            className="rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                            Active
                        </Badge>
                    </div>
                </div>
            </div>
        </Panel>
    );
}
