import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ArrowRight } from 'lucide-react';
import { cities, generateTrains, Train } from '../data/mockData';

export function SearchTripPage() {
  const navigate = useNavigate();
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [date, setDate] = useState('');
  const [trains, setTrains] = useState<Train[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('clientAuth');
    if (!auth) {
      sessionStorage.setItem('redirectAfterLogin', '/search');
      navigate('/client/login');
    }
  }, [navigate]);

  const handleSearch = () => {
    const results = generateTrains(departureCity, arrivalCity, date);
    setTrains(results);
    setSearched(true);
  };

  const handleSelectTrain = (train: Train) => {
    // Store selected train in sessionStorage for purchase page
    sessionStorage.setItem('selectedTrain', JSON.stringify(train));
    navigate('/purchase');
  };

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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6">Search a trip</h2>

        {/* Search Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Departure city</label>
              <select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Arrival city</label>
              <select
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!departureCity || !arrivalCity || !date || departureCity === arrivalCity}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search trains
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h3 className="text-xl mb-4">
              Available trains {trains.length > 0 && `(${trains.length})`}
            </h3>
            
            {trains.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">No trains found for this route and date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trains.map((train) => (
                  <div
                    key={train.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-500">Train {train.id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-2xl">{train.departureTime}</div>
                            <div className="text-sm text-gray-600">{train.departureCity}</div>
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                          <div>
                            <div className="text-2xl">{train.arrivalTime}</div>
                            <div className="text-sm text-gray-600">{train.arrivalCity}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl">€{train.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">per person</div>
                        </div>
                        <button
                          onClick={() => handleSelectTrain(train)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}