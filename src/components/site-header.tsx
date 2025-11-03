"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { IconCalendarEvent } from "@tabler/icons-react";

export function SiteHeader() {
  const pathname = usePathname();
  
  const getTitle = () => {
    if (pathname === "/barbers") return "Barberos";
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/appointments") return "Citas";
    return "Dashboard";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold">{getTitle()}</h1>
          <Badge variant="secondary" className="text-xs">
            Gestión de Barbería
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground md:flex">
            <IconCalendarEvent className="size-4" />
            <span>{new Date().toLocaleDateString("es-ES", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
