import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromatrack · Read your strip. Track your exposure.",
  description: "Calibration-aware H₂S exposure strip analysis and session tracking. An interactive frontend prototype with clearly labelled demo data.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
