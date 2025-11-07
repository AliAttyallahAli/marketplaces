import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Chargement...', centered = false }) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;
  
  const spinner = (
    <div className={`d-flex align-items-center ${centered ? 'justify-content-center' : ''}`}>
      <Spinner 
        animation="border" 
        role="status" 
        size={spinnerSize}
        className={centered ? '' : 'me-2'}
      >
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
      {text && <span className={centered ? 'ms-2' : ''}>{text}</span>}
    </div>
  );

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;