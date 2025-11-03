"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Barber } from "@/model/Baber";
import { Appointment } from "@/model/Appointment";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: Barber | null;
  appointment?: Appointment | null;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  barber,
  appointment,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getTitle = () => {
    if (appointment) return "¿Estás seguro de eliminar esta cita?";
    if (barber) return "¿Estás seguro de eliminar a este barbero?";
    return "¿Estás seguro?";
  };

  const getDescription = () => {
    if (appointment) {
      return (
        <>
          Esta acción no se puede deshacer. Esto eliminará permanentemente la cita de{" "}
          <span className="font-semibold text-foreground">
            {appointment.nombreCliente}
          </span>{" "}
          del {appointment.fecha} a las {appointment.hora} de la base de datos.
        </>
      );
    }
    if (barber) {
      return (
        <>
          Esta acción no se puede deshacer. Esto eliminará permanentemente a{" "}
          <span className="font-semibold text-foreground">
            {barber.name}
          </span>{" "}
          y todos sus datos asociados de la base de datos.
        </>
      );
    }
    return "Esta acción no se puede deshacer.";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



