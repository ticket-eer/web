import React, { useEffect, useState } from 'react';
import {
  asList,
  call,
  createAdminConnection,
  deleteAdminConnection,
  getAdminBillets,
  getAdminConnections,
  getAdminControles,
  getAdminDashboard,
  updateAdminConnection,
} from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

async function getAdminTrajets() {
  return call('GET', '/trajets');
}

async function createAdminTrajet(data: any) {
  return call('POST', '/trajets', data);
}

async function updateAdminTrajet(id: number | string, data: any) {
  return call('PATCH', `/trajets/${id}`, data);
}

async function deleteAdminTrajet(id: number | string) {
  return call('DELETE', `/trajets/${id}`);
}

function makeCityId(name: string) {
  return name
    .trim()
    .substring(0, 3)
    .toUpperCase();
}

function AdminDashboard() {
  const [tab, setTab] = useState('cities');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [apiTickets, setApiTickets] = useState<any[]>([]);
  const [apiValidations, setApiValidations] = useState<any[]>([]);
  const [apiTrajets, setApiTrajets] = useState<any[]>([]);
  const [apiConnections, setApiConnections] = useState<any[]>([]);
  const [error, setError] = useState('');

  const cities = Array.from(
    new Set(
      apiTrajets
        .flatMap((t) => [
          t.villeDepart || t.ville_depart,
          t.villeArrivee || t.ville_arrivee,
        ])
        .filter(Boolean)
    )
  ).map((name: any) => ({
    id: makeCityId(String(name)),
    n: String(name),
  }));

  async function loadAdmin() {
    setError('');

    const [dashboardRes, ticketsRes, controlesRes, trajetsRes, connectionsRes] = await Promise.allSettled([
      getAdminDashboard(),
      getAdminBillets(),
      getAdminControles(),
      getAdminTrajets(),
      getAdminConnections(),
    ]);

    if (dashboardRes.status === 'fulfilled') {
      setAdminStats(dashboardRes.value);
    }

    if (ticketsRes.status === 'fulfilled') {
      setApiTickets(asList(ticketsRes.value));
    }

    if (controlesRes.status === 'fulfilled') {
      setApiValidations(asList(controlesRes.value));
    }

    if (trajetsRes.status === 'fulfilled') {
      setApiTrajets(asList(trajetsRes.value));
    }

    if (connectionsRes.status === 'fulfilled') {
      setApiConnections(asList(connectionsRes.value));
    }
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  async function handleAddTrain() {
    try {
      const train = prompt('Nom du train ? Exemple : TGV-101');
      const villeDepart = prompt('Ville de départ ? Exemple : Paris');
      const villeArrivee = prompt('Ville arrivée ? Exemple : Lyon');
      const dateVoyage = prompt('Date voyage ? Exemple : 2026-05-20');
      const heureDepart = prompt('Heure départ ? Exemple : 10:00');
      const heureArrivee = prompt('Heure arrivée ? Exemple : 12:00');
      const prixRaw = prompt('Prix ? Exemple : 59.90');

      if (!train || !villeDepart || !villeArrivee || !dateVoyage || !heureDepart || !heureArrivee || !prixRaw) {
        return;
      }

      const prix = Number(prixRaw);
      if (!Number.isFinite(prix) || prix <= 0) {
        alert('Veuillez saisir un prix valide.');
        return;
      }

      await createAdminTrajet({
        train,
        villeDepart,
        villeArrivee,
        dateVoyage,
        heureDepart,
        heureArrivee,
        prix,
      });

      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur ajout trajet');
    }
  }

  async function handleEditTrain(trainData: any) {
    try {
      const id = trainData.id;
      if (!id) return;

      const train = prompt('Nom du train ?', trainData.train || '');
      const villeDepart = prompt('Ville de départ ?', trainData.villeDepart || trainData.ville_depart || '');
      const villeArrivee = prompt('Ville arrivée ?', trainData.villeArrivee || trainData.ville_arrivee || '');
      const dateVoyage = prompt('Date voyage ?', trainData.dateVoyage || trainData.date_voyage || '');
      const heureDepart = prompt('Heure départ ?', trainData.heureDepart || trainData.heure_depart || '');
      const heureArrivee = prompt('Heure arrivée ?', trainData.heureArrivee || trainData.heure_arrivee || '');
      const prixRaw = prompt('Prix ?', String(trainData.prix ?? trainData.price ?? ''));

      if (!train || !villeDepart || !villeArrivee || !dateVoyage || !heureDepart || !heureArrivee || !prixRaw) {
        return;
      }

      const prix = Number(prixRaw);
      if (!Number.isFinite(prix) || prix <= 0) {
        alert('Veuillez saisir un prix valide.');
        return;
      }

      await updateAdminTrajet(id, {
        train,
        villeDepart,
        villeArrivee,
        dateVoyage,
        heureDepart,
        heureArrivee,
        prix,
      });

      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur modification trajet');
    }
  }

  async function handleDeleteTrain(trainData: any) {
    try {
      const id = trainData.id;
      if (!id) return;

      const ok = confirm('Supprimer ce trajet ?');
      if (!ok) return;

      await deleteAdminTrajet(id);
      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur suppression trajet');
    }
  }

  async function handleAddConnection() {
    try {
      const villeDepart = prompt('Ville de départ ? Exemple : Paris');
      const villeArrivee = prompt('Ville arrivée ? Exemple : Lyon');
      const trajetIdsRaw = prompt('Trajet IDs ? Séparez-les par des virgules. Exemple : 12, 18');
      const dateVoyage = prompt('Date voyage ? Exemple : 2026-05-20');
      const legsCountRaw = prompt('Legs count ? Exemple : 2');
      const totalDurationMinutesRaw = prompt('Durée totale (minutes) ? Exemple : 180');
      const priceRaw = prompt('Prix total ? Exemple : 45.50');

      if (!villeDepart || !villeArrivee || !trajetIdsRaw || !dateVoyage || !legsCountRaw || !totalDurationMinutesRaw || !priceRaw) {
        return;
      }

      const trajetIds = trajetIdsRaw
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value));

      if (!trajetIds.length) {
        alert('Veuillez saisir au moins un trajet ID valide.');
        return;
      }

      const legsCount = Number(legsCountRaw);

      if (!Number.isFinite(legsCount) || legsCount <= 0) {
        alert('Veuillez saisir un legs count valide.');
        return;
      }

      const totalDurationMinutes = Number(totalDurationMinutesRaw);

      if (!Number.isFinite(totalDurationMinutes) || totalDurationMinutes <= 0) {
        alert('Veuillez saisir une durée valide.');
        return;
      }

      const price = Number(priceRaw);

      if (!Number.isFinite(price) || price < 0) {
        alert('Veuillez saisir un prix valide.');
        return;
      }

      await createAdminConnection({
        villeDepart,
        villeArrivee,
        trajetIds,
        dateVoyage,
        legsCount,
        totalDurationMinutes,
        price
      });

      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur ajout connection');
    }
  }

  async function handleEditConnection(connectionData: any) {
    try {
      const id = connectionData.id;
      if (!id) return;

      const villeDepart = prompt('Ville de départ ?', connectionData.villeDepart || connectionData.ville_depart || '');
      const villeArrivee = prompt('Ville arrivée ?', connectionData.villeArrivee || connectionData.ville_arrivee || '');
      const currentTrajetIds = Array.isArray(connectionData.trajetIds)
        ? connectionData.trajetIds.join(', ')
        : String(connectionData.trajetIds || connectionData.trajet_ids || '');
      const trajetIdsRaw = prompt('Trajet IDs ? Séparez-les par des virgules.', currentTrajetIds);
      const dateVoyage = prompt('Date voyage ?', connectionData.dateVoyage || connectionData.date_voyage || '');
      const legsCountRaw = prompt('Legs count ?', String(connectionData.legsCount || connectionData.legs_count || ''));
      const totalDurationMinutesRaw = prompt('Durée totale (minutes) ?', String(connectionData.totalDurationMinutes || connectionData.total_duration_minutes || ''));
      const priceRaw = prompt('Prix total ?', String(connectionData.price || ''));

      if (!villeDepart || !villeArrivee || !trajetIdsRaw || !dateVoyage || !legsCountRaw || !totalDurationMinutesRaw || !priceRaw) {
        return;
      }

      const trajetIds = trajetIdsRaw
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value));

      if (!trajetIds.length) {
        alert('Veuillez saisir au moins un trajet ID valide.');
        return;
      }

      const legsCount = Number(legsCountRaw);

      if (!Number.isFinite(legsCount) || legsCount <= 0) {
        alert('Veuillez saisir un legs count valide.');
        return;
      }

      const totalDurationMinutes = Number(totalDurationMinutesRaw);

      if (!Number.isFinite(totalDurationMinutes) || totalDurationMinutes <= 0) {
        alert('Veuillez saisir une durée valide.');
        return;
      }

      const price = Number(priceRaw);

      if (!Number.isFinite(price) || price < 0) {
        alert('Veuillez saisir un prix valide.');
        return;
      }

      await updateAdminConnection(id, {
        villeDepart,
        villeArrivee,
        trajetIds,
        dateVoyage,
        legsCount,
        totalDurationMinutes,
        price,
      });

      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur modification connection');
    }
  }

  async function handleDeleteConnection(connectionData: any) {
    try {
      const id = connectionData.id;
      if (!id) return;

      const ok = confirm('Supprimer cette connection ?');
      if (!ok) return;

      await deleteAdminConnection(id);
      await loadAdmin();
    } catch (e: any) {
      alert(e.message || 'Erreur suppression connection');
    }
  }

  return (
    <>
      <TopNav />
      <SubNav />

      <div className="admin-hdr">
        <div className="admin-hdr-inner">
          <div className="admin-h1">Admin dashboard</div>

          {adminStats && (
            <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div className="stat-card">
                <div className="stat-label">Users</div>
                <div className="stat-value">{adminStats.totalUsers ?? '—'}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Tickets</div>
                <div className="stat-value">{adminStats.totalBillets ?? '—'}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{adminStats.totalTransactions ?? '—'}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Validations</div>
                <div className="stat-value">{adminStats.totalControles ?? '—'}</div>
              </div>
            </div>
          )}

          <div className="tabs">
            <button className={`atab ${tab === 'cities' ? 'active' : ''}`} onClick={() => setTab('cities')}>
              Manage cities
            </button>

            <button className={`atab ${tab === 'trains' ? 'active' : ''}`} onClick={() => setTab('trains')}>
              Manage trains
            </button>

            <button className={`atab ${tab === 'connections' ? 'active' : ''}`} onClick={() => setTab('connections')}>
              Manage trip
            </button>

            <button className={`atab ${tab === 'tickets' ? 'active' : ''}`} onClick={() => setTab('tickets')}>
              View tickets
            </button>

            <button className={`atab ${tab === 'validations' ? 'active' : ''}`} onClick={() => setTab('validations')}>
              View validations
            </button>
          </div>
        </div>
      </div>

      <div className="admin-body">
        {error && <div className="err">{error}</div>}

        {tab === 'cities' && (
          <>
            <div className="sec-hdr">
              <span className="sec-title">Cities in network</span>
              <button className="act" onClick={loadAdmin}>
                Refresh
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>City ID</th>
                  <th>City name</th>
                  <th>Used in routes</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {cities.map((city) => {
                  const count = apiTrajets.filter((t) => {
                    const dep = t.villeDepart || t.ville_depart;
                    const arr = t.villeArrivee || t.ville_arrivee;
                    return dep === city.n || arr === city.n;
                  }).length;

                  return (
                    <tr key={city.n}>
                      <td>{city.id}</td>
                      <td>{city.n}</td>
                      <td>{count}</td>
                      <td>
                        <span className="badge bv">Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {tab === 'trains' && (
          <>
            <div className="sec-hdr">
              <span className="sec-title">Train routes</span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="act" onClick={loadAdmin}>
                  Refresh
                </button>

                <button className="btn-blue" onClick={handleAddTrain}>
                  Add train
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Train</th>
                  <th>Route</th>
                  <th>Date voyage</th>
                  <th>Départ</th>
                  <th>Arrivée</th>
                  <th>Prix</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apiTrajets.map((train) => (
                  <tr key={train.id}>
                    <td>{train.id}</td>
                    <td>{train.train || 'N/A'}</td>
                    <td>
                      {train.villeDepart || train.ville_depart || 'N/A'} →{' '}
                      {train.villeArrivee || train.ville_arrivee || 'N/A'}
                    </td>
                    <td>{train.dateVoyage || train.date_voyage || 'N/A'}</td>
                    <td>{train.heureDepart || train.heure_depart || 'N/A'}</td>
                    <td>{train.heureArrivee || train.heure_arrivee || 'N/A'}</td>
                    <td>{train.prix != null || train.price != null ? `${Number(train.prix ?? train.price).toFixed(2)} €` : 'N/A'}</td>
                    <td>
                      <span className="badge bv">Active</span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="act" onClick={() => handleEditTrain(train)}>
                        Edit
                      </button>
                      <button className="act" onClick={() => handleDeleteTrain(train)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'connections' && (
          <>
            <div className="sec-hdr">
              <span className="sec-title">Connections</span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="act" onClick={loadAdmin}>
                  Refresh
                </button>

                <button className="btn-blue" onClick={handleAddConnection}>
                  Add connection
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Date voyage</th>
                  <th>Trajet IDs</th>
                  <th>Legs</th>
                  <th>Duration</th>
                  <th>Prix</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {apiConnections.map((connection) => {
                  const route = `${connection.villeDepart || connection.ville_depart || 'N/A'} → ${connection.villeArrivee || connection.ville_arrivee || 'N/A'}`;
                  const trajetIds = Array.isArray(connection.trajetIds)
                    ? connection.trajetIds.join(', ')
                    : String(connection.trajetIds || connection.trajet_ids || 'N/A');
                  const legsCount = connection.legsCount ?? connection.legs_count ?? (Array.isArray(connection.legs) ? connection.legs.length : 'N/A');
                  const duration = connection.totalDurationMinutes ?? connection.total_duration_minutes;

                  return (
                    <tr key={connection.id}>
                      <td>{connection.id}</td>
                      <td>{route}</td>
                      <td>{connection.dateVoyage || connection.date_voyage || 'N/A'}</td>
                      <td>{trajetIds}</td>
                      <td>{legsCount}</td>
                      <td>{duration != null ? `${duration} min` : 'N/A'}</td>
                      <td>{connection.price != null || connection.prix != null ? `${Number(connection.price ?? connection.prix).toFixed(2)} €` : 'N/A'}</td>
                      <td>
                        <span className="badge bv">Active</span>
                      </td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="act" onClick={() => handleEditConnection(connection)}>
                          Edit
                        </button>
                        <button className="act" onClick={() => handleDeleteConnection(connection)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {tab === 'tickets' && (
          <>
            <div className="sec-hdr">
              <span className="sec-title">All tickets</span>
              <button className="act" onClick={loadAdmin}>
                Refresh
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Passenger</th>
                  <th>Train</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {apiTickets.map((b) => {
                  const status = b.etatBillet || b.etat_billet || 'NON_UTILISE';
                  const valid = status === 'NON_UTILISE';

                  return (
                    <tr key={b.id || b.codeOptique}>
                      <td>{b.id || b.codeOptique || b.code_optique}</td>
                      <td>{b.userId || b.user_id || 'N/A'}</td>
                      <td>{b.trajetId || b.trajet_id || b.itineraireId || b.itineraire_id || 'N/A'}</td>
                      <td>{b.montant !== null && b.montant !== undefined ? `${b.montant} €` : 'N/A'}</td>
                      <td>{b.dateAchat || b.date_achat || 'N/A'}</td>
                      <td>
                        <span className={`badge ${valid ? 'bv' : 'bu'}`}>
                          {valid ? 'Valid' : 'Used'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {tab === 'validations' && (
          <>
            <div className="sec-hdr">
              <span className="sec-title">Validation history</span>
              <button className="act" onClick={loadAdmin}>
                Refresh
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Controller</th>
                  <th>Timestamp</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {apiValidations.map((v, index) => {
                  const result = v.resultat || 'INVALIDE';
                  const ok = result === 'UTILISE' || result === 'VALIDE';

                  return (
                    <tr key={`${v.id}-${index}`}>
                      <td>{v.billetId || v.billet_id || v.id || 'N/A'}</td>
                      <td>{v.agentId || v.agent_id || 'N/A'}</td>
                      <td>{v.dateHeure || v.date_heure || 'N/A'}</td>
                      <td>
                        <span className={`badge ${ok ? 'bv' : 'bi'}`}>
                          {ok ? 'Valid → Used' : 'Invalid - Rejected'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;