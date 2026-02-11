export function DropSignup() {
  return (
    <div className="card">
      <h3>Join the Drop List</h3>
      <p style={{ color: "var(--slate)" }}>
        Early access and private collector releases. Limited edition alerts only.
      </p>
      <div className="cta-row" style={{ justifyContent: "flex-start" }}>
        <button className="btn btn-primary">Email Waitlist</button>
        <button className="btn">SMS Alerts</button>
      </div>
    </div>
  );
}
