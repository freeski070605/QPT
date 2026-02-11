import Image from "next/image";
import { Artwork } from "../lib/types";

export function ArtworkDetail({ artwork }: { artwork: Artwork }) {
  const imageSrc = artwork.image?.trim();

  return (
    <>
      <section className="section-pad">
        <div className="brand-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-soft bg-brand-neutral p-3 shadow-soft">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {imageSrc ? <Image src={imageSrc} alt={artwork.title} fill className="object-cover" /> : <div className="absolute inset-0 bg-brand-neutral" />}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-accent">Artwork Detail</p>
            <h1 className="text-4xl leading-tight sm:text-5xl">{artwork.title}</h1>
            <p className="text-base leading-relaxed text-brand-text/75">{artwork.description}</p>

            <div className="space-y-3 rounded-soft bg-brand-neutral p-6">
              <DetailRow label="Dimensions" value={artwork.dimensions} />
              <DetailRow label="Price" value={`$${artwork.price.toLocaleString()}`} />
              <DetailRow label="Availability" value={artwork.availability} />
            </div>

            <div className="hidden gap-3 sm:flex">
              <button type="button" className="btn-primary w-full">
                Purchase Artwork
              </button>
              <button type="button" className="btn-outline w-full">
                Inquire
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-primary/10 bg-white/95 p-4 backdrop-blur sm:hidden">
        <div className="brand-shell flex gap-3 px-0">
          <button type="button" className="btn-outline w-full">
            Inquire
          </button>
          <button type="button" className="btn-primary w-full">
            Purchase
          </button>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-3 border-b border-brand-primary/10 pb-3 text-sm text-brand-primary last:border-0 last:pb-0">
      <span className="uppercase tracking-[0.16em] text-brand-primary/60">{label}</span>
      <span className="font-medium text-brand-primary">{value}</span>
    </p>
  );
}
