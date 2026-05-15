import React, { useState } from 'react';
import { scanBillet } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function TicketValidationPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function validate() {
    if (!code) {
      setResult({
        type: 'bad',
        title: '✗ BILLET INVALIDE',
        detail: 'Please enter a ticket ID.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await scanBillet(code);
      const res = (data.resultat || data.etat || data.etatBillet || '').toUpperCase();

      if (res === 'NON_UTILISE' || res === 'VALIDE') {
        setResult({
          type: 'ok',
          title: '✓ BILLET VALIDE',
          detail: 'Le billet est valide.',
        });
      } else if (res === 'UTILISE') {
        setResult({
          type: 'used',
          title: '✗ BILLET DÉJÀ UTILISÉ',
          detail: 'Ce billet a déjà été validé précédemment.',
        });
      } else if (res === 'EXPIRE') {
        setResult({
          type: 'exp',
          title: '✗ BILLET EXPIRÉ',
          detail: 'La date de validité de ce billet est dépassée.',
        });
      } else {
        setResult({
          type: 'bad',
          title: '✗ BILLET INVALIDE',
          detail: data.message || 'Code non reconnu dans le système.',
        });
      }
    } catch (err: any) {
      setResult({
        type: 'bad',
        title: '✗ BILLET INVALIDE',
        detail: err.message || 'Ticket not found or invalid.',
      });
    } finally {
      setLoading(false);
    }
  }

  function resultClass(type: string) {
    if (type === 'ok') return 'res-ok';
    if (type === 'used') return 'res-used';
    if (type === 'exp') return 'res-exp';
    return 'res-bad';
  }

  function iconStyle(type: string) {
    if (type === 'ok') return { background: '#bbf7d0', color: '#166534' };
    if (type === 'used') return { background: '#fde68a', color: '#b45309' };
    if (type === 'exp') return { background: '#e5e7eb', color: '#6b7280' };
    return { background: '#fecaca', color: '#dc2626' };
  }

  function titleColor(type: string) {
    if (type === 'ok') return '#166534';
    if (type === 'used') return '#b45309';
    if (type === 'exp') return '#6b7280';
    return '#dc2626';
  }

  return (
      <>
        <TopNav />
        <SubNav />

        <div className="pwrap">
          <h1 className="page-h">Ticket validation</h1>

          <div className="val-wrap">
            <div className="scan-area">
              <div className="scan-icon">▦</div>
              <span className="scan-txt">QR Code Scanner — Camera feed would appear here</span>
              <span className="scan-txt2">
              Position the ticket QR code within the frame to scan automatically
            </span>
            </div>

            <div className="man-title">Manual ticket validation</div>

            <div className="man-row">
              <input
                  type="text"
                  placeholder="Enter ticket ID e.g., TKT-2026-001234"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
              />

              <button className="btn-val" onClick={validate}>
                {loading ? 'Validating...' : 'Validate'}
              </button>
            </div>

            {result && (
                <div className={resultClass(result.type)}>
                  <div className="res-row">
                    <div className="res-ic" style={iconStyle(result.type)}>
                      {result.type === 'ok' ? '✓' : '✕'}
                    </div>

                    <div className="res-title" style={{ color: titleColor(result.type) }}>
                      {result.title}
                    </div>
                  </div>

                  <div className="res-det">{result.detail}</div>
                </div>
            )}

          </div>
        </div>
      </>
  );
}
export default TicketValidationPage;