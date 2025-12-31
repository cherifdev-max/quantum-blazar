import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SST Manager - Suivi Prestations",
  description: "Application de gestion pour le suivi des prestations SST EDF/ENEDIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible">
          <div className="print:hidden">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible print:h-auto">
            <div className="print:hidden">
              <Header />
            </div>
            <main className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible print:h-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
