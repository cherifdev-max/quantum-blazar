"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
    onDelete: () => Promise<void>;
    itemName: string;
    className?: string;
    iconOnly?: boolean;
}

export default function DeleteButton({ onDelete, itemName, className, iconOnly = false }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Êtes-vous sûr de vouloir supprimer ${itemName} ? Cette action est irréversible.`)) {
            setIsDeleting(true);
            try {
                await onDelete();
            } catch (error) {
                alert("Erreur lors de la suppression");
            } finally {
                setIsDeleting(false);
            }
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isDeleting}
            className={cn(
                "group hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg",
                isDeleting && "opacity-50 cursor-not-allowed",
                className
            )}
            title={`Supprimer ${itemName}`}
        >
            <Trash2 className={cn("h-4 w-4", iconOnly ? "" : "mr-2", isDeleting && "animate-pulse")} />
            {!iconOnly && "Supprimer"}
        </button>
    );
}
