"use client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useBarbers } from "@/hooks/useBarbers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconUsers, IconClock, IconCheck, IconX, IconCalendarEvent } from "@tabler/icons-react";
import Link from "next/link";

export default function DashboardPage() {
  const { barbers, loading } = useBarbers();

  const activeBarbers = barbers.filter((b) => b.status !== false).length;
  const inactiveBarbers = barbers.length - activeBarbers;
  const totalServices = barbers.reduce(
    (acc, b) => acc + (b.services?.length || 0),
    0
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Encabezado */}
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visión general de tu barbería
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Barberos
            </CardTitle>
            <IconUsers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barbers.length}</div>
            <p className="text-xs text-muted-foreground">
              Total registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Barberos Activos
            </CardTitle>
            <IconCheck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeBarbers}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles ahora
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Barberos Inactivos
            </CardTitle>
            <IconX className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveBarbers}
            </div>
            <p className="text-xs text-muted-foreground">
              No disponibles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Servicios Totales
            </CardTitle>
            <IconClock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Servicios ofrecidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Acciones Rápidas */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/barbers">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUsers className="size-5" />
                      Gestionar Barberos
                    </CardTitle>
                    <CardDescription>
                      Ver, agregar, editar o eliminar barberos
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/appointments">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconCalendarEvent className="size-5" />
                      Gestionar Citas
                    </CardTitle>
                    <CardDescription>
                      Ver, crear y administrar citas
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IconClock className="size-5" />
                    Gestionar Servicios
                  </CardTitle>
                  <CardDescription>
                    Próximamente: gestión de servicios
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


