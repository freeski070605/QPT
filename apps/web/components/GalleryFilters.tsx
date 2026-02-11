export function GalleryFilters() {
  return (
    <div className="card">
      <div className="pill">Smart Filters</div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <div>
          <p>Color</p>
          <span className="pill">Obsidian</span>{" "}
          <span className="pill">Amber</span>
        </div>
        <div>
          <p>Style</p>
          <span className="pill">Fluid</span>{" "}
          <span className="pill">Geode</span>
        </div>
        <div>
          <p>Price</p>
          <span className="pill">$500-$1000</span>
        </div>
        <div>
          <p>Availability</p>
          <span className="pill">In Stock</span>
        </div>
      </div>
    </div>
  );
}
