import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const JetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barber App - Gestión de Barbería",
  description: "Sistema de gestión para barbería - Administra barberos, citas y clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${JetBrainsMono.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
