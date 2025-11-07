import React from 'react';

// Mapping des icônes Font Awesome vers Bootstrap Icons
export const BootstrapIcons = {
  // Navigation
  home: 'bi-house',
  store: 'bi-shop',
  exchange: 'bi-arrow-left-right',
  bell: 'bi-bell',
  user: 'bi-person',
  
  // Actions
  shoppingCart: 'bi-cart',
  wallet: 'bi-wallet',
  money: 'bi-currency-dollar',
  mobile: 'bi-phone',
  qrcode: 'bi-qr-code',
  search: 'bi-search',
  plus: 'bi-plus',
  edit: 'bi-pencil',
  trash: 'bi-trash',
  download: 'bi-download',
  eye: 'bi-eye',
  
  // Status
  check: 'bi-check-circle',
  exclamation: 'bi-exclamation-triangle',
  info: 'bi-info-circle',
  
  // Social
  comments: 'bi-chat',
  newspaper: 'bi-newspaper',
  file: 'bi-file-text'
};

// Composant d'icône Bootstrap
export const Icon = ({ name, className = '', size = '' }) => {
  const iconClass = BootstrapIcons[name] || 'bi-question-circle';
  const sizeClass = size ? ` bi-${size}` : '';
  
  return <i className={`bi ${iconClass}${sizeClass} ${className}`}></i>;
};

export default Icon;