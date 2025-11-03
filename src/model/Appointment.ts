export interface Appointment {
  id?: string;
  nombreCliente: string;
  emailCliente?: string;
  telefonoCliente?: string;
  barberoId: string;
  barberoNombre?: string;
  servicio: string;
  fecha: string; // formato: YYYY-MM-DD
  hora: string; // formato: HH:MM
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  notas?: string;
  timestampCreation?: Date;
  timestampUpdate?: Date;
}



