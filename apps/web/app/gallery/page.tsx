import { GalleryGrid } from "../../components/GalleryGrid";
import { SectionFade } from "../../components/SectionFade";
import { fetchArtworks } from "../../lib/api";
import { Artwork } from "../../lib/types";

export default async function GalleryPage() {
  const artworks = await loadCollectionArtworks();

  return (
    <main className="section-pad">
      <SectionFade>
        <div className="brand-shell">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-accent">Collection</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Curated Resin Works</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-brand-text/75">
            Discover artworks shaped with controlled flow, balanced palette, and gallery-minded presentation.
          </p>

          <div className="mt-10">{artworks.length ? <GalleryGrid artworks={artworks} /> : <CollectionEmptyState />}</div>
        </div>
      </SectionFade>
    </main>
  );
}

async function loadCollectionArtworks(): Promise<Artwork[]> {
  try {
    const items = await fetchArtworks({ showInCollection: true });
    return items.map((item) => ({
      id: item._id,
      slug: item.slug,
      title: item.title,
      description: item.description ?? "",
      dimensions: item.dimensions ?? "",
      price: item.price,
      availability: item.status,
      size: item.size,
      tone: item.tone,
      image: item.images?.[0] ?? ""
    }));
  } catch {
    return [];
  }
}

function CollectionEmptyState() {
  return (
    <div className="rounded-soft border border-brand-primary/15 bg-white p-8 text-center">
      <p className="text-lg text-brand-primary">No artwork is available in the collection right now.</p>
      <p className="mt-2 text-sm text-brand-primary/70">Check back soon for new releases.</p>
    </div>
  );
}
