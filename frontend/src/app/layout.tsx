import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart AI Failover",
  description: "Automatic failover between Gemini and Claude",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
