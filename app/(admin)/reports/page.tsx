import { AlertTriangle, Mail, Bell, CheckCheck, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { sendCampaign, getEmailLogs, getContracts, getSSTs } from "@/lib/actions";
import EmailLogList from "./EmailLogList";
import { revalidatePath } from "next/cache";

export default async function ReportsPage() {
    const emailLogs = await getEmailLogs();
    const contracts = await getContracts();
    const ssts = await getSSTs();

    // Calculate Financial Data
    const totalAmount = contracts.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalBilled = contracts.reduce((sum, c) => sum + c.billedAmount, 0);
    const totalRAF = totalAmount - totalBilled;

    // Find contracts ending within 3 months
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    const today = new Date();

    const expiringContracts = contracts.filter(c => {
        const endDate = new Date(c.endDate);
        return endDate > today && endDate <= threeMonthsFromNow;
    });

    async function handleSendReminders(formData: FormData) {
        "use server";
        await sendCampaign(formData);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Reporting & Alertes</h1>
                <p className="text-slate-500">Pilotage des échéances et automatisation des relances.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Automation Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Relances Mensuelles</h3>
                                <p className="text-sm text-slate-500">Automatisation des réclamations de livrables</p>
                            </div>
                        </div>
                        <Badge variant="success">Actif</Badge>
                    </div>

                    <p className="text-sm text-slate-600 mb-6">
                        Configurez votre campagne de rappel pour le dépôt des livrables.
                    </p>

                    <form action={handleSendReminders} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Destinataire(s)</label>
                            <select
                                name="sstId"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">🌍 Tous les prestataires (Relance Globale)</option>
                                {ssts.map(sst => (
                                    <option key={sst.id} value={sst.id}>👤 {sst.companyName} ({sst.mainContact.name})</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all"
                        >
                            Envoyer la relance
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Historique des envois</h4>
                        <EmailLogList logs={emailLogs} />
                    </div>
                </div>

                {/* Alerts Summary */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Alertes Contractuelles</h3>
                            <p className="text-sm text-slate-500">Contrats nécessitant une attention immédiate</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {expiringContracts.slice(0, 3).map((contract) => (
                            <div key={contract.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <Calendar className="h-4 w-4 text-slate-400 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{contract.orderNumber} - Fin le {new Date(contract.endDate).toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-500">{contract.client} • {contract.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced Reporting Placeholder */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Analyse de la Performance Financière
                </h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                    <div className="flex items-end justify-between h-64 gap-2">
                        {/* Simulation de répartition mensuelle basée sur le facturé total pour l'esthétique */}
                        {[45, 60, 75, 50, 80, 95, 70, 65, 85, 90, 100, 80].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative w-full bg-slate-200 rounded-t-md overflow-hidden h-full flex items-end">
                                    <div
                                        className="w-full bg-emerald-500 opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out rounded-t-md relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
                                            {/* Fake monthly distribution for demo visual */}
                                            {Math.round((totalBilled / 12) * (height / 100) / 1000)} k€
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500 uppercase">
                                    {['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                        <div>
                            <p className="text-sm text-slate-500">RAF Global</p>
                            <p className="text-2xl font-bold text-slate-900">{(totalRAF / 1000000).toFixed(1)}M€</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Facturé (YTD)</p>
                            <p className="text-2xl font-bold text-emerald-600">{(totalBilled / 1000).toFixed(0)}k€</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Projection Fin d'année</p>
                            <p className="text-2xl font-bold text-blue-600">{(totalAmount / 1000000).toFixed(1)}M€</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
