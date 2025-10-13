import type { Metadata } from "next";
import "./globals.css";
import AuthInit from "@/hooks/useclient";

export const metadata: Metadata = {
  title: "Almoxarifado UFC",
  description: "Frontend do sistema de almoxarifado",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthInit />
        {children}
      </body>
    </html>
  );
}
