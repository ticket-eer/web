import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogIn, UserPlus } from 'lucide-react';

export function ClientLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (isLogin) {
      // Login
      if (email && password) {
        const userData = {
          id: 'user-001',
          email: email,
          name: email.split('@')[0],
          authenticated: true,
        };
        sessionStorage.setItem('clientAuth', JSON.stringify(userData));
        
        // Redirect to the page they were trying to access, or dashboard
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/client/dashboard';
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      }
    } else {
      // Register
      if (email && password && name) {
        const userData = {
          id: 'user-' + Math.floor(Math.random() * 1000),
          email: email,
          name: name,
          authenticated: true,
        };
        sessionStorage.setItem('clientAuth', JSON.stringify(userData));
        navigate('/client/dashboard');
      }
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
              <User className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl text-center mb-2">
              {isLogin ? 'Client login' : 'Create account'}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {isLogin 
                ? 'Login to access your tickets and dashboard' 
                : 'Register to book tickets and track your expenses'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
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
                {isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Register" 
                  : 'Already have an account? Login'}
              </button>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                Demo: Use any email and password to login/register
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
