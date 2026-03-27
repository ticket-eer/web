import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, LogIn } from 'lucide-react';

export function ControllerLoginPage() {
  const navigate = useNavigate();
  const [controllerId, setControllerId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real system would validate credentials
    if (controllerId && password) {
      sessionStorage.setItem('controllerAuth', 'true');
      sessionStorage.setItem('controllerId', controllerId);
      navigate('/controller/validate');
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
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl text-center mb-2">Controller access</h2>
            <p className="text-gray-600 text-center mb-8">
              Login to validate passenger tickets
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Controller ID</label>
                <input
                  type="text"
                  value={controllerId}
                  onChange={(e) => setControllerId(e.target.value)}
                  placeholder="Enter your controller ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
            </form>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                Demo credentials: Use any controller ID and password to access the validation interface.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
