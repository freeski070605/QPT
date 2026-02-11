import { Artwork } from "./types";

export const artworks: Artwork[] = [
  {
    id: "a1",
    slug: "still-tide",
    title: "Still Tide",
    description:
      "Layered emerald and pearl tones suspended in a quiet, reflective composition.",
    dimensions: "24 x 36 in",
    price: 2200,
    availability: "Available",
    size: "Large",
    tone: "Cool",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "a2",
    slug: "minute-glass",
    title: "Minute Glass",
    description:
      "A soft gradient pour with translucent depth, inspired by still morning water.",
    dimensions: "18 x 24 in",
    price: 1450,
    availability: "Available",
    size: "Medium",
    tone: "Balanced",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "a3",
    slug: "before-shift",
    title: "Before Shift",
    description:
      "Controlled movement in a restrained palette, capturing the stillness before motion.",
    dimensions: "16 x 20 in",
    price: 980,
    availability: "Reserved",
    size: "Small",
    tone: "Cool",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "a4",
    slug: "twelve-fifteen",
    title: "Twelve Fifteen",
    description:
      "A refined composition with deep emerald bands and soft mineral highlights.",
    dimensions: "20 x 30 in",
    price: 1800,
    availability: "Available",
    size: "Medium",
    tone: "Warm",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "a5",
    slug: "quiet-current",
    title: "Quiet Current",
    description:
      "A minimal study in tone and transparency with hand-finished edges.",
    dimensions: "30 x 40 in",
    price: 3100,
    availability: "Sold",
    size: "Large",
    tone: "Balanced",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "a6",
    slug: "echo-resin",
    title: "Echo Resin",
    description:
      "Soft arcs of pigment with subtle metallic undertones and clean negative space.",
    dimensions: "12 x 16 in",
    price: 760,
    availability: "Available",
    size: "Small",
    tone: "Warm",
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80"
  }
];

export function getAllArtworks() {
  return artworks;
}

export function getFeaturedArtworks() {
  return artworks.filter((item) => item.featured);
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((item) => item.slug === slug);
}
