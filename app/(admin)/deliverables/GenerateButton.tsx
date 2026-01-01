"use client";

import { RefreshCw } from "lucide-react";
import { generateMonthlyDeliverables } from "@/lib/actions";

export default function GenerateButton() {
    async function handleClick() {
        if (confirm("Générer les BL/PV vides pour tous les contrats actifs de ce mois ?")) {
            await generateMonthlyDeliverables();
        }
    }

    return (
        <button
            onClick={handleClick}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
            <RefreshCw className="mr-2 h-4 w-4" />
            Générer Livrables du Mois
        </button>
    );
}
