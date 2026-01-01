"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSSTs, createContract } from "@/lib/actions";
import { SSTEntity } from "@/types";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewContractPage() {
    const router = useRouter();
    const [ssts, setSsts] = useState<SSTEntity[]>([]);

    // Initial State
    const [formData, setFormData] = useState({
        client: "EDF",
        orderNumber: "",
        sstId: "",
        description: "",
        startDate: "",
        endDate: "",
        totalAmount: 0,
        billedAmount: 0,
        purchasedAmount: 0,
    });

    const [raf, setRaf] = useState(0);

    // Load SSTs on mount
    useEffect(() => {
        getSSTs().then(setSsts);
    }, []);

    // Auto-calculate RAF
    useEffect(() => {
        setRaf(formData.totalAmount - formData.billedAmount);
    }, [formData.totalAmount, formData.billedAmount]);

    async function handleSave(formDataToSubmit: FormData) {
        // Validation basique
        if (!formDataToSubmit.get("sstId")) {
            alert("Veuillez sélectionner un prestataire.");
            return;
        }
        await createContract(formDataToSubmit);
        // Redirection après succès
        router.push("/contracts");
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/contracts" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nouveau Contrat</h1>
                    <p className="text-slate-500">Créez une nouvelle fiche de suivi financier.</p>
                </div>
            </div>

            <form action={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Client</label>
                        <select
                            name="client"
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        >
                            <option value="EDF">EDF</option>
                            <option value="ENEDIS">ENEDIS</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Numéro de Commande</label>
                        <input
                            name="orderNumber"
                            required
                            type="text"
                            placeholder="Ex: CMD-2024-XXX"
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.orderNumber}
                            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Prestataire (SST)</label>
                        <select
                            name="sstId"
                            required
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.sstId}
                            onChange={(e) => setFormData({ ...formData, sstId: e.target.value })}
                        >
                            <option value="">Sélectionner un prestataire...</option>
                            {ssts.map((sst) => (
                                <option key={sst.id} value={sst.id}>
                                    {sst.companyName} ({sst.siret})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Description / Objet</label>
                        <textarea
                            name="description"
                            className="w-full rounded-lg border border-slate-200 h-24 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Objet du marché..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date de Début</label>
                        <input
                            name="startDate"
                            required
                            type="date"
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date de Fin</label>
                        <input
                            name="endDate"
                            required
                            type="date"
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Données Financières</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Montant Total (€)</label>
                            <input
                                name="totalAmount"
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                value={formData.totalAmount}
                                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Montant Facturé (€)</label>
                            <input
                                name="billedAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                value={formData.billedAmount}
                                onChange={(e) => setFormData({ ...formData, billedAmount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Coût Achat SST (€)</label>
                            <input
                                name="purchasedAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                value={formData.purchasedAmount}
                                onChange={(e) => setFormData({ ...formData, purchasedAmount: parseFloat(e.target.value) || 0 })}
                            />
                            <div className="flex items-center justify-between text-xs mt-1">
                                <span className="text-slate-500">Marge:</span>
                                <span className={cn(
                                    "font-bold",
                                    (formData.totalAmount - (formData.purchasedAmount || 0)) >= 0 ? "text-emerald-600" : "text-red-500"
                                )}>
                                    {(formData.totalAmount - (formData.purchasedAmount || 0)).toLocaleString("fr-FR")} €
                                    {formData.totalAmount > 0 && ` (${(((formData.totalAmount - (formData.purchasedAmount || 0)) / formData.totalAmount) * 100).toFixed(1)}%)`}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Reste à Faire (RAF)</label>
                            <div className={cn(
                                "w-full rounded-lg border h-10 px-3 flex items-center text-sm font-bold font-mono bg-slate-50",
                                raf < 0 ? "text-red-600 border-red-200 bg-red-50" : "text-emerald-700 border-emerald-200 bg-emerald-50"
                            )}>
                                {raf.toLocaleString("fr-FR")} €
                            </div>
                            <p className="text-xs text-slate-400">Calcul automatique</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer le Contrat
                    </button>
                </div>
            </form>
        </div>
    );
}
