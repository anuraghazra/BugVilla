import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleIcon from './CircleIcon';

export const isNavStyles = css`
  .icon {
    margin-right: 10px;
    transition: 0.2s;
  }
  &:hover {
    color: ${p => p.theme.colors.primary};
    .icon {
      background-color: ${p => p.theme.colors.primary};
      color: ${p => p.theme.colors.accent};
    }
  }
`;

interface LinkProps extends NavLinkProps {
  isNav?: boolean;
}
export const Link = styled(NavLink)<LinkProps>`
  display: flex;
  align-items: center;
  ${p =>
    p.isNav
      ? isNavStyles
      : css`
          svg {
            transition: 0.3s;
          }

          &:hover {
            svg {
              transform: translateX(5px);
              transition: 0.3s;
            }
          }
        `}
`;

interface IconLinkProps {
  to: string;
  icon?: any;
  isNav?: boolean;
  [x: string]: any;
}

const defaultProps: IconLinkProps = {
  to: '/',
  children: null,
  icon: 'arrow-right'
};

export const IconLink: React.FC<IconLinkProps> = ({
  to,
  icon,
  children,
  isNav,
  ...props
}) => {
  return (
    <Link isNav={isNav} {...props} to={to}>
      {isNav ? (
        <>
          <CircleIcon className="icon" size="28px" icon={icon} />
          {children}
        </>
      ) : (
        <>
          {children}
          <FontAwesomeIcon className="faIcon" icon={icon} />
        </>
      )}
    </Link>
  );
};

IconLink.defaultProps = defaultProps;

export default IconLink;
