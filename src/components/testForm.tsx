"use client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

export default function TestForm() {
  async function handleSubmit() {
    try {
      await addDoc(collection(db, "citas"), {
        nombreCliente: "Josue",
        servicio: "Corte",
        fecha: "2025-11-03",
        hora: "14:00",
        estado: "pendiente",
        timestampCreation: new Date(),
      });
      toast.success("Cita creada correctamente", {
        description: "La cita ha sido registrada en el sistema",
      });
    } catch (error: any) {
      toast.error("Error al crear la cita", {
        description: error.message || "Por favor, intenta nuevamente",
      });
    }
  }

  return (
    <Button
      onClick={handleSubmit}
      variant="default"
      className="gap-2"
    >
      <IconPlus className="size-4" />
      Crear cita de prueba
    </Button>
  );
}
