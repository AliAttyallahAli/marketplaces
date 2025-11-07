import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'client' }) => {
  const location = useLocation();

  const clientMenu = [
    { path: '/profile', icon: 'fas fa-user', label: 'Mon Profil' },
    { path: '/profile?tab=wallet', icon: 'fas fa-wallet', label: 'Mon Portefeuille' },
    { path: '/profile?tab=kyc', icon: 'fas fa-id-card', label: 'Vérification KYC' },
    { path: '/profile?tab=upgrade', icon: 'fas fa-store', label: 'Devenir Vendeur' }
  ];

  const vendeurMenu = [
    { path: '/vendeur', icon: 'fas fa-tachometer-alt', label: 'Tableau de Bord' },
    { path: '/vendeur?tab=products', icon: 'fas fa-box', label: 'Mes Produits' },
    { path: '/vendeur?tab=sales', icon: 'fas fa-chart-line', label: 'Mes Ventes' },
    { path: '/vendeur?tab=analytics', icon: 'fas fa-chart-bar', label: 'Analytics' }
  ];

  const adminMenu = [
    { path: '/admin', icon: 'fas fa-cog', label: 'Tableau de Bord' },
    { path: '/admin?tab=users', icon: 'fas fa-users', label: 'Utilisateurs' },
    { path: '/admin?tab=transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
    { path: '/admin?tab=services', icon: 'fas fa-concierge-bell', label: 'Services' },
    { path: '/admin?tab=settings', icon: 'fas fa-sliders-h', label: 'Paramètres' }
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return adminMenu;
      case 'vendeur':
        return vendeurMenu;
      default:
        return clientMenu;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar bg-light rounded p-3">
      <Nav className="flex-column">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path.split('?')[0];
          
          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={`d-flex align-items-center py-2 px-3 rounded ${
                isActive ? 'bg-primary text-white' : 'text-dark'
              }`}
            >
              <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
              <span>{item.label}</span>
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
};

export default Sidebar;