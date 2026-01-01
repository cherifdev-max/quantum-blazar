"use client";

import { useState } from "react";
import { Copy, X, Pencil, Info } from "lucide-react";
import { Deliverable } from "@/types";
import { updateDeliverableData } from "@/lib/actions";

interface EditDeliverableDialogProps {
    deliverable: Deliverable;
}

export default function EditDeliverableDialog({ deliverable }: EditDeliverableDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const type = deliverable.type;
    const data = deliverable.data;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded mr-2"
                title="Modifier les détails"
            >
                <Pencil className="h-4 w-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-bold text-slate-900 mb-4">Modifier Livrable ({type})</h2>

                <form action={async (formData) => {
                    await updateDeliverableData(deliverable.id, formData);
                    setIsOpen(false);
                }} className="space-y-4">

                    {/* Common hidden fields if needed, but here we just update data */}

                    {type === 'BL' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Jours Travaillés / UO
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                        <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10 transition-opacity">
                                            Indiquez le nombre de jours ouvrés prestés dans le mois (ex: 20j) ou le nombre d'Unités d'Oeuvre consommées.
                                        </div>
                                    </div>
                                </label>
                                <input
                                    name="daysWorked"
                                    type="number"
                                    step="0.5"
                                    defaultValue={data?.daysWorked}
                                    placeholder="Ex: 20"
                                    className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-slate-500 italic">
                                    ℹ️ Pour info : 20 jours ≈ 1 ETP mois standard.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description Activité</label>
                                <textarea
                                    name="activityDescription"
                                    rows={3}
                                    defaultValue={data?.activityDescription}
                                    placeholder="Détails de la prestation réalisée..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {type === 'PV' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Validateur Client
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                        <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10">
                                            Nom du responsable client qui valide cette période.
                                        </div>
                                    </div>
                                </label>
                                <input
                                    name="clientValidatorName"
                                    type="text"
                                    defaultValue={data?.clientValidatorName}
                                    placeholder="Nom du responsable (Chef de Projet, PO...)"
                                    className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Réserves éventuelles</label>
                                <textarea
                                    name="reservations"
                                    rows={2}
                                    defaultValue={data?.reservations}
                                    placeholder="Noter ici les réserves s'il y en a..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                            {/* Enable BL fields for PV too, to sync count/activity */}
                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Détails Prestation (Synchro BL)</h3>
                                <div className="space-y-2 mb-2">
                                    <label className="text-xs font-medium text-slate-700">Jours Travaillés</label>
                                    <input
                                        name="daysWorked"
                                        type="number"
                                        step="0.5"
                                        defaultValue={data?.daysWorked}
                                        className="w-full rounded-lg border border-slate-200 h-8 px-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-700">Activité</label>
                                    <textarea
                                        name="activityDescription"
                                        rows={2}
                                        defaultValue={data?.activityDescription}
                                        className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        Enregistrer modifications
                    </button>
                </form>
            </div>
        </div>
    );
}
