"use client";

import { useState, useEffect } from "react";
import { BaberService } from "@/services/BarberService";
import { Barber } from "@/model/Baber";

export function useBarbers() {
  const [barbers, setBabers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = new BaberService();
    async function loadData() {
      try {
        const data = await service.getBaber();
        console.log(data);
        setBabers(data as Barber[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { barbers, loading, error };
}
