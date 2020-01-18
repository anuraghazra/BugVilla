import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavCircleIconLink = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row-reverse;

  .faIcon {
    margin: 0;
    margin-right: 10px;
    background-color: ${p => p.theme.colors.brand.accent};
    color: ${p => p.theme.colors.brand.primary};
    border-radius: 100px;
    width: 28px;
    height: 28px;
    padding: 7px;
  }
  &:hover {
    color: ${p => p.theme.colors.brand.primary};
    .faIcon {
      transform: translateX(0);
      background-color: ${p => p.theme.colors.brand.primary};
      color: ${p => p.theme.colors.brand.accent};
    }
  }
`;

interface LinkProps {
  isNav?: boolean;
}
const Link = styled(NavLink)<LinkProps>`
  svg {
    transition: 0.3s;
  }

  &:hover {
    svg {
      transform: translateX(5px);
      transition: 0.3s;
    }
  }

  ${p => p.isNav && NavCircleIconLink}
`;

interface IconLinkProps {
  to: string;
  icon?: any;
  children: React.ReactNode;
  isNav?: boolean;
  [x: string]: any;
}

const defaultProps: IconLinkProps = {
  to: '/',
  children: 'null',
  icon: 'arrow-right'
};

const IconLink: React.FC<IconLinkProps> = ({
  to,
  icon,
  children,
  isNav,
  ...props
}) => {
  return (
    <Link isNav={isNav} {...props} to={to}>
      {children}
      <FontAwesomeIcon className="faIcon" icon={icon} />
    </Link>
  );
};

IconLink.defaultProps = defaultProps;

export default IconLink;
