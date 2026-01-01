import { getContractById, getSSTById, getDeliverables } from "@/lib/actions";
import { Badge } from "@/components/ui/Badge";
import { calculateRAF } from "@/types";
import { ChevronLeft, Edit, Calendar, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ContractDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const contract = await getContractById(params.id);

    if (!contract) {
        notFound();
    }

    const sst = await getSSTById(contract.sstId);
    const allDeliverables = await getDeliverables();
    const deliverables = allDeliverables.filter(d => d.contractId === contract.id);

    if (!sst) {
        return <div className="p-8">Erreur: Prestataire introuvable</div>;
    }

    const raf = calculateRAF(contract);
    const rafPercent = (raf / contract.totalAmount) * 100;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/contracts" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            {contract.orderNumber}
                            <Badge variant={contract.dc4Status === 'Validé' ? 'success' : 'secondary'}>{contract.dc4Status}</Badge>
                        </h1>
                        <p className="text-slate-500">{contract.client} • {contract.description}</p>
                    </div>
                </div>
                <Link
                    href={`/contracts/${contract.id}/edit`}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Prestataire
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <p className="font-bold text-lg">{sst.companyName}</p>
                            <p className="text-slate-600">{sst.address}</p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-3 pt-3 border-t border-slate-200 text-sm">
                                <div>
                                    <span className="text-slate-400 block text-xs uppercase">Contact</span>
                                    <span className="font-medium">{sst.mainContact.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs uppercase">Email</span>
                                    <a href={`mailto:${sst.mainContact.email}`} className="text-blue-600 hover:underline">{sst.mainContact.email}</a>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-xs uppercase">SIRET</span>
                                    <span className="font-mono">{sst.siret}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Calendrier & Livrables
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-400 uppercase">Début</p>
                                <p className="font-medium" suppressHydrationWarning>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-400 uppercase">Fin</p>
                                <p className="font-medium" suppressHydrationWarning>{new Date(contract.endDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>

                        <p className="font-medium text-sm mb-2">Historique des Livrables</p>
                        {deliverables.length > 0 ? (
                            <div className="space-y-2">
                                {deliverables.map(d => (
                                    <div key={d.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                                        <span className="text-sm font-medium">{d.type} - {d.month}</span>
                                        <Badge variant={d.status === 'Validé' ? 'success' : 'secondary'}>{d.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Aucun livrable enregistré.</p>
                        )}
                    </div>
                </div>

                {/* Financial Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Finances
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Montant Total</p>
                                <p className="text-2xl font-bold">{contract.totalAmount.toLocaleString("fr-FR")} €</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Facturé à ce jour</p>
                                <p className="text-lg font-medium text-slate-700">{contract.billedAmount.toLocaleString("fr-FR")} €</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm font-bold text-slate-900 mb-1">Reste à Faire (RAF)</p>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                                    <div className={cn("bg-emerald-500 h-2.5 rounded-full")} style={{ width: `${rafPercent}%` }}></div>
                                </div>
                                <p className={cn("text-xl font-bold", rafPercent < 10 ? "text-red-500" : "text-emerald-600")}>
                                    {raf.toLocaleString("fr-FR")} €
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm font-bold text-slate-900 mb-1">Rentabilité / Marge</p>
                                {contract.purchasedAmount ? (
                                    <>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-2xl font-bold text-emerald-600">
                                                {(contract.totalAmount - contract.purchasedAmount).toLocaleString("fr-FR")} €
                                            </span>
                                            <span className="text-sm font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                                {((contract.totalAmount - contract.purchasedAmount) / contract.totalAmount * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Achat: {contract.purchasedAmount.toLocaleString("fr-FR")} €
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Non calculé (Coût d'achat manquant)</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
