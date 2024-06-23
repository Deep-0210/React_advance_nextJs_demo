import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo",
  description: "With the proper arranged task can make your day efficient",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
