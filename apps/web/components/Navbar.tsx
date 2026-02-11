"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Collection" },
  { href: "/commission", label: "Commission" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-primary/10 bg-white/90 backdrop-blur">
      <div className="brand-shell flex h-20 items-center justify-between">
        <Link href="/" className="group">
          <p className="font-display text-2xl tracking-[0.16em] text-brand-primary">
            QUARTER PAST TWELVE
          </p>
          <p className="text-[10px] uppercase tracking-[0.45em] text-brand-accent">
            RESIN ARTS
          </p>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-brand-primary/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-brand-primary md:hidden"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.18em] text-brand-primary transition hover:text-brand-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {open ? (
        <nav className="brand-shell grid gap-2 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-brand-neutral px-4 py-3 text-xs uppercase tracking-[0.16em] text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
