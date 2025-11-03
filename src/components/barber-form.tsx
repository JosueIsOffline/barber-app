"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { IconX } from "@tabler/icons-react";

import { Barber } from "@/model/Baber";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const barberSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  services: z.array(z.string()).min(1, "Debe tener al menos un servicio"),
  status: z.boolean().optional(),
});

type BarberFormData = z.infer<typeof barberSchema>;

interface BarberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber;
  onSubmit: (data: BarberFormData) => Promise<void>;
}

const AVAILABLE_SERVICES = [
  "Corte de cabello",
  "Barba",
  "Corte + Barba",
  "Afeitado clásico",
  "Tinte",
  "Alisado",
  "Cejas",
  "Tratamiento capilar",
];

export function BarberForm({ open, onOpenChange, barber, onSubmit }: BarberFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(barber?.services || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BarberFormData>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: barber?.name || "",
      email: barber?.email || "",
      phone: barber?.phone || "",
      startDate: barber?.startDate || "09:00",
      endDate: barber?.endDate || "18:00",
      services: barber?.services || [],
      status: barber?.status ?? true,
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (barber) {
      reset({
        name: barber.name || "",
        email: barber.email || "",
        phone: barber.phone || "",
        startDate: barber.startDate || "09:00",
        endDate: barber.endDate || "18:00",
        services: barber.services || [],
        status: barber.status ?? true,
      });
      setSelectedServices(barber.services || []);
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        startDate: "09:00",
        endDate: "18:00",
        services: [],
        status: true,
      });
      setSelectedServices([]);
    }
  }, [barber, reset]);

  const toggleService = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(newServices);
    setValue("services", newServices);
  };

  const onFormSubmit = async (data: BarberFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, services: selectedServices });
      // El toast se maneja en el componente padre (dashboard)
      onOpenChange(false);
      reset();
      setSelectedServices([]);
    } catch (error: any) {
      // El error ya se maneja en el componente padre
      // Pero mantenemos el estado para evitar envíos duplicados
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{barber ? "Editar Barbero" : "Nuevo Barbero"}</DialogTitle>
          <DialogDescription>
            {barber
              ? "Modifica la información del barbero"
              : "Completa la información para agregar un nuevo barbero"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nombre completo"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+1 234 567 890"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Hora de inicio</Label>
                <Input
                  id="startDate"
                  type="time"
                  {...register("startDate")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">Hora de fin</Label>
                <Input
                  id="endDate"
                  type="time"
                  {...register("endDate")}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label>
                Servicios <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 p-4 rounded-md border border-dashed">
                {AVAILABLE_SERVICES.map((service) => (
                  <Badge
                    key={service}
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleService(service)}
                  >
                    {service}
                    {selectedServices.includes(service) && (
                      <IconX className="ml-1 size-3" />
                    )}
                  </Badge>
                ))}
              </div>
              {selectedServices.length === 0 && (
                <p className="text-sm text-destructive">
                  Debes seleccionar al menos un servicio
                </p>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="status">Estado</Label>
                <p className="text-sm text-muted-foreground">
                  El barbero estará {status ? "activo" : "inactivo"}
                </p>
              </div>
              <Switch
                id="status"
                checked={status}
                onCheckedChange={(checked) => setValue("status", checked)}
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
            <Button type="submit" disabled={isSubmitting || selectedServices.length === 0}>
              {isSubmitting ? "Guardando..." : barber ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

