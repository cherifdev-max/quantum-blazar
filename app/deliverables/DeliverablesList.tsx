"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, Printer, Filter, Upload, XCircle, RefreshCw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DeliverableStatus, Contract, Deliverable } from "@/types";
import { cn } from "@/lib/utils";
import { updateDeliverableStatus, deleteDeliverable } from "@/lib/actions";
import DeleteButton from "@/components/ui/DeleteButton";
import EditDeliverableDialog from "./EditDeliverableDialog";

interface DeliverablesListProps {
    initialDeliverables: any[]; // relaxed type for now
    contracts: Contract[];
}

export default function DeliverablesList({ initialDeliverables, contracts }: DeliverablesListProps) {
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // Current month YYYY-MM
    const [filterStatus, setFilterStatus] = useState("all");

    async function handleUpdateStatus(id: string, newStatus: string) {
        await updateDeliverableStatus(id, newStatus);
    }

    const getContract = (id: string) => contracts.find(c => c.id === id);

    const getStatusIcon = (status: DeliverableStatus) => {
        switch (status) {
            case "Validé": return CheckCircle;
            case "Soumis": return Clock;
            case "Rejeté": return AlertCircle;
            default: return Clock;
        }
    };

    const getStatusColor = (status: DeliverableStatus) => {
        switch (status) {
            case "Validé": return "text-emerald-500";
            case "Soumis": return "text-amber-500";
            case "Rejeté": return "text-red-500";
            default: return "text-slate-400";
        }
    };

    const filteredDeliverables = initialDeliverables.filter(d => {
        if (filterStatus !== 'all' && d.status !== filterStatus) return false;
        if (d.month !== filterMonth) return false;
        return true;
    });

    return (
        <>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Filter className="h-4 w-4" />
                    Période :
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </label>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                <div className="flex bg-slate-50 p-1 rounded-lg">
                    {["all", "En attente", "Soumis", "Validé"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                filterStatus === status ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {status === 'all' ? 'Tous' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDeliverables.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Aucun livrable généré pour {filterMonth}. <br />
                        <span className="text-sm">Cliquez sur "Générer les Livrables" pour initialiser le mois.</span>
                    </div>
                ) : (
                    filteredDeliverables.map((item) => {
                        const contract = getContract(item.contractId);
                        const Icon = getStatusIcon(item.status);
                        const statusColor = getStatusColor(item.status);

                        return (
                            <div key={item.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                                            item.type === 'PV' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            {item.type}
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">{contract?.orderNumber || 'Contrat Inconnu'}</h3>
                                            <p className="text-xs text-slate-500">{contract?.client}</p>
                                        </div>
                                    </div>
                                    <Badge variant={item.status === 'Validé' ? 'success' : item.status === 'Soumis' ? 'warning' : 'secondary'}>
                                        {item.status}
                                    </Badge>
                                </div>

                                <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
                                    <p className="line-clamp-2">{contract?.description}</p>

                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">
                                            {item.type} - {item.month}
                                        </span>
                                        {item.data?.daysWorked && item.type === 'BL' && (
                                            <span className="text-xs text-slate-500">
                                                {item.data.daysWorked} Jours déclarés
                                            </span>
                                        )}
                                        {item.data?.clientValidatorName && item.type === 'PV' && (
                                            <span className="text-xs text-slate-500">
                                                Validé par : {item.data.clientValidatorName}
                                            </span>
                                        )}
                                        {item.data?.reservations && (
                                            <span className="text-xs text-amber-600 font-medium">
                                                ⚠ Réserves notées
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-end mb-2">
                                        <EditDeliverableDialog deliverable={item} />
                                        <DeleteButton
                                            onDelete={async () => {
                                                await deleteDeliverable(item.id);
                                            }}
                                            itemName={`${item.type} of ${contract?.orderNumber}`}
                                            iconOnly
                                            className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded"
                                        />
                                    </div>

                                    {/* Workflow Actions */}
                                    <div className="flex gap-2">
                                        {item.status === 'En attente' && (
                                            <>
                                                <input
                                                    type="file"
                                                    id={`file-upload-${item.id}`}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            handleUpdateStatus(item.id, 'Soumis');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors flex items-center shadow-sm"
                                                >
                                                    <Upload className="h-3 w-3 mr-1" />
                                                    Déposer
                                                </button>
                                            </>
                                        )}
                                        {item.status === 'Soumis' && (
                                            <>
                                                {item.fileUrl && (
                                                    <a
                                                        href={item.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded transition-colors flex items-center shadow-sm border border-slate-200"
                                                        title="Voir le document"
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Voir
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'Validé')}
                                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded transition-colors flex items-center shadow-sm"
                                                    title="Valider"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'Rejeté')}
                                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded transition-colors flex items-center shadow-sm"
                                                    title="Rejeter"
                                                >
                                                    <XCircle className="h-3 w-3" />
                                                </button>
                                            </>
                                        )}
                                        {item.status === 'Rejeté' && (
                                            <>
                                                <input
                                                    type="file"
                                                    id={`file-reupload-${item.id}`}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            handleUpdateStatus(item.id, 'Soumis');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => document.getElementById(`file-reupload-${item.id}`)?.click()}
                                                    className="text-xs bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors flex items-center shadow-sm"
                                                >
                                                    <RefreshCw className="h-3 w-3 mr-1" />
                                                    Re-soumettre
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Icon className={cn("h-4 w-4 mr-1.5", statusColor)} />
                                        {item.status === 'Validé' ? 'Validé' : 'En attente'}
                                    </div>

                                    <Link
                                        href={`/documents/preview/${item.id}?type=${item.type}`}
                                        className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Printer className="h-3.5 w-3.5 mr-1.5" />
                                        Générer PDF
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
