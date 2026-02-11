export type Artwork = {
  id: string;
  slug: string;
  title: string;
  description: string;
  dimensions: string;
  price: number;
  availability: "Available" | "Reserved" | "Sold";
  size: "Small" | "Medium" | "Large";
  tone: "Cool" | "Warm" | "Balanced";
  image: string;
  featured?: boolean;
};
