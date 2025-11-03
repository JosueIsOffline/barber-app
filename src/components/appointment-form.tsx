"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Appointment } from "@/model/Appointment";
import { Barber } from "@/model/Baber";
import { useBarbers } from "@/hooks/useBarbers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const appointmentSchema = z.object({
  nombreCliente: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  emailCliente: z.string().email("Email inválido").optional().or(z.literal("")),
  telefonoCliente: z.string().optional(),
  barberoId: z.string().min(1, "Debe seleccionar un barbero"),
  barberoNombre: z.string().optional(),
  servicio: z.string().min(1, "Debe seleccionar un servicio"),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().min(1, "La hora es requerida"),
  estado: z.enum(["pendiente", "confirmada", "completada", "cancelada"]),
  notas: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
}

export function AppointmentForm({ open, onOpenChange, appointment, onSubmit }: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const { barbers, loading: barbersLoading } = useBarbers();

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);
  const availableServices = selectedBarber?.services || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      nombreCliente: appointment?.nombreCliente || "",
      emailCliente: appointment?.emailCliente || "",
      telefonoCliente: appointment?.telefonoCliente || "",
      barberoId: appointment?.barberoId || "",
      servicio: appointment?.servicio || "",
      fecha: appointment?.fecha || "",
      hora: appointment?.hora || "",
      estado: appointment?.estado || "pendiente",
      notas: appointment?.notas || "",
    },
  });

  const barberoId = watch("barberoId");

  useEffect(() => {
    if (barberoId) {
      setSelectedBarberId(barberoId);
      const barber = barbers.find((b) => b.id === barberoId);
      if (barber && appointment?.barberoId === barberoId && appointment?.servicio) {
        // Si el servicio está en los servicios del barbero, mantenerlo
        if (!barber.services.includes(appointment.servicio)) {
          setValue("servicio", "");
        }
      } else if (!appointment) {
        setValue("servicio", "");
      }
    }
  }, [barberoId, barbers, appointment, setValue]);

  useEffect(() => {
    if (appointment) {
      reset({
        nombreCliente: appointment.nombreCliente || "",
        emailCliente: appointment.emailCliente || "",
        telefonoCliente: appointment.telefonoCliente || "",
        barberoId: appointment.barberoId || "",
        servicio: appointment.servicio || "",
        fecha: appointment.fecha || "",
        hora: appointment.hora || "",
        estado: appointment.estado || "pendiente",
        notas: appointment.notas || "",
      });
      setSelectedBarberId(appointment.barberoId || "");
    } else {
      reset({
        nombreCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        barberoId: "",
        servicio: "",
        fecha: new Date().toISOString().split("T")[0],
        hora: "",
        estado: "pendiente",
        notas: "",
      });
      setSelectedBarberId("");
    }
  }, [appointment, reset]);

  const onFormSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      // Obtener el nombre del barbero
      const barber = barbers.find((b) => b.id === data.barberoId);
      await onSubmit({
        ...data,
        barberoNombre: barber?.name || "",
      });
      onOpenChange(false);
      reset();
      setSelectedBarberId("");
    } catch (error: any) {
      // El error ya se maneja en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener la fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? "Editar Cita" : "Nueva Cita"}</DialogTitle>
          <DialogDescription>
            {appointment
              ? "Modifica la información de la cita"
              : "Completa la información para crear una nueva cita"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombreCliente">
                Nombre del Cliente <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombreCliente"
                placeholder="Nombre completo"
                {...register("nombreCliente")}
                className={errors.nombreCliente ? "border-destructive" : ""}
              />
              {errors.nombreCliente && (
                <p className="text-sm text-destructive">{errors.nombreCliente.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="emailCliente">Email</Label>
                <Input
                  id="emailCliente"
                  type="email"
                  placeholder="email@ejemplo.com"
                  {...register("emailCliente")}
                  className={errors.emailCliente ? "border-destructive" : ""}
                />
                {errors.emailCliente && (
                  <p className="text-sm text-destructive">{errors.emailCliente.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefonoCliente">Teléfono</Label>
                <Input
                  id="telefonoCliente"
                  placeholder="+1 234 567 890"
                  {...register("telefonoCliente")}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="barberoId">
                Barbero <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("barberoId")}
                onValueChange={(value) => {
                  setValue("barberoId", value);
                  setValue("servicio", "");
                }}
              >
                <SelectTrigger
                  id="barberoId"
                  className={errors.barberoId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Selecciona un barbero" />
                </SelectTrigger>
                <SelectContent>
                  {barbersLoading ? (
                    <SelectItem value="loading" disabled>
                      Cargando barberos...
                    </SelectItem>
                  ) : barbers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay barberos disponibles
                    </SelectItem>
                  ) : (
                    barbers
                      .filter((b) => b.status !== false)
                      .map((barber) => (
                        <SelectItem key={barber.id} value={barber.id || ""}>
                          {barber.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
              {errors.barberoId && (
                <p className="text-sm text-destructive">{errors.barberoId.message}</p>
              )}
            </div>

            {selectedBarber && (
              <div className="grid gap-2">
                <Label htmlFor="servicio">
                  Servicio <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("servicio")}
                  onValueChange={(value) => setValue("servicio", value)}
                >
                  <SelectTrigger
                    id="servicio"
                    className={errors.servicio ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Este barbero no tiene servicios disponibles
                      </SelectItem>
                    ) : (
                      availableServices.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.servicio && (
                  <p className="text-sm text-destructive">{errors.servicio.message}</p>
                )}
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">
                  Fecha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  min={today}
                  {...register("fecha")}
                  className={errors.fecha ? "border-destructive" : ""}
                />
                {errors.fecha && (
                  <p className="text-sm text-destructive">{errors.fecha.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hora">
                  Hora <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hora"
                  type="time"
                  {...register("hora")}
                  className={errors.hora ? "border-destructive" : ""}
                />
                {errors.hora && (
                  <p className="text-sm text-destructive">{errors.hora.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={watch("estado")}
                onValueChange={(value: any) => setValue("estado", value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Notas adicionales sobre la cita..."
                {...register("notas")}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : appointment ? "Actualizar" : "Crear Cita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

