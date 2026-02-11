export type Artwork = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  videoUrl?: string;
  price: number;
  status: "Available" | "Reserved" | "Sold";
  size: "Small" | "Medium" | "Large";
  tone: "Cool" | "Warm" | "Balanced";
  editionCount?: number;
  dimensions?: string;
  materials?: string;
  paymentUrl?: string;
  showInCollection?: boolean;
  createdAt?: string;
};

export type ArtworkPayload = {
  title: string;
  description?: string;
  images: string[];
  videoUrl?: string;
  price: number;
  status: "Available" | "Reserved" | "Sold";
  size: "Small" | "Medium" | "Large";
  tone: "Cool" | "Warm" | "Balanced";
  editionCount: number;
  dimensions?: string;
  materials?: string;
  paymentUrl?: string;
  showInCollection: boolean;
  slug?: string;
};

export type Order = {
  _id: string;
  userId?: string;
  artworkId: string;
  paymentMethod: string;
  paymentStatus: "awaiting_payment" | "needs_review" | "paid" | "failed" | "refunded";
  shippingStatus: "created" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentProof?: string;
  trackingNumber?: string;
  createdAt?: string;
};

export type Commission = {
  _id: string;
  name: string;
  email: string;
  sizeRequest: string;
  colorPalette: string;
  description?: string;
  budget: string;
  timeline: string;
  notes?: string;
  status: "new" | "in_review" | "responded" | "closed";
  createdAt?: string;
};

export type AdminOverview = {
  artworks: {
    total: number;
    available: number;
    sold: number;
  };
  orders: {
    total: number;
    pendingPaymentReview: number;
  };
  commissions: {
    open: number;
  };
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "collector";
  createdAt?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Preserve fallback message.
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function fetchArtworks(options?: { includeHidden?: boolean; showInCollection?: boolean }) {
  const params = new URLSearchParams();

  if (typeof options?.includeHidden === "boolean") {
    params.set("includeHidden", String(options.includeHidden));
  }

  if (typeof options?.showInCollection === "boolean") {
    params.set("showInCollection", String(options.showInCollection));
  }

  const query = params.toString();
  return request<Artwork[]>(`/api/artworks${query ? `?${query}` : ""}`);
}

export async function fetchArtwork(id: string) {
  return request<Artwork>(`/api/artworks/${id}`);
}

export async function createArtwork(token: string, payload: ArtworkPayload) {
  return request<Artwork>("/api/artworks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });
}

export async function updateArtwork(token: string, artworkId: string, payload: Partial<ArtworkPayload>) {
  return request<Artwork>(`/api/artworks/${artworkId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });
}

export async function deleteArtwork(token: string, artworkId: string) {
  return request<void>(`/api/artworks/${artworkId}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
}

export async function uploadArtworkImage(token: string, payload: { dataUrl: string; folder?: string }) {
  return request<{
    secureUrl: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
  }>("/api/artworks/upload-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });
}

export async function createCashAppOrder(payload: {
  userId?: string;
  artworkId: string;
  paymentProof: string;
}) {
  return request("/api/orders/cashapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function adminLogin(payload: { email: string; password: string }) {
  return request<{ user: { _id: string; email: string; role: string; name: string }; token: string }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminOverview(token: string) {
  return request<AdminOverview>("/api/admin/overview", {
    headers: authHeaders(token)
  });
}

export async function fetchOrders(token: string) {
  return request<Order[]>("/api/orders", {
    headers: authHeaders(token)
  });
}

export async function updateOrder(
  token: string,
  orderId: string,
  payload: Partial<{
    paymentStatus: Order["paymentStatus"];
    shippingStatus: Order["shippingStatus"];
    trackingNumber: string;
  }>
) {
  return request<Order>(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchCommissions(token: string) {
  return request<Commission[]>("/api/commissions", {
    headers: authHeaders(token)
  });
}

export async function createCommission(payload: {
  name: string;
  email: string;
  sizeRequest: string;
  colorPalette: string;
  description: string;
  budget: string;
  timeline: string;
  notes?: string;
}) {
  return request<Commission>("/api/commissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function updateCommission(
  token: string,
  commissionId: string,
  payload: Partial<{
    status: Commission["status"];
    notes: string;
  }>
) {
  return request<Commission>(`/api/commissions/${commissionId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminUsers(token: string) {
  return request<AdminUser[]>("/api/admin/users", {
    headers: authHeaders(token)
  });
}

export async function updateAdminUserRole(token: string, userId: string, role: AdminUser["role"]) {
  return request<AdminUser>(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token)
    },
    body: JSON.stringify({ role })
  });
}
