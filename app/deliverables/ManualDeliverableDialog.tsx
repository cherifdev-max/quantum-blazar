"use client";

import { useState } from "react";
import { Plus, X, Info } from "lucide-react";
import { Contract } from "@/types";
import { createManualDeliverable } from "@/lib/actions";

interface ManualDeliverableDialogProps {
    contracts: Contract[];
}

export default function ManualDeliverableDialog({ contracts }: ManualDeliverableDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'BL' | 'PV'>('BL');

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Manuel
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-lg font-bold text-slate-900 mb-4">Ajout Manuel de Livrable</h2>

                <form action={async (formData) => {
                    await createManualDeliverable(formData);
                    setIsOpen(false);
                }} className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Contrat concerné</label>
                        <select name="contractId" required className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="">Sélectionner un contrat...</option>
                            {contracts.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.orderNumber} - {c.client}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mois</label>
                            <input
                                name="month"
                                type="month"
                                required
                                min={new Date().toISOString().slice(0, 7)}
                                defaultValue={new Date().toISOString().slice(0, 7)}
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Type</label>
                            <select
                                name="type"
                                required
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={type}
                                onChange={(e) => setType(e.target.value as 'BL' | 'PV')}
                            >
                                <option value="BL">BL (Livraison / CRA)</option>
                                <option value="PV">PV (Validation / Recette)</option>
                            </select>
                        </div>
                    </div>

                    {type === 'BL' && (
                        <div className="space-y-4 border-t pt-4 border-slate-100">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Jours Travaillés / UO
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                        <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10">
                                            Indiquez le nombre de jours ouvrés prestés dans le mois (ex: 20j) ou le nombre d'Unités d'Oeuvre consommées sur le contrat.
                                        </div>
                                    </div>
                                </label>
                                <input
                                    name="daysWorked"
                                    type="number"
                                    step="0.5"
                                    placeholder="Ex: 20"
                                    className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-slate-500 italic">
                                    💡 Moyenne standard : 21.67 jours/mois.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description Activité</label>
                                <textarea
                                    name="activityDescription"
                                    rows={3}
                                    placeholder="Détails de la prestation réalisée..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {type === 'PV' && (
                        <div className="space-y-4 border-t pt-4 border-slate-100">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    Validateur Client
                                    <div className="group relative">
                                        <Info className="h-4 w-4 text-slate-400 cursor-help" />
                                        <div className="absolute left-1/2 bottom-full mb-2 w-64 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg z-10">
                                            Nom du responsable côté client (Chef de projet, Product Owner...) qui a validé la bonne réception des livrables.
                                        </div>
                                    </div>
                                </label>
                                <input
                                    name="clientValidatorName"
                                    type="text"
                                    placeholder="Nom du responsable (Chef de Projet, PO...)"
                                    className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Réserves éventuelles</label>
                                <textarea
                                    name="reservations"
                                    rows={2}
                                    placeholder="Noter ici les réserves s'il y en a..."
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        Créer le livrable
                    </button>
                </form>
            </div>
        </div>
    );
}
