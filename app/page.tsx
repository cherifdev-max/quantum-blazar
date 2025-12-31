import { KPICard } from "@/components/ui/KPICard";
import { MOCK_DELIVERABLES } from "@/lib/data";
import { calculateRAF, calculateMargin, Contract } from "@/types";
import { Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { generateMonthlyDeliverables, getContracts, getDeliverables } from "@/lib/actions";
import FinancialChart from "@/components/features/FinancialChart";

export default async function Home() {
  const contracts = await getContracts();

  // KPI Calculations
  const totalRAF = contracts.reduce((acc, c) => acc + calculateRAF(c), 0);
  const activeContracts = contracts.filter(c => c.endDate > new Date().toISOString()).length;
  const deliverables = await getDeliverables();
  const pendingDeliverables = deliverables.filter(d => d.status === "En attente").length;

  // Financial Calculations
  const totalMargin = contracts.reduce((acc, c) => acc + calculateMargin(c), 0);
  const totalRevenue = contracts.reduce((acc, c) => acc + c.totalAmount, 0);
  const globalMarginPercent = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;

  // Chart Data Calculation
  const rafByClient = contracts.reduce((acc, contract) => {
    const raf = calculateRAF(contract);
    const client = contract.client;
    acc[client] = (acc[client] || 0) + raf;
    return acc;
  }, {} as Record<string, number>);

  const edfRAF = rafByClient['EDF'] || 0;
  const enedisRAF = rafByClient['ENEDIS'] || 0;
  const totalCalculatedRAF = edfRAF + enedisRAF;

  // Percentage for gradient (default to 50% if 0 to avoid NaN)
  const edfPercentage = totalCalculatedRAF > 0 ? Math.round((edfRAF / totalCalculatedRAF) * 100) : 0;
  const gradientStyle = `conic-gradient(#3b82f6 0% ${edfPercentage}%, #10b981 ${edfPercentage}% 100%)`;

  // Top Contracts by Margin
  const topContracts = [...contracts]
    .sort((a, b) => calculateMargin(b) - calculateMargin(a))
    .slice(0, 3);

  // Alerts Calculation
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  const today = new Date();

  const alertsCount = contracts.filter(c => {
    const endDate = new Date(c.endDate);
    return endDate > today && endDate <= threeMonthsFromNow;
  }).length;

  // Chart Data Calculation - Monthly Projection
  const months = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN", "JUIL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];
  const currentYear = new Date().getFullYear();
  const factureByMonth = new Array(12).fill(0);
  const rafByMonth = new Array(12).fill(0);
  let totalBilled = 0;

  contracts.forEach(contract => {
    totalBilled += contract.billedAmount || 0;

    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);

    if (endDate.getFullYear() >= currentYear && startDate.getFullYear() <= currentYear) {
      const startMonthIndex = startDate.getFullYear() < currentYear ? 0 : startDate.getMonth();
      const endMonthIndex = endDate.getFullYear() > currentYear ? 11 : endDate.getMonth();
      const totalMonthsDuration = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

      if (totalMonthsDuration > 0) {
        const monthlyAmount = contract.totalAmount / totalMonthsDuration;

        for (let i = startMonthIndex; i <= endMonthIndex; i++) {
          const monthKey = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`;

          // Check if specific deliverable exists and is Validated
          const deliverable = deliverables.find(d => d.contractId === contract.id && d.month === monthKey);

          if (deliverable && deliverable.status === 'Validé') {
            factureByMonth[i] += monthlyAmount;
          } else {
            rafByMonth[i] += monthlyAmount;
          }
        }
      }
    }
  });

  const chartData = months.map((name, index) => ({
    name,
    facture: factureByMonth[index],
    raf: rafByMonth[index]
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
        <p className="mt-2 text-slate-500">
          Vue d'overview de l'activité SST et de la rentabilité.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Reste à Faire Total"
          value={`${(totalRAF / 1000).toFixed(0)} k€`}
          icon={Activity}
          trend="+12%"
          trendUp={true}
          description="vs mois dernier"
          tooltip="Montant total restant à facturer sur les contrats actifs."
          href="/contracts"
        />
        <KPICard
          title="Marge Nette Globale"
          value={`${(totalMargin / 1000).toFixed(0)} k€`}
          icon={Wallet}
          trend={`${globalMarginPercent.toFixed(1)}%`}
          trendUp={globalMarginPercent > 20} // Green if > 20%
          description="Marge moyenne"
          className="border-l-4 border-l-emerald-500"
          tooltip="Différence cumulée entre le montant vendu et le coût d'achat SST."
          href="/contracts"
        />
        <KPICard
          title="Livrables en Attente"
          value={pendingDeliverables}
          icon={Clock}
          trend="Urgent"
          trendUp={false}
          className="border-l-4 border-l-amber-500"
          tooltip="Nombre de documents (BL/PV) en attente de validation ou d'envoi."
          href="/deliverables"
        />
        <KPICard
          title="Actions Requises"
          value={alertsCount}
          icon={AlertCircle}
          description="Fins de contrats proches"
          className="border-l-4 border-l-red-500"
          tooltip="Contrats arrivant à échéance dans les 3 mois."
          href="/contracts"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Real RAF Chart */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Analyse de la Performance Financière
          </h3>

          <div className="flex-1 min-h-[250px] w-full">
            <FinancialChart data={chartData} />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div className="text-left">
              <p className="text-sm text-slate-500 mb-1">RAF Global</p>
              <p className="text-xl font-bold text-slate-900">{(totalRAF / 1000).toFixed(1)}M€</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Facturé (Total)</p>
              <p className="text-xl font-bold text-emerald-600">{(totalBilled / 1000).toFixed(0)}k€</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Top Rentabilité
          </h3>
          <div className="space-y-4">
            {topContracts.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Aucun contrat avec marge calculée.</p>
            ) : topContracts.map((contract) => {
              const margin = calculateMargin(contract);
              const marginPercent = contract.totalAmount > 0 ? (margin / contract.totalAmount) * 100 : 0;

              return (
                <Link
                  key={contract.id}
                  href={`/contracts/${contract.id}/edit`}
                  className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 group hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{contract.orderNumber}</p>
                    <p className="text-sm text-slate-500">{contract.client} • {contract.description?.substring(0, 30)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">+{margin.toLocaleString("fr-FR")} €</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      {marginPercent.toFixed(1)}%
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
              Calculé sur la différence (Vente - Achat SST)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
