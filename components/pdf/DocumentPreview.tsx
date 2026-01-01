import { Contract, Deliverable, SSTEntity } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentPreviewProps {
    type: 'BL' | 'PV';
    contract: Contract;
    sst: SSTEntity;
    deliverable: Deliverable;
}

export function DocumentPreview({ type, contract, sst, deliverable }: DocumentPreviewProps) {
    const currentDate = new Date();
    const data = deliverable.data;

    return (
        <div className="bg-white p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl text-slate-900 text-sm leading-relaxed" id="document-preview">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest">{type === 'BL' ? 'Bon de Livraison' : 'Procès-Verbal'}</h1>
                    <p className="text-slate-500 mt-2">Période : {deliverable.month}</p>
                </div>
                <div className="text-right">
                    <h2 className={cn("text-xl font-bold", type === 'PV' ? "text-purple-600" : "text-blue-600")}>
                        {sst.companyName}
                    </h2>
                    <p>{sst.address}</p>
                    <p>SIRET : {sst.siret}</p>
                </div>
            </div>

            {/* Client Info */}
            <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-100">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Client</h3>
                <p className="text-lg font-bold">{contract.client}</p>
                <p>Référence Commande : <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">{contract.orderNumber}</span></p>
            </div>

            {/* Content Body */}
            <div className="mb-12">
                <h3 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4">Détail de la prestation</h3>
                <p className="mb-6">{contract.description}</p>

                <table className="w-full text-left mb-6">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-3">Désignation</th>
                            <th className="p-3 text-right">Quantité / Jours</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-100">
                            <td className="p-3">
                                <div className="font-medium">Forfait mensuel - {deliverable.month}</div>
                                {data?.activityDescription && (
                                    <div className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{data.activityDescription}</div>
                                )}
                            </td>
                            <td className="p-3 text-right font-mono">
                                {data?.daysWorked ? `${data.daysWorked} Jours` : '1 Forfait'}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {type === 'PV' && data?.reservations && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                        <h4 className="text-amber-800 font-bold text-xs uppercase mb-1">Réserves / Observations</h4>
                        <p className="text-amber-900">{data.reservations}</p>
                    </div>
                )}

                <div className="text-slate-500 italic text-xs mt-8">
                    {type === 'PV' ? (
                        "Nous certifions que les prestations décrites ci-dessus ont été réalisées conformément au cahier des charges."
                    ) : (
                        "Ce document atteste de la livraison des éléments contractuels pour la période concernée."
                    )}
                </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 mt-20">
                <div className="border border-slate-300 h-32 p-4 rounded-lg relative">
                    <p className="absolute top-4 left-4 text-xs font-bold uppercase text-slate-400">Pour le Prestataire</p>
                    {data?.signature ? (
                        <img
                            src={data.signature}
                            alt="Signature Prestataire"
                            className="absolute bottom-2 left-4 max-h-20 max-w-[80%]"
                        />
                    ) : (
                        <p className="absolute bottom-4 left-4">{sst.mainContact.name}</p>
                    )}
                </div>
                <div className="border border-slate-300 h-32 p-4 rounded-lg relative">
                    <p className="absolute top-4 left-4 text-xs font-bold uppercase text-slate-400">Pour {contract.client}</p>
                    {type === 'PV' && data?.clientValidatorName && (
                        <div className="absolute bottom-4 left-4">
                            <p className="text-xs text-slate-400 mb-1">Validé par :</p>
                            <p className="font-medium">{data.clientValidatorName}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                Document généré automatiquement le {format(currentDate, 'dd/MM/yyyy')} via SST Manager.
            </div>
        </div>
    );
}
