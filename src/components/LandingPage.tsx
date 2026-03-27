import { Link } from 'react-router-dom';
import { Search, Ticket, Shield, Settings, User } from 'lucide-react';

export function LandingPage() {
  // Check if user is authenticated
  const isAuthenticated = sessionStorage.getItem('clientAuth');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-blue-600">Ticketeer</h1>
            <p className="text-gray-600 mt-2">Railway ticket generation and validation platform</p>
          </div>
          {isAuthenticated ? (
            <Link
              to="/client/dashboard"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <User className="w-5 h-5" />
              <span>My account</span>
            </Link>
          ) : (
            <Link
              to="/client/login"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Actions */}
            <Link
              to="/search"
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl mb-2">Search a trip</h2>
              <p className="text-gray-600">Find and book railway tickets</p>
            </Link>

            <Link
              to="/my-tickets"
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Ticket className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl mb-2">My tickets</h2>
              <p className="text-gray-600">View your purchased tickets</p>
            </Link>

            {/* Controller Access */}
            <Link
              to="/controller"
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl mb-2">Controller access</h2>
              <p className="text-gray-600">Validate passenger tickets</p>
            </Link>

            {/* Admin Dashboard */}
            <Link
              to="/admin"
              className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl mb-2">Admin dashboard</h2>
              <p className="text-gray-600">Manage system data</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>Ticketeer © 2026 - Software Engineering Project</p>
        </div>
      </footer>
    </div>
  );
}