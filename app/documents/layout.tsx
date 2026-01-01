
export default function DocumentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm print:hidden">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                            Q
                        </div>
                        <h1 className="text-lg font-semibold text-slate-800">Espace Partenaire</h1>
                    </div>
                    <div className="text-sm text-slate-500">
                        SST Manager
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 print:p-0">
                {children}
            </main>
        </div>
    );
}
