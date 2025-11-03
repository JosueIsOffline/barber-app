"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | Error | null;
  onRetry?: () => void;
  title?: string;
}

export function ErrorDisplay({ error, onRetry, title = "Error al cargar datos" }: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : error || "Ocurrió un error desconocido";

  return (
    <Empty>
      <EmptyMedia>
        <AlertCircle className="size-8 text-destructive" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{errorMessage}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Reintentar
        </Button>
      )}
    </Empty>
  );
}







