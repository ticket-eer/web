import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asList, getBillets } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function MyTicketsPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTickets() {
    setLoading(true);
    setError('');

    try {
      const data = await getBillets();
      const list = asList(data);
      setTickets(list);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des billets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem('tt');

    if (!token) {
      navigate('/client/login');
      return;
    }

    loadTickets();
  }, [navigate]);

  function getStatus(ticket: any) {
    const status = ticket.etatBillet || ticket.etat_billet || 'NON_UTILISE';

    if (status === 'NON_UTILISE') return ['bv', 'Valid'];
    if (status === 'UTILISE') return ['bu', 'Used'];
    if (status === 'EXPIRE') return ['be', 'Expired'];

    return ['bi', 'Invalid'];
  }

  function getTrip(ticket: any) {
    const trajet = ticket.trajet || ticket.trajetDto || ticket.trip || {};

    return {
      heureDepart: trajet.heureDepart || trajet.heure_depart || '--:--',
      heureArrivee: trajet.heureArrivee || trajet.heure_arrivee || '--:--',
      villeDepart: trajet.villeDepart || trajet.ville_depart || '—',
      villeArrivee: trajet.villeArrivee || trajet.ville_arrivee || '—',
      train:
          trajet.train ||
          ticket.trajetId ||
          ticket.trajet_id ||
          ticket.itineraireId ||
          ticket.itineraire_id ||
          'N/A',
      date:
          trajet.dateVoyage ||
          trajet.date_voyage ||
          ticket.dateValidite ||
          ticket.date_validite ||
          ticket.dateAchat ||
          ticket.date_achat ||
          '',
    };
  }

  return (
      <>
        <TopNav />
        <SubNav />

        <div className="pwrap">
          <div className="row-between">
            <h1 className="page-h" style={{ margin: 0 }}>
              My tickets
            </h1>

            <button className="btn-blue" onClick={() => navigate('/search')}>
              Book new trip
            </button>
          </div>

          {loading && <div className="loading">Loading tickets...</div>}

          {!loading && error && (
              <div className="empty" style={{ color: '#dc2626' }}>
                {error}
              </div>
          )}

          {!loading && !error && tickets.length === 0 && (
              <div className="empty">
                No tickets yet.{' '}
                <button
                    onClick={() => navigate('/search')}
                    style={{
                      color: '#2563eb',
                      cursor: 'pointer',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                    }}
                >
                  Book a trip →
                </button>
              </div>
          )}

          {!loading && !error && tickets.length > 0 && (
              <div className="tk-list">
                {tickets.map((ticket, index) => {
                  const [badgeClass, badgeLabel] = getStatus(ticket);
                  const trip = getTrip(ticket);

                  return (
                      <div className="tk-card" key={ticket.id || ticket.codeOptique || index}>
                        <div className="tk-left">
                          <div className="tk-toprow">
                      <span className="tk-id">
                        {ticket.id || ticket.codeOptique || ticket.code_optique || 'N/A'}
                      </span>

                            <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                          </div>

                          <div className="tk-times">
                            <div className="tk-t">
                              <div className="time">{trip.heureDepart}</div>
                              <div className="city">{trip.villeDepart}</div>
                            </div>

                            <span className="tk-sep">→</span>

                            <div className="tk-t">
                              <div className="time">{trip.heureArrivee}</div>
                              <div className="city">{trip.villeArrivee}</div>
                            </div>
                          </div>

                          <div className="tk-meta">
                            <span className="tm-train">Train {trip.train}</span> • {trip.date}
                          </div>
                        </div>

                        <button
                            className="btn-view"
                            onClick={() => {
                              sessionStorage.setItem('currentTicket', JSON.stringify(ticket));
                              navigate(`/ticket/${ticket.id || ticket.codeOptique || ticket.code_optique}`);
                            }}
                        >
                          View ticket
                        </button>
                      </div>
                  );
                })}
              </div>
          )}
        </div>
      </>
  );
}

export default MyTicketsPage;