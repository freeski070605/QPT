import Link from "next/link";

export default function DropPage() {
  return (
    <main className="section-pad">
      <div className="brand-shell grid gap-6 lg:grid-cols-2">
        <div className="rounded-soft bg-brand-neutral p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-accent">Next Drop</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">06 : 12 : 44</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-brand-primary/60">Hours : Minutes : Seconds</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/gallery" className="btn-primary">
              Preview Works
            </Link>
            <Link href="/commission" className="btn-outline">
              Collector Access
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
