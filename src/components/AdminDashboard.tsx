import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Train as TrainIcon, Ticket, CheckSquare } from 'lucide-react';
import { cities } from '../data/mockData';

type TabType = 'cities' | 'trains' | 'tickets' | 'validations';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('cities');

  const mockTrains = [
    { id: 'TR-101', route: 'London → Paris', departures: '3 daily', status: 'Active' },
    { id: 'TR-205', route: 'Berlin → Munich', departures: '4 daily', status: 'Active' },
    { id: 'TR-312', route: 'Madrid → Barcelona', departures: '5 daily', status: 'Active' },
    { id: 'TR-421', route: 'Rome → Milan', departures: '3 daily', status: 'Active' },
    { id: 'TR-508', route: 'Amsterdam → Brussels', departures: '6 daily', status: 'Active' },
  ];

  const mockTicketStats = [
    { id: 'TKT-2026-001234', passenger: 'John Smith', train: 'TR-101', date: '2026-01-25', status: 'Valid' },
    { id: 'TKT-2026-001233', passenger: 'Emma Wilson', train: 'TR-205', date: '2026-01-24', status: 'Valid' },
    { id: 'TKT-2026-001198', passenger: 'John Smith', train: 'TR-312', date: '2026-01-18', status: 'Used' },
    { id: 'TKT-2026-001145', passenger: 'John Smith', train: 'TR-205', date: '2026-01-12', status: 'Used' },
    { id: 'TKT-2026-001089', passenger: 'Sarah Johnson', train: 'TR-421', date: '2026-01-10', status: 'Used' },
  ];

  const mockValidations = [
    { ticketId: 'TKT-2026-001198', controller: 'CTRL-045', timestamp: '2026-01-18 14:23', result: 'Valid → Used' },
    { ticketId: 'TKT-2026-001145', controller: 'CTRL-032', timestamp: '2026-01-12 10:15', result: 'Valid → Used' },
    { ticketId: 'TKT-2026-001089', controller: 'CTRL-045', timestamp: '2026-01-10 16:42', result: 'Valid → Used' },
    { ticketId: 'TKT-2026-000954', controller: 'CTRL-018', timestamp: '2026-01-08 09:30', result: 'Invalid - Rejected' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl text-blue-600">Ticketeer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6">Admin dashboard</h2>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('cities')}
                className={`flex-1 px-6 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'cities'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="hidden sm:inline">Manage cities</span>
                <span className="sm:hidden">Cities</span>
              </button>
              <button
                onClick={() => setActiveTab('trains')}
                className={`flex-1 px-6 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'trains'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TrainIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Manage trains</span>
                <span className="sm:hidden">Trains</span>
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 px-6 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'tickets'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Ticket className="w-5 h-5" />
                <span className="hidden sm:inline">View tickets</span>
                <span className="sm:hidden">Tickets</span>
              </button>
              <button
                onClick={() => setActiveTab('validations')}
                className={`flex-1 px-6 py-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'validations'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="hidden sm:inline">View validations</span>
                <span className="sm:hidden">Validations</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Cities Tab */}
            {activeTab === 'cities' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg">Cities in network</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add city
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">City ID</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">City name</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cities.map((city) => (
                        <tr key={city.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{city.id}</td>
                          <td className="px-4 py-3">{city.name}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trains Tab */}
            {activeTab === 'trains' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg">Train routes</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add train
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Train ID</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Route</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Departures</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockTrains.map((train) => (
                        <tr key={train.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{train.id}</td>
                          <td className="px-4 py-3">{train.route}</td>
                          <td className="px-4 py-3 text-sm">{train.departures}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {train.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <h3 className="text-lg mb-4">All tickets</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Ticket ID</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Passenger</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Train</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockTicketStats.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{ticket.id}</td>
                          <td className="px-4 py-3">{ticket.passenger}</td>
                          <td className="px-4 py-3 text-sm">{ticket.train}</td>
                          <td className="px-4 py-3 text-sm">{ticket.date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                ticket.status === 'Valid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Validations Tab */}
            {activeTab === 'validations' && (
              <div>
                <h3 className="text-lg mb-4">Validation history</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Ticket ID</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Controller</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Timestamp</th>
                        <th className="px-4 py-3 text-left text-sm text-gray-600">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockValidations.map((validation, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{validation.ticketId}</td>
                          <td className="px-4 py-3 text-sm">{validation.controller}</td>
                          <td className="px-4 py-3 text-sm">{validation.timestamp}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                validation.result.includes('Invalid')
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {validation.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
