import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'db.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "db.json not found" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // We use batches (limit 500)
        let batch = writeBatch(db);
        let count = 0;
        let total = 0;

        const collections = ['sst', 'contracts', 'deliverables', 'emails', 'clients'];

        for (const colName of collections) {
            const items = data[colName] || [];
            for (const item of items) {
                if (!item.id) continue;

                const ref = doc(db, colName, item.id);
                batch.set(ref, item);
                count++;
                total++;

                if (count >= 450) {
                    await batch.commit();
                    batch = writeBatch(db);
                    count = 0;
                }
            }
        }

        if (count > 0) {
            await batch.commit();
        }

        return NextResponse.json({ success: true, migrated: total });
    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
