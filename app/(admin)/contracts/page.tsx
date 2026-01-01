import { Plus } from "lucide-react";
import { getContracts } from "@/lib/actions";
import Link from "next/link";
import ContractsListClient from "./ContractsListClient";

export default async function ContractsPage() {
    // Fetch real data from the server
    const contracts = await getContracts();

    // Reverse to show newest first
    const sortedContracts = [...contracts].reverse();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Contrats & Commandes</h1>
                    <p className="text-slate-500">Gérez les commandes EDF/ENEDIS et suivez le RAF.</p>
                </div>
                <Link href="/contracts/new" className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Contrat
                </Link>
            </div>

            <ContractsListClient initialContracts={sortedContracts} />
        </div>
    );
}
