import React from 'react';
import { NavLink } from 'react-router-dom'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Link = styled(NavLink)`
  svg {
    transition: 0.3s;
  }
  
  &:hover {
    svg {
      transform: translateX(5px);
      transition: 0.3s;
    }
  }
`

interface Props {
  to: string;
  icon?: any;
  children: React.ReactNode;
  [x:string]: any;
}

const defaultProps: Props = {
  to: '/',
  children: 'null',
  icon: 'arrow-right'
}

const IconLink: React.FC<Props> = ({ to, icon, children, ...props }) => {
  return (
    <Link {...props} to={to}>
      {children}
      <FontAwesomeIcon icon={icon} />
    </Link>
  )
}

IconLink.defaultProps = defaultProps;

export default IconLink;