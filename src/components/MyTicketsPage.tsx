import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket as TicketIcon, ArrowRight } from 'lucide-react';
import { mockTickets } from '../data/mockData';

export function MyTicketsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('clientAuth');
    if (!auth) {
      sessionStorage.setItem('redirectAfterLogin', '/my-tickets');
      navigate('/client/login');
    }
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'used':
        return 'Used';
      case 'invalid':
        return 'Invalid';
      default:
        return status;
    }
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">My tickets</h2>
          <Link
            to="/search"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Book new trip
          </Link>
        </div>

        {mockTickets.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-gray-700">No tickets yet</h3>
            <p className="text-gray-600 mb-6">Start by searching for a trip</p>
            <Link
              to="/search"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Search trips
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500">{ticket.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <div className="text-xl">{ticket.train.departureTime}</div>
                        <div className="text-sm text-gray-600">{ticket.train.departureCity}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xl">{ticket.train.arrivalTime}</div>
                        <div className="text-sm text-gray-600">{ticket.train.arrivalCity}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Train {ticket.train.id}</span>
                      <span>•</span>
                      <span>{ticket.train.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/ticket/${ticket.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
                    >
                      View ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}