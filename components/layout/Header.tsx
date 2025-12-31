import { Bell, Search, User } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
            <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un contrat, un SST..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative rounded-full p-2 hover:bg-slate-100 transition-colors">
                    <Bell className="h-6 w-6 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-700">Admin User</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                        <User className="h-6 w-6 text-slate-500" />
                    </div>
                </div>
            </div>
        </header>
    );
}
