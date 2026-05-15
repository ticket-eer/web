import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate, useParams } from "react-router-dom";
import { getBillet, getBilletByCode } from "../services/api";
import { TopNav } from "./TopNav";
import { SubNav } from "./SubNav";

function GeneratedTicketPage() {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const qrBoxRef = useRef<HTMLDivElement | null>(null);

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTicket() {
      setLoading(true);
      setError("");

      const fallbackTicket = (() => {
        try {
          return (
            JSON.parse(sessionStorage.getItem("currentTicket") || "null") ||
            JSON.parse(sessionStorage.getItem("generatedTicket") || "null")
          );
        } catch {
          return null;
        }
      })();

      if (!ticketId) {
        if (active) {
          setTicket(fallbackTicket);
          setLoading(false);
        }
        return;
      }

      try {
        const apiTicket = /^\d+$/.test(ticketId)
          ? await getBillet(ticketId)
          : await getBilletByCode(ticketId);

        if (active) {
          const normalizedTicket =
            apiTicket?.data ||
            apiTicket?.billet ||
            apiTicket?.ticket ||
            apiTicket;

          setTicket(normalizedTicket || fallbackTicket);
        }
      } catch {
        if (active) {
          setTicket(fallbackTicket);
          setError(fallbackTicket ? "" : "Ticket not found.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTicket();

    return () => {
      active = false;
    };
  }, [ticketId]);

  function getTicketStatus(ticketData: any) {
    const status = String(
      ticketData?.etatBillet ||
        ticketData?.etat_billet ||
        ticketData?.status ||
        ticketData?.etat ||
        "NON_UTILISE",
    ).toUpperCase();

    if (status === "UTILISE" || status === "USED") {
      return {
        badgeClass: "bu",
        badgeLabel: "Used",
      };
    }

    if (status === "EXPIRE" || status === "EXPIRED") {
      return {
        badgeClass: "be",
        badgeLabel: "Expired",
      };
    }

    if (status === "INVALIDE" || status === "INVALID") {
      return {
        badgeClass: "bi",
        badgeLabel: "Invalid",
      };
    }

    return {
      badgeClass: "bv",
      badgeLabel: "Valid / Not yet used",
    };
  }

  const { badgeClass, badgeLabel } = getTicketStatus(ticket);

  function downloadQrPng() {
    const canvas = qrBoxRef.current?.querySelector("canvas");

    if (!canvas) {
      return;
    }

    const qrValue = ticket?.codeOptique || ticket?.code_optique || "ticket-qr";
    const link = document.createElement("a");
    link.download = `${qrValue}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (loading) {
    return (
      <>
        <TopNav />
        <SubNav to="/my-tickets" />

        <div className="pwrap" style={{ maxWidth: 700 }}>
          <div className="loading">Loading ticket...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <SubNav to="/my-tickets" />

      <div className="pwrap" style={{ maxWidth: 700 }}>
        <div className="pcard">
          <div className="success-top">
            <div className="suc-icon">✓</div>
            <div className="suc-title">Ticket details</div>
            <div className="suc-sub">Your railway ticket</div>
          </div>

          <div className="pcard-body">
            {error && (
              <div className="err" style={{ display: "block" }}>
                {error}
              </div>
            )}

            <div className="info-grid">
              <div className="ic">
                <div className="il">Ticket ID</div>
                <div className="iv">
                  {ticket?.id ||
                    ticket?.codeOptique ||
                    ticket?.code_optique ||
                    "N/A"}
                </div>
              </div>

              <div className="ic">
                <div className="il">Status</div>
                <div className="iv">
                  <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                </div>
              </div>
            </div>

            <div className="qr-box" ref={qrBoxRef}>
              <div className="qr-lbl">Validation QR Code</div>

              <div className="qr-gen">
                {ticket?.codeOptique || ticket?.code_optique ? (
                  <QRCodeCanvas
                    value={ticket.codeOptique || ticket.code_optique}
                    size={200}
                    level="H"
                    includeMargin
                  />
                ) : (
                  <div className="qr-placeholder">No QR available</div>
                )}
              </div>

              <div className="qr-code">
                {ticket?.codeOptique || ticket?.code_optique || "TKT-CODE"}
              </div>

              {ticket?.codeOptique || ticket?.code_optique ? (
                <button
                  className="btn-qr"
                  onClick={downloadQrPng}
                  type="button"
                >
                  Download QR as PNG
                </button>
              ) : null}
            </div>

            <div className="imp-note">
              <strong>Important:</strong> This ticket is personal and must be
              presented during control.
            </div>
          </div>

          <div className="pcard-foot">
            <button className="btn-sec" onClick={() => navigate("/my-tickets")}>
              Back to tickets
            </button>

            <button className="btn-prim" onClick={() => navigate("/search")}>
              Book another trip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneratedTicketPage;
