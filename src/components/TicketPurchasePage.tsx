import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ArrowRight } from 'lucide-react';
import { Train } from '../data/mockData';

export function TicketPurchasePage() {
  const navigate = useNavigate();
  const [train, setTrain] = useState<Train | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = sessionStorage.getItem('clientAuth');
    if (!auth) {
      sessionStorage.setItem('redirectAfterLogin', '/purchase');
      navigate('/client/login');
      return;
    }
    
    const storedTrain = sessionStorage.getItem('selectedTrain');
    if (storedTrain) {
      setTrain(JSON.parse(storedTrain));
      
      // Pre-fill user data from auth
      const userData = JSON.parse(auth);
      setPassengerName(userData.name || '');
      setEmail(userData.email || '');
    } else {
      navigate('/search');
    }
  }, [navigate]);

  const handlePurchase = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate ticket ID
      const ticketId = `TKT-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;
      
      // Store ticket data
      const ticketData = {
        id: ticketId,
        passengerName,
        email,
        train,
        status: 'valid',
        purchaseDate: new Date().toISOString().split('T')[0],
      };
      
      sessionStorage.setItem('currentTicket', JSON.stringify(ticketData));
      navigate(`/ticket/${ticketId}`);
    }, 1500);
  };

  if (!train) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl text-blue-600">Ticketeer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6">Purchase ticket</h2>

        <div className="space-y-6">
          {/* Trip Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Trip summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xl">{train.departureTime}</div>
                  <div className="text-gray-600">{train.departureCity}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <div className="text-xl">{train.arrivalTime}</div>
                  <div className="text-gray-600">{train.arrivalCity}</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Train {train.id}</div>
                  <div className="text-sm text-gray-600">Date: {train.date}</div>
                </div>
                <div className="text-2xl">€{train.price.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Passenger information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Full name</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Payment method</label>
                <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md bg-gray-50">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Credit / Debit Card</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Card number (mock)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  Note: This is a mock payment interface for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!passengerName || !email || !cardNumber || processing}
            className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing payment...' : 'Pay and generate ticket'}
          </button>
        </div>
      </main>
    </div>
  );
}