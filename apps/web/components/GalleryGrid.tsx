"use client";

import { useMemo, useState } from "react";
import { Artwork } from "../lib/types";
import { ArtworkCard } from "./ArtworkCard";
import { motion } from "framer-motion";

type PriceFilter = "all" | "under-1500" | "1500-3000" | "3000-plus";

export function GalleryGrid({ artworks }: { artworks: Artwork[] }) {
  const [size, setSize] = useState<string>("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [tone, setTone] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");

  const filtered = useMemo(() => {
    return artworks.filter((item) => {
      const sizeMatch = size === "all" || item.size === size;
      const toneMatch = tone === "all" || item.tone === tone;
      const availabilityMatch = availability === "all" || item.availability === availability;
      const priceMatch =
        price === "all" ||
        (price === "under-1500" && item.price < 1500) ||
        (price === "1500-3000" && item.price >= 1500 && item.price <= 3000) ||
        (price === "3000-plus" && item.price > 3000);

      return sizeMatch && toneMatch && availabilityMatch && priceMatch;
    });
  }, [artworks, availability, price, size, tone]);

  return (
    <div className="space-y-8">
      <div className="rounded-soft bg-brand-neutral p-5 shadow-soft sm:p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-brand-accent">Filter Collection</p>
        <div className="grid gap-4 md:grid-cols-4">
          <Select
            label="Size"
            value={size}
            onChange={setSize}
            options={["all", "Small", "Medium", "Large"]}
          />
          <Select
            label="Price"
            value={price}
            onChange={(value) => setPrice(value as PriceFilter)}
            options={["all", "under-1500", "1500-3000", "3000-plus"]}
          />
          <Select
            label="Color Tone"
            value={tone}
            onChange={setTone}
            options={["all", "Cool", "Warm", "Balanced"]}
          />
          <Select
            label="Availability"
            value={availability}
            onChange={setAvailability}
            options={["all", "Available", "Reserved", "Sold"]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-soft border border-brand-primary/15 bg-white p-8 text-center text-brand-primary/80">
          No artworks match your selected filters.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <ArtworkCard artwork={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.18em] text-brand-primary/70">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-brand-primary/20 bg-white px-4 py-3 text-sm text-brand-primary outline-none transition focus:border-brand-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
