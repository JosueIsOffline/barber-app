"use client";
import { useState } from "react";
import { Barber } from "@/model/Baber";
import { useBarbers } from "@/hooks/useBarbers";
import { BarberTable } from "@/components/barber-table";
import { BarberForm } from "@/components/barber-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorDisplay } from "@/components/error-display";
import { BaberService } from "@/services/BarberService";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUsers, IconClock, IconCheck, IconX, IconPlus } from "@tabler/icons-react";

export default function BarbersPage() {
  const { barbers, loading, error, refetch } = useBarbers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | undefined>();

  const activeBarbers = barbers.filter((b) => b.status !== false).length;
  const inactiveBarbers = barbers.length - activeBarbers;

  const handleEdit = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsFormOpen(true);
  };

  const handleDelete = async (barber: Barber) => {
    if (!barber.id) {
      toast.error("No se puede eliminar: ID no válido");
      return;
    }
    
    try {
      const service = new BaberService();
      await service.deleteBaber(barber.id);
      toast.success(`${barber.name} eliminado correctamente`);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el barbero");
    }
  };

  const handleAdd = () => {
    setSelectedBarber(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    const service = new BaberService();
    try {
      if (selectedBarber?.id) {
        await service.updateBaber(selectedBarber.id, data);
        toast.success("Barbero actualizado correctamente");
      } else {
        await service.addBaber(data);
        toast.success("Barbero creado correctamente");
      }
      setIsFormOpen(false);
      setSelectedBarber(undefined);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el barbero");
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Barberos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los barberos de tu barbería
            </p>
          </div>
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
              <div className="text-2xl font-bold">
                {barbers.reduce(
                  (acc, b) => acc + (b.services?.length || 0),
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Servicios ofrecidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Barberos */}
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Barberos</CardTitle>
              <CardDescription>
                Busca, filtra y gestiona los barberos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner message="Cargando barberos..." />
              ) : error ? (
                <ErrorDisplay
                  error={error}
                  onRetry={refetch}
                  title="Error al cargar barberos"
                />
              ) : (
                <BarberTable
                  data={barbers}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulario de Barberos */}
      <BarberForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        barber={selectedBarber}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}


