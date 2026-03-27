import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket } from '../data/mockData';

export function GeneratedTicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Try to get ticket from sessionStorage first (newly generated)
    const currentTicket = sessionStorage.getItem('currentTicket');
    if (currentTicket) {
      const ticketData = JSON.parse(currentTicket);
      if (ticketData.id === ticketId) {
        setTicket(ticketData);
        return;
      }
    }

    // Otherwise, create a mock ticket for demo purposes
    setTicket({
      id: ticketId || 'TKT-2026-000000',
      passengerName: 'John Smith',
      email: 'john.smith@email.com',
      train: {
        id: 'TR-101',
        departureCity: 'London',
        arrivalCity: 'Paris',
        departureTime: '08:00',
        arrivalTime: '11:30',
        price: 45.00,
        date: '2026-01-25',
      },
      status: 'valid',
      purchaseDate: new Date().toISOString().split('T')[0],
    });
  }, [ticketId]);

  if (!ticket) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/my-tickets" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl text-blue-600">Ticketeer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
          {/* Success Banner */}
          <div className="bg-green-50 border-b border-green-200 p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-green-900">Ticket generated successfully</div>
              <div className="text-sm text-green-700">Your ticket has been sent to {ticket.email}</div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-8">
            {/* Ticket ID */}
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">Ticket ID</div>
              <div className="text-xl">{ticket.id}</div>
            </div>

            {/* Passenger Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Passenger</div>
              <div className="text-lg">{ticket.passengerName}</div>
            </div>

            {/* Trip Details */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-3">Trip details</div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="text-2xl">{ticket.train.departureTime}</div>
                  <div className="text-gray-600">{ticket.train.departureCity}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <div className="text-2xl">{ticket.train.arrivalTime}</div>
                  <div className="text-gray-600">{ticket.train.arrivalCity}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Train:</span> {ticket.train.id}
                </div>
                <div>
                  <span className="text-gray-600">Date:</span> {ticket.train.date}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-sm text-gray-600 mb-4">Validation QR Code</div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <QRCodeSVG
                  value={JSON.stringify({
                    ticketId: ticket.id,
                    passengerName: ticket.passengerName,
                    trainId: ticket.train.id,
                    date: ticket.train.date,
                    status: ticket.status,
                  })}
                  size={200}
                  level="H"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {ticket.status === 'valid' ? 'Valid / Not yet used' : ticket.status}
                </span>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> This ticket is personal and must be presented during control. 
                Please ensure your QR code is clearly visible to the controller.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-4">
          <Link
            to="/my-tickets"
            className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-center"
          >
            View all tickets
          </Link>
          <Link
            to="/search"
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-md hover:border-gray-400 text-center"
          >
            Book another trip
          </Link>
        </div>
      </main>
    </div>
  );
}
