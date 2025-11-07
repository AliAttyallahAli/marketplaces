import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback((options = {}) => {
    const {
      redirectTo = '/',
      showConfirmation = false,
      message = 'Déconnexion réussie'
    } = options;

    if (showConfirmation) {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
      if (!confirmed) return;
    }

    logout();
    
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [logout, navigate]);

  return handleLogout;
};