import React from 'react';

interface LogoWithTextProps {
  text: string;
}

const LogoWithText: React.FC<LogoWithTextProps> = ({ text }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Replace the src with your actual logo path */}
      <img src="/images/logo_no_text2.png" alt="Logo" style={{ marginRight: '8px', height: '30px' }} />
      <span style={{ fontWeight: '600' }}>{text}</span>
    </div>
  );
};

export default LogoWithText;