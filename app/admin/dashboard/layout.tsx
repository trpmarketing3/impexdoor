import type { ReactNode } from "react";
import Sidebar from "./_components/sidebar";
import Topbar from "./_components/topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-hidden px-6 py-8">
            <div className="flex h-full flex-col overflow-hidden">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}


