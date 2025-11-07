import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages principales
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './components/products/ProductDetail';
import P2P from './pages/P2P';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Vendeur from './pages/Vendeur';

// Authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages légales
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import VendorAgreement from './pages/VendorAgreement';

// Nouvelles pages
import Documents from './pages/Documents';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import NotificationsPage from './pages/NotificationsPage';
import ServiceManagement from './pages/ServiceManagement';
import NewsletterManagement from './pages/NewsletterManagement';

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
            
            {/* Nouvelles routes */}
            <Route path="/documents" element={<Documents />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Routes légales */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/vendor-agreement" element={<VendorAgreement />} />
            
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