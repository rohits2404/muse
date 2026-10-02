import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { CircleUserRound, Laptop2, ShieldCheck } from "lucide-react";
import Link from "next/link";

type AccountPath = "profile" | "security" | "sessions";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

const navigation = [
    {
        id: "profile" as const,
        label: "Profile Settings",
        description: "Manage Personal Details & Public Bio",
        icon: CircleUserRound,
    },
    {
        id: "security" as const,
        label: "Security & Passwords",
        description: "Password Updates & Linked Accounts",
        icon: ShieldCheck,
    },
    {
        id: "sessions" as const,
        label: "Active Sessions",
        description: "Manage Signed-In Devices & Access",
        icon: Laptop2,
    },
];

export function SideNav({ path, user }: { path: AccountPath; user: User }) {
    return (
        <aside className="shrink-0 lg:flex lg:flex-col lg:justify-between lg:gap-6">
            <div className="space-y-4">
                <div className="hidden px-3 lg:block">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Settings Menu
                    </p>
                </div>

                <nav
                    aria-label="Account"
                    className="flex gap-1.5 overflow-x-auto rounded-2xl border border-black/6 bg-white/60 p-1.5 shadow-sm backdrop-blur-md dark:border-white/8 dark:bg-white/2 lg:flex-col lg:overflow-visible"
                >
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = path === item.id;

                        return (
                            <Link
                                key={item.id}
                                href={`/account/${item.id}`}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "group relative flex min-w-fit flex-1 items-center gap-3.5 rounded-xl px-3.5 py-3 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring lg:flex-none",
                                    active
                                        ? "bg-foreground text-background shadow-md shadow-foreground/5"
                                        : "text-muted-foreground hover:bg-black/4 hover:text-foreground dark:hover:bg-white/5",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                                        active
                                            ? "bg-background/20 text-background"
                                            : "bg-black/4 group-hover:bg-black/6 dark:bg-white/6 dark:group-hover:bg-white/10",
                                    )}
                                >
                                    <Icon className="size-4" />
                                </span>

                                <span className="min-w-0 text-left">
                                    <span className="block text-sm font-semibold leading-none">
                                        {item.label}
                                    </span>

                                    <span
                                        className={cn(
                                            "mt-1.5 hidden text-[11px] leading-none lg:block",
                                            active
                                                ? "text-background/70"
                                                : "text-muted-foreground/70",
                                        )}
                                    >
                                        {item.description}
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Identity Card */}
            <div className="hidden rounded-2xl border border-black/6 bg-linear-to-b from-white/80 to-white/40 p-4 shadow-sm backdrop-blur-md dark:border-white/8 dark:from-white/4 dark:to-white/1 lg:block">
                <div className="flex items-center gap-3.5">
                    <UserAvatar user={user} className="size-10 shadow-sm" />

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                            {user.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
