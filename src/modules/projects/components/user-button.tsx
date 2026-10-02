"use client";

import { Menu } from "@base-ui/react/menu";
import {
    Check,
    ChevronDown,
    LogOut,
    Monitor,
    Settings,
    Shield,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function UserMenu() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm">
                <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-200" />
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    const user = session.user;

    const name = user.name || "User";
    const email = user.email || "";
    const initial = name.charAt(0).toUpperCase();

    const handleSignOut = async () => {
        await authClient.signOut();

        router.replace("/");
        router.refresh();
    };

    return (
        <Menu.Root>
            <Menu.Trigger
                className="
          group flex h-10 items-center gap-2 rounded-xl
          border border-zinc-200/80
          bg-white/80
          px-1.5 pr-2
          shadow-sm
          backdrop-blur-xl
          transition-all
          hover:border-zinc-300
          hover:bg-white
          hover:shadow-md
          focus:outline-none
          data-popup-open:border-zinc-300
          data-popup-open:shadow-md
        "
            >
                {/* Avatar */}
                <div
                    className="
            relative flex h-7 w-7 shrink-0 items-center
            justify-center overflow-hidden rounded-lg
            bg-linear-to-br from-orange-400 via-orange-500 to-amber-600
            text-[11px] font-bold text-white
            shadow-sm
          "
                >
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        initial
                    )}

                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                {/* Name */}
                <div className="hidden min-w-0 text-left sm:block">
                    <p className="max-w-28 truncate text-xs font-semibold text-zinc-800">
                        {name}
                    </p>
                    <p className="max-w-28 truncate text-[10px] text-zinc-400">
                        {email}
                    </p>
                </div>

                <ChevronDown
                    className="
            h-3.5 w-3.5
            text-zinc-400
            transition-transform
            group-data-popup-open:rotate-180
          "
                />
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="z-50"
                >
                    <Menu.Popup
                        className="
              w-64
              overflow-hidden
              rounded-2xl
              border border-zinc-200/80
              bg-white/95
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
              backdrop-blur-xl
              outline-none

              data-starting-style:translate-y-1
              data-starting-style:opacity-0
              data-ending-style:translate-y-1
              data-ending-style:opacity-0

              transition-all
              duration-150
            "
                    >
                        {/* Profile header */}
                        <div className="mb-1 rounded-xl bg-zinc-50 p-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                    flex h-10 w-10 shrink-0 items-center
                    justify-center overflow-hidden rounded-xl
                    bg-linear-to-br from-orange-400 via-orange-500 to-amber-600
                    text-sm font-bold text-white
                    shadow-sm
                  "
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        initial
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-zinc-900">
                                        {name}
                                    </p>

                                    <p className="truncate text-[11px] text-zinc-400">
                                        {email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account */}
                        <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Account
                        </div>

                        <Menu.Item
                            onClick={() => router.push("/account/profile")}
                            className={menuItemClass}
                        >
                            <span className={iconClass}>
                                <User className="h-3.5 w-3.5" />
                            </span>

                            <span className="flex-1">
                                <span className="block text-xs font-medium text-zinc-800">
                                    Profile
                                </span>

                                <span className="block text-[10px] text-zinc-400">
                                    Manage your account
                                </span>
                            </span>
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => router.push("/account/settings")}
                            className={menuItemClass}
                        >
                            <span className={iconClass}>
                                <Settings className="h-3.5 w-3.5" />
                            </span>

                            <span className="flex-1">
                                <span className="block text-xs font-medium text-zinc-800">
                                    Settings
                                </span>

                                <span className="block text-[10px] text-zinc-400">
                                    Preferences & configuration
                                </span>
                            </span>
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => router.push("/account/security")}
                            className={menuItemClass}
                        >
                            <span className={iconClass}>
                                <Shield className="h-3.5 w-3.5" />
                            </span>

                            <span className="flex-1">
                                <span className="block text-xs font-medium text-zinc-800">
                                    Security
                                </span>

                                <span className="block text-[10px] text-zinc-400">
                                    Password & security
                                </span>
                            </span>
                        </Menu.Item>

                        <Menu.Separator className="my-1.5 h-px bg-zinc-100" />

                        {/* Workspace */}
                        <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Workspace
                        </div>

                        <Menu.Item
                            onClick={() => router.push("/")}
                            className={menuItemClass}
                        >
                            <span className={iconClass}>
                                <Monitor className="h-3.5 w-3.5" />
                            </span>

                            <span className="flex-1">
                                <span className="block text-xs font-medium text-zinc-800">
                                    Workspace
                                </span>

                                <span className="block text-[10px] text-zinc-400">
                                    Back to your projects
                                </span>
                            </span>

                            <Check className="h-3 w-3 text-zinc-300" />
                        </Menu.Item>

                        <Menu.Separator className="my-1.5 h-px bg-zinc-100" />

                        {/* Sign out */}
                        <Menu.Item
                            onClick={handleSignOut}
                            className="
                group flex w-full cursor-pointer items-center gap-3
                rounded-xl px-2.5 py-2
                outline-none
                transition-colors

                hover:bg-red-50
                data-highlighted:bg-red-50
              "
                        >
                            <span
                                className="
                  flex h-8 w-8 shrink-0 items-center
                  justify-center rounded-lg
                  bg-red-50
                  text-red-500
                  transition-colors
                  group-hover:bg-red-100
                "
                            >
                                <LogOut className="h-3.5 w-3.5" />
                            </span>

                            <span>
                                <span className="block text-xs font-medium text-red-600">
                                    Sign out
                                </span>

                                <span className="block text-[10px] text-red-400">
                                    End your current session
                                </span>
                            </span>
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

const menuItemClass = `
  group flex w-full cursor-pointer items-center gap-3
  rounded-xl px-2.5 py-2
  outline-none
  transition-colors

  hover:bg-zinc-50
  data-[highlighted]:bg-zinc-50
`;

const iconClass = `
  flex h-8 w-8 shrink-0
  items-center justify-center
  rounded-lg
  border border-zinc-200/80
  bg-white
  text-zinc-500
  shadow-sm
  transition-all

  group-hover:border-zinc-200
  group-hover:bg-white
  group-hover:text-zinc-900
`;
