import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Styles personnalisés
import './styles/App.css';
import './styles/BootstrapOverrides.css';
import './styles/Responsive.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);