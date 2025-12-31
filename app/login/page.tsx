"use client";

import { login } from "@/lib/auth";
import { Lock, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-[#000091] p-8 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-[#000091] font-bold text-2xl">S</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-white mb-2">Gestion SST</h1>
                    <p className="text-blue-100 text-center text-sm">
                        Gestion des prestations et livrables
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    {error === "invalid_credentials" && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center">
                            <span className="font-medium mr-2">Erreur :</span> Identifiants incorrects.
                        </div>
                    )}

                    <form action={login} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@cherif.com"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Mot de passe</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 bg-[#000091] hover:bg-[#000063] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-200 mt-2"
                        >
                            Se connecter
                        </button>
                    </form>

                    <p className="text-center mt-6 text-xs text-slate-400">
                        Version de démonstration v1.0.4
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <LoginForm />
        </Suspense>
    );
}
