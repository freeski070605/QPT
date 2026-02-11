import { AdminDashboard } from "../../components/AdminDashboard";
import { SectionFade } from "../../components/SectionFade";

export default function AdminPage() {
  return (
    <main>
      <SectionFade>
        <div className="brand-shell pt-14">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-accent">Admin Panel</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Admin Operations Dashboard</h1>
          <p className="mt-4 max-w-2xl text-brand-text/75">
            Admin controls for inventory and commissions
          </p>
        </div>
      </SectionFade>
      <AdminDashboard />
    </main>
  );
}
