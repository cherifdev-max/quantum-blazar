import Link from "next/link";
import { LucideIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
    className?: string;
    href?: string;
    tooltip?: string;
}

export function KPICard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    description,
    className,
    href,
    tooltip,
}: KPICardProps) {
    const cardContent = (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        {tooltip && (
                            <div className="group relative">
                                <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 pointer-events-none">
                                    {tooltip}
                                </div>
                            </div>
                        )}
                    </div>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                </div>
            </div>
            {(trend || description) && (
                <div className="mt-4 flex items-center text-sm">
                    {trend && (
                        <span
                            className={cn(
                                "font-medium mr-2",
                                trendUp ? "text-emerald-600" : "text-red-600"
                            )}
                        >
                            {trend}
                        </span>
                    )}
                    {description && <span className="text-slate-400">{description}</span>}
                </div>
            )}
        </>
    );

    const containerClasses = cn(
        "rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md block",
        href && "hover:bg-slate-50/50 cursor-pointer hover:border-blue-200",
        className
    );

    if (href) {
        return (
            <Link href={href} className={containerClasses}>
                {cardContent}
            </Link>
        );
    }

    return (
        <div className={containerClasses}>
            {cardContent}
        </div>
    );
}
