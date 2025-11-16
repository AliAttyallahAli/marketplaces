import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ChatWidget from './components/chat/ChatWidget';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './components/products/ProductDetail';
import P2P from './pages/P2P';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Vendeur from './pages/Vendeur';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import VendorAgreement from './pages/VendorAgreement';
import ServiceManagement from './pages/ServiceManagement';
import NewsletterManagement from './components/newsletter/NewsletterManagement';
import ChatPage from './pages/Chat'; // Ajouter cette ligne
import Documents from './pages/Documents';
import StatisticsPage from './pages/Statistics';
// Composants de service
import ZIZPayment from './components/services/ZIZPayment';
import STEPayment from './components/services/STEPayment';
import TaxPayment from './components/services/TaxPayment';

function App() {
  return (
    <AuthProvider>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/vendor-agreement" element={<VendorAgreement />} />
            
            {/* Routes marketplace */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/product/:id" element={<ProductDetail />} />
            
            {/* Routes authentifiées */}
            <Route path="/p2p" element={<P2P />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/payment/ziz" element={<ZIZPayment />} />
            <Route path="/services/payment/ste" element={<STEPayment />} />
            <Route path="/services/payment/tax" element={<TaxPayment />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<ChatPage />} /> {/* Ajouter cette ligne */}
            <Route path="/documents" element={<Documents />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            {/* Routes avec restrictions de rôle */}
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/vendeur/*" element={<Vendeur />} />
            <Route path="/service-management" element={<ServiceManagement />} />
            <Route path="/newsletter-management" element={<NewsletterManagement />} />
            
            {/* Route 404 */}
            <Route path="*" element={
              <div className="container py-5 text-center">
                <h1 className="display-1">404</h1>
                <p className="lead">Page non trouvée</p>
                <a href="/" className="btn btn-primary">Retour à l'accueil</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        
        {/* Widget de chat */}
        <ChatWidget />
        
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;