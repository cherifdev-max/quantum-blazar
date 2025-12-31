import fs from 'fs/promises';
import path from 'path';
import { SSTEntity, Contract, Deliverable, ClientEntity } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface EmailLog {
    id: string;
    to: string;
    subject: string;
    body: string;
    sentAt: string;
    status: 'sent' | 'failed';
}

export interface Database {
    sst: SSTEntity[];
    contracts: Contract[];
    deliverables: Deliverable[];
    emails: EmailLog[];
    clients?: ClientEntity[];
}

export async function readDB(): Promise<Database> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty structure or default one
        console.error("Error reading DB", error);
        return { sst: [], contracts: [], deliverables: [], emails: [] };
    }
}

export async function writeDB(data: Database): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
