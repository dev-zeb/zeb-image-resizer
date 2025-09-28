import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeb Image Resizer",
  description:
    "Resize your images easily with custom dimensions and aspect ratios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
