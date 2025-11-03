"use client";
import { useState } from "react";
import { Appointment } from "@/model/Appointment";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentTable } from "@/components/appointment-table";
import { AppointmentForm } from "@/components/appointment-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorDisplay } from "@/components/error-display";
import { AppointmentService } from "@/services/AppointmentService";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCalendarEvent, IconClock, IconCheck, IconX, IconPlus } from "@tabler/icons-react";

export default function AppointmentsPage() {
  const { appointments, loading, error, refetch } = useAppointments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();

  const pendingAppointments = appointments.filter((a) => a.estado === "pendiente").length;
  const confirmedAppointments = appointments.filter((a) => a.estado === "confirmada").length;
  const completedAppointments = appointments.filter((a) => a.estado === "completada").length;
  const cancelledAppointments = appointments.filter((a) => a.estado === "cancelada").length;

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDelete = async (appointment: Appointment) => {
    if (!appointment.id) {
      toast.error("No se puede eliminar: ID no válido");
      return;
    }
    
    try {
      const service = new AppointmentService();
      await service.deleteAppointment(appointment.id);
      toast.success(`Cita de ${appointment.nombreCliente} eliminada correctamente`);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la cita");
    }
  };

  const handleAdd = () => {
    setSelectedAppointment(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    const service = new AppointmentService();
    try {
      if (selectedAppointment?.id) {
        await service.updateAppointment(selectedAppointment.id, data);
        toast.success("Cita actualizada correctamente");
      } else {
        await service.addAppointment(data);
        toast.success("Cita creada correctamente");
      }
      setIsFormOpen(false);
      setSelectedAppointment(undefined);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la cita");
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citas</h1>
            <p className="text-muted-foreground">
              Gestiona todas las citas de tu barbería
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <IconPlus className="size-4" />
            Nueva Cita
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Citas
              </CardTitle>
              <IconCalendarEvent className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Total registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes
              </CardTitle>
              <IconClock className="size-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAppointments}
              </div>
              <p className="text-xs text-muted-foreground">
                Por confirmar
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Confirmadas
              </CardTitle>
              <IconCheck className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {confirmedAppointments}
              </div>
              <p className="text-xs text-muted-foreground">
                Activas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completadas
              </CardTitle>
              <IconCheck className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {completedAppointments}
              </div>
              <p className="text-xs text-muted-foreground">
                Finalizadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Citas */}
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Citas</CardTitle>
              <CardDescription>
                Busca, filtra y gestiona las citas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner message="Cargando citas..." />
              ) : error ? (
                <ErrorDisplay
                  error={error}
                  onRetry={refetch}
                  title="Error al cargar citas"
                />
              ) : (
                <AppointmentTable
                  data={appointments}
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

      {/* Formulario de Citas */}
      <AppointmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        appointment={selectedAppointment}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}



