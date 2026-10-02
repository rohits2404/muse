export function MuseBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.55]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, #c9c9c5 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="absolute left-1/2 -top-80 h-162.5 w-212.5 -translate-x-1/2 rounded-full bg-orange-300/20 blur-[130px]" />

            <div className="absolute -bottom-75 -left-50 h-137.5 w-137.5 rounded-full bg-blue-300/10 blur-[140px]" />

            <div className="absolute -right-50 top-[35%] h-125 w-125 rounded-full bg-purple-300/10 blur-[140px]" />
        </div>
    );
}
