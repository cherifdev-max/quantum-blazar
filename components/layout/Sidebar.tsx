import Link from "next/link";
import { LayoutDashboard, Users, FileText, FileCheck, Settings, Activity, Power, Info, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const navigation = [
    { name: "Tableau de Bord", href: "/", icon: LayoutDashboard },
    { name: "SSTs", href: "/sst", icon: Users },
    { name: "Clients", href: "/clients", icon: Building2 },
    { name: "Contrats", href: "/contracts", icon: FileText },
    { name: "Suivi Livrables", href: "/deliverables", icon: FileCheck },
    { name: "Reporting & Alertes", href: "/reports", icon: Activity },
    { name: "À Propos", href: "/about", icon: Info },
];

export function Sidebar() {
    return (
        <div className="flex h-full w-64 flex-col bg-[#000091] text-white shadow-2xl transition-colors duration-500">
            <div className="flex h-24 items-center justify-center border-b border-[#000063] px-6 shadow-sm bg-[#000063]/20">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Gestion <span className="text-blue-300">SST</span>
                </h1>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                "hover:bg-white/10 hover:text-white text-blue-100"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-colors text-blue-300 group-hover:text-white" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t border-[#000063] p-4 bg-[#000063]/10">
                <div className="mb-4 px-2 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#000091] ring-2 ring-white/50">
                        AD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Admin</p>
                        <p className="text-xs text-blue-300 truncate">admin@cherif.com</p>
                    </div>
                </div>

                <form action={logout}>
                    <button type="submit" className="flex w-full items-center rounded-xl px-4 py-2 text-sm font-medium text-blue-300 hover:bg-white/10 hover:text-white transition-all group">
                        <Power className="mr-3 h-5 w-5 text-blue-400 group-hover:text-red-300 transition-colors" />
                        Se déconnecter
                    </button>
                </form>
            </div>
        </div>
    );
}
