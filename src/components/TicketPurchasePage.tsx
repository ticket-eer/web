import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction, getStoredUser } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function TicketPurchasePage() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getStoredUser();

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('selectedTrip') || 'null');

      if (!stored) {
        navigate('/search');
        return;
      }

      setTrip(stored);
    } catch {
      navigate('/search');
    }
  }, [navigate]);

  async function pay() {
    setError('');
    setLoading(true);

    try {
      const montant = Number(trip?.prix ?? trip?.price ?? trip?.montant);

      if (!Number.isFinite(montant) || montant <= 0) {
        setError('Price not available from the API.');
        return;
      }

      const trajetId = trip?.isConnection ? null : trip?.trajetId || trip?.id;
      const itineraireId = trip?.isConnection ? trip?.itineraireId || trip?.id : null;

      const data = await createTransaction(montant, 'CARTE', trajetId, itineraireId);

      const billet =
        data.billet ||
        data.ticket ||
        data.billetDto ||
        data.transaction?.billet ||
        {
          id: data.transaction?.billetId || `TKT-${Date.now()}`,
          codeOptique: null,
        };

      const fullTicket = {
        ...billet,
        trajet: trip,
        trajetId: billet.trajetId || billet.trajet_id || trajetId,
        itineraireId: billet.itineraireId || billet.itineraire_id || itineraireId,
        montant,
        etatBillet: billet.etatBillet || billet.etat_billet || 'NON_UTILISE',
        dateAchat: billet.dateAchat || billet.date_achat || new Date().toISOString().slice(0, 10),
        transactionId: billet.transactionId || billet.transaction_id || data.transaction?.id,
      };

      setGeneratedTicket(fullTicket);
      sessionStorage.setItem('generatedTicket', JSON.stringify(fullTicket));
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Erreur paiement');
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
            ['Résumé', 1],
            ['Paiement', 2],
            ['Confirmation', 3],
          ].map(([label, number], index) => {
            const n = number as number;
            const c = n < step ? 'done' : n === step ? 'active' : 'pending';

            return (
              <React.Fragment key={label}>
                {index > 0 && <div className="sline" />}
                <div className="step">
                  <div className={`snum ${c}`}>{n < step ? '✓' : n}</div>
                  <span className={`slbl ${n <= step ? 'active' : 'pending'}`}>{label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {error && <div className="err" style={{ display: 'block' }}>{error}</div>}

        {step === 1 && (
          <div className="pcard">
            <div className="pcard-head">
              <h2>Résumé du voyage</h2>
            </div>

            <div className="pcard-body">
              <div className="trip-summary">
                <div className="ts-side">
                  <div className="ts-time">{trip.heureDepart || '--'}</div>
                  <div className="ts-city">{trip.villeDepart || '—'}</div>
                </div>

                <span className="ts-arrow">→</span>

                <div className="ts-side">
                  <div className="ts-time">{trip.heureArrivee || '--'}</div>
                  <div className="ts-city">{trip.villeArrivee || '—'}</div>
                </div>
              </div>

              <div className="info-grid">
                <div className="ic">
                  <div className="il">Date de voyage</div>
                  <div className="iv">{trip.dateVoyage || '—'}</div>
                </div>

                <div className="ic">
                  <div className="il">Type</div>
                  <div className="iv">{trip.isConnection ? 'Correspondance' : 'Trajet direct'}</div>
                </div>

                <div className="ic">
                  <div className="il">Train</div>
                  <div className="iv">{trip.train || '—'}</div>
                </div>

                <div className="ic">
                  <div className="il">Passager</div>
                  <div className="iv">{user?.nom || user?.email || '—'}</div>
                </div>
              </div>

              <div className="price-row">
                <span className="price-lbl">Total à payer</span>
                <span className="price-val">
                  {Number.isFinite(Number(trip?.prix ?? trip?.price ?? trip?.montant))
                    ? `€${Number(trip?.prix ?? trip?.price ?? trip?.montant).toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => navigate('/search')}>
                ← Retour
              </button>

              <button className="btn-prim" onClick={() => setStep(2)}>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 16px',
                    border: '1px solid #2563eb',
                    borderRadius: 8,
                    background: '#eff6ff',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>
                    Credit / Debit Card
                  </span>
                </div>
              </div>

              <div className="fld">
                <label>Card number</label>
                <input className="ro-inp" value="" readOnly placeholder="Provided by the payment API" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
                ⚠️ Note: This is a mock payment interface for demonstration purposes.
              </div>

              <div className="price-row">
                <span className="price-lbl">Total</span>
                <span className="price-val">
                  {Number.isFinite(Number(trip?.prix ?? trip?.price ?? trip?.montant))
                    ? `€${Number(trip?.prix ?? trip?.price ?? trip?.montant).toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => setStep(1)}>
                ← Retour
              </button>

              <button className="btn-prim" onClick={pay} disabled={loading}>
                {loading ? 'Processing...' : 'Pay and generate ticket'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && generatedTicket && (
          <div className="pcard">
            <div className="success-top">
              <div className="suc-icon">✓</div>
              <div className="suc-title">Ticket generated successfully</div>
              <div className="suc-sub">Your ticket has been sent to {user?.email || ''}</div>
            </div>

            <div className="pcard-body">
              <div className="info-grid">
                <div className="ic">
                  <div className="il">Ticket ID</div>
                  <div className="iv" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                    {generatedTicket.id || 'N/A'}
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
                  {generatedTicket.codeOptique || generatedTicket.code_optique || 'TKT-CODE'}
                </div>
              </div>

              <div className="imp-note">
                <strong>Important:</strong> This ticket is personal and must be presented during
                control.
              </div>
            </div>

            <div className="pcard-foot">
              <button className="btn-sec" onClick={() => navigate('/my-tickets')}>
                View all tickets
              </button>

              <button className="btn-prim" onClick={() => navigate('/search')}>
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