import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBillet, getBilletByCode } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function GeneratedTicketPage() {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTicket() {
      setLoading(true);
      setError('');

      const fallbackTicket = (() => {
        try {
          return (
              JSON.parse(sessionStorage.getItem('currentTicket') || 'null') ||
              JSON.parse(sessionStorage.getItem('generatedTicket') || 'null')
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
        const apiTicket = /^\d+$/.test(ticketId) ? await getBillet(ticketId) : await getBilletByCode(ticketId);

        if (active) {
          setTicket(apiTicket?.data || apiTicket?.billet || apiTicket || fallbackTicket);
        }
      } catch {
        if (active) {
          setTicket(fallbackTicket);
          setError(fallbackTicket ? '' : 'Ticket not found.');
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
              {error && <div className="err" style={{ display: 'block' }}>{error}</div>}

              <div className="info-grid">
                <div className="ic">
                  <div className="il">Ticket ID</div>
                  <div className="iv">
                    {ticket?.id || ticket?.codeOptique || ticket?.code_optique || 'N/A'}
                  </div>
                </div>

                <div className="ic">
                  <div className="il">Status</div>
                  <div className="iv">
                    <span className="badge bv">Valid / Not yet used</span>
                  </div>
                </div>
              </div>

              <div className="qr-box">
                <div className="qr-lbl">Validation QR Code</div>
                <div className="qr-fake">
                  {Array.from({ length: 81 }).map((_, i) => (
                      <span key={i} />
                  ))}
                </div>
                <div className="qr-code">
                  {ticket?.codeOptique || ticket?.code_optique || 'TKT-CODE'}
                </div>
              </div>

              <div className="imp-note">
                <strong>Important:</strong> This ticket is personal and must be presented during
                control.
              </div>
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => navigate('/my-tickets')}>
                Back to tickets
              </button>

              <button className="btn-prim" onClick={() => navigate('/search')}>
                Book another trip
              </button>
            </div>
          </div>
        </div>
      </>
  );
}
export default GeneratedTicketPage;