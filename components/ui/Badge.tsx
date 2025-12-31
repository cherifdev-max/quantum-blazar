import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "destructive" | "outline" | "secondary";
    className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
    const variants = {
        default: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        warning: "bg-amber-100 text-amber-700 hover:bg-amber-200",
        destructive: "bg-red-100 text-red-700 hover:bg-red-200",
        outline: "border border-slate-200 text-slate-700",
        secondary: "bg-slate-100 text-slate-700",
    };

    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", variants[variant], className)}>
            {children}
        </span>
    );
}
