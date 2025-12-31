"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_SST } from "@/lib/data";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Contract } from "@/types";

export default function EditContractForm({ contract }: { contract: Contract }) {
    const router = useRouter();
    const id = contract.id; // Corrected: use contract.id directly

    const [formData, setFormData] = useState({
        client: contract.client,
        orderNumber: contract.orderNumber,
        sstId: contract.sstId,
        description: contract.description || "",
        startDate: contract.startDate,
        endDate: contract.endDate,
        totalAmount: contract.totalAmount,
        billedAmount: contract.billedAmount,
        purchasedAmount: contract.purchasedAmount || 0,
        dc4Status: (contract.dc4Status || 'Brouillon') as "Brouillon" | "Soumis" | "Validé" | "Rejeté",
    });

    const [raf, setRaf] = useState(0);

    // Auto-calculate RAF
    useEffect(() => {
        setRaf(formData.totalAmount - formData.billedAmount);
    }, [formData.totalAmount, formData.billedAmount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("client", formData.client);
        data.append("orderNumber", formData.orderNumber);
        data.append("sstId", formData.sstId);
        data.append("description", formData.description);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("totalAmount", formData.totalAmount.toString());
        data.append("billedAmount", formData.billedAmount.toString());
        data.append("purchasedAmount", formData.purchasedAmount.toString());
        data.append("dc4Status", formData.dc4Status);

        try {
            const { updateContract } = await import("@/lib/actions");
            await updateContract(id as string, data);

            router.push(`/contracts/${id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la sauvegarde.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href={`/contracts/${id}`} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Modifier Contrat</h1>
                    <p className="text-slate-500">{formData.orderNumber}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Client</label>
                        <select
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value as any })}
                        >
                            <option value="EDF">EDF</option>
                            <option value="ENEDIS">ENEDIS</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">État DC4</label>
                        <select
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.dc4Status}
                            onChange={(e) => setFormData({ ...formData, dc4Status: e.target.value as any })}
                        >
                            <option value="Brouillon">Brouillon</option>
                            <option value="Soumis">Soumis</option>
                            <option value="Validé">Validé</option>
                            <option value="Rejeté">Rejeté</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Numéro de Commande</label>
                        <input
                            required
                            type="text"
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.orderNumber}
                            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Prestataire (SST)</label>
                        <select
                            required
                            className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.sstId}
                            onChange={(e) => setFormData({ ...formData, sstId: e.target.value })}
                        >
                            <option value="">Sélectionner un prestataire...</option>
                            {MOCK_SST.map((sst) => (
                                <option key={sst.id} value={sst.id}>
                                    {sst.companyName} ({sst.siret})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Description / Objet</label>
                        <textarea
                            className="w-full rounded-lg border border-slate-200 h-24 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Date de Début</label>
                        <input
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
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                value={formData.billedAmount}
                                onChange={(e) => setFormData({ ...formData, billedAmount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Reste à Faire (RAF)</label>
                            <div className={cn(
                                "w-full rounded-lg border h-10 px-3 flex items-center text-sm font-bold font-mono bg-slate-50",
                                raf < 0 ? "text-red-600 border-red-200 bg-red-50" : "text-emerald-700 border-emerald-200 bg-emerald-50"
                            )}>
                                {raf.toLocaleString("fr-FR")} €
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Coût Achat SST (€)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                value={formData.purchasedAmount}
                                onChange={(e) => setFormData({ ...formData, purchasedAmount: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                    </button>
                </div>
            </form>
        </div>
    );
}
