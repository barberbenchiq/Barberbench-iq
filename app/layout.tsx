import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberBench IQ | Know Your Numbers",
  description: "Simple business coaching and performance insights built for barbers.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
