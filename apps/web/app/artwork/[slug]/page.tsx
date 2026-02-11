import { notFound } from "next/navigation";
import { ArtworkDetail } from "../../../components/ArtworkDetail";
import { fetchArtwork } from "../../../lib/api";
import { Artwork } from "../../../lib/types";

type PageProps = {
  params: { slug: string };
};

export default async function ArtworkDetailPage({ params }: PageProps) {
  const artwork = await loadArtwork(params.slug);

  if (!artwork) {
    notFound();
  }

  return <main className="pb-24 sm:pb-0">{artwork ? <ArtworkDetail artwork={artwork} /> : null}</main>;
}

async function loadArtwork(slug: string): Promise<Artwork | null> {
  try {
    const item = await fetchArtwork(slug);
    return {
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
    };
  } catch {
    return null;
  }
}
