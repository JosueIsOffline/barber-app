"use client";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TestForm() {
  async function handleSubmit() {
    await addDoc(collection(db, "citas"), {
      nombreCliente: "Josue",
      servicio: "Corte",
      fecha: "2025-11-03",
      hora: "14:00",
      estado: "pendiente",
    });
    alert("Cita creada correctamente");
  }

  return (
    <button
      className="bg-purple-600 text-black text-base font-bold p-5 h-auto w-auto cursor-pointer hover:bg-purple-600/60 rounded-md"
      onClick={handleSubmit}
    >
      Crear cita (Pruebame 👉👈🥺)
    </button>
  );
}
