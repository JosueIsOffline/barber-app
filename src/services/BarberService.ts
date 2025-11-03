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
      throw new Error("El barbero debe tenr nombre y al menos un servicio");
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
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }
}
