"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Mail, Phone, Building2, Edit } from "lucide-react";
import { SSTEntity } from "@/types";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteSST } from "@/lib/actions";

export default function SSTListClient({ initialSST }: { initialSST: SSTEntity[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSST = initialSST.filter(s =>
        s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.siret.includes(searchTerm) ||
        s.mainContact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une société, un SIRET..."
                        className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSST.map((sst) => (
                    <div key={sst.id} className="group relative bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Link href={`/sst/${sst.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 block bg-slate-50 rounded-lg">
                                <Edit className="h-4 w-4" />
                            </Link>
                            <div className="bg-slate-50 rounded-lg">
                                <DeleteButton
                                    onDelete={async () => {
                                        await deleteSST(sst.id);
                                    }}
                                    itemName={sst.companyName}
                                    iconOnly
                                    className="p-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="rounded-lg bg-blue-50 p-3">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {sst.siret}
                            </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-900">{sst.companyName}</h3>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-start text-sm text-slate-600">
                                <MapPin className="mr-2 h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                                {sst.address}
                            </div>

                            <div className="border-t border-slate-100 pt-3 mt-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contact Principal</p>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center font-medium text-slate-900">
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></div>
                                        {sst.mainContact.name}
                                    </div>
                                    <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                                        <Mail className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                        {sst.mainContact.email}
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="mr-2 h-3.5 w-3.5 text-slate-400" />
                                        {sst.mainContact.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/sst/${sst.id}/edit`} className="flex-1 text-center rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                Modifier
                            </Link>
                            <Link href="/contracts" className="flex-1 text-center rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                                Voir Contrats
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
