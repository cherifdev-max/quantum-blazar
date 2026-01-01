import { getClients, createClient, deleteClient } from "@/lib/actions";
import { Users, Plus, Building } from "lucide-react";
import DeleteButton from "@/components/ui/DeleteButton";

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                    <p className="text-slate-500">Gestion de vos clients / donneurs d'ordres.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* List */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Clients Existants
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {clients.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 italic">Aucun client configuré.</div>
                        ) : clients.map(client => (
                            <div key={client.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {client.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{client.name}</p>
                                        <p className="text-sm text-slate-500">{client.description}</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DeleteButton
                                        onDelete={async () => {
                                            "use server";
                                            await deleteClient(client.id);
                                        }}
                                        itemName={`le client ${client.name}`}
                                        iconOnly
                                        className="p-2 text-slate-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Form */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-fit">
                    <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-emerald-600" />
                        Ajouter un nouveau client
                    </h2>
                    <form action={createClient} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nom du Client</label>
                            <input
                                name="name"
                                required
                                placeholder="Ex: TOTAL ENERGIES"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description (Optionnel)</label>
                            <input
                                name="description"
                                placeholder="Ex: Siège social Paris"
                                className="w-full rounded-lg border border-slate-200 h-10 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors">
                            Enregistrer le Client
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
