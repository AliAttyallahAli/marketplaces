import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Optionnel: Vérifier la validité du token
        // await userAPI.getProfile();
      } catch (error) {
        console.error('Erreur vérification token:', error);
        // Token invalide, déconnecter l'utilisateur
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Mettre à jour l'état
      setToken(newToken);
      setUser(userData);
      
      toast.success('Connexion réussie!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success('Inscription réussie! Veuillez vous connecter.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Erreur d'inscription";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Réinitialiser l'état
    setToken(null);
    setUser(null);
    
    toast.info('Déconnexion réussie');
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };

  const upgradeToVendeur = async (vendeurData) => {
    try {
      await authAPI.upgradeToVendeur(vendeurData);
      const updatedUser = { ...user, role: 'vendeur' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Félicitations! Vous êtes maintenant vendeur.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de mise à jour';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      await userAPI.updateProfile(profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour avec succès');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de mise à jour';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    upgradeToVendeur,
    updateUserProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isVendeur: user?.role === 'vendeur',
    isClient: user?.role === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};