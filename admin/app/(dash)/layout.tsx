import type { ReactNode } from "react";
import Sidebar from "@/components/_common/sidebar/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <Sidebar />
      {children}
    </main>
  );
}
