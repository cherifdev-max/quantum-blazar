import { getDeliverableById, getContractById, getSSTById } from "@/lib/actions";
import DocumentPageClient from "./DocumentPageClient";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DocumentPage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const { id } = params;
    const type = (searchParams.type as 'BL' | 'PV') || 'BL';

    const deliverable = await getDeliverableById(id);
    if (!deliverable) return notFound();

    const contract = await getContractById(deliverable.contractId);
    if (!contract) return notFound();

    const sst = await getSSTById(contract.sstId);
    if (!sst) return notFound();

    return (
        <DocumentPageClient
            type={type}
            contract={contract}
            sst={sst}
            deliverable={deliverable}
            token={searchParams.token as string}
        />
    );
}
