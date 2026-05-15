import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { asList, getTrajets, searchConnections } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

export function SearchTripPage() {
  const navigate = useNavigate();

  const [cities, setCities] = useState<string[]>([]);
  const [villeDepart, setVilleDepart] = useState('');
  const [villeArrivee, setVilleArrivee] = useState('');
  const [dateVoyage, setDateVoyage] = useState(new Date().toISOString().split('T')[0]);

  const [directs, setDirects] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCities() {
      try {
        const data = await getTrajets();
        const list = asList(data);
        const set = new Set<string>();

        list.forEach((t: any) => {
          if (t.villeDepart) set.add(t.villeDepart);
          if (t.villeArrivee) set.add(t.villeArrivee);
          if (t.ville_depart) set.add(t.ville_depart);
          if (t.ville_arrivee) set.add(t.ville_arrivee);
        });

        setCities([...set].sort());
      } catch {
        setCities([]);
      }
    }

    loadCities();
  }, []);

  async function handleSearch() {
    setError('');
    setDirects([]);
    setConnections([]);

    if (!villeDepart || !villeArrivee || !dateVoyage) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);

    try {
      const directData = await getTrajets(villeDepart, villeArrivee, dateVoyage);
      const directList = asList(directData);

      let connectionList: any[] = [];

      try {
        const connectionData = await searchConnections(villeDepart, villeArrivee, dateVoyage);
        connectionList = asList(connectionData);
      } catch {
        connectionList = [];
      }

      setDirects(directList);
      setConnections(connectionList);

      if (!directList.length && !connectionList.length) {
        setError('No direct trains or connections available for this route and date.');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur recherche trajets');
    } finally {
      setLoading(false);
    }
  }

  function normalizeDirect(t: any) {
    return {
      trajetId: t.id || t.trajetId || t.trajet_id || null,
      itineraireId: null,
      isConnection: false,
      villeDepart: t.villeDepart || t.ville_depart || villeDepart,
      villeArrivee: t.villeArrivee || t.ville_arrivee || villeArrivee,
      heureDepart: t.heureDepart || t.heure_depart || '--',
      heureArrivee: t.heureArrivee || t.heure_arrivee || '--',
      dateVoyage: t.dateVoyage || t.date_voyage || dateVoyage,
      train: t.train || t.numeroTrain || t.numero_train || t.id || 'N/A',
      prix: t.prix ?? t.price ?? t.montant ?? null,
    };
  }

  function normalizeConnection(c: any) {
    const segments = c.segments || c.trajets || c.legs || c.etapes || [];
    const first = segments[0] || c;
    const last = segments[segments.length - 1] || c;

    return {
      trajetId: null,
      itineraireId: c.id || c.itineraireId || c.itineraire_id || null,
      isConnection: true,
      villeDepart: first.villeDepart || first.ville_depart || c.villeDepart || villeDepart,
      villeArrivee: last.villeArrivee || last.ville_arrivee || c.villeArrivee || villeArrivee,
      heureDepart: first.heureDepart || first.heure_depart || c.heureDepart || '--',
      heureArrivee: last.heureArrivee || last.heure_arrivee || c.heureArrivee || '--',
      dateVoyage: c.dateVoyage || c.date_voyage || dateVoyage,
      train: 'Correspondance',
      prix: c.prixTotal ?? c.totalPrice ?? c.prix ?? c.price ?? c.montant ?? null,
      length: segments.length,
      details: segments.length
          ? segments
              .map((s: any) => {
                const vd = s.villeDepart || s.ville_depart || '?';
                const va = s.villeArrivee || s.ville_arrivee || '?';
                const hd = s.heureDepart || s.heure_depart || '--';
                const ha = s.heureArrivee || s.heure_arrivee || '--';
                return `${vd} → ${va} (${hd}-${ha})`;
              })
              .join(' / ')
          : 'Trip with connection',
    };
  }

  function selectTrip(trip: any) {
    sessionStorage.setItem('selectedTrip', JSON.stringify(trip));
    navigate('/purchase');
  }

  return (
      <>
        <TopNav />
        <SubNav to="/my-tickets" />

        <div className="pwrap">
          <h1 className="page-h">Search a trip</h1>

          <div className="s-box">
            <div className="s-grid">
              <div className="sf">
                <label>Departure city</label>
                <select value={villeDepart} onChange={(e) => setVilleDepart(e.target.value)}>
                  <option value="">Select city...</option>
                  {cities.map((city) => (
                      <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="sf">
                <label>Arrival city</label>
                <select value={villeArrivee} onChange={(e) => setVilleArrivee(e.target.value)}>
                  <option value="">Select city...</option>
                  {cities.map((city) => (
                      <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="sf">
                <label>Date</label>
                <input
                    type="date"
                    value={dateVoyage}
                    onChange={(e) => setDateVoyage(e.target.value)}
                />
              </div>

              <button className="btn-srch" onClick={handleSearch}>
                Search trains
              </button>
            </div>
          </div>

          {loading && <div className="loading">Searching trains and connections...</div>}

          {!loading && error && <div className="err" style={{ display: 'block' }}>{error}</div>}

          {!loading && directs.length > 0 && (
              <>
                <div className="res-count" style={{ marginTop: 22 }}>
                  Direct trains ({directs.length})
                </div>

                {directs.map((item, index) => {
                  const t = normalizeDirect(item);

                  return (
                      <div className="tr-card" key={`direct-${t.trajetId || index}`}>
                        <div className="tr-left">
                          <div className="tr-t">
                            <div className="time">{t.heureDepart}</div>
                            <div className="city">{t.villeDepart}</div>
                          </div>

                          <span style={{ color: '#d1d5db', fontSize: 20 }}>→</span>

                          <div className="tr-t">
                            <div className="time">{t.heureArrivee}</div>
                            <div className="city">{t.villeArrivee}</div>
                          </div>

                          <div className="tr-info">{t.train}</div>
                        </div>

                        <div className="tr-right">
                          <div>
                            <div className="tr-price">
                              {t.prix != null ? `€${Number(t.prix).toFixed(2)}` : 'N/A'}
                            </div>
                            <div className="tr-psub">Direct trip</div>
                          </div>

                          <button className="btn-sel" onClick={() => selectTrip(t)}>
                            Select
                          </button>
                        </div>
                      </div>
                  );
                })}
              </>
          )}

          {!loading && connections.length > 0 && (
              <>
                <div className="res-count" style={{ marginTop: 22 }}>
                  Connections ({connections.length})
                </div>

                {connections.map((item, index) => {
                  const t = normalizeConnection(item);

                  return (
                      <div className="tr-card" key={`connection-${t.itineraireId || index}`}>
                        <div className="tr-left">
                          <div className="tr-t">
                            <div className="time">{t.heureDepart}</div>
                            <div className="city">{t.villeDepart}</div>
                          </div>

                          <span style={{ color: '#d1d5db', fontSize: 20 }}>⇄</span>

                          <div className="tr-t">
                            <div className="time">{t.heureArrivee}</div>
                            <div className="city">{t.villeArrivee}</div>
                          </div>

                          <div className="tr-info">{t.details}</div>
                        </div>

                        <div className="tr-right">
                          <div>
                            <div className="tr-price">
                              {t.prix != null ? `€${Number(t.prix).toFixed(2)}` : 'N/A'}
                            </div>
                            <div className="tr-psub">{t.length <= 1 ? 'Direct trip' : `${t.length} trains`}</div>
                          </div>

                          <button className="btn-sel" onClick={() => selectTrip(t)}>
                            Select
                          </button>
                        </div>
                      </div>
                  );
                })}
              </>
          )}
        </div>
      </>
  );
}
export default SearchTripPage;
