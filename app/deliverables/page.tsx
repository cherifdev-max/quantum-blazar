import { generateMonthlyDeliverables, getContracts, getDeliverables } from "@/lib/actions";
import { Badge } from "@/components/ui/Badge";
import { DeliverableStatus } from "@/types";
import { cn } from "@/lib/utils";
import DeliverablesList from "./DeliverablesList";
import GenerateButton from "./GenerateButton";
import ManualDeliverableDialog from "./ManualDeliverableDialog";
import { Suspense } from "react";

export default async function DeliverablesPage() {
    const deliverables = await getDeliverables();
    const contracts = await getContracts();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Registre des Livrables</h1>
                    <p className="text-slate-500">Suivi mensuel des BL et PV par contrat (Données Réelles).</p>
                </div>
                <div className="flex items-center gap-2">
                    <ManualDeliverableDialog contracts={contracts} />
                    <GenerateButton />
                </div>
            </div>

            <Suspense fallback={<div>Chargement...</div>}>
                <DeliverablesList initialDeliverables={deliverables} contracts={contracts} />
            </Suspense>
        </div>
    );
}
