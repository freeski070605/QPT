type FeaturedItem = {
  title: string;
  tag: string;
  price: string;
};

export function FeaturedGrid({ items }: { items: FeaturedItem[] }) {
  return (
    <div className="grid">
      {items.map((piece) => (
        <div className="card" key={piece.title}>
          <div className="pill">{piece.tag}</div>
          <h3>{piece.title}</h3>
          <p style={{ color: "var(--slate)" }}>{piece.price}</p>
        </div>
      ))}
    </div>
  );
}
