import React from 'react';
import Logo from 'assets/svg/BugVilla.svg';

const BugVillaLogo: React.FC<{ width?: string }> = ({ width }) => (
  <img
    style={{ width: width }}
    className="logo"
    src={Logo}
    alt="BugVilla Logo"
  />
);

export default BugVillaLogo;
