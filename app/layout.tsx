import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { QuickExit } from "@/components/quick-exit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Take Back Control",
  description: "Step-by-step help to get intimate images removed and stop them spreading. Nothing you enter is uploaded.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-[100dvh] antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <QuickExit />
      </body>
    </html>
  );
}
