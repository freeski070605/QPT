import Image from "next/image";
import Link from "next/link";
import { Artwork } from "../lib/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const imageSrc = artwork.image?.trim();

  return (
    <article className="group overflow-hidden rounded-soft bg-white shadow-card">
      <Link href={`/artwork/${artwork.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={artwork.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-neutral" />
          )}
          <div className="absolute inset-0 bg-brand-primary/0 transition duration-500 group-hover:bg-brand-primary/50" />
          <div className="absolute inset-x-4 bottom-4 translate-y-4 rounded-2xl bg-white/90 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="font-display text-xl text-brand-primary">{artwork.title}</p>
            <p className="mt-1 text-sm text-brand-primary/80">${artwork.price.toLocaleString()}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
