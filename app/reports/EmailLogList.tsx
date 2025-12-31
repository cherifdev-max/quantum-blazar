"use client";

import { EmailLog } from "@/lib/storage";
import { CheckCheck, XCircle } from "lucide-react";

export default function EmailLogList({ logs }: { logs: EmailLog[] }) {
    if (logs.length === 0) {
        return <p className="text-sm text-slate-500 italic">Aucun envoi récent.</p>;
    }

    return (
        <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
            {logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                    <div>
                        <p className="font-semibold text-slate-900">{log.to}</p>
                        <p className="text-xs text-slate-500" suppressHydrationWarning>
                            {new Date(log.sentAt).toLocaleDateString('fr-FR')} {new Date(log.sentAt).toLocaleTimeString('fr-FR')}
                        </p>
                        <p className="text-slate-600 mt-1">{log.subject}</p>
                    </div>
                    {log.status === 'sent' ? (
                        <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <CheckCheck className="h-3 w-3 mr-1" /> Envoyé
                        </span>
                    ) : (
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            <XCircle className="h-3 w-3 mr-1" /> Échec
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
