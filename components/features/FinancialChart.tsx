"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartData {
    name: string; // Month name
    facture: number; // Billed
    raf: number; // Remaining
}

export default function FinancialChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-400">Aucune donnée disponible</div>;

    // Formatting for currency
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
        return `${value}€`;
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 11 }}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px'
                        }}
                        formatter={(value: any, name: any) => [
                            `${Number(value || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
                            name === 'facture' ? 'Déjà Facturé' : 'Rreste à Facturer'
                        ]}
                        cursor={{ fill: '#F8FAFC' }}
                    />
                    <Bar dataKey="facture" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="facture" />
                    <Bar dataKey="raf" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} name="raf" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
