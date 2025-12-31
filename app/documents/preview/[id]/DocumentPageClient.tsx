"use client";

import Link from "next/link";
import { Printer, ChevronLeft } from "lucide-react";
import { DocumentPreview } from "@/components/pdf/DocumentPreview";
import { Contract, SSTEntity, Deliverable } from "@/types";

interface DocumentPageClientProps {
    type: 'BL' | 'PV';
    contract: Contract;
    sst: SSTEntity;
    deliverable: Deliverable;
}

export default function DocumentPageClient({ type, contract, sst, deliverable }: DocumentPageClientProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8 print:p-0 print:bg-white">
            <div className="max-w-4xl mx-auto print:hidden mb-6 flex justify-between items-center">
                <Link href="/deliverables" className="flex items-center text-slate-500 hover:text-slate-900">
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Retour aux livrables
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer / PDF
                    </button>
                </div>
            </div>

            <div className="print:block">
                <DocumentPreview
                    type={type}
                    contract={contract}
                    sst={sst}
                    deliverable={deliverable}
                />
            </div>

            <style jsx global>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
        }
      `}</style>
        </div>
    );
}
