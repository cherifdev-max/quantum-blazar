import Link from "next/link";
import { Plus, Search, MapPin, Mail, Phone, Building2, Edit } from "lucide-react";
import { getSSTs } from "@/lib/actions";
import SSTListClient from "./SSTListClient";

export default async function SSTPage() {
    const sstList = await getSSTs();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Annuaire Prestataires</h1>
                    <p className="text-slate-500">Gérez les fiches des sociétés sous-traitantes.</p>
                </div>
                <Link href="/sst/new" className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Prestataire
                </Link>
            </div>

            <SSTListClient initialSST={sstList} />
        </div>
    );
}

