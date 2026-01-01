import { getContractById } from "@/lib/actions";
import EditContractForm from "./EditContractForm";
import { notFound } from "next/navigation";

export default async function EditContractPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const contract = await getContractById(params.id);

    if (!contract) {
        return <div className="p-8">Chargement ou Contrat introuvable...</div>;
        // Or notFound();
    }

    return <EditContractForm contract={contract} />;
}
