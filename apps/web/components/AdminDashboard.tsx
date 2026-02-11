"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminOverview,
  AdminUser,
  Artwork,
  ArtworkPayload,
  Commission,
  Order,
  adminLogin,
  createArtwork,
  deleteArtwork,
  fetchAdminOverview,
  fetchAdminUsers,
  fetchArtworks,
  fetchCommissions,
  fetchOrders,
  updateAdminUserRole,
  updateArtwork,
  uploadArtworkImage,
  updateCommission,
  updateOrder
} from "../lib/api";

const TOKEN_KEY = "qpt_admin_token";
const EMPTY_FORM: ArtworkPayload = {
  title: "",
  description: "",
  images: [],
  videoUrl: "",
  price: 100,
  status: "Available",
  size: "Medium",
  tone: "Balanced",
  editionCount: 1,
  dimensions: "",
  materials: "",
  paymentUrl: "",
  showInCollection: true,
  slug: ""
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [form, setForm] = useState<ArtworkPayload>(EMPTY_FORM);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = window.localStorage.getItem(TOKEN_KEY);
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void refreshData(token);
  }, [token]);

  const sortedArtworks = useMemo(() => artworks.slice().sort((a, b) => a.title.localeCompare(b.title)), [artworks]);

  async function refreshData(activeToken = token) {
    if (!activeToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [overviewData, artworksData, ordersData, commissionsData, usersData] = await Promise.all([
        fetchAdminOverview(activeToken),
        fetchArtworks({ includeHidden: true }),
        fetchOrders(activeToken),
        fetchCommissions(activeToken),
        fetchAdminUsers(activeToken)
      ]);
      setOverview(overviewData);
      setArtworks(artworksData);
      setOrders(ordersData);
      setCommissions(commissionsData);
      setUsers(usersData);
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      if (message.toLowerCase().includes("token") || message.toLowerCase().includes("permission")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await adminLogin({ email, password });
      if (response.user.role !== "admin") {
        throw new Error("This account is not an admin account.");
      }
      setOwnerName(response.user.name);
      setToken(response.token);
      window.localStorage.setItem(TOKEN_KEY, response.token);
      setPassword("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setOverview(null);
    setOrders([]);
    setCommissions([]);
    setUsers([]);
    setOwnerName("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingArtworkId(null);
  }

  function applyArtwork(artwork: Artwork) {
    setEditingArtworkId(artwork._id);
    setForm({
      title: artwork.title,
      description: artwork.description ?? "",
      images: artwork.images ?? [],
      videoUrl: artwork.videoUrl ?? "",
      price: artwork.price,
      status: artwork.status,
      size: artwork.size,
      tone: artwork.tone,
      editionCount: artwork.editionCount ?? 1,
      dimensions: artwork.dimensions ?? "",
      materials: artwork.materials ?? "",
      paymentUrl: artwork.paymentUrl ?? "",
      showInCollection: artwork.showInCollection ?? true,
      slug: artwork.slug ?? ""
    });
  }

  async function onUploadArtworkImage(files: FileList | null) {
    if (!token || !files?.length) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const dataUrl = await fileToDataUrl(file);
        const response = await uploadArtworkImage(token, { dataUrl });
        uploadedUrls.push(response.secureUrl);
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedUrls]
      }));
      setNotice(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded.`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onSaveArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Please sign in first.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const payload = normalizedPayload(form);
      if (editingArtworkId) {
        await updateArtwork(token, editingArtworkId, payload);
        setNotice("Artwork updated.");
      } else {
        await createArtwork(token, payload);
        setNotice("Artwork created.");
      }
      await refreshData(token);
      resetForm();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteArtwork(artworkId: string) {
    if (!token) {
      return;
    }
    const ok = window.confirm("Delete this artwork permanently?");
    if (!ok) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      await deleteArtwork(token, artworkId);
      if (editingArtworkId === artworkId) {
        resetForm();
      }
      await refreshData(token);
      setNotice("Artwork deleted.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateOrder(
    orderId: string,
    payload: Partial<{
      paymentStatus: Order["paymentStatus"];
      shippingStatus: Order["shippingStatus"];
      trackingNumber: string;
    }>
  ) {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await updateOrder(token, orderId, payload);
      await refreshData(token);
      setNotice("Order updated.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateCommission(
    commissionId: string,
    payload: Partial<{
      status: Commission["status"];
      notes: string;
    }>
  ) {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await updateCommission(token, commissionId, payload);
      await refreshData(token);
      setNotice("Commission updated.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onChangeRole(userId: string, role: AdminUser["role"]) {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await updateAdminUserRole(token, userId, role);
      await refreshData(token);
      setNotice("User role updated.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="section-pad">
        <div className="brand-shell max-w-xl">
          <form className="space-y-4 rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card" onSubmit={onLogin}>
            <h2 className="text-2xl">Admin Sign In</h2>
            <p className="text-sm text-brand-primary/70">Use owner admin credentials to manage inventory, orders, and clients.</p>
            <input
              className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin email"
              required
            />
            <input
              className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              required
            />
            <button className="btn-primary w-full disabled:opacity-70" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="brand-shell space-y-6">
        <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl">Owner Console</h2>
              <p className="text-sm text-brand-primary/70">{ownerName ? `Signed in as ${ownerName}` : "Admin session active"}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" type="button" onClick={() => refreshData()} disabled={loading}>
                Refresh
              </button>
              <button className="btn-outline" type="button" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
          {notice ? <p className="mt-3 text-sm text-brand-accent">{notice}</p> : null}
        </div>

        {overview ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric title="Artworks" value={overview.artworks.total} />
            <Metric title="Available" value={overview.artworks.available} />
            <Metric title="Orders" value={overview.orders.total} />
            <Metric title="Open Commissions" value={overview.commissions.open} />
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
            <h3 className="text-xl">Artwork Manager</h3>
            <p className="mt-2 text-sm text-brand-primary/70">Create, update, and remove artwork from the gallery.</p>
            <form className="mt-5 space-y-3" onSubmit={onSaveArtwork}>
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Title"
                required
              />
              <textarea
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.description ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={3}
              />
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.images.join(", ")}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    images: event.target.value
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean)
                  }))
                }
                placeholder="Image URLs (comma-separated)"
              />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-brand-primary/70">Upload Image Files</label>
                <input
                  className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-accent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.2em] file:text-white"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    void onUploadArtworkImage(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                  type="number"
                  min={1}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                  placeholder="Price"
                  required
                />
                <input
                  className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                  type="number"
                  min={1}
                  value={form.editionCount}
                  onChange={(event) => setForm((current) => ({ ...current, editionCount: Number(event.target.value) }))}
                  placeholder="Edition Count"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Select
                  value={form.status}
                  onChange={(value) => setForm((current) => ({ ...current, status: value as ArtworkPayload["status"] }))}
                  options={["Available", "Reserved", "Sold"]}
                />
                <Select
                  value={form.size}
                  onChange={(value) => setForm((current) => ({ ...current, size: value as ArtworkPayload["size"] }))}
                  options={["Small", "Medium", "Large"]}
                />
                <Select
                  value={form.tone}
                  onChange={(value) => setForm((current) => ({ ...current, tone: value as ArtworkPayload["tone"] }))}
                  options={["Cool", "Warm", "Balanced"]}
                />
              </div>
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.dimensions ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, dimensions: event.target.value }))}
                placeholder="Dimensions"
              />
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.materials ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, materials: event.target.value }))}
                placeholder="Materials"
              />
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.paymentUrl ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, paymentUrl: event.target.value }))}
                placeholder="Payment URL"
              />
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.videoUrl ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
                placeholder="Video URL"
              />
              <input
                className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
                value={form.slug ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                placeholder="Custom slug (optional)"
              />
              <label className="flex items-center gap-3 rounded-xl border border-brand-primary/20 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.showInCollection}
                  onChange={(event) => setForm((current) => ({ ...current, showInCollection: event.target.checked }))}
                />
                Show on collection page
              </label>
              <div className="flex gap-2">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {editingArtworkId ? "Save Changes" : "Create Artwork"}
                </button>
                {editingArtworkId ? (
                  <button className="btn-outline" type="button" onClick={resetForm}>
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
            <h3 className="text-xl">Artwork Inventory</h3>
            <div className="mt-4 max-h-[38rem] space-y-3 overflow-y-auto pr-1">
              {sortedArtworks.map((artwork) => (
                <article key={artwork._id} className="rounded-xl bg-brand-neutral p-4">
                  <p className="font-semibold text-brand-primary">{artwork.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-primary/60">
                    {artwork.status} | ${artwork.price.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-brand-primary/70">{artwork.slug}</p>
                  <p className="mt-1 text-xs text-brand-primary/70">Collection: {artwork.showInCollection ? "Visible" : "Hidden"}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-outline !px-4 !py-2" type="button" onClick={() => applyArtwork(artwork)}>
                      Edit
                    </button>
                    <button
                      className="rounded-full border border-red-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-700 transition hover:bg-red-700 hover:text-white"
                      type="button"
                      onClick={() => onDeleteArtwork(artwork._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!sortedArtworks.length ? <p className="text-sm text-brand-primary/70">No artwork found.</p> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
            <h3 className="text-xl">Orders</h3>
            <div className="mt-4 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onSave={onUpdateOrder} />
              ))}
              {!orders.length ? <p className="text-sm text-brand-primary/70">No orders yet.</p> : null}
            </div>
          </div>

          <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
            <h3 className="text-xl">Commissions</h3>
            <div className="mt-4 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
              {commissions.map((commission) => (
                <CommissionCard key={commission._id} commission={commission} onSave={onUpdateCommission} />
              ))}
              {!commissions.length ? <p className="text-sm text-brand-primary/70">No commission requests yet.</p> : null}
            </div>
          </div>
        </div>

        <div className="rounded-soft border border-brand-primary/10 bg-white p-6 shadow-card">
          <h3 className="text-xl">User Access</h3>
          <p className="mt-2 text-sm text-brand-primary/70">Grant or revoke admin role for team members.</p>
          <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
            {users.map((user) => (
              <div key={user._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-neutral px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-brand-primary">{user.name}</p>
                  <p className="text-xs text-brand-primary/70">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-primary/60">{user.role}</span>
                  <button className="btn-outline !px-4 !py-2" type="button" onClick={() => onChangeRole(user._id, "collector")}>
                    Collector
                  </button>
                  <button className="btn-primary !px-4 !py-2" type="button" onClick={() => onChangeRole(user._id, "admin")}>
                    Admin
                  </button>
                </div>
              </div>
            ))}
            {!users.length ? <p className="text-sm text-brand-primary/70">No users found.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select className="w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-soft border border-brand-primary/10 bg-white p-5 shadow-card">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-primary/60">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-brand-primary">{value}</p>
    </article>
  );
}

function OrderCard({
  order,
  onSave
}: {
  order: Order;
  onSave: (
    orderId: string,
    payload: Partial<{
      paymentStatus: Order["paymentStatus"];
      shippingStatus: Order["shippingStatus"];
      trackingNumber: string;
    }>
  ) => Promise<void>;
}) {
  const [paymentStatus, setPaymentStatus] = useState<Order["paymentStatus"]>(order.paymentStatus);
  const [shippingStatus, setShippingStatus] = useState<Order["shippingStatus"]>(order.shippingStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");

  return (
    <article className="rounded-xl bg-brand-neutral p-4">
      <p className="font-semibold text-brand-primary">Order {order._id.slice(-6)}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-brand-primary/60">{order.paymentMethod}</p>
      {order.paymentProof ? (
        <a className="mt-1 block text-xs text-brand-accent underline" href={order.paymentProof} target="_blank" rel="noreferrer">
          View payment proof
        </a>
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Select
          value={paymentStatus}
          onChange={(value) => setPaymentStatus(value as Order["paymentStatus"])}
          options={["awaiting_payment", "needs_review", "paid", "failed", "refunded"]}
        />
        <Select
          value={shippingStatus}
          onChange={(value) => setShippingStatus(value as Order["shippingStatus"])}
          options={["created", "processing", "shipped", "delivered", "cancelled"]}
        />
      </div>
      <input
        className="mt-2 w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
        value={trackingNumber}
        onChange={(event) => setTrackingNumber(event.target.value)}
        placeholder="Tracking number"
      />
      <button
        className="btn-primary mt-3 !px-4 !py-2"
        type="button"
        onClick={() => onSave(order._id, { paymentStatus, shippingStatus, trackingNumber: trackingNumber.trim() || undefined })}
      >
        Save Order
      </button>
    </article>
  );
}

function CommissionCard({
  commission,
  onSave
}: {
  commission: Commission;
  onSave: (commissionId: string, payload: Partial<{ status: Commission["status"]; notes: string }>) => Promise<void>;
}) {
  const [status, setStatus] = useState<Commission["status"]>(commission.status);
  const [notes, setNotes] = useState(commission.notes ?? "");

  return (
    <article className="rounded-xl bg-brand-neutral p-4">
      <p className="font-semibold text-brand-primary">{commission.name}</p>
      <p className="text-xs text-brand-primary/70">{commission.email}</p>
      <p className="mt-2 text-xs text-brand-primary/70">
        {commission.sizeRequest} | {commission.colorPalette} | {commission.budget}
      </p>
      <p className="mt-2 text-sm text-brand-primary/80">{commission.description ?? "No description provided."}</p>
      <div className="mt-3">
        <Select value={status} onChange={(value) => setStatus(value as Commission["status"])} options={["new", "in_review", "responded", "closed"]} />
      </div>
      <textarea
        className="mt-2 w-full rounded-xl border border-brand-primary/20 px-4 py-3 text-sm"
        rows={3}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Internal notes"
      />
      <button className="btn-primary mt-3 !px-4 !py-2" type="button" onClick={() => onSave(commission._id, { status, notes })}>
        Save Commission
      </button>
    </article>
  );
}

function normalizedPayload(form: ArtworkPayload): ArtworkPayload {
  return {
    title: form.title.trim(),
    description: optionalText(form.description),
    images: form.images.map((value) => value.trim()).filter(Boolean),
    videoUrl: optionalText(form.videoUrl),
    price: Number(form.price),
    status: form.status,
    size: form.size,
    tone: form.tone,
    editionCount: Number(form.editionCount),
    dimensions: optionalText(form.dimensions),
    materials: optionalText(form.materials),
    paymentUrl: optionalText(form.paymentUrl),
    showInCollection: form.showInCollection,
    slug: optionalText(form.slug)
  };
}

function optionalText(value: string | undefined) {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}


