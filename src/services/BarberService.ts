import { db } from "@/lib/firebase";
import { Barber } from "@/model/Baber";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export class BaberService {
  private babersRef = collection(db, "barbers");

  async addBaber(barber: Barber) {
    if (!barber.name || !barber.services.length) {
      throw new Error("El barbero debe tener nombre y al menos un servicio");
    }

    const docRef = await addDoc(this.babersRef, {
      name: barber.name,
      email: barber.email || "",
      phone: barber.phone || "",
      startHour: barber.startDate || "09:00",
      endHour: barber.endDate || "18:00",
      services: barber.services,
      isActive: barber.status ?? true,
      timestampCreation: new Date(),
    });

    return { id: docRef.id, ...barber };
  }

  async getBaber() {
    const snapshot = await getDocs(this.babersRef);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        startDate: data.startHour || data.startDate || "09:00",
        endDate: data.endHour || data.endDate || "18:00",
        services: data.services || [],
        status: data.isActive !== undefined ? data.isActive : data.status !== false,
      } as Barber;
    });
  }

  async getBaberById(id: string): Promise<Barber | null> {
    if (!id) {
      throw new Error("El ID del barbero es requerido");
    }

    const docRef = doc(db, "barbers", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      startDate: data.startHour || data.startDate || "09:00",
      endDate: data.endHour || data.endDate || "18:00",
      services: data.services || [],
      status: data.isActive !== undefined ? data.isActive : data.status !== false,
    } as Barber;
  }

  async updateBaber(id: string, barber: Partial<Barber>) {
    if (!id) {
      throw new Error("El ID del barbero es requerido");
    }

    if (barber.name !== undefined && !barber.name) {
      throw new Error("El nombre del barbero es requerido");
    }

    if (barber.services !== undefined && barber.services.length === 0) {
      throw new Error("El barbero debe tener al menos un servicio");
    }

    const docRef = doc(db, "barbers", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Barbero no encontrado");
    }

    const updateData: any = {};
    
    if (barber.name !== undefined) updateData.name = barber.name;
    if (barber.email !== undefined) updateData.email = barber.email || "";
    if (barber.phone !== undefined) updateData.phone = barber.phone || "";
    if (barber.startDate !== undefined) updateData.startHour = barber.startDate;
    if (barber.endDate !== undefined) updateData.endHour = barber.endDate;
    if (barber.services !== undefined) updateData.services = barber.services;
    if (barber.status !== undefined) updateData.isActive = barber.status;

    updateData.timestampUpdate = new Date();

    await updateDoc(docRef, updateData);

    return { id, ...barber };
  }

  async deleteBaber(id: string) {
    if (!id) {
      throw new Error("El ID del barbero es requerido");
    }

    const docRef = doc(db, "barbers", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Barbero no encontrado");
    }

    await deleteDoc(docRef);
    return { id };
  }
}
