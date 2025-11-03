import { db } from "@/lib/firebase";
import { Appointment } from "@/model/Appointment";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export class AppointmentService {
  private appointmentsRef = collection(db, "citas");

  async addAppointment(appointment: Appointment) {
    if (!appointment.nombreCliente || !appointment.barberoId || !appointment.servicio || !appointment.fecha || !appointment.hora) {
      throw new Error("Debe completar todos los campos obligatorios");
    }

    const docRef = await addDoc(this.appointmentsRef, {
      nombreCliente: appointment.nombreCliente,
      emailCliente: appointment.emailCliente || "",
      telefonoCliente: appointment.telefonoCliente || "",
      barberoId: appointment.barberoId,
      barberoNombre: appointment.barberoNombre || "",
      servicio: appointment.servicio,
      fecha: appointment.fecha,
      hora: appointment.hora,
      estado: appointment.estado || "pendiente",
      notas: appointment.notas || "",
      timestampCreation: new Date(),
    });

    return { id: docRef.id, ...appointment };
  }

  async getAppointments() {
    try {
      // Primero intentamos obtener todos los documentos y ordenar en memoria
      // Esto evita el problema del índice compuesto en Firestore
      const snapshot = await getDocs(this.appointmentsRef);
      const appointments = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nombreCliente: data.nombreCliente || "",
          emailCliente: data.emailCliente || "",
          telefonoCliente: data.telefonoCliente || "",
          barberoId: data.barberoId || "",
          barberoNombre: data.barberoNombre || "",
          servicio: data.servicio || "",
          fecha: data.fecha || "",
          hora: data.hora || "",
          estado: data.estado || "pendiente",
          notas: data.notas || "",
          timestampCreation: data.timestampCreation?.toDate(),
          timestampUpdate: data.timestampUpdate?.toDate(),
        } as Appointment;
      });
      
      // Ordenar en memoria: primero por fecha (desc), luego por hora (desc)
      return appointments.sort((a, b) => {
        const dateCompare = b.fecha.localeCompare(a.fecha);
        if (dateCompare !== 0) return dateCompare;
        return b.hora.localeCompare(a.hora);
      });
    } catch (error: any) {
      console.error("Error al obtener citas:", error);
      throw new Error(`Error al cargar las citas: ${error.message}`);
    }
  }

  async getAppointmentsByBarber(barberoId: string) {
    try {
      const q = query(
        this.appointmentsRef,
        where("barberoId", "==", barberoId)
      );
      const snapshot = await getDocs(q);
      const appointments = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          nombreCliente: data.nombreCliente || "",
          emailCliente: data.emailCliente || "",
          telefonoCliente: data.telefonoCliente || "",
          barberoId: data.barberoId || "",
          barberoNombre: data.barberoNombre || "",
          servicio: data.servicio || "",
          fecha: data.fecha || "",
          hora: data.hora || "",
          estado: data.estado || "pendiente",
          notas: data.notas || "",
          timestampCreation: data.timestampCreation?.toDate(),
          timestampUpdate: data.timestampUpdate?.toDate(),
        } as Appointment;
      });
      
      // Ordenar en memoria
      return appointments.sort((a, b) => {
        const dateCompare = b.fecha.localeCompare(a.fecha);
        if (dateCompare !== 0) return dateCompare;
        return b.hora.localeCompare(a.hora);
      });
    } catch (error: any) {
      console.error("Error al obtener citas por barbero:", error);
      throw new Error(`Error al cargar las citas: ${error.message}`);
    }
  }

  async getAppointmentsByDate(fecha: string) {
    const q = query(
      this.appointmentsRef,
      where("fecha", "==", fecha),
      orderBy("hora", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        timestampCreation: data.timestampCreation?.toDate(),
        timestampUpdate: data.timestampUpdate?.toDate(),
      } as Appointment;
    });
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    if (!id) {
      throw new Error("El ID de la cita es requerido");
    }

    const docRef = doc(db, "citas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      nombreCliente: data.nombreCliente || "",
      emailCliente: data.emailCliente || "",
      telefonoCliente: data.telefonoCliente || "",
      barberoId: data.barberoId || "",
      barberoNombre: data.barberoNombre || "",
      servicio: data.servicio || "",
      fecha: data.fecha || "",
      hora: data.hora || "",
      estado: data.estado || "pendiente",
      notas: data.notas || "",
      timestampCreation: data.timestampCreation?.toDate(),
      timestampUpdate: data.timestampUpdate?.toDate(),
    } as Appointment;
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>) {
    if (!id) {
      throw new Error("El ID de la cita es requerido");
    }

    const docRef = doc(db, "citas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Cita no encontrada");
    }

    const updateData: any = {};

    if (appointment.nombreCliente !== undefined) updateData.nombreCliente = appointment.nombreCliente;
    if (appointment.emailCliente !== undefined) updateData.emailCliente = appointment.emailCliente || "";
    if (appointment.telefonoCliente !== undefined) updateData.telefonoCliente = appointment.telefonoCliente || "";
    if (appointment.barberoId !== undefined) updateData.barberoId = appointment.barberoId;
    if (appointment.barberoNombre !== undefined) updateData.barberoNombre = appointment.barberoNombre || "";
    if (appointment.servicio !== undefined) updateData.servicio = appointment.servicio;
    if (appointment.fecha !== undefined) updateData.fecha = appointment.fecha;
    if (appointment.hora !== undefined) updateData.hora = appointment.hora;
    if (appointment.estado !== undefined) updateData.estado = appointment.estado;
    if (appointment.notas !== undefined) updateData.notas = appointment.notas || "";

    updateData.timestampUpdate = new Date();

    await updateDoc(docRef, updateData);

    return { id, ...appointment };
  }

  async deleteAppointment(id: string) {
    if (!id) {
      throw new Error("El ID de la cita es requerido");
    }

    const docRef = doc(db, "citas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Cita no encontrada");
    }

    await deleteDoc(docRef);
    return { id };
  }
}



