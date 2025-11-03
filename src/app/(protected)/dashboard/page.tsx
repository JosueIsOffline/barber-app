"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { Barber } from "@/model/Baber";
import { useBarbers } from "@/hooks/useBarbers";
export default function Page() {
  const { barbers, loading, error } = useBarbers();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      {/* <DataTable data={data} /> */}

      <div className="px-4 lg:px-6">
        <ul className="space-y-2">
          {barbers.map((b) => (
            <li key={b.id} className="border p-2 rounded-md">
              <strong>{b.name}</strong>
              <strong>{b.email}</strong>
              <strong>{b.phone}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
