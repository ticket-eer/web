import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function GeneratedTicketPage() {
  const navigate = useNavigate();

  let ticket: any = null;

  try {
    ticket =
        JSON.parse(sessionStorage.getItem('currentTicket') || 'null') ||
        JSON.parse(sessionStorage.getItem('generatedTicket') || 'null');
  } catch {
    ticket = null;
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