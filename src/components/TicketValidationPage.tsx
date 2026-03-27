import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Search, CheckCircle, XCircle, LogOut } from 'lucide-react';

interface ValidationResult {
  status: 'valid' | 'invalid' | 'used';
  ticketId: string;
  passengerName?: string;
  trainId?: string;
  date?: string;
  message: string;
}

export function TicketValidationPage() {
  const [ticketId, setTicketId] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = () => {
    setIsValidating(true);
    
    // Simulate server validation
    setTimeout(() => {
      // Mock validation logic
      const mockValidTickets = ['TKT-2026-001234', 'TKT-2026-001567', 'TKT-2026-001890'];
      const mockUsedTickets = ['TKT-2026-001198', 'TKT-2026-001145'];
      
      let result: ValidationResult;
      
      if (mockValidTickets.includes(ticketId)) {
        result = {
          status: 'valid',
          ticketId: ticketId,
          passengerName: 'John Smith',
          trainId: 'TR-101',
          date: '2026-01-25',
          message: 'Ticket is valid and ready for use',
        };
      } else if (mockUsedTickets.includes(ticketId)) {
        result = {
          status: 'used',
          ticketId: ticketId,
          passengerName: 'John Smith',
          trainId: 'TR-312',
          date: '2026-01-18',
          message: 'Ticket has already been used',
        };
      } else {
        result = {
          status: 'invalid',
          ticketId: ticketId,
          message: 'Ticket not found or invalid',
        };
      }
      
      setValidationResult(result);
      setIsValidating(false);
    }, 1000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('controllerAuth');
    sessionStorage.removeItem('controllerId');
    window.location.href = '/controller';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl text-blue-600">Ticketeer</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl mb-6">Ticket validation</h2>

        <div className="space-y-6">
          {/* QR Scanner Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-4">
                <Camera className="w-16 h-16 text-gray-400 mb-2" />
                <p className="text-gray-600">QR Code Scanner</p>
                <p className="text-sm text-gray-500">Camera feed would appear here</p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Position the ticket QR code within the frame to scan automatically
              </p>
            </div>
          </div>

          {/* Manual Input */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Manual ticket validation</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter ticket ID (e.g., TKT-2026-001234)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && ticketId && handleValidate()}
              />
              <button
                onClick={handleValidate}
                disabled={!ticketId || isValidating}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div
              className={`rounded-lg border-2 p-6 ${
                validationResult.status === 'valid'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start gap-4">
                {validationResult.status === 'valid' ? (
                  <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <h3
                    className={`text-xl mb-2 ${
                      validationResult.status === 'valid' ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {validationResult.status === 'valid'
                      ? 'Ticket Valid'
                      : validationResult.status === 'used'
                      ? 'Ticket Already Used'
                      : 'Ticket Invalid'}
                  </h3>
                  
                  <p
                    className={`mb-4 ${
                      validationResult.status === 'valid' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {validationResult.message}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-600">Ticket ID:</span>
                      <span className="font-medium">{validationResult.ticketId}</span>
                    </div>
                    
                    {validationResult.passengerName && (
                      <div className="flex gap-2">
                        <span className="text-gray-600">Passenger:</span>
                        <span className="font-medium">{validationResult.passengerName}</span>
                      </div>
                    )}
                    
                    {validationResult.trainId && (
                      <div className="flex gap-2">
                        <span className="text-gray-600">Train:</span>
                        <span className="font-medium">{validationResult.trainId}</span>
                      </div>
                    )}
                    
                    {validationResult.date && (
                      <div className="flex gap-2">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{validationResult.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm mb-2 text-blue-900">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Scan the passenger's QR code or enter the ticket ID manually</li>
              <li>Wait for server validation response</li>
              <li>Valid tickets will turn green and can be marked as used</li>
              <li>Invalid or already used tickets will be rejected in red</li>
            </ul>
          </div>

          {/* Demo Ticket IDs */}
          <div className="bg-gray-100 border border-gray-300 rounded-md p-4">
            <h4 className="text-sm mb-2 text-gray-700">Demo ticket IDs for testing:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>Valid:</strong> TKT-2026-001234, TKT-2026-001567</div>
              <div><strong>Used:</strong> TKT-2026-001198, TKT-2026-001145</div>
              <div><strong>Invalid:</strong> Any other ID</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
