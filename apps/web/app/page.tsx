import Link from "next/link";
import { ArtworkCard } from "../components/ArtworkCard";
import { Hero } from "../components/Hero";
import { SectionFade } from "../components/SectionFade";
import { getFeaturedArtworks } from "../lib/mockData";

export default function HomePage() {
  const featured = getFeaturedArtworks();

  return (
    <main className="pb-10">
      <Hero />

      <section className="section-pad">
        <SectionFade>
          <div className="brand-shell">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-accent">Featured Collection</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
                A refined moment captured in time through resin art
              </h2>
              <Link href="/gallery" className="btn-outline">
                View All Works
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((item) => (
                <ArtworkCard key={item.id} artwork={item} />
              ))}
            </div>
          </div>
        </SectionFade>
      </section>

      <section className="section-pad">
        <SectionFade delay={0.1}>
          <div className="brand-shell grid gap-6 lg:grid-cols-2">
            <div className="rounded-soft bg-brand-neutral p-8 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-accent">Brand Philosophy</p>
              <h3 className="mt-4 text-3xl sm:text-4xl">Precision, stillness, intentional creation.</h3>
              <p className="mt-4 leading-relaxed text-brand-text/75">
                Quarter Past Twelve marks a defining moment in time. Each piece balances movement and restraint, with
                nature-led tones and clean modern composition.
              </p>
            </div>

      
          </div>
        </SectionFade>
      </section>
    </main>
  );
}
