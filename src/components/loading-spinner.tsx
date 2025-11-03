"use client";

import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = "Cargando...", fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function LoadingState({ message = "Cargando datos..." }: { message?: string }) {
  return (
    <Empty>
      <EmptyMedia>
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{message}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}







