export function AdminNav() {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="pill">Admin Control Panel</div>
      <div className="cta-row" style={{ justifyContent: "flex-start" }}>
        <button className="btn">Inventory</button>
        <button className="btn">Orders</button>
        <button className="btn">Content</button>
        <button className="btn">Analytics</button>
      </div>
    </div>
  );
}
