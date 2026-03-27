import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ClientLoginPage } from './components/ClientLoginPage';
import { ClientDashboard } from './components/ClientDashboard';
import { SearchTripPage } from './components/SearchTripPage';
import { TicketPurchasePage } from './components/TicketPurchasePage';
import { GeneratedTicketPage } from './components/GeneratedTicketPage';
import { MyTicketsPage } from './components/MyTicketsPage';
import { ControllerLoginPage } from './components/ControllerLoginPage';
import { TicketValidationPage } from './components/TicketValidationPage';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/client/login" element={<ClientLoginPage />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/search" element={<SearchTripPage />} />
          <Route path="/purchase" element={<TicketPurchasePage />} />
          <Route path="/ticket/:ticketId" element={<GeneratedTicketPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/controller" element={<ControllerLoginPage />} />
          <Route path="/controller/validate" element={<TicketValidationPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}