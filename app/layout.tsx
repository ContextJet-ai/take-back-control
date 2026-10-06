import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Take Back Control",
  description: "Step-by-step help to get intimate images removed and stop them spreading. Nothing you enter is uploaded.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-[100dvh] antialiased">{children}</body>
    </html>
  );
}
