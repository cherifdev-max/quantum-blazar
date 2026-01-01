import { getSSTByToken, getContracts, getDeliverables } from "@/lib/actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, FileText, Upload } from "lucide-react";

export default async function PortalPage({ params }: { params: { token: string } }) {
    const sst = await getSSTByToken(params.token);

    if (!sst) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-slate-800">Lien invalide ou expiré</h1>
                <p className="text-slate-500 mt-2">Veuillez vérifier le lien dans votre email.</p>
            </div>
        );
    }

    // Fetch related data
    // Optimisation possible: Créer une server action dédiée "getSSTDashboardData(token)"
    const allContracts = await getContracts();
    const sstContracts = allContracts.filter(c => String(c.sstId).trim() === String(sst.id).trim());

    const allDeliverables = await getDeliverables();
    // Filter deliverables linked to these contracts
    const myDeliverables = allDeliverables.filter(d =>
        sstContracts.some(c => c.id === d.contractId)
    ).sort((a, b) => b.month.localeCompare(a.month)); // Most recent first

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Bonjour {sst.mainContact.name}</h1>
                <p className="text-slate-600">Société : {sst.companyName}</p>
            </div>

            <div className="grid gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800">Mes Livrables à Traiter</h2>
                    </div>

                    {myDeliverables.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Aucun livrable en attente.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {myDeliverables.map(doc => {
                                const isPending = doc.status === 'En attente' || doc.status === 'Rejeté';
                                const contract = sstContracts.find(c => c.id === doc.contractId);

                                return (
                                    <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg ${doc.type === 'BL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                }`}>
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                    {doc.type === 'BL' ? 'Bon de Livraison (CRA)' : 'Procès-Verbal (PV)'}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Période : {format(new Date(doc.month + '-01'), 'MMMM yyyy', { locale: fr })}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                        {contract?.orderNumber || 'Sans Contrat'}
                                                    </span>
                                                    <StatusBadge status={doc.status} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            {isPending ? (
                                                <Link
                                                    href={`/documents/preview/${doc.id}?type=${doc.type}&token=${params.token}`} // We will need to secure preview too, or just allow public preview for now
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Remplir
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/documents/preview/${doc.id}?type=${doc.type}&token=${params.token}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                                                >
                                                    Voir le document
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        'En attente': 'bg-orange-100 text-orange-700',
        'Soumis': 'bg-blue-100 text-blue-700',
        'Validé': 'bg-green-100 text-green-700',
        'Rejeté': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}
