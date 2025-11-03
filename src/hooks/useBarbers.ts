"use client";

import { useState, useEffect, useCallback } from "react";
import { BaberService } from "@/services/BarberService";
import { Barber } from "@/model/Baber";

export function useBarbers() {
  const [barbers, setBabers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const service = new BaberService();
    try {
      const data = await service.getBaber();
      setBabers(data as Barber[]);
    } catch (err: any) {
      setError(err.message || "Error al cargar los barberos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { barbers, loading, error, refetch: loadData };
}
