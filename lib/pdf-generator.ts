import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Contract, SSTEntity, Deliverable } from "@/types";
import { format } from "date-fns";

export async function generateBLPDF(contract: Contract, sst: SSTEntity, deliverable: Deliverable): Promise<Buffer> {
    // Create new PDF document (A4 size)
    const doc = new jsPDF();
    const data = deliverable.data;
    const typeLabel = deliverable.type === 'BL' ? 'Bon de Livraison' : 'Procès-Verbal';
    const currentDate = new Date();

    // -- Header --
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(typeLabel.toUpperCase(), 15, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Période : ${deliverable.month}`, 15, 28);

    // -- SST Info (Right aligned) --
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    if (deliverable.type === 'PV') doc.setTextColor(147, 51, 234); // Purple
    else doc.setTextColor(37, 99, 235); // Blue

    doc.text(sst.companyName, 195, 20, { align: "right" });

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(sst.address, 195, 26, { align: "right" });
    doc.text(`SIRET : ${sst.siret}`, 195, 32, { align: "right" });

    // -- Separator --
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, 38, 195, 38);

    // -- Client Info Box --
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(15, 45, 180, 25, "F");

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT", 20, 52);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(contract.client, 20, 58);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Référence Commande : ${contract.orderNumber}`, 20, 64);

    // -- Content Body --
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Détail de la prestation", 15, 85);
    doc.line(15, 87, 65, 87); // Small underline

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(contract.description, 180);
    doc.text(descriptionLines, 15, 95);

    // Table
    const startY = 95 + (descriptionLines.length * 5) + 5;

    autoTable(doc, {
        startY: startY,
        head: [['Désignation', 'Quantité / Jours']],
        body: [
            [
                `Forfait mensuel - ${deliverable.month}\n${data?.activityDescription || ''}`,
                data?.daysWorked ? `${data.daysWorked} Jours` : '1 Forfait'
            ]
        ],
        theme: 'plain',
        headStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: 'bold' },
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 140 },
            1: { halign: 'right' }
        }
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;

    // Reservations (PV only)
    if (deliverable.type === 'PV' && data?.reservations) {
        doc.setFillColor(255, 251, 235); // amber-50
        doc.setDrawColor(253, 230, 138); // amber-200
        doc.rect(15, finalY, 180, 20, "DF");

        doc.setFontSize(8);
        doc.setTextColor(146, 64, 14); // amber-800
        doc.text("RÉSERVES / OBSERVATIONS", 20, finalY + 6);

        doc.setFontSize(10);
        doc.setTextColor(120, 53, 15); // amber-900
        doc.text(data.reservations, 20, finalY + 12);

        finalY += 25;
    }

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    const disclaimer = deliverable.type === 'PV'
        ? "Nous certifions que les prestations décrites ci-dessus ont été réalisées conformément au cahier des charges."
        : "Ce document atteste de la livraison des éléments contractuels pour la période concernée.";
    doc.text(disclaimer, 15, finalY + 10);

    // -- Signatures --
    const sigY = finalY + 30;

    // Box 1
    doc.setDrawColor(200);
    doc.rect(15, sigY, 85, 30);
    doc.setFont("helvetica", "bold");
    doc.text("Pour le Prestataire", 20, sigY + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(sst.mainContact.name, 20, sigY + 25);

    // Box 2
    doc.setDrawColor(200);
    doc.rect(110, sigY, 85, 30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100);
    doc.text(`Pour ${contract.client}`, 115, sigY + 6);

    if (deliverable.type === 'PV' && data?.clientValidatorName) {
        doc.setFontSize(8);
        doc.text("Validé par :", 115, sigY + 20);
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(data.clientValidatorName, 115, sigY + 25);
    }

    // -- Footer --
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Document généré automatiquement le ${format(currentDate, 'dd/MM/yyyy')} via SST Manager.`, 105, pageHeight - 10, { align: 'center' });

    // Return logic based on runtime environment
    // In React/Next.js client-side, .output('arraybuffer') is standard.
    // server-side Node.js needs Buffer.from()
    return Buffer.from(doc.output('arraybuffer'));
}
