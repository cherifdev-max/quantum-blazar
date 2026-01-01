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

import { updateDeliverableStatusAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DocumentPageClientProps {
    type: 'BL' | 'PV';
    contract: Contract;
    sst: SSTEntity;
    deliverable: Deliverable;
    token?: string;
}

import SignatureCanvas from 'react-signature-canvas';
import { useRef } from "react";

export default function DocumentPageClient({ type, contract, sst, deliverable, token }: DocumentPageClientProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const sigCanvas = useRef<SignatureCanvas>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleClear = () => {
        sigCanvas.current?.clear();
    };

    const handleSubmit = async () => {
        if (!confirm("Voulez-vous confirmer et soumettre ce document ?\nUne fois soumis, vous ne pourrez plus le modifier.")) return;

        // Check if signature is empty (optional, but good practice)
        if (canSubmit && sigCanvas.current?.isEmpty()) {
            if (!confirm("Vous n'avez pas signé. Voulez-vous continuer sans signature ?")) return;
        }

        const signatureData = sigCanvas.current?.isEmpty() ? undefined : sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

        setSubmitting(true);
        try {
            await updateDeliverableStatusAction(deliverable.id, 'Soumis', signatureData);
            alert("Document soumis avec succès !");
            if (token) {
                router.push(`/portal/${token}`);
            } else {
                router.push('/deliverables');
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de la soumission.");
        } finally {
            setSubmitting(false);
        }
    };

    const backLink = token ? `/portal/${token}` : "/deliverables";
    const canSubmit = token && (deliverable.status === 'En attente' || deliverable.status === 'Rejeté');

    return (
        <div className="min-h-screen bg-slate-100 p-8 print:p-0 print:bg-white">
            <div className="max-w-4xl mx-auto print:hidden mb-6 flex justify-between items-center">
                <Link href={backLink} className="flex items-center text-slate-500 hover:text-slate-900">
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    {token ? "Retour à mon espace" : "Retour aux livrables"}
                </Link>
                <div className="flex gap-4">
                    {canSubmit && (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Validation...' : 'Valider et Soumettre'}
                        </button>
                    )}
                    <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer / PDF
                    </button>
                </div>
            </div>

            {/* Signature Area for SST */}
            {canSubmit && (
                <div className="max-w-[210mm] mx-auto mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:hidden">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Veuillez signer ci-dessous avant de valider</h3>
                    <div className="border border-slate-300 rounded-lg bg-slate-50 relative">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{
                                className: 'w-full h-40 cursor-crosshair rounded-lg'
                            }}
                        />
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 text-xs text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded border border-slate-200"
                        >
                            Effacer
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Signez avec votre souris ou votre doigt.</p>
                </div>
            )}

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
