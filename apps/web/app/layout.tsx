import { Cormorant_Garamond, Inter } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"]
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

export const metadata = {
  title: "Quarter Past Twelve Resin Arts",
  description: "A refined digital gallery for premium resin artwork."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-[var(--font-body)] text-brand-text antialiased">
        <div className="relative min-h-screen bg-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(30,107,76,0.08),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(15,61,46,0.06),transparent_35%)]" />
          <div className="relative">
            <Navbar />
            {children}
            <footer className="border-t border-brand-primary/10 py-10">
              <div className="brand-shell text-center text-xs uppercase tracking-[0.2em] text-brand-primary/60">
                Quarter Past Twelve Resin Arts
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
