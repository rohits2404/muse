export { cn } from "cn";

export function getDiceBearAvatar(email: string) {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
        email.trim().toLowerCase(),
    )}`;
}

export function getStrength(password: string) {
    if (!password) return { score: 0, label: "" };

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

    const clamped = Math.max(1, score);

    return {
        score: clamped,
        label: ["", "Weak", "Fair", "Good", "Strong"][clamped],
    };
}

export function getDevice(userAgent?: string | null) {
    if (!userAgent) {
        return {
            name: "Unknown device",
            mobile: false,
        };
    }

    const os = /iPhone/i.test(userAgent)
        ? "iPhone"
        : /iPad/i.test(userAgent)
          ? "iPad"
          : /Android/i.test(userAgent)
            ? "Android"
            : /Windows/i.test(userAgent)
              ? "Windows"
              : /Macintosh|Mac OS/i.test(userAgent)
                ? "Mac"
                : /Linux/i.test(userAgent)
                  ? "Linux"
                  : null;

    const browser = /Edg\//i.test(userAgent)
        ? "Edge"
        : /OPR\//i.test(userAgent)
          ? "Opera"
          : /Firefox\//i.test(userAgent)
            ? "Firefox"
            : /Chrome\//i.test(userAgent)
              ? "Chrome"
              : /Safari\//i.test(userAgent)
                ? "Safari"
                : null;

    const name =
        browser && os
            ? `${browser} on ${os}`
            : os || browser || "Unknown device";
    const mobile = /iPhone|iPad|Android/i.test(userAgent);

    return { name, mobile };
}

export function timeAgo(date: Date | string) {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
