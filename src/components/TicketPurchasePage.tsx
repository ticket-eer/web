import React, { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { createTransaction, getStoredUser } from "../services/api";
import { TopNav } from "./TopNav";
import { SubNav } from "./SubNav";

function TicketPurchasePage() {
  const navigate = useNavigate();
  const qrBoxRef = useRef<HTMLDivElement | null>(null);

  const [trip, setTrip] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getStoredUser();

  useEffect(() => {
    try {
      const stored = JSON.parse(
        sessionStorage.getItem("selectedTrip") || "null",
      );

      if (!stored) {
        navigate("/search");
        return;
      }

      setTrip(stored);
    } catch {
      navigate("/search");
    }
  }, [navigate]);

  const montant = useMemo(() => {
    const rawPrice =
      trip?.prix ??
      trip?.price ??
      trip?.prixTotal ??
      trip?.totalPrice ??
      trip?.montant;

    const value = Number(rawPrice);

    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }

    return value;
  }, [trip]);

  const formattedPrice = montant !== null ? `€${montant.toFixed(2)}` : "N/A";

  function downloadQrPng() {
    const canvas = qrBoxRef.current?.querySelector("canvas");

    if (!canvas) {
      return;
    }

    const qrValue =
      generatedTicket?.codeOptique ||
      generatedTicket?.code_optique ||
      "ticket-qr";
    const link = document.createElement("a");
    link.download = `${qrValue}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function pay() {
    setError("");

    if (montant === null) {
      setError(
        "Prix indisponible depuis l'API. Vérifie que l'admin a bien ajouté un prix au trajet.",
      );
      return;
    }

    setLoading(true);

    try {
      const trajetId = trip?.isConnection ? null : trip?.trajetId || trip?.id;
      const connectionId = trip?.isConnection
        ? trip?.connectionId || trip?.itineraireId || trip?.id
        : null;

      const data = await createTransaction(
        montant,
        "CARTE",
        trajetId,
        connectionId,
      );

      const billet = data.billet ||
        data.ticket ||
        data.billetDto ||
        data.transaction?.billet || {
          id: data.transaction?.billetId || `TKT-${Date.now()}`,
          codeOptique: null,
        };

      const fullTicket = {
        ...billet,
        trajet: trip,
        trajetId: billet.trajetId || billet.trajet_id || trajetId,
        connectionId:
          billet.connectionId || billet.connection_id || connectionId,
        montant,
        etatBillet: billet.etatBillet || billet.etat_billet || "NON_UTILISE",
        dateAchat:
          billet.dateAchat ||
          billet.date_achat ||
          new Date().toISOString().slice(0, 10),
        transactionId:
          billet.transactionId || billet.transaction_id || data.transaction?.id,
      };

      setGeneratedTicket(fullTicket);
      sessionStorage.setItem("generatedTicket", JSON.stringify(fullTicket));
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Erreur paiement");
    } finally {
      setLoading(false);
    }
  }

  if (!trip) return null;

  return (
    <>
      <TopNav />
      <SubNav to="/search" />

      <div className="pwrap" style={{ maxWidth: 700 }}>
        <div className="steps">
          {[
            ["Résumé", 1],
            ["Paiement", 2],
            ["Confirmation", 3],
          ].map(([label, number], index) => {
            const n = number as number;
            const c = n < step ? "done" : n === step ? "active" : "pending";

            return (
              <React.Fragment key={label}>
                {index > 0 && <div className="sline" />}
                <div className="step">
                  <div className={`snum ${c}`}>{n < step ? "✓" : n}</div>
                  <span className={`slbl ${n <= step ? "active" : "pending"}`}>
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div className="err" style={{ display: "block" }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="pcard">
            <div className="pcard-head">
              <h2>Résumé du voyage</h2>
            </div>

            <div className="pcard-body">
              <div className="trip-summary">
                <div className="ts-side">
                  <div className="ts-time">{trip.heureDepart || "--"}</div>
                  <div className="ts-city">{trip.villeDepart || "—"}</div>
                </div>

                <span className="ts-arrow">→</span>

                <div className="ts-side">
                  <div className="ts-time">{trip.heureArrivee || "--"}</div>
                  <div className="ts-city">{trip.villeArrivee || "—"}</div>
                </div>
              </div>

              <div className="info-grid">
                <div className="ic">
                  <div className="il">Date de voyage</div>
                  <div className="iv">{trip.dateVoyage || "—"}</div>
                </div>

                <div className="ic">
                  <div className="il">Type</div>
                  <div className="iv">
                    {trip.isConnection ? "Correspondance" : "Trajet direct"}
                  </div>
                </div>

                <div className="ic">
                  <div className="il">Train</div>
                  <div className="iv">{trip.train || "—"}</div>
                </div>

                <div className="ic">
                  <div className="il">Passager</div>
                  <div className="iv">{user?.nom || user?.email || "—"}</div>
                </div>
              </div>

              <div className="price-row">
                <span className="price-lbl">Total à payer</span>
                <span className="price-val">{formattedPrice}</span>
              </div>

              {montant === null && (
                <div className="warn-note">
                  ⚠️ Le prix n’est pas disponible depuis l’API. Il faut le
                  renseigner côté admin.
                </div>
              )}
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => navigate("/search")}>
                ← Retour
              </button>

              <button
                className="btn-prim"
                onClick={() => setStep(2)}
                disabled={montant === null}
              >
                Procéder au paiement →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pcard">
            <div className="pcard-head">
              <h2>Paiement</h2>
            </div>

            <div className="pcard-body">
              <div className="fld">
                <label>Moyen de paiement</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 16px",
                    border: "1px solid #2563eb",
                    borderRadius: 8,
                    background: "#eff6ff",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1d4ed8",
                    }}
                  >
                    Credit / Debit Card
                  </span>
                </div>
              </div>

              <div className="fld">
                <label>Card number</label>
                <input
                  className="ro-inp"
                  value="1234 4567 8901 2345"
                  readOnly
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div className="fld">
                  <label>Expiry</label>
                  <input className="ro-inp" value="12/27" readOnly />
                </div>

                <div className="fld">
                  <label>CVV</label>
                  <input className="ro-inp" value="•••" readOnly />
                </div>
              </div>

              <div className="warn-note">
                ⚠️ Note: This is a mock payment interface for demonstration
                purposes.
              </div>

              <div className="price-row">
                <span className="price-lbl">Total</span>
                <span className="price-val">{formattedPrice}</span>
              </div>
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => setStep(1)}>
                ← Retour
              </button>

              <button className="btn-prim" onClick={pay} disabled={loading}>
                {loading ? "Processing..." : "Pay and generate ticket"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && generatedTicket && (
          <div className="pcard">
            <div className="success-top">
              <div className="suc-icon">✓</div>
              <div className="suc-title">Ticket generated successfully</div>
              <div className="suc-sub">
                Your ticket has been sent to {user?.email || ""}
              </div>
            </div>

            <div className="pcard-body">
              <div className="info-grid">
                <div className="ic">
                  <div className="il">Ticket ID</div>
                  <div
                    className="iv"
                    style={{ fontSize: 12, fontFamily: "monospace" }}
                  >
                    {generatedTicket.id || "N/A"}
                  </div>
                </div>

                <div className="ic">
                  <div className="il">Status</div>
                  <div className="iv">
                    <span className="badge bv">Valid / Not yet used</span>
                  </div>
                </div>

                <div className="ic">
                  <div className="il">Amount</div>
                  <div className="iv">{formattedPrice}</div>
                </div>

                <div className="ic">
                  <div className="il">Transaction</div>
                  <div className="iv">
                    {generatedTicket.transactionId || "N/A"}
                  </div>
                </div>
              </div>

              <div className="qr-box" ref={qrBoxRef}>
                <div className="qr-lbl">Validation QR Code</div>
                <div className="qr-gen">
                  {generatedTicket?.codeOptique ||
                  generatedTicket?.code_optique ? (
                    <QRCodeCanvas
                      value={
                        generatedTicket.codeOptique ||
                        generatedTicket.code_optique
                      }
                      size={200}
                      level="H"
                      includeMargin
                    />
                  ) : (
                    <div className="qr-placeholder">No QR available</div>
                  )}
                </div>
                <div className="qr-code">
                  {generatedTicket.codeOptique ||
                    generatedTicket.code_optique ||
                    "TKT-CODE"}
                </div>

                <button
                  className="btn-qr"
                  onClick={downloadQrPng}
                  type="button"
                >
                  Download QR as PNG
                </button>
              </div>

              <div className="imp-note">
                <strong>Important:</strong> This ticket is personal and must be
                presented during control.
              </div>
            </div>

            <div className="pcard-foot">
              <button
                className="btn-sec"
                onClick={() => navigate("/my-tickets")}
              >
                View all tickets
              </button>

              <button className="btn-prim" onClick={() => navigate("/search")}>
                Book another trip
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TicketPurchasePage;
