import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

export function UserAvatar({
    user,
    className,
}: {
    user: User;
    className?: string;
}) {
    const initials =
        user.name
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "M";

    return (
        <Avatar className={cn("rounded-2xl", className)}>
            {user.image && <AvatarImage src={user.image} alt={user.name} />}

            <AvatarFallback className="rounded-2xl bg-foreground font-bold text-background">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
