"use client";

import { useState } from "react";
import { createCashAppOrder } from "../lib/api";

export function ArtworkPurchase({ artworkId }: { artworkId: string }) {
  const [proof, setProof] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCashApp = async () => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      await createCashAppOrder({ artworkId, paymentProof: proof });
      setStatus("Submitted. Awaiting admin verification.");
      setProof("");
    } catch (err) {
      setStatus("Failed to submit. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="cta-row" style={{ justifyContent: "flex-start" }}>
        <button className="btn btn-primary">Purchase</button>
        <button className="btn">Pay With PayPal</button>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="pill">CashApp Manual Order</div>
        <p style={{ color: "var(--slate)" }}>
          Send payment to Cashtag $ResinArt and upload a payment screenshot link.
        </p>
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            background: "#0f0f12",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--ink)"
          }}
          placeholder="Payment proof URL (screenshot link)"
          value={proof}
          onChange={(event) => setProof(event.target.value)}
        />
        <button className="btn btn-primary" onClick={submitCashApp} disabled={!proof || isSubmitting}>
          Submit CashApp Proof
        </button>
        {status ? <p style={{ color: "var(--slate)", marginTop: 12 }}>{status}</p> : null}
      </div>
    </div>
  );
}
