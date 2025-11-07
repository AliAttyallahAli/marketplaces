export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-TD', {
    style: 'currency',
    currency: 'XAF'
  }).format(price);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format: +235 XX XX XX XX
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[0-9\s\-\(\)]{8,}$/;
  return re.test(phone);
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const generateTransactionId = () => {
  return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const calculateFees = (amount) => {
  const fee = amount * 0.01; // 1%
  const netAmount = amount - fee;
  return {
    amount,
    fee,
    netAmount,
    total: amount
  };
};