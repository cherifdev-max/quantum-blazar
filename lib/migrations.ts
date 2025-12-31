
import { readDB, writeDB } from './storage';

export async function migrateContractsPurchaseAmount() {
    const db = await readDB();

    // Iterate and update old contracts
    const updatedContracts = db.contracts.map(contract => {
        // If purchasedAmount is missing or 0, we simulate a realistic default
        // Let's assume a 20% margin: Purchase Price = Selling Price * 0.8
        if (!contract.purchasedAmount) {
            return {
                ...contract,
                purchasedAmount: Math.round(contract.totalAmount * 0.8 * 100) / 100
            };
        }
        return contract;
    });

    db.contracts = updatedContracts;
    await writeDB(db);
    console.log(`Migration completed: Updated ${updatedContracts.length} contracts.`);
}

export async function getDeliverables() {
    const db = await readDB();
    return db.deliverables || [];
}
