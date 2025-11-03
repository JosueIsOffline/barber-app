import TestForm from "@/components/testForm";
import { Button } from "@/components/ui/button";
import { IconLayoutDashboard, IconUsers, IconCalendarEvent, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 pb-20 gap-8 sm:p-20">
      <main className="flex flex-col gap-8 w-full max-w-4xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Barber App
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema de gestión para tu barbería
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLayoutDashboard className="size-5" />
                Dashboard
              </CardTitle>
              <CardDescription>
                Visión general de tu barbería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full" variant="default">
                  Ir al Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="size-5" />
                Barberos
              </CardTitle>
              <CardDescription>
                Gestiona tu equipo de barberos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/barbers">
                <Button className="w-full" variant="outline">
                  Gestionar Barberos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendarEvent className="size-5" />
                Citas
              </CardTitle>
              <CardDescription>
                Administra las citas de tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/appointments">
                <Button className="w-full" variant="outline">
                  Gestionar Citas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
