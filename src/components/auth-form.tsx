"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FaGithub, FaGoogle } from "react-icons/fa";

type AuthMode = "sign-in" | "sign-up";
type SocialProvider = "github" | "google";

interface AuthFormProps {
    initialMode?: AuthMode;
}

const inputClass =
    "h-10 rounded-xl border-zinc-200 bg-white px-3.5 shadow-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10";

const socialClass =
    "h-10 rounded-xl border-zinc-200 bg-white font-medium shadow-none transition-all hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-sm";

export function AuthForm({ initialMode = "sign-in" }: AuthFormProps) {
    const router = useRouter();

    const [mode, setMode] = useState<AuthMode>(initialMode);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
        null,
    );

    const [error, setError] = useState("");

    const isSignUp = mode === "sign-up";

    const switchMode = (nextMode: AuthMode) => {
        setError("");
        setMode(nextMode);

        router.replace(`/auth/${nextMode}`, {
            scroll: false,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isLoading) return;

        setError("");

        if (isSignUp && password.length < 8) {
            setError("Your Password Must Contain At Least 8 Characters.");
            return;
        }

        setIsLoading(true);

        try {
            if (isSignUp) {
                const { error } = await authClient.signUp.email({
                    name,
                    email,
                    password,
                    callbackURL: "/dashboard",
                });

                if (error) {
                    setError(error.message || "Unable To Create Your Account.");
                    return;
                }
            } else {
                const { error } = await authClient.signIn.email({
                    email,
                    password,
                    rememberMe: true,
                    callbackURL: "/dashboard",
                });

                if (error) {
                    setError(error.message || "Invalid Email Or Password.");
                    return;
                }
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Something Went Wrong. Please Try Again In a Moment.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocial = async (provider: SocialProvider) => {
        if (socialLoading) return;

        setError("");
        setSocialLoading(provider);

        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/dashboard",
            });
        } catch {
            setError(
                `Unable To Continue With ${provider === "github" ? "GitHub" : "Google"}.`,
            );
            setSocialLoading(null);
        }
    };

    const busy = isLoading || socialLoading !== null;

    return (
        <div className="w-full max-w-107.5">
            {/* Brand */}
            <div className="mb-5 flex flex-col items-center text-center">
                <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] border border-zinc-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
                    <Sparkles className="h-5 w-5 text-orange-500" />

                    <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-orange-400 ring-4 ring-[#f8f8f6]" />
                </div>

                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                    {isSignUp ? "Create Your Space" : "Welcome Back"}
                </h1>

                <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                    {isSignUp
                        ? "Start Turning Your Ideas Into Beautiful Interfaces With Muse."
                        : "Continue Creating, Exploring, And Shaping Your Ideas With Muse."}
                </p>
            </div>

            {/* Main auth card */}
            <div className="rounded-[28px] border border-zinc-200/80 bg-white/90 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                <div className="rounded-[22px] border border-zinc-100 bg-[#fafaf9] p-5">
                    {/* Mode switch */}
                    <div className="mb-5 grid grid-cols-2 rounded-xl border border-zinc-200 bg-zinc-100/70 p-1">
                        <button
                            type="button"
                            onClick={() => switchMode("sign-in")}
                            className={`h-9 rounded-lg text-sm font-medium transition-all ${
                                !isSignUp
                                    ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200/70"
                                    : "text-zinc-500 hover:text-zinc-800"
                            }`}
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            onClick={() => switchMode("sign-up")}
                            className={`h-9 rounded-lg text-sm font-medium transition-all ${
                                isSignUp
                                    ? "bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200/70"
                                    : "text-zinc-500 hover:text-zinc-800"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FieldGroup className="gap-4">
                            {isSignUp && (
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="What Should We Call You?"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        disabled={isLoading}
                                        className={inputClass}
                                        required
                                    />
                                </Field>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>

                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    disabled={isLoading}
                                    className={inputClass}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>

                                    {!isSignUp && (
                                        <button
                                            type="button"
                                            className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-900"
                                            onClick={() => {
                                                // Add your password-reset route here later.
                                                router.push(
                                                    "/auth/forgot-password",
                                                );
                                            }}
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete={
                                            isSignUp
                                                ? "new-password"
                                                : "current-password"
                                        }
                                        placeholder={
                                            isSignUp
                                                ? "At Least 8 Characters"
                                                : "Enter Your Password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        disabled={isLoading}
                                        className={`${inputClass} pr-11`}
                                        minLength={8}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) => !current,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {isSignUp && (
                                    <FieldDescription className="text-[11px]">
                                        Use At Least 8 Characters To Keep Your
                                        Account Secure.
                                    </FieldDescription>
                                )}
                            </Field>

                            {error && (
                                <FieldError className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs">
                                    {error}
                                </FieldError>
                            )}

                            <Button
                                type="submit"
                                disabled={busy}
                                className="group h-10 w-full rounded-xl bg-zinc-950 text-sm font-medium text-white shadow-[0_8px_25px_rgba(0,0,0,0.14)] transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {isSignUp
                                            ? "Creating Your Space..."
                                            : "Signing You In..."}
                                    </>
                                ) : (
                                    <>
                                        {isSignUp
                                            ? "Create Your Account"
                                            : "Continue"}

                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>

                    {/* Divider */}
                    <div className="my-4 flex items-center gap-3">
                        <Separator className="flex-1" />

                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                            Or
                        </span>

                        <Separator className="flex-1" />
                    </div>

                    {/* Social buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={busy}
                            onClick={() => handleSocial("github")}
                            className={socialClass}
                        >
                            {socialLoading === "github" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FaGithub className="h-4 w-4" />
                            )}
                            GitHub
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={busy}
                            onClick={() => handleSocial("google")}
                            className={socialClass}
                        >
                            {socialLoading === "google" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FaGoogle className="h-4 w-4" />
                            )}
                            Google
                        </Button>
                    </div>

                    {/* Footer */}
                    <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
                        {isSignUp ? (
                            <>
                                Already Have an Account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("sign-in")}
                                    className="font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                New to Muse?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("sign-up")}
                                    className="font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950"
                                >
                                    Create An Account
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>

            <p className="mt-4 text-center text-[10px] leading-5 text-zinc-400">
                By Continuing, You Agree To Muse&apos;s Terms And Acknowledge
                Its Privacy Policy.
            </p>
        </div>
    );
}
