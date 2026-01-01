"use server";

import { db } from "./firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    writeBatch
} from "firebase/firestore";
import { SSTEntity, Contract, Deliverable, ClientEntity, EmailLog, DeliverableType, DeliverableData } from "@/types";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./mail";

// Helper to sanitize data from Firestore snapshots
const mapDoc = <T>(doc: any): T => ({ id: doc.id, ...doc.data() } as T);

export async function getSSTs(): Promise<SSTEntity[]> {
    const querySnapshot = await getDocs(collection(db, "sst"));
    return querySnapshot.docs.map(mapDoc<SSTEntity>);
}

export async function getContracts(): Promise<Contract[]> {
    const querySnapshot = await getDocs(collection(db, "contracts"));
    return querySnapshot.docs.map(mapDoc<Contract>);
}

export async function deleteSST(id: string) {
    await deleteDoc(doc(db, "sst", id));
    revalidatePath("/sst");
}

export async function deleteContract(id: string) {
    await deleteDoc(doc(db, "contracts", id));

    // Cleanup linked deliverables
    const q = query(collection(db, "deliverables"), where("contractId", "==", id));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    revalidatePath("/contracts");
    revalidatePath("/deliverables");
}

export async function getSSTById(id: string): Promise<SSTEntity | undefined> {
    const docRef = doc(db, "sst", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return undefined;
    return mapDoc<SSTEntity>(docSnap);
}

export async function createSST(formData: FormData) {
    const newSST: Omit<SSTEntity, "id"> = {
        companyName: formData.get("companyName") as string,
        siret: formData.get("siret") as string,
        address: formData.get("address") as string,
        mainContact: {
            name: formData.get("contactName") as string,
            email: formData.get("contactEmail") as string,
            phone: formData.get("contactPhone") as string,
        },
    };

    await addDoc(collection(db, "sst"), newSST);
    revalidatePath("/sst");
}

export async function updateSST(id: string, formData: FormData) {
    const updateData = {
        companyName: formData.get("companyName") as string,
        siret: formData.get("siret") as string,
        address: formData.get("address") as string,
        mainContact: {
            name: formData.get("contactName") as string,
            email: formData.get("contactEmail") as string,
            phone: formData.get("contactPhone") as string,
        },
    };

    await updateDoc(doc(db, "sst", id), updateData);
    revalidatePath("/sst");
}

export async function sendCampaign(formData?: FormData) {
    const logs: Omit<EmailLog, "id">[] = [];
    const sstId = formData?.get("sstId")?.toString();
    const campaignType = (sstId && sstId !== "all") ? "Individuel" : "Global";

    let targetSSTs: SSTEntity[] = [];

    if (sstId && sstId !== "all") {
        const sst = await getSSTById(sstId);
        if (sst) targetSSTs.push(sst);
    } else {
        targetSSTs = await getSSTs();
    }

    const batch = writeBatch(db);
    const emailsRef = collection(db, "emails");

    for (const sst of targetSSTs) {
        const subject = `[${campaignType}] Rappel : Dépôt de vos livrables (BL/PV)`;
        const bodyText = `Bonjour ${sst.mainContact.name},\n\nNous vous rappelons que vous devez déposer vos BL et PV avant le 25 du mois.\n\nCordialement,\nService Achats.`;
        const bodyHtml = `<p>Bonjour <strong>${sst.mainContact.name}</strong>,</p><p>Nous vous rappelons que vous devez déposer vos BL et PV avant le 25 du mois.</p><p>Cordialement,<br>Service Achats.</p>`;

        let status: 'sent' | 'failed' = 'sent';

        // Attempt sending real email
        const result = await sendEmail({
            to: sst.mainContact.email,
            subject,
            html: bodyHtml
        });

        status = result.success ? 'sent' : 'failed';

        const log = {
            to: sst.mainContact.email,
            subject,
            body: bodyText,
            sentAt: new Date().toISOString(),
            status,
            error: result.error || null // Store error details
        };
        const newDocRef = doc(emailsRef);
        batch.set(newDocRef, log);
    }

    await batch.commit();
    revalidatePath("/reports");
}

export async function createContract(formData: FormData) {
    const newContract: any = {
        client: formData.get("client") as string,
        orderNumber: formData.get("orderNumber") as string,
        sstId: formData.get("sstId") as string,
        description: formData.get("description") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        totalAmount: parseFloat(formData.get("totalAmount") as string),
        billedAmount: parseFloat(formData.get("billedAmount") as string),
        purchasedAmount: parseFloat(formData.get("purchasedAmount") as string) || 0,
        dc4Status: 'Brouillon'
    };

    await addDoc(collection(db, "contracts"), newContract);

    revalidatePath("/contracts");
    revalidatePath("/");
    revalidatePath("/reports");
}

export async function updateContract(id: string, formData: FormData) {
    const updateData = {
        client: formData.get("client") as string,
        orderNumber: formData.get("orderNumber") as string,
        sstId: formData.get("sstId") as string,
        description: formData.get("description") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        totalAmount: parseFloat(formData.get("totalAmount") as string),
        billedAmount: parseFloat(formData.get("billedAmount") as string),
        purchasedAmount: parseFloat(formData.get("purchasedAmount") as string) || 0,
        dc4Status: formData.get("dc4Status") as string,
    };

    await updateDoc(doc(db, "contracts", id), updateData);

    revalidatePath("/contracts");
    revalidatePath(`/contracts/${id}`);
    revalidatePath("/reports");
    revalidatePath("/");
}

export async function getContractById(id: string) {
    const docSnap = await getDoc(doc(db, "contracts", id));
    if (!docSnap.exists()) return undefined;
    return mapDoc<Contract>(docSnap);
}

export async function getDeliverables() {
    const querySnapshot = await getDocs(collection(db, "deliverables"));
    return querySnapshot.docs.map(mapDoc<Deliverable>);
}

export async function generateMonthlyDeliverables() {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const contracts = await getContracts();

    // Fetch existing deliverables for this month to check duplicates
    // Optimization: query only this month's deliverables
    const q = query(collection(db, "deliverables"), where("month", "==", currentMonth));
    const existingSnap = await getDocs(q);
    const existingKeys = new Set(existingSnap.docs.map(d => `${d.data().contractId}-${d.data().type}`)); // simple key

    const batch = writeBatch(db);
    let createdCount = 0;
    const deliverablesRef = collection(db, "deliverables");

    for (const contract of contracts) {
        if (new Date(contract.endDate) >= currentDate) {
            // Check duplicates
            const blKey = `${contract.id}-BL`;
            const pvKey = `${contract.id}-PV`;

            if (!existingKeys.has(blKey)) {
                const newBL = {
                    contractId: contract.id,
                    month: currentMonth,
                    type: 'BL',
                    status: 'En attente',
                    data: {
                        daysWorked: 20,
                        activityDescription: contract.description
                    }
                };
                batch.set(doc(deliverablesRef), newBL);
                createdCount++;
            }
            if (!existingKeys.has(pvKey)) {
                const newPV = {
                    contractId: contract.id,
                    month: currentMonth,
                    type: 'PV',
                    status: 'En attente',
                    data: {
                        daysWorked: 20,
                        activityDescription: contract.description
                    }
                };
                batch.set(doc(deliverablesRef), newPV);
                createdCount++;
            }
        }
    }

    if (createdCount > 0) {
        await batch.commit();
    }

    revalidatePath("/deliverables");
    return createdCount;
}

export async function updateDeliverableStatus(id: string, newStatus: string) {
    const deliverableRef = doc(db, "deliverables", id);
    const updateData: any = { status: newStatus };

    if (newStatus === 'Soumis') {
        const docSnap = await getDoc(deliverableRef);
        const type = docSnap.exists() ? docSnap.data().type : 'BL';

        updateData.submissionDate = new Date().toISOString();
        updateData.fileUrl = `/documents/preview/${id}?type=${type}`;
    }

    await updateDoc(deliverableRef, updateData);
    revalidatePath("/deliverables");
}

export async function createManualDeliverable(formData: FormData) {
    try {
        const daysWorked = formData.get("daysWorked") ? parseFloat(formData.get("daysWorked") as string) : undefined;
        const activityDescription = formData.get("activityDescription") as string || undefined;
        const clientValidatorName = formData.get("clientValidatorName") as string || undefined;
        const reservations = formData.get("reservations") as string || undefined;

        // Create object and remove undefined keys for Firestore compatibility
        const data: DeliverableData = JSON.parse(JSON.stringify({
            daysWorked,
            activityDescription,
            clientValidatorName,
            reservations
        }));

        const newDeliverable = {
            contractId: formData.get("contractId") as string,
            month: formData.get("month") as string,
            type: formData.get("type") as DeliverableType,
            status: 'En attente',
            data
        };

        await addDoc(collection(db, "deliverables"), newDeliverable);
        revalidatePath("/deliverables");
    } catch (error) {
        console.error("Error creating manual deliverable:", error);
        throw error; // Re-throw to inform client
    }
}

export async function updateDeliverableData(id: string, formData: FormData) {
    try {
        const daysWorked = formData.get("daysWorked") ? parseFloat(formData.get("daysWorked") as string) : undefined;
        const activityDescription = formData.get("activityDescription") as string || undefined;
        const clientValidatorName = formData.get("clientValidatorName") as string || undefined;
        const reservations = formData.get("reservations") as string || undefined;

        // Create object and remove undefined keys for Firestore compatibility
        const data: DeliverableData = JSON.parse(JSON.stringify({
            daysWorked,
            activityDescription,
            clientValidatorName,
            reservations
        }));

        await updateDoc(doc(db, "deliverables", id), { data });
        revalidatePath("/deliverables");
        revalidatePath(`/documents/preview/${id}`); // Revalidate preview page
    } catch (error) {
        console.error("Error updating deliverable data:", error);
        throw error;
    }
}

export async function deleteDeliverable(id: string) {
    await deleteDoc(doc(db, "deliverables", id));
    revalidatePath("/deliverables");
}

export async function getDeliverableById(id: string) {
    const docSnap = await getDoc(doc(db, "deliverables", id));
    if (!docSnap.exists()) return undefined;
    return mapDoc<Deliverable>(docSnap);
}

export async function getClients(): Promise<ClientEntity[]> {
    const querySnapshot = await getDocs(collection(db, "clients"));
    return querySnapshot.docs.map(mapDoc<ClientEntity>);
}

export async function createClient(formData: FormData) {
    const newClient = {
        name: formData.get("name") as string,
        description: formData.get("description") as string
    };
    await addDoc(collection(db, "clients"), newClient);
    revalidatePath("/clients");
    revalidatePath("/contracts/new");
}

export async function deleteClient(id: string) {
    await deleteDoc(doc(db, "clients", id));
    revalidatePath("/clients");
    revalidatePath("/contracts/new");
}

export async function getEmailLogs(): Promise<EmailLog[]> {
    const querySnapshot = await getDocs(collection(db, "emails"));
    const logs = querySnapshot.docs.map(mapDoc<EmailLog>);
    return logs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}
