import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, TrendingUp, Calendar, Euro, Ticket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { asList, getBillets, getMe, getStoredUser, getUserBillets } from '../services/api';

interface ClientData {
  name: string;
  email: string;
}

interface MonthlyExpense {
  month: string;
  amount: number;
  tickets: number;
}

function ClientDashboard() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        const storedUser = getStoredUser();
        const apiUser = await getMe().catch(() => storedUser);

        const userData = apiUser?.id ? apiUser : storedUser;

        if (!userData) {
          navigate('/client/login');
          return;
        }

        if (active) {
          setClientData({
            name: userData.nom || userData.name || userData.email || 'User',
            email: userData.email || '',
          });
        }

        const ticketData = userData?.id ? await getUserBillets(userData.id).catch(() => getBillets()) : await getBillets();

        if (active) {
          setTickets(asList(ticketData));
        }
      } catch {
        navigate('/client/login');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('clientAuth');
    sessionStorage.removeItem('tt');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tu');
    navigate('/');
  };

  const monthlyExpenses = tickets.reduce<Map<string, MonthlyExpense>>((acc, ticket) => {
    const amount = Number(ticket.montant ?? ticket.prix ?? ticket.price ?? ticket.transaction?.montant);
    const rawDate =
      ticket.dateAchat ||
      ticket.date_achat ||
      ticket.dateValidite ||
      ticket.date_validite ||
      ticket.transaction?.dateHeure;

    if (!Number.isFinite(amount) || !rawDate) {
      return acc;
    }

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return acc;
    }

    const month = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(parsedDate);
    const existing = acc.get(month) || { month, amount: 0, tickets: 0 };

    existing.amount += amount;
    existing.tickets += 1;
    acc.set(month, existing);
    return acc;
  }, new Map());

  const monthlyExpenseList = Array.from(monthlyExpenses.values());
  const currentMonthExpenses = monthlyExpenseList[monthlyExpenseList.length - 1]?.amount ?? 0;
  const previousMonthExpenses = monthlyExpenseList[monthlyExpenseList.length - 2]?.amount ?? 0;
  const totalExpenses = monthlyExpenseList.reduce((sum, item) => sum + item.amount, 0);
  const averageMonthly = monthlyExpenseList.length > 0 ? totalExpenses / monthlyExpenseList.length : 0;

  if (loading || !clientData) {
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
                <BarChart data={monthlyExpenseList}>
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
                {monthlyExpenseList.slice().reverse().map((expense, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{expense.month}</td>
                      <td className="px-4 py-3 text-sm">{expense.tickets} tickets</td>
                      <td className="px-4 py-3">€{expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        €{(expense.tickets > 0 ? expense.amount / expense.tickets : 0).toFixed(2)}
                      </td>
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
export default ClientDashboard;