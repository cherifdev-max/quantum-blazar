"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, Edit, LayoutList, Calendar, Info } from "lucide-react";
import { MOCK_SST } from "@/lib/data"; // Ideally we fetch SSTs too, but mixing mock sst names is ok-ish or we should pass sst list props
import { Badge } from "@/components/ui/Badge";
import { calculateRAF, ContractStatus, DC4Status, Contract } from "@/types";
import { cn } from "@/lib/utils";
import { TimelineView } from "@/components/features/TimelineView";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteContract } from "@/lib/actions";

export default function ContractsListClient({ initialContracts }: { initialContracts: Contract[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

    // MOCK_SST is static so we can keep it here for looking up names, OR better: pass sst map
    // For now to speed up, using MOCK_SST for names is risky if new SSTs are created?
    // User can likely create new SSTs. So we should really fetch SSTs too.
    // However, the prompt is about fixing the PURCHASE COST display.
    // Let's rely on MOCK_SST for now but acknowledge it's tech debt, OR better:
    // Let's refactor ContractsPage to fetch SSTs too.
    const getSSTName = (id: string) => MOCK_SST.find((s) => s.id === id)?.companyName || "SST Inconnu/Nouveau";

    const getStatusVariant = (status: DC4Status) => {
        switch (status) {
            case "Validé": return "success";
            case "Soumis": return "warning";
            case "Rejeté": return "destructive";
            default: return "secondary";
        }
    };

    const filteredContracts = initialContracts.filter(c =>
        c.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSSTName(c.sstId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center flex-1 w-full space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par commande, sous-traitant..."
                            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtres
                    </button>
                </div>

                <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50">
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", viewMode === 'list' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        <LayoutList className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", viewMode === 'timeline' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        <Calendar className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Commande</th>
                                    <th className="px-6 py-4 font-medium">Client</th>
                                    <th className="px-6 py-4 font-medium">Prestataire (SST)</th>
                                    <th className="px-6 py-4 font-medium">Dates</th>
                                    <th className="px-6 py-4 font-medium text-right">Montant Total</th>
                                    <th className="px-6 py-4 font-medium text-right">Reste à Faire</th>
                                    <th className="px-6 py-4 font-medium text-right">Marge</th>
                                    <th className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            État DC4
                                            <div className="group relative">
                                                <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                                <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 pointer-events-none font-normal">
                                                    Déclaration de Sous-Traitance (Formulaire DC4). Indique le statut de validation du sous-traitant par le client final/public.
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredContracts.map((contract) => {
                                    const raf = calculateRAF(contract);
                                    const rafPercent = (raf / contract.totalAmount) * 100;

                                    return (
                                        <tr key={contract.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {contract.orderNumber}
                                                <div className="text-xs text-slate-500 font-normal truncate max-w-[150px]">{contract.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                                    contract.client === 'EDF' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' : 'bg-green-50 text-green-700 ring-green-600/20'
                                                )}>
                                                    {contract.client}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{getSSTName(contract.sstId)}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                <div className="flex flex-col text-xs">
                                                    <span suppressHydrationWarning>Début: {new Date(contract.startDate).toLocaleDateString('fr-FR')}</span>
                                                    <span suppressHydrationWarning>Fin: {new Date(contract.endDate).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-900">
                                                {contract.totalAmount.toLocaleString("fr-FR")} €
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-bold text-slate-900">{raf.toLocaleString("fr-FR")} €</div>
                                                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                                                    <div
                                                        className={cn("h-1.5 rounded-full", rafPercent < 20 ? "bg-red-500" : "bg-blue-500")}
                                                        style={{ width: `${rafPercent}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {contract.purchasedAmount ? (
                                                    <div>
                                                        <div className="font-bold text-emerald-600">
                                                            {((contract.totalAmount - contract.purchasedAmount) / contract.totalAmount * 100).toFixed(0)}%
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {(contract.totalAmount - contract.purchasedAmount).toLocaleString("fr-FR")} €
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusVariant(contract.dc4Status)}>{contract.dc4Status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/contracts/${contract.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link href={`/contracts/${contract.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <DeleteButton
                                                        onDelete={async () => {
                                                            await deleteContract(contract.id);
                                                        }}
                                                        itemName={`la commande ${contract.orderNumber}`}
                                                        iconOnly
                                                        className="p-2 text-slate-400"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <TimelineView contracts={filteredContracts} />
            )}
        </>
    );
}
