import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crownlocked Heirs | Jamie McFarlane",
  description:
    "Enter Bjargfold in Crownlocked Heirs, an interconnected LitRPG progression-fantasy series by Jamie McFarlane.",
  icons: {
    icon: "/drakon-prince.jpg",
    shortcut: "/drakon-prince.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
