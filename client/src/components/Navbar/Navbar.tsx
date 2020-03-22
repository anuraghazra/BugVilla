import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavbarWrapper = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  position: fixed;

  background-color: ${p => p.theme.colors.primary};
  z-index: 2;

  color: ${p => p.theme.colors.white};

  @media screen and (${p => p.theme.media.minTablet}) {
    display: none;
  }
`;

interface NavbarProps {
  handleSidebar?: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ handleSidebar }) => {
  return (
    <NavbarWrapper>
      <FontAwesomeIcon
        onClick={handleSidebar}
        size="2x"
        icon="bars"
      ></FontAwesomeIcon>
      <div></div>
    </NavbarWrapper>
  );
};

export default Navbar;
