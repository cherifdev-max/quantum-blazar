import { createSST } from "@/lib/actions";
import { ChevronLeft, Save, Building2, User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function NewSSTPage() {
    async function action(formData: FormData) {
        "use server";
        await createSST(formData);
        redirect("/sst");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/sst" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nouveau Prestataire</h1>
                    <p className="text-slate-500">Ajouter une nouvelle société sous-traitante.</p>
                </div>
            </div>

            <form action={action} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">

                {/* Company Info */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Informations Société
                    </h3>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Raison Sociale</label>
                            <input
                                required
                                name="companyName"
                                type="text"
                                placeholder="Ex: SAS ENERGIE PLUS"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">SIRET</label>
                            <input
                                required
                                name="siret"
                                type="text"
                                placeholder="14 chiffres"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Adresse Complète
                            </label>
                            <textarea
                                required
                                name="address"
                                className="w-full rounded-lg border border-slate-200 h-20 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Contact Principal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Nom Complet</label>
                            <input
                                required
                                name="contactName"
                                type="text"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> Email
                            </label>
                            <input
                                required
                                name="contactEmail"
                                type="email"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                <Phone className="h-3 w-3" /> Téléphone
                            </label>
                            <input
                                required
                                name="contactPhone"
                                type="tel"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 user-select-none">
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer le Prestataire
                    </button>
                </div>
            </form>
        </div>
    );
}
