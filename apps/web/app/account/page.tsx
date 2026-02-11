export default function AccountPage() {
  return (
    <main className="section-pad">
      <div className="brand-shell">
        <h1 className="text-4xl sm:text-5xl">Collector Account</h1>
        <p className="mt-3 text-brand-text/75">Track saved works, orders, and authenticity documentation.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-soft bg-brand-neutral p-6">Saved Works</div>
          <div className="rounded-soft bg-brand-neutral p-6">Order History</div>
          <div className="rounded-soft bg-brand-neutral p-6">Certificates</div>
        </div>
      </div>
    </main>
  );
}
