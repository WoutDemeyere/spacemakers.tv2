import React, { useEffect } from 'react';

const ControlPage: React.FC = () => {
  useEffect(() => {
    window.location.href = '/spacetree';
  }, []);

  return null; // Since we're redirecting, there's no need to render anything
};

export default ControlPage;
