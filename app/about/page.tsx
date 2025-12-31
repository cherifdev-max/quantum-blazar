import { Info, LayoutDashboard, Users, FileText, FileCheck, Activity, Database } from "lucide-react";
import { migrateContractsPurchaseAmount } from "@/lib/migrations";

export default function AboutPage() {
    async function triggerMigration() {
        "use server";
        await migrateContractsPurchaseAmount();
    }
    const modules = [
        {
            title: "Tableau de Bord",
            icon: LayoutDashboard,
            color: "text-blue-500",
            bg: "bg-blue-50",
            description: "Votre point de départ. Il affiche une vue d'ensemble des indicateurs clés (KPI) comme le Reste à Faire (RAF) global, les contrats actifs et les alertes urgentes. Le graphique vous montre la répartition financière en temps réel."
        },
        {
            title: "SST & Prestataires",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-50",
            description: "L'annuaire de vos sous-traitants. Vous pouvez ajouter de nouvelles entreprises, gérer leurs coordonnées et voir la liste complète des partenaires avec qui vous travaillez."
        },
        {
            title: "Contrats & Commandes",
            icon: FileText,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            description: "Le cœur du suivi financier. Créez des contrats liés à des commandes client (EDF/ENEDIS) et à des prestataires. Le système calcule automatiquement le montant facturé et ce qu'il reste à produire."
        },
        {
            title: "Suivi Livrables",
            icon: FileCheck,
            color: "text-amber-500",
            bg: "bg-amber-50",
            description: "Gérez les preuves du travail effectué (Bordereaux de Livraison, PV). Vous pouvez télécharger les fichiers et suivre leur statut de validation."
        },
        {
            title: "Reporting & Alertes",
            icon: Activity,
            color: "text-rose-500",
            bg: "bg-rose-50",
            description: "Outil de pilotage avancé. Il permet d'envoyer des relances automatiques par email aux prestataires et d'analyser la performance financière mensuelle de vos projets."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Info className="h-8 w-8 text-blue-600" />
                    À propos de SST Manager
                </h1>
                <p className="mt-2 text-slate-500 text-lg">
                    Guide simplifié pour comprendre et utiliser votre application de gestion.
                </p>
            </div>

            <div className="grid gap-6">
                {modules.map((module, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-6 hover:shadow-md transition-shadow">
                        <div className={`h-14 w-14 rounded-xl ${module.bg} flex items-center justify-center flex-shrink-0`}>
                            <module.icon className={`h-7 w-7 ${module.color}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{module.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {module.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 text-slate-300 p-6 rounded-xl mt-8">
                <h4 className="text-white font-bold mb-2">Besoin d'aide supplémentaire ?</h4>
                <p className="text-sm">
                    Cette application est conçue pour être intuitive. Si vous rencontrez un problème technique ou avez une question sur une fonctionnalité, contactez l'support technique (Admin).
                </p>
                <div className="flex justify-between items-end mt-4">
                    <p className="text-xs text-slate-500">Version 1.0.5 - SST Manager</p>
                    <form action={triggerMigration}>
                        <button type="submit" className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 py-1 px-3 rounded flex items-center gap-1 transition-colors">
                            <Database className="h-3 w-3" />
                            Migrer Données (Admin)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
