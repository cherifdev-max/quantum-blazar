export type SSTEntity = {
    id: string;
    companyName: string; // Société
    siret: string;
    address: string;
    mainContact: {
        name: string;
        email: string;
        phone: string;
    };
    portalToken?: string; // Secure token for magic link access
};

export type ContractStatus = 'Draft' | 'Active' | 'Completed' | 'Terminated';
export type DC4Status = 'Brouillon' | 'Soumis' | 'Validé' | 'Rejeté';

export type Contract = {
    id: string;
    sstId: string; // Foreign key to SSTEntity
    client: 'EDF' | 'ENEDIS';
    orderNumber: string; // Numéro de commande
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    totalAmount: number; // Montant total
    billedAmount: number; // Montant facturé
    purchasedAmount?: number; // Montant Achat (Coût SST)
    description?: string;
    dc4Status: DC4Status;
};

// Computed helper for RAF
export const calculateRAF = (contract: Contract) => contract.totalAmount - contract.billedAmount;
// Computed helper for Margin
export const calculateMargin = (contract: Contract) => {
    if (!contract.purchasedAmount) return 0;
    return contract.totalAmount - contract.purchasedAmount;
};
export const calculateMarginPercent = (contract: Contract) => {
    if (!contract.purchasedAmount || contract.totalAmount === 0) return 0;
    return ((contract.totalAmount - contract.purchasedAmount) / contract.totalAmount) * 100;
};

export type DeliverableType = 'BL' | 'PV' | 'Livrable';
export type DeliverableStatus = 'En attente' | 'Soumis' | 'Validé' | 'Rejeté';

export type DeliverableData = {
    // Commun
    periodStart?: string; // Début de période (ex: 01/01/2024)
    periodEnd?: string;   // Fin de période (clôture mensuelle)

    // BL (Bon de Livraison / Compte Rendu d'Activité)
    daysWorked?: number; // Nombre de jours / UO (Unités d'Oeuvre)
    activityDescription?: string; // Description succinte (ex: "Dévt Feature X, TMA...")

    // PV (Procès-Verbal de Recette / Validation d'activité)
    clientValidatorName?: string; // Responsable client qui valide (Chef de projet, PO...)
    reservations?: string; // Réserves éventuelles sur la prestation
    tjm?: number; // Taux Journalier (Optionnel, pour ref)
    signature?: string; // Base64 data URL - Added for electronic signature
};

export type Deliverable = {
    id: string;
    contractId: string;
    month: string; // Format YYYY-MM
    type: DeliverableType;
    status: DeliverableStatus;
    fileUrl?: string;
    submissionDate?: string;
    data?: DeliverableData;
};

export interface ClientEntity {
    id: string;
    name: string;
    description?: string;
}

export type Notification = {
    id: string;
    type: 'Alert' | 'Reminder';
    message: string;
    date: string;
    read: boolean;
    relatedContractId?: string;
};

export interface EmailLog {
    id: string;
    to: string;
    subject: string;
    body: string;
    sentAt: string;
    status: 'sent' | 'failed';
}
