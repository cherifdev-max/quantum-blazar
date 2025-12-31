import { SSTEntity, Contract, Deliverable } from "@/types";

export const MOCK_SST: SSTEntity[] = [
    {
        id: "sst-1",
        companyName: "TechSolutions SAS",
        siret: "12345678900010",
        address: "12 Rue de l'Industrie, 75011 Paris",
        mainContact: { name: "Jean Dupont", email: "j.dupont@techsolutions.fr", phone: "0102030405" },
    },
    {
        id: "sst-2",
        companyName: "ElecExperts",
        siret: "98765432100022",
        address: "45 Avenue de l'Energie, 69000 Lyon",
        mainContact: { name: "Marie Curie", email: "contact@elecexperts.com", phone: "0478901234" },
    },
];

export const MOCK_CONTRACTS: Contract[] = [
    {
        id: "c-1",
        sstId: "sst-1",
        client: "EDF",
        orderNumber: "CMD-2024-001",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        totalAmount: 150000,
        billedAmount: 75000,
        dc4Status: "Validé",
        description: "Maintenance préventive Groupe A",
    },
    {
        id: "c-2",
        sstId: "sst-1",
        client: "ENEDIS",
        orderNumber: "CMD-2024-002",
        startDate: "2024-03-01",
        endDate: "2025-02-28",
        totalAmount: 50000,
        billedAmount: 10000,
        dc4Status: "Soumis",
        description: "Migration compteurs Linky - Zone Nord",
    },
    {
        id: "c-3",
        sstId: "sst-2",
        client: "EDF",
        orderNumber: "CMD-2024-003",
        startDate: "2024-06-01",
        endDate: "2024-09-30",
        totalAmount: 25000,
        billedAmount: 24000,
        dc4Status: "Validé",
        description: "Audit énergétique",
    },
];

export const MOCK_DELIVERABLES: Deliverable[] = [
    {
        id: "d-1",
        contractId: "c-1",
        month: "2024-01",
        type: "BL",
        status: "Validé",
    },
    {
        id: "d-2",
        contractId: "c-1",
        month: "2024-01",
        type: "PV",
        status: "Validé",
    },
    {
        id: "d-3",
        contractId: "c-1",
        month: "2024-02",
        type: "PV",
        status: "Soumis",
    },
    {
        id: "d-4",
        contractId: "c-2",
        month: "2024-03",
        type: "BL",
        status: "En attente",
    },
];
