"use client";

import { useState, useEffect, useCallback } from "react";
import { AppointmentService } from "@/services/AppointmentService";
import { Appointment } from "@/model/Appointment";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const service = new AppointmentService();
    try {
      const data = await service.getAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { appointments, loading, error, refetch: loadData };
}





