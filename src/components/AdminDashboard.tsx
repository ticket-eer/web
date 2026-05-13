import React, { useEffect, useState } from 'react';
import { asList, getAdminBillets, getAdminControles } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

const DC = [
  { id: 'LON', n: 'London' },
  { id: 'PAR', n: 'Paris' },
  { id: 'BER', n: 'Berlin' },
  { id: 'ROM', n: 'Rome' },
  { id: 'MAD', n: 'Madrid' },
  { id: 'AMS', n: 'Amsterdam' },
  { id: 'VIE', n: 'Vienna' },
];

const DT = [
  { id: 'TR-101', r: 'London → Paris', f: '3 daily' },
  { id: 'TR-205', r: 'Berlin → Munich', f: '4 daily' },
  { id: 'TR-312', r: 'Madrid → Barcelona', f: '5 daily' },
  { id: 'TR-421', r: 'Rome → Milan', f: '3 daily' },
  { id: 'TR-508', r: 'Amsterdam → Brussels', f: '6 daily' },
];

const DTK = [
  { id: 'TKT-2026-001234', p: 'John Smith', t: 'TR-101', d: '2026-01-25', s: 'NON_UTILISE' },
  { id: 'TKT-2026-001233', p: 'Emma Wilson', t: 'TR-205', d: '2026-01-24', s: 'NON_UTILISE' },
  { id: 'TKT-2026-001198', p: 'John Smith', t: 'TR-312', d: '2026-01-18', s: 'UTILISE' },
];

const DV = [
  { b: 'TKT-2026-001198', c: 'CTRL-045', ts: '2026-01-18 14:23', r: 'UTILISE' },
  { b: 'TKT-2026-001145', c: 'CTRL-032', ts: '2026-01-12 10:15', r: 'UTILISE' },
  { b: 'TKT-2026-000954', c: 'CTRL-018', ts: '2026-01-08 09:30', r: 'INVALIDE' },
];

function AdminDashboard() {
  const [tab, setTab] = useState('cities');
  const [apiTickets, setApiTickets] = useState<any[]>([]);
  const [apiValidations, setApiValidations] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const [ticketsRes, controlesRes] = await Promise.allSettled([
          getAdminBillets(),
          getAdminControles(),
        ]);

        if (ticketsRes.status === 'fulfilled') {
          const list = asList(ticketsRes.value);
          if (list.length) setApiTickets(list);
        }

        if (controlesRes.status === 'fulfilled') {
          const list = asList(controlesRes.value);
          if (list.length) setApiValidations(list);
        }
      } catch {
        // fallback demo data
      }
    }

    loadAdmin();
  }, []);

  return (
      <>
        <TopNav />
        <SubNav />

        <div className="admin-hdr">
          <div className="admin-hdr-inner">
            <div className="admin-h1">Admin dashboard</div>

            <div className="tabs">
              <button
                  className={`atab ${tab === 'cities' ? 'active' : ''}`}
                  onClick={() => setTab('cities')}
              >
                Manage cities
              </button>

              <button
                  className={`atab ${tab === 'trains' ? 'active' : ''}`}
                  onClick={() => setTab('trains')}
              >
                Manage trains
              </button>

              <button
                  className={`atab ${tab === 'tickets' ? 'active' : ''}`}
                  onClick={() => setTab('tickets')}
              >
                View tickets
              </button>

              <button
                  className={`atab ${tab === 'validations' ? 'active' : ''}`}
                  onClick={() => setTab('validations')}
              >
                View validations
              </button>
            </div>
          </div>
        </div>

        <div className="admin-body">
          {tab === 'cities' && (
              <>
                <div className="sec-hdr">
                  <span className="sec-title">Cities in network</span>
                  <button className="btn-blue">Add city</button>
                </div>

                <table>
                  <thead>
                  <tr>
                    <th>City ID</th>
                    <th>City name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>

                  <tbody>
                  {DC.map((city) => (
                      <tr key={city.id}>
                        <td>{city.id}</td>
                        <td>{city.n}</td>
                        <td>
                          <span className="badge bv">Active</span>
                        </td>
                        <td>
                          <button className="act">Edit</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </>
          )}

          {tab === 'trains' && (
              <>
                <div className="sec-hdr">
                  <span className="sec-title">Train routes</span>
                  <button className="btn-blue">Add train</button>
                </div>

                <table>
                  <thead>
                  <tr>
                    <th>Train ID</th>
                    <th>Route</th>
                    <th>Departures</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>

                  <tbody>
                  {DT.map((train) => (
                      <tr key={train.id}>
                        <td>{train.id}</td>
                        <td>{train.r}</td>
                        <td>{train.f}</td>
                        <td>
                          <span className="badge bv">Active</span>
                        </td>
                        <td>
                          <button className="act">Edit</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </>
          )}

          {tab === 'tickets' && (
              <>
                <div className="sec-hdr">
                  <span className="sec-title">All tickets</span>
                </div>

                <table>
                  <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Passenger</th>
                    <th>Train</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                  </thead>

                  <tbody>
                  {(apiTickets.length
                          ? apiTickets.map((b) => ({
                            id: b.id || b.codeOptique || b.code_optique || 'N/A',
                            p: b.userId || b.user_id || 'N/A',
                            t: b.trajetId || b.trajet_id || b.itineraireId || b.itineraire_id || 'N/A',
                            d: b.dateAchat || b.date_achat || 'N/A',
                            s: b.etatBillet || b.etat_billet || 'NON_UTILISE',
                          }))
                          : DTK
                  ).map((row) => {
                    const valid = row.s === 'NON_UTILISE';

                    return (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{row.p}</td>
                          <td>{row.t}</td>
                          <td>{row.d}</td>
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
                  {(apiValidations.length
                          ? apiValidations.map((v) => ({
                            b: v.billetId || v.billet_id || v.id || 'N/A',
                            c: v.agentId || v.agent_id || 'N/A',
                            ts: v.dateHeure || v.date_heure || 'N/A',
                            r: v.resultat || 'INVALIDE',
                          }))
                          : DV
                  ).map((row, index) => {
                    const ok = row.r === 'UTILISE' || row.r === 'VALIDE';

                    return (
                        <tr key={`${row.b}-${index}`}>
                          <td>{row.b}</td>
                          <td>{row.c}</td>
                          <td>{row.ts}</td>
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