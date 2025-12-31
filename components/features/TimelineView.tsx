import { format, eachMonthOfInterval, startOfYear, endOfYear, getMonth, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Contract } from "@/types";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
    contracts: Contract[];
}

export function TimelineView({ contracts }: TimelineViewProps) {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));

    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Planning {currentYear}</h2>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header Months */}
                    <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50">
                        {months.map((month) => (
                            <div key={month.toString()} className="px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-0">
                                {format(month, "MMM", { locale: fr })}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100">
                        {contracts.map((contract) => {
                            const start = parseISO(contract.startDate);
                            const end = parseISO(contract.endDate);

                            const startMonth = getMonth(start);
                            const endMonth = getMonth(end);

                            // Simple logic for current year display:
                            // If starts before year, bar starts at 0. If ends after year, bar ends at 11.

                            let colStart = startMonth + 1;
                            let colSpan = (endMonth - startMonth) + 1;

                            // Adjust for multi-year contracts (clipped to current year view)
                            if (start.getFullYear() < currentYear) {
                                colStart = 1;
                                colSpan = end.getFullYear() === currentYear ? endMonth + 1 : 12;
                            } else if (start.getFullYear() > currentYear) {
                                return null; // Don't show future year contracts
                            } else {
                                // Starts in current year
                                if (end.getFullYear() > currentYear) {
                                    colSpan = 12 - startMonth;
                                }
                            }

                            // Color based on client
                            const barColor = contract.client === 'EDF' ? 'bg-orange-400' : 'bg-emerald-500';

                            return (
                                <div key={contract.id} className="grid grid-cols-12 h-14 items-center hover:bg-slate-50 transition-colors relative group">
                                    <div
                                        className={cn(
                                            "mx-1 rounded-md h-8 flex items-center px-3 shadow-sm relative z-10 transition-all hover:scale-[1.01]",
                                            barColor
                                        )}
                                        style={{
                                            gridColumnStart: colStart,
                                            gridColumnEnd: `span ${colSpan}`
                                        }}
                                    >
                                        <span className="text-xs font-bold text-white truncate w-full">
                                            {contract.orderNumber}
                                        </span>
                                    </div>

                                    {/* Grid Lines Overlay */}
                                    <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="border-r border-slate-100 h-full last:border-0"></div>
                                        ))}
                                    </div>

                                    {/* Tooltip on hover */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded-md px-2 py-1 z-20 whitespace-nowrap">
                                        {contract.client} - {format(start, 'dd/MM')} au {format(end, 'dd/MM')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
