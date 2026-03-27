import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, TrendingUp, Calendar, Euro, Ticket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyExpense {
  month: string;
  amount: number;
}

interface ClientData {
  name: string;
  email: string;
}

export function ClientDashboard() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientData | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('clientAuth');
    if (!auth) {
      navigate('/client/login');
      return;
    }
    const userData = JSON.parse(auth);
    setClientData(userData);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('clientAuth');
    navigate('/');
  };

  // Mock monthly expenses data
  const monthlyExpenses: MonthlyExpense[] = [
    { month: 'Sep 2025', amount: 0 },
    { month: 'Oct 2025', amount: 87.50 },
    { month: 'Nov 2025', amount: 145.00 },
    { month: 'Dec 2025', amount: 203.50 },
    { month: 'Jan 2026', amount: 142.00 },
  ];

  const currentMonthExpenses = monthlyExpenses[monthlyExpenses.length - 1].amount;
  const previousMonthExpenses = monthlyExpenses[monthlyExpenses.length - 2].amount;
  const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const averageMonthly = totalExpenses / monthlyExpenses.filter(m => m.amount > 0).length;

  if (!clientData) {
    return null;
  }

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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Welcome back, {clientData.name}</h2>
          <p className="text-gray-600">{clientData.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm text-gray-600">This month</h3>
            </div>
            <div className="text-3xl mb-1">€{currentMonthExpenses.toFixed(2)}</div>
            <div className="text-sm text-gray-600">
              {currentMonthExpenses > previousMonthExpenses ? (
                <span className="text-red-600">
                  +€{(currentMonthExpenses - previousMonthExpenses).toFixed(2)} vs last month
                </span>
              ) : (
                <span className="text-green-600">
                  -€{(previousMonthExpenses - currentMonthExpenses).toFixed(2)} vs last month
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm text-gray-600">Average monthly</h3>
            </div>
            <div className="text-3xl mb-1">€{averageMonthly.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Based on last 4 months</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Euro className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm text-gray-600">Total spent</h3>
            </div>
            <div className="text-3xl mb-1">€{totalExpenses.toFixed(2)}</div>
            <div className="text-sm text-gray-600">All time</div>
          </div>
        </div>

        {/* Monthly Expenses Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg mb-6">Monthly expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Details Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg mb-4">Expense breakdown by month</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Month</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Tickets purchased</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Total amount</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Average per ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyExpenses.filter(m => m.amount > 0).reverse().map((expense, index) => {
                  const ticketCount = Math.floor(expense.amount / 45) + Math.floor(Math.random() * 2);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{expense.month}</td>
                      <td className="px-4 py-3 text-sm">{ticketCount} tickets</td>
                      <td className="px-4 py-3">€{expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">€{(expense.amount / ticketCount).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/search"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Book a new trip</h3>
              <p className="text-sm text-blue-100">Search and purchase tickets</p>
            </div>
          </Link>

          <Link
            to="/my-tickets"
            className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg mb-1">My tickets</h3>
              <p className="text-sm text-gray-600">View all your tickets</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
