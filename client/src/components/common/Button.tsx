import React from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ButtonProps {
  width?: string;
}

// prettier-ignore
const StyledButton = styled.button<ButtonProps & React.HTMLAttributes<HTMLDivElement>>`
  background-color: ${p => p.theme.colors.brand.primary};
  color: ${p => p.theme.colors.common.white};

  width: ${p => p.width};
  height: fit-content;
  border: none;
  border-radius: 50px;
  padding: 10px 15px;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.2s;
  line-height: 1;
  font-size: 14px;

  &:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }

  &:disabled {
    opacity: 0.8;
  }
`;

interface Props {
  width?: string;
  icon?: any;
  children: React.ReactNode;
  isLoading?: boolean;
  [x: string]: any;
}

const Button: React.FC<Props> = ({
  width,
  icon,
  children,
  isLoading,
  ...props
}) => (
  <StyledButton {...props} width={width}>
    {icon && (
      <FontAwesomeIcon spin={isLoading} icon={isLoading ? 'spinner' : icon} />
    )}
    {children}
  </StyledButton>
);

export default Button;
